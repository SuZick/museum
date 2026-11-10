// 3D-модель «Искра-1256»: чёрный моноблок (экран + отсек накопителя) и отдельная клавиатура.
// Размеры сняты с фото экспоната (photo_10) и фото с Wikimedia; единицы — метры.
import * as THREE from 'three'
import { ModelBuilder, material, frameGeometry, canvasPlane } from './lib.js'

// ---------- Материалы ----------
const body = material('Корпус', 0x232323, { roughness: 0.6 })
const bezel = material('Окантовка', 0x191919, { roughness: 0.45 })
const deep = material('Ниша', 0x0b0b0b, { roughness: 0.85 })
const panel = material('Панель отсека', 0x2c2c2c, { roughness: 0.45 })
const chrome = material('Хром', 0xc9c9c9, { roughness: 0.3, metalness: 0.9 })
const smoked = material('Окошко', 0x8f9894, { roughness: 0.15 })
const keyDark = material('Клавиши тёмные', 0x3b3b3d, { roughness: 0.5 })
const keyRed = material('Клавиши красные', 0xb3342b, { roughness: 0.45 })
const keyLight = material('Клавиши светлые', 0xc9c2b4, { roughness: 0.5 })
const cable = material('Кабель', 0xcfcabd, { roughness: 0.6 })

// ---------- Моноблок ----------
const W = 0.5 // ширина
const H = 0.245 // высота
const D = 0.4 // глубина
const PLINTH = 0.012 // высота цоколя
const FRONT = D / 2 // z лицевой стороны

function monoblock(m) {
  // Корпус и цоколь
  m.roundedBox([W, H - PLINTH, D], 0.01, body, { position: [0, PLINTH + (H - PLINTH) / 2, 0] })
  m.box([W - 0.02, PLINTH, D - 0.02], deep, { position: [0, PLINTH / 2, 0] })

  // Экран: выпуклая окантовка → тёмная ниша → светящийся кинескоп
  const sx = -0.087 // центр экрана по x
  const sy = 0.1265 // центр экрана по y
  m.add(
    frameGeometry({ width: 0.274, height: 0.215, radius: 0.014 }, { width: 0.244, height: 0.19, radius: 0.022 }, 0.008),
    bezel,
    { position: [sx, sy, FRONT] },
  )
  m.add(
    frameGeometry({ width: 0.244, height: 0.19, radius: 0.022 }, { width: 0.228, height: 0.178, radius: 0.026 }, 0.004),
    deep,
    { position: [sx, sy, FRONT] },
  )
  m.object(canvasPlane('Экран', 0.236, 0.185, drawScreen, { glow: 0.55, transparent: false, pixelsPerMeter: 3000 }), {
    position: [sx, sy, FRONT + 0.002],
  })

  // Отсек накопителя справа: рамка, верхняя планка с кнопкой, откидная крышка с окошком
  const bx = 0.1435
  const by = 0.1756
  m.add(
    frameGeometry({ width: 0.157, height: 0.109, radius: 0.004 }, { width: 0.149, height: 0.101, radius: 0.003 }, 0.006),
    bezel,
    { position: [bx, by, FRONT] },
  )
  m.box([0.147, 0.026, 0.004], panel, { position: [bx, 0.2143, FRONT + 0.002] })
  m.cylinder(0.0055, 0.004, chrome, { position: [0.2019, 0.2143, FRONT + 0.005], rotation: [Math.PI / 2, 0, 0] })
  m.cylinder(0.0035, 0.003, deep, { position: [0.2019, 0.2143, FRONT + 0.0065], rotation: [Math.PI / 2, 0, 0] })
  m.box([0.147, 0.072, 0.005], panel, { position: [bx, 0.161, FRONT + 0.0025] })
  m.roundedBox([0.054, 0.017, 0.004], 0.0015, smoked, { position: [0.1454, 0.1591, FRONT + 0.0055] })
  m.box([0.03, 0.004, 0.002], chrome, { position: [0.1454, 0.1591, FRONT + 0.0075] })

  // Надпись «ИСКРА-1256»
  m.object(canvasPlane('Надпись', 0.13, 0.018, drawLabel), { position: [0.1639, 0.0876, FRONT + 0.0006] })

  // Нижняя планка с тремя ручками регулировки
  m.add(
    frameGeometry({ width: 0.163, height: 0.0333, radius: 0.003 }, { width: 0.157, height: 0.0275, radius: 0.002 }, 0.004),
    bezel,
    { position: [0.1481, 0.0431, FRONT] },
  )
  for (const x of [0.0907, 0.1482, 0.2056]) {
    m.cylinder(0.0055, 0.006, chrome, { position: [x, 0.0431, FRONT + 0.003], rotation: [Math.PI / 2, 0, 0] })
    m.cylinder(0.003, 0.002, deep, { position: [x, 0.0431, FRONT + 0.0065], rotation: [Math.PI / 2, 0, 0] })
  }

  // Вентиляционные прорези сверху и сзади
  for (let i = 0; i < 9; i++) {
    m.box([0.3, 0.001, 0.005], deep, { position: [0, H + 0.0003, -0.17 + i * 0.012] })
  }
  for (let i = 0; i < 8; i++) {
    m.box([0.26, 0.004, 0.002], deep, { position: [-0.06, 0.13 + i * 0.012, -FRONT - 0.0005] })
  }
  m.box([0.14, 0.05, 0.004], deep, { position: [0.14, 0.06, -FRONT - 0.001] }) // разъёмы
}

// ---------- Клавиатура ----------
const KW = 0.42 // ширина
const KD = 0.19 // глубина
const KZ = FRONT + 0.03 + KD / 2 // центр клавиатуры по z (перед моноблоком)
const K_FRONT_H = 0.02 // высота спереди
const K_BACK_H = 0.036 // высота сзади
const SLOPE = Math.atan((K_BACK_H - K_FRONT_H) / KD) // наклон верхней панели

// Высота верхней панели клавиатуры в точке z (z — от центра клавиатуры)
const topAt = (z) => K_FRONT_H + ((KD / 2 - z) / KD) * (K_BACK_H - K_FRONT_H)

// Раскладка: ряды от дальнего к ближнему. [ширина в клавишах, цвет]; D — тёмная, R — красная, L — светлая
const MAIN_ROWS = [
  [[1, 'R'], ...Array(11).fill([1, 'L']), [1, 'R']],
  Array(13).fill([1, 'D']),
  [[1.5, 'R'], ...Array(10).fill([1, 'D']), [1.5, 'D']],
  [[1.75, 'R'], ...Array(10).fill([1, 'D']), [1.25, 'R']],
  [[2.25, 'R'], ...Array(9).fill([1, 'D']), [1.75, 'R']],
  [[1.5, 'R'], [1.5, 'R'], [7, 'D'], [1.5, 'R'], [1.5, 'R']],
]
const PAD_ROWS = [
  Array(4).fill([1, 'L']),
  [[1, 'L'], [1, 'L'], [1, 'L'], [1, 'R']],
  [[1, 'L'], [1, 'L'], [1, 'L'], [1, 'R']],
  [[1, 'L'], [1, 'L'], [1, 'L'], [1, 'R']],
  [[1, 'L'], [1, 'L'], [1, 'L'], [1, 'R']],
  [[2, 'L'], [1, 'L'], [1, 'R']],
]
const KEY_COLORS = { D: keyDark, R: keyRed, L: keyLight }

function keyboard(m) {
  // Корпус — клин: сзади выше, чем спереди. Рисуем профиль сбоку и «вытягиваем» его на ширину клавиатуры.
  const profile = new THREE.Shape()
  profile.moveTo(-KD / 2, 0)
  profile.lineTo(KD / 2, 0)
  profile.lineTo(KD / 2, K_BACK_H)
  profile.lineTo(-KD / 2, K_FRONT_H)
  profile.closePath()
  const caseGeometry = new THREE.ExtrudeGeometry(profile, {
    depth: KW - 0.004,
    bevelEnabled: true,
    bevelSize: 0.002,
    bevelThickness: 0.002,
    bevelSegments: 1,
  })
  m.add(caseGeometry, body, { position: [-KW / 2 + 0.002, 0, KZ], rotation: [0, Math.PI / 2, 0] })

  // Клавиши
  const pitch = 0.019 // шаг клавиш
  const gap = 0.0035 // зазор между клавишами
  const keyHeight = 0.009
  const x0 = -(17.5 * pitch) / 2 // основной блок 13 клавиш + промежуток 0.5 + цифровой блок 4
  const z0 = -KD / 2 + 0.04 + pitch / 2

  const placeRow = (row, rowIndex, startX) => {
    let x = startX
    const z = z0 + rowIndex * pitch
    for (const [width, color] of row) {
      const keyWidth = width * pitch - gap
      m.box([keyWidth, keyHeight, pitch - gap], KEY_COLORS[color], {
        position: [x + (width * pitch) / 2, topAt(z) + keyHeight / 2 - 0.003, KZ + z],
        rotation: [SLOPE, 0, 0],
      })
      x += width * pitch
    }
  }
  MAIN_ROWS.forEach((row, i) => placeRow(row, i, x0))
  PAD_ROWS.forEach((row, i) => placeRow(row, i, x0 + 13.5 * pitch))

  // Кабель от клавиатуры к моноблоку
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.17, 0.026, KZ - KD / 2 + 0.002),
    new THREE.Vector3(-0.19, 0.008, KZ - KD / 2 - 0.012),
    new THREE.Vector3(-0.24, 0.004, KZ - KD / 2 - 0.008),
    new THREE.Vector3(-0.268, 0.004, 0.17),
    new THREE.Vector3(-0.272, 0.008, 0.06),
    new THREE.Vector3(-0.25, 0.04, 0.02),
  ])
  m.add(new THREE.TubeGeometry(path, 48, 0.003, 6), cable)
}

// ---------- Рисунки на холсте ----------

// Экран: на снимке включённой «Искры-1256» интерпретатор сообщает объём свободной памяти
function drawScreen(ctx, w, h) {
  const glow = ctx.createRadialGradient(w / 2, h / 2, h * 0.1, w / 2, h / 2, w * 0.65)
  glow.addColorStop(0, '#83928c')
  glow.addColorStop(1, '#4b5853')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = 'rgba(0, 0, 0, 0.07)' // строки развёртки кинескопа
  for (let y = 0; y < h; y += 6) ctx.fillRect(0, y, w, 2)

  ctx.font = `bold ${Math.round(h / 15)}px "Courier New", monospace`
  ctx.fillStyle = '#eef4ef'
  ctx.shadowColor = 'rgba(255, 255, 255, 0.6)'
  ctx.shadowBlur = 8
  ctx.textBaseline = 'top'
  ctx.textAlign = 'center'
  ctx.fillText('СВОБОДНАЯ ПАМЯТЬ=64352', w / 2, h * 0.1)
  ctx.textAlign = 'left'
  ctx.fillText(':_', w * 0.08, h * 0.21)
}

// Надпись на корпусе — контурные белые буквы, как на оригинале
function drawLabel(ctx, w, h) {
  ctx.clearRect(0, 0, w, h)
  ctx.font = `bold ${Math.round(h * 0.8)}px Arial, sans-serif`
  ctx.letterSpacing = `${Math.round(h * 0.06)}px`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = Math.max(3, h * 0.07)
  ctx.strokeText('ИСКРА-1256', w / 2, h / 2 + 2)
}

export default function buildIskra1256() {
  const m = new ModelBuilder('Искра-1256')
  monoblock(m)
  keyboard(m)
  return m.build()
}
