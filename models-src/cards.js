// Общие детали для моделей плат расширения (видеокарт): текстолит с «гребёнкой» контактов,
// металлическая планка, разъёмы, вентиляторы, мелкие детали (резисторы, конденсаторы).
// Плата лежит на столе деталями вверх и повёрнута так же, как на фото витрины: контакты внизу
// (ближе к зрителю, +z). Планка у карт ISA справа (+x), у карт PCI и PCI Express — слева (-x):
// у этих шин детали стоят на другой стороне платы.
import * as THREE from 'three'
import { material, canvasPlane, textPlane, FACE_UP } from './lib.js'
import { T, drawPcb } from './boards.js'

export const cardMats = {
  bracket: material('Планка', 0xc4c7c9, { roughness: 0.35, metalness: 0.9 }),
  shell: material('Корпус разъёма', 0xb9bcbe, { roughness: 0.3, metalness: 0.95 }),
  plastic: material('Пластик разъёма', 0x1d1d1f, { roughness: 0.6 }),
  vgaBlue: material('Разъём VGA', 0x2c45a8, { roughness: 0.5 }),
  dviWhite: material('Разъём DVI', 0xece8dc, { roughness: 0.6 }),
  chip: material('Микросхемы', 0x1b1b1d, { roughness: 0.45 }),
  resistor: material('Резисторы', 0xd8c49a, { roughness: 0.6 }),
  ceramic: material('Конденсаторы керамические', 0xc8682e, { roughness: 0.5 }),
  electrolytic: material('Конденсаторы', 0x1e1f24, { roughness: 0.4 }),
  tantalum: material('Конденсаторы танталовые', 0x2a54b0, { roughness: 0.45 }),
  yellowCap: material('Конденсаторы жёлтые', 0xd9a520, { roughness: 0.45 }),
  pins: material('Штырьки', 0xe2c46a, { roughness: 0.3, metalness: 1 }),
  copper: material('Медная обмотка', 0xb86a32, { roughness: 0.35, metalness: 0.8 }),
  fanBlack: material('Вентилятор', 0x222326, { roughness: 0.5 }),
}

// Позолоченные контакты нарисованы картинкой: полоски на цвете текстолита.
// Это в несколько раз легче, чем делать каждый контакт отдельной деталью.
function contactsPlane(width, depth, pitch, background) {
  return canvasPlane(
    'Контакты',
    width,
    depth,
    (ctx, w, h) => {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, w, h)
      const count = Math.floor(width / pitch)
      const step = (w / width) * pitch
      const start = (w - count * step) / 2
      ctx.fillStyle = '#d9ab45'
      for (let i = 0; i < count; i++) ctx.fillRect(start + i * step + step * 0.2, h * 0.08, step * 0.6, h * 0.84)
    },
    { transparent: false, pixelsPerMeter: 9000, roughness: 0.35 },
  )
}

// Текстолит: прямоугольник length × height с нарисованными дорожками
// и выступы снизу с позолоченными контактами (ими плата вставляется в слот).
//   fingers — участки контактов: [{ from, to }] — расстояния от левого края платы в метрах
//   pitch   — шаг контактов (у ISA 2,54 мм, у PCI 1,27 мм, у PCI Express 1 мм)
//   colors  — цвета основы и дорожек для рисунка, edgeColor — цвет торцов и нижней стороны
//   pixelsPerMeter — чёткость рисунка (у больших плат чуть меньше, чтобы файл был легче)
export function cardPcb(m, { length, height, fingers, pitch, fingerDepth = 0.0075, colors, edgeColor, seed = 1, labels = [], pixelsPerMeter = 4800 }) {
  const edge = material('Текстолит', edgeColor, { roughness: 0.6 })
  m.box([length, T, height], edge, { position: [0, T / 2, 0] })
  const plane = canvasPlane('Дорожки', length, height, (ctx, w, h) => drawPcb(ctx, w, h, seed, labels, length, colors), {
    transparent: false,
    pixelsPerMeter,
    roughness: 0.45,
  })
  m.object(plane, { position: [0, T + 0.0001, 0], rotation: FACE_UP })

  // Выступы с контактами (картинка с контактами — сверху и снизу)
  const z = height / 2 + fingerDepth / 2
  for (const { from, to } of fingers) {
    const width = to - from
    const x = -length / 2 + from + width / 2
    m.box([width, T, fingerDepth], edge, { position: [x, T / 2, z] })
    const top = contactsPlane(width, fingerDepth, pitch, colors.base)
    m.object(top, { position: [x, T + 0.0001, z], rotation: FACE_UP })
    m.object(top.clone(), { position: [x, -0.0001, z], rotation: [Math.PI / 2, 0, 0] })
  }
}

// Контакты PCI Express x16: короткий участок у планки, вырез-ключ, длинный участок.
// start — расстояние от левого края платы до первого контакта
export function pcieFingers(start) {
  return [
    { from: start, to: start + 0.0112 },
    { from: start + 0.0131, to: start + 0.0841 },
  ]
}

// Металлическая планка (крепится к корпусу компьютера) на краю платы x.
//   top    — z верхнего края, там загиб с прорезью под винт
//   bottom — z нижнего края, там узкий язычок
//   dir    — в какую сторону смотрит загиб: +1 (планка справа) или -1 (слева)
// Планка стоит поперёк платы: 18 мм в высоту, из них чуть-чуть уходит под плату.
export function bracket(m, x, { top, bottom, dir = 1, tab = 0.011, width = 0.0185, below = 0.0025 }) {
  const thick = 0.0009
  const y0 = -below
  const main = bottom - tab - top
  m.box([thick, width, main], cardMats.bracket, { position: [x, y0 + width / 2, top + main / 2] })
  m.box([thick, width * 0.45, tab], cardMats.bracket, { position: [x, y0 + width * 0.32, bottom - tab / 2] })
  m.box([0.011, width, thick], cardMats.bracket, { position: [x + dir * 0.0055, y0 + width / 2, top + thick / 2] })
}

// Трапеция (форма разъёмов D-sub и DVI), центр в нуле
function trapezoidShape(wide, narrow, height) {
  const shape = new THREE.Shape()
  shape.moveTo(-wide / 2, height / 2)
  shape.lineTo(wide / 2, height / 2)
  shape.lineTo(narrow / 2, -height / 2)
  shape.lineTo(-narrow / 2, -height / 2)
  shape.closePath()
  return shape
}

// Выдавить плоскую форму наружу через планку на глубину depth (dir = +1 — вдоль +x, -1 — вдоль -x)
function extrudeOut(shape, depth, dir) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false })
  g.rotateY((dir * Math.PI) / 2)
  return g
}

// Разъём с трапециевидной «юбкой» на планке x (D-sub или DVI), центр по z.
// Внутри — корпус на плате, снаружи — металлическая юбка, изолятор и две винтовые стойки.
function trapezoidConnector(m, x, z, { dir, body, bodyMat, insulator, length, wide, narrow, height, screws }) {
  const y = T + 0.0064 // ось разъёма над платой
  m.box([body, 0.0118, length], bodyMat, { position: [x - (dir * body) / 2, T + 0.0059, z] })
  m.box([0.0008, 0.0125, length + 0.0005], cardMats.shell, { position: [x + dir * 0.0009, y, z] })
  m.add(extrudeOut(trapezoidShape(wide, narrow, height), 0.0062, dir), cardMats.shell, { position: [x + dir * 0.0013, y, z] })
  m.add(extrudeOut(trapezoidShape(wide - 0.0016, narrow - 0.0016, height - 0.0016), 0.0063, dir), insulator, {
    position: [x + dir * 0.0013, y, z],
  })
  for (const side of [-1, 1]) {
    m.cylinder(0.0024, 0.0055, cardMats.shell, {
      position: [x + dir * (0.0013 + 0.00275), y, z + side * screws],
      rotation: [0, 0, Math.PI / 2],
    }, 6)
  }
}

// Разъём монитора D-sub (VGA). insulator — цвет пластика (у старых карт чёрный, у новых синий)
export function dsub(m, x, z, { dir = 1, insulator = cardMats.plastic, body = 0.013 } = {}) {
  trapezoidConnector(m, x, z, { dir, body, bodyMat: insulator, insulator, length: 0.0305, wide: 0.0168, narrow: 0.0146, height: 0.0084, screws: 0.0125 })
}

// Цифровой разъём монитора DVI — белый, шире VGA
export function dvi(m, x, z, { dir = -1 } = {}) {
  trapezoidConnector(m, x, z, {
    dir,
    body: 0.016,
    bodyMat: cardMats.dviWhite,
    insulator: cardMats.dviWhite,
    length: 0.038,
    wide: 0.0268,
    narrow: 0.0236,
    height: 0.0085,
    screws: 0.0165,
  })
}

// Круглый разъём S-Video (телевизионный выход)
export function svideo(m, x, z, { dir = -1 } = {}) {
  const y = T + 0.0064
  m.box([0.012, 0.0118, 0.0135], cardMats.plastic, { position: [x - (dir * 0.012) / 2, T + 0.0059, z] })
  m.cylinder(0.0048, 0.006, cardMats.shell, { position: [x + dir * 0.003, y, z], rotation: [0, 0, Math.PI / 2] }, 20)
  m.cylinder(0.0036, 0.0062, cardMats.plastic, { position: [x + dir * 0.003, y, z], rotation: [0, 0, Math.PI / 2] }, 16)
}

// Разъём HDMI — плоская металлическая коробочка
export function hdmi(m, x, z, { dir = -1 } = {}) {
  m.box([0.012, 0.0058, 0.0152], cardMats.shell, { position: [x - (dir * 0.0045), T + 0.0035, z] })
}

// ---------- Микросхемы и детали питания ----------

// Графический процессор в корпусе BGA: квадратная подложка и кристалл посередине
export function bga(m, x, z, size, { die = size * 0.45, substrate = 0x2f4a2c, dieColor = 0x2a2d33 } = {}) {
  m.box([size, 0.0012, size], material('Подложка процессора', substrate, { roughness: 0.5 }), { position: [x, T + 0.0006, z] })
  m.box([die, 0.0008, die], material('Кристалл', dieColor, { roughness: 0.25, metalness: 0.3 }), { position: [x, T + 0.0016, z] })
}

// Микросхема памяти (прямоугольник с надписью). label — общая картинка-надпись или null
export function memChip(m, x, z, [w, d], label = null, { rotate = false } = {}) {
  m.box([w, 0.0012, d], cardMats.chip, { position: [x, T + 0.0006, z] })
  if (label) m.object(label.clone(), { position: [x, T + 0.0013, z], rotation: rotate ? [-Math.PI / 2, 0, Math.PI / 2] : FACE_UP })
}

// Надпись на микросхеме (одна картинка на несколько одинаковых микросхем)
export function chipText(text, width, height, color = '#c9c9c9') {
  return textPlane(`Надпись ${text}`, width, height, text, { color, size: 0.7 })
}

// Катушка-тороид: медное «колечко» из провода
export function toroid(m, x, z, radius = 0.0045) {
  m.add(new THREE.TorusGeometry(radius, radius * 0.42, 8, 18), cardMats.copper, {
    position: [x, T + radius * 0.42, z],
    rotation: [Math.PI / 2, 0, 0],
  })
}

// Квадратный дроссель (чёрный кубик с надписью вроде «R56»)
export function choke(m, x, z, size, text) {
  m.box([size, size * 0.6, size], cardMats.chip, { position: [x, T + size * 0.3, z] })
  if (text) m.object(textPlane(`Дроссель ${text}`, size * 0.8, size * 0.45, text, { color: '#e8e8e8', size: 0.75 }), {
    position: [x, T + size * 0.6 + 0.0001, z],
    rotation: FACE_UP,
  })
}

// Вентилятор: ступица и лопасти. y — высота, на которой он лежит
export function fan(m, x, y, z, { radius, blades = 9, mat = cardMats.fanBlack, hubRatio = 0.38, height = 0.004 }) {
  const hub = radius * hubRatio
  m.cylinder(hub, height, mat, { position: [x, y + height / 2, z] }, 24)
  const len = radius - hub
  // Лопасть — тонкая пластинка вдоль радиуса, повёрнутая вокруг своей длинной оси (как у настоящего вентилятора)
  for (let i = 0; i < blades; i++) {
    const a = (i / blades) * Math.PI * 2
    const r = hub + len / 2
    m.box([len * 0.55, height * 0.2, len], mat, {
      position: [x + Math.sin(a) * r, y + height * 0.55, z + Math.cos(a) * r],
      rotation: [0, a, 0.5],
    })
  }
}

// Круглая картинка (наклейка на ступице вентилятора)
export function roundSticker(name, diameter, draw) {
  return canvasPlane(name, diameter, diameter, (ctx, w, h) => {
    ctx.save()
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, w / 2 - 1, 0, Math.PI * 2)
    ctx.clip()
    draw(ctx, w, h)
    ctx.restore()
  })
}

// ---------- Мелкие детали ----------

// Резистор, лежащий вдоль x (along = 'x') или вдоль z
export function resistor(m, x, z, along = 'x') {
  const rotation = along === 'x' ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0]
  m.cylinder(0.0009, 0.0055, cardMats.resistor, { position: [x, T + 0.0011, z], rotation }, 8)
}

// Керамический конденсатор-«таблетка», стоит на плате
export function ceramicCap(m, x, z) {
  m.cylinder(0.0021, 0.0011, cardMats.ceramic, { position: [x, T + 0.0028, z], rotation: [Math.PI / 2, 0, 0] }, 10)
}

// Электролитический конденсатор-«бочонок», стоит на плате
export function electrolyticCap(m, x, z, { radius = 0.0025, height = 0.0055, mat = cardMats.electrolytic, top = null } = {}) {
  m.cylinder(radius, height, mat, { position: [x, T + height / 2, z] }, 12)
  if (top) m.cylinder(radius * 0.92, 0.0002, top, { position: [x, T + height + 0.0001, z] }, 12)
}

// Танталовый конденсатор — маленький брусочек
export function tantalumCap(m, x, z, mat = cardMats.tantalum) {
  m.box([0.0035, 0.0018, 0.0022], mat, { position: [x, T + 0.0009, z] })
}

// SMD-детали: россыпь крошечных брусочков вдоль линии (резисторы и конденсаторы на поверхности платы)
export function smdRow(m, x, z, count, { step = 0.0022, along = 'x', mat = cardMats.chip } = {}) {
  for (let i = 0; i < count; i++) {
    const dx = along === 'x' ? i * step : 0
    const dz = along === 'x' ? 0 : i * step
    m.box([0.0016, 0.0006, 0.0009], mat, { position: [x + dx, T + 0.0003, z + dz] })
  }
}

// Колодка штырьков cols × rows (перемычки, разъёмы-гребёнки)
export function jumpers(m, x, z, cols = 3, rows = 2, { pins = true } = {}) {
  const p = 0.00254
  m.box([cols * p, 0.0025, rows * p], cardMats.plastic, { position: [x, T + 0.00125, z] })
  if (!pins) return
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      m.box([0.0006, 0.006, 0.0006], cardMats.pins, {
        position: [x + (c - (cols - 1) / 2) * p, T + 0.003, z + (r - (rows - 1) / 2) * p],
      })
    }
  }
}

// Наклейка с текстом (серийный номер, наклейка на BIOS): лежит на высоте y над столом
export function sticker(m, name, x, y, z, [width, depth], text, { background = '#f2efe6', color = '#222222', size = 0.6, rotation = FACE_UP } = {}) {
  const plane = textPlane(name, width, depth, text, { background, color, size, weight: 'bold', pixelsPerMeter: 9000 })
  m.object(plane, { position: [x, y, z], rotation })
}

// Наклейка со штрихкодом
export function barcode(m, x, y, z, [width, depth], text, { rotation = FACE_UP, seed = 3 } = {}) {
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  const plane = canvasPlane('Штрихкод', width, depth, (ctx, w, h) => {
    ctx.fillStyle = '#f4f2ea'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#111111'
    let px = w * 0.06
    while (px < w * 0.94) {
      const bar = (1 + Math.floor(rnd() * 3)) * (w / 160)
      ctx.fillRect(px, h * 0.1, bar, h * 0.58)
      px += bar + (1 + Math.floor(rnd() * 2)) * (w / 160)
    }
    ctx.font = `bold ${Math.round(h * 0.22)}px Arial`
    ctx.textAlign = 'center'
    ctx.fillText(text, w / 2, h * 0.9)
  }, { transparent: false, pixelsPerMeter: 9000 })
  m.object(plane, { position: [x, y, z], rotation })
}
