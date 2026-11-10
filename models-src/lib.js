// Общие инструменты для построения 3D-моделей экспонатов из простых деталей.
// Единицы измерения — метры. Оси: x — вправо, y — вверх, z — к зрителю (лицевая сторона).
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'

// ---------- Материалы ----------

// Обычный материал: пластик (по умолчанию) или металл (metalness близко к 1)
export function material(name, color, { roughness = 0.55, metalness = 0, ...rest } = {}) {
  return new THREE.MeshStandardMaterial({ name, color, roughness, metalness, ...rest })
}

// ---------- Формы ----------

// Прямоугольник со скруглёнными углами (центр в нуле)
export function roundedRectShape(width, height, radius) {
  const x = -width / 2
  const y = -height / 2
  const r = Math.min(radius, width / 2, height / 2)
  const shape = new THREE.Shape()
  shape.moveTo(x + r, y)
  shape.lineTo(x + width - r, y)
  shape.quadraticCurveTo(x + width, y, x + width, y + r)
  shape.lineTo(x + width, y + height - r)
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  shape.lineTo(x + r, y + height)
  shape.quadraticCurveTo(x, y + height, x, y + height - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

// Плоская скруглённая пластина толщиной depth (лицом к +z, задняя сторона в z = 0)
export function plateGeometry(width, height, radius, depth) {
  return new THREE.ExtrudeGeometry(roundedRectShape(width, height, radius), {
    depth,
    bevelEnabled: false,
    curveSegments: 4,
  })
}

// Рамка: пластина с вырезом посередине (окантовка экрана, отсека и т.п.)
export function frameGeometry(outer, inner, depth) {
  const shape = roundedRectShape(outer.width, outer.height, outer.radius)
  shape.holes.push(roundedRectShape(inner.width, inner.height, inner.radius))
  return new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 4 })
}

// Табличка с текстом или рисунком: рисуем на холсте (canvas) и натягиваем на плоскость.
// draw(ctx, w, h) — функция рисования; glow — светится ли (для экранов).
export function canvasPlane(name, width, height, draw, { pixelsPerMeter = 4000, glow = 0, transparent = true, roughness } = {}) {
  // Разрешение картинки: по длинной стороне не меньше 256 и не больше 1024 пикселей
  const long = Math.max(width, height)
  const scale = Math.min(1024, Math.max(256, long * pixelsPerMeter)) / long
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(8, Math.round(width * scale))
  canvas.height = Math.max(8, Math.round(height * scale))
  const ctx = canvas.getContext('2d')
  draw(ctx, canvas.width, canvas.height)

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4
  // Непрозрачные картинки сохраняем в JPEG — он в разы легче PNG
  if (!transparent) texture.userData.mimeType = 'image/jpeg'

  const mat = new THREE.MeshStandardMaterial({
    name,
    map: texture,
    roughness: roughness ?? (glow ? 0.15 : 0.6),
    alphaTest: transparent ? 0.5 : 0,
  })
  if (glow) {
    mat.emissive = new THREE.Color(0xffffff)
    mat.emissiveMap = texture
    mat.emissiveIntensity = glow
  }
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat)
  mesh.name = name
  return mesh
}

// Надпись одной строкой. По умолчанию — на прозрачном фоне; background — цвет таблички.
export function textPlane(
  name,
  width,
  height,
  text,
  {
    color = '#ffffff',
    background = null,
    font = 'Arial, sans-serif',
    weight = 'bold',
    italic = false,
    size = 0.72, // высота букв относительно высоты таблички
    align = 'center',
    outline = false,
    letterSpacing = 0,
    glow = 0,
    pixelsPerMeter = 6000,
  } = {},
) {
  return canvasPlane(
    name,
    width,
    height,
    (ctx, w, h) => {
      if (background) {
        ctx.fillStyle = background
        ctx.fillRect(0, 0, w, h)
      }
      const setFont = (px) => {
        ctx.font = `${italic ? 'italic ' : ''}${weight} ${px}px ${font}`
        ctx.letterSpacing = `${Math.round(px * (letterSpacing / size))}px`
      }
      // Если текст не помещается в табличку по ширине — уменьшаем шрифт
      let fontSize = Math.round(h * size)
      setFont(fontSize)
      const maxWidth = w - h * 0.3
      const textWidth = ctx.measureText(text).width
      if (textWidth > maxWidth) {
        fontSize = Math.floor((fontSize * maxWidth) / textWidth)
        setFont(fontSize)
      }
      ctx.textAlign = align
      ctx.textBaseline = 'middle'
      const x = align === 'left' ? h * 0.15 : align === 'right' ? w - h * 0.15 : w / 2
      if (outline) {
        ctx.strokeStyle = color
        ctx.lineWidth = Math.max(3, h * 0.07)
        ctx.strokeText(text, x, h / 2 + 1)
      } else {
        ctx.fillStyle = color
        ctx.fillText(text, x, h / 2 + 1)
      }
    },
    { pixelsPerMeter, glow, transparent: !background },
  )
}

// Плоская табличка, лежащая «лицом вверх» (для надписей на верхней панели устройства)
export const FACE_UP = [-Math.PI / 2, 0, 0]

// Эллипс (центр в нуле)
export function ellipseShape(rx, ry) {
  const shape = new THREE.Shape()
  shape.absellipse(0, 0, rx, ry, 0, Math.PI * 2, false, 0)
  return shape
}

// Клин: корпус, который сзади выше, чем спереди (клавиатуры, калькуляторы).
// Нижняя грань — на y = 0, лицевая сторона смотрит на +z.
export function wedgeGeometry(width, depth, frontHeight, backHeight, bevel = 0.002) {
  const profile = new THREE.Shape()
  profile.moveTo(-depth / 2, 0)
  profile.lineTo(depth / 2, 0)
  profile.lineTo(depth / 2, backHeight)
  profile.lineTo(-depth / 2, frontHeight)
  profile.closePath()
  const inner = width - 2 * bevel
  const g = new THREE.ExtrudeGeometry(profile, {
    depth: inner,
    bevelEnabled: bevel > 0,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 1,
  })
  g.rotateY(Math.PI / 2)
  g.translate(-inner / 2, bevel, 0)
  return g
}

// Ряды клавиш на панели.
// rows — массив рядов (от дальнего к ближнему); ряд — массив клавиш [ширина в шагах, материал, подпись, цвет подписи].
//   Материал null — пустое место.
// surfaceY(z) — высота панели в точке z (для наклонной клавиатуры), slope — наклон клавиш.
// Возвращает список клавиш с координатами — по нему можно нанести подписи (keyLabels).
export function placeKeys(
  m,
  rows,
  { x0, z0, pitch, rowPitch = pitch, gap = 0.003, height = 0.008, keyDepth = rowPitch, surfaceY = () => 0, slope = 0, rounded = 0, zOffset = 0 },
) {
  const keys = []
  rows.forEach((row, r) => {
    let x = x0
    const z = z0 + r * rowPitch
    for (const [units, mat, label, labelColor] of row) {
      const w = units * pitch
      if (mat) {
        const size = [w - gap, height, keyDepth - gap]
        const position = [x + w / 2, surfaceY(z) + height / 2 - 0.0015, z + zOffset]
        if (rounded) m.roundedBox(size, rounded, mat, { position, rotation: [slope, 0, 0] }, 1)
        else m.box(size, mat, { position, rotation: [slope, 0, 0] })
        keys.push({ x: x + w / 2, z: z + zOffset, w: w - gap, d: keyDepth - gap, top: surfaceY(z) + height - 0.0015, label, labelColor })
      }
      x += w
    }
  })
  return keys
}

// Подписи на клавишах ровной (не наклонной) клавиатуры: одна прозрачная картинка поверх всех клавиш
export function keyLabels(m, name, keys, { color = '#ffffff', font = 'Arial, sans-serif', size = 0.5 } = {}) {
  const minX = Math.min(...keys.map((k) => k.x - k.w / 2))
  const maxX = Math.max(...keys.map((k) => k.x + k.w / 2))
  const minZ = Math.min(...keys.map((k) => k.z - k.d / 2))
  const maxZ = Math.max(...keys.map((k) => k.z + k.d / 2))
  const width = maxX - minX
  const depth = maxZ - minZ
  const plane = canvasPlane(
    name,
    width,
    depth,
    (ctx, w) => {
      const s = w / width
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      for (const k of keys) {
        if (!k.label) continue
        const fontSize = Math.round(Math.min(k.w, k.d) * s * size * (k.label.length > 2 ? 0.6 : 1))
        ctx.font = `bold ${fontSize}px ${font}`
        ctx.fillStyle = k.labelColor ?? color
        ctx.fillText(k.label, (k.x - minX) * s, (k.z - minZ) * s + 1)
      }
    },
    { pixelsPerMeter: 9000 },
  )
  m.object(plane, { position: [(minX + maxX) / 2, keys[0].top + 0.0003, (minZ + maxZ) / 2], rotation: FACE_UP })
}

// Настольная клавиатура-клин с клавишами (основной блок + цифровой блок справа).
// main, pad — ряды клавиш в формате placeKeys; z — центр клавиатуры по глубине.
export function deskKeyboard(
  m,
  { z, width, depth, frontHeight, backHeight, caseMat, main, pad = [], pitch = 0.019, backMargin = 0.035, padGap = 0.5, keyHeight = 0.009 },
) {
  m.add(wedgeGeometry(width, depth, frontHeight, backHeight), caseMat, { position: [0, 0, z] })
  const slope = Math.atan((backHeight - frontHeight) / depth)
  const surfaceY = (localZ) => frontHeight + ((depth / 2 - localZ) / depth) * (backHeight - frontHeight)
  const mainUnits = Math.max(...main.map((row) => row.reduce((sum, [units]) => sum + units, 0)))
  const padUnits = pad.length ? Math.max(...pad.map((row) => row.reduce((sum, [units]) => sum + units, 0))) : 0
  const x0 = -((mainUnits + (pad.length ? padGap + padUnits : 0)) * pitch) / 2
  const options = { pitch, height: keyHeight, slope, z0: -depth / 2 + backMargin + pitch / 2, surfaceY, zOffset: z }
  placeKeys(m, main, { ...options, x0 })
  if (pad.length) placeKeys(m, pad, { ...options, x0: x0 + (mainUnits + padGap) * pitch })
}

// Повернуть точку-смещение на угол вокруг оси x (для деталей на наклонной крышке)
export function rotateX([x, y, z], angle) {
  return [x, y * Math.cos(angle) - z * Math.sin(angle), y * Math.sin(angle) + z * Math.cos(angle)]
}

// ---------- Сборка модели ----------

// Все детали одного материала склеиваются в один объект:
// модель получается лёгкой и быстро рисуется даже на телефоне.
export class ModelBuilder {
  constructor(name) {
    this.name = name
    this.parts = new Map() // материал → список геометрий
    this.objects = [] // отдельные объекты (таблички с текстом, экраны)
  }

  // Добавить деталь. position — [x, y, z], rotation — [x, y, z] в радианах
  add(geometry, mat, { position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1] } = {}) {
    const matrix = new THREE.Matrix4().compose(
      new THREE.Vector3(...position),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(...rotation)),
      new THREE.Vector3(...scale),
    )
    let g = geometry.clone().applyMatrix4(matrix)
    g.clearGroups()
    // Детали без картинок, поэтому оставляем только координаты и нормали — файл легче
    for (const key of Object.keys(g.attributes)) {
      if (!['position', 'normal'].includes(key)) g.deleteAttribute(key)
    }
    if (!g.index) g = mergeVertices(g)
    if (!this.parts.has(mat)) this.parts.set(mat, [])
    this.parts.get(mat).push(g)
    return this
  }

  // Брусок (прямоугольный параллелепипед)
  box([w, h, d], mat, options) {
    return this.add(new THREE.BoxGeometry(w, h, d), mat, options)
  }

  // Брусок со скруглёнными рёбрами
  // segments — плавность скругления (1 — для мелких деталей вроде кнопок, так модель легче)
  roundedBox([w, h, d], radius, mat, options, segments = 2) {
    return this.add(new RoundedBoxGeometry(w, h, d, segments, radius), mat, options)
  }

  // Цилиндр (по умолчанию стоит вертикально; чтобы смотрел на зрителя — rotation [π/2, 0, 0])
  cylinder(radius, height, mat, options, segments = 24) {
    return this.add(new THREE.CylinderGeometry(radius, radius, height, segments), mat, options)
  }

  // Готовый объект (например, табличка canvasPlane)
  object(obj, { position = [0, 0, 0], rotation = [0, 0, 0] } = {}) {
    obj.position.set(...position)
    obj.rotation.set(...rotation)
    this.objects.push(obj)
    return this
  }

  build() {
    const group = new THREE.Group()
    group.name = this.name
    for (const [mat, geometries] of this.parts) {
      const mesh = new THREE.Mesh(mergeGeometries(geometries, false), mat)
      mesh.name = mat.name
      group.add(mesh)
    }
    for (const obj of this.objects) group.add(obj)
    return group
  }
}
