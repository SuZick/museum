// Общие детали для моделей материнских плат: текстолит с дорожками, микросхемы, слоты, разъёмы.
// Плата лежит на столе; дальний край (-z) — «верх» на фото, слоты расширения — ближе к зрителю.
import { material, canvasPlane, textPlane, FACE_UP } from './lib.js'

export const mats = {
  pcbEdge: material('Текстолит', 0x3d5428, { roughness: 0.6 }),
  chip: material('Микросхемы', 0x1b1b1d, { roughness: 0.45 }),
  socket: material('Панельки', 0x34332f, { roughness: 0.6 }),
  slot: material('Слоты ISA', 0x151515, { roughness: 0.5 }),
  slotWhite: material('Слоты памяти', 0xe8e4da, { roughness: 0.5 }),
  ceramic: material('Корпус процессора', 0x6d6a64, { roughness: 0.5 }),
  sticker: material('Наклейки', 0xf2efe6, { roughness: 0.7 }),
  metal: material('Металл', 0xcfcfcf, { roughness: 0.3, metalness: 0.9 }),
  battery: material('Батарейка', 0x2850b8, { roughness: 0.35 }),
  connector: material('Разъём питания', 0xf0ece0, { roughness: 0.6 }),
}

export const T = 0.0016 // толщина платы

// Плата: текстолит с нарисованными дорожками и надписями
export function board(m, width, depth, seed, labels = []) {
  m.box([width, T, depth], mats.pcbEdge, { position: [0, T / 2, 0] })
  const plane = canvasPlane('Дорожки', width, depth, (ctx, w, h) => drawPcb(ctx, w, h, seed, labels, width), {
    transparent: false,
    pixelsPerMeter: 3200,
    roughness: 0.45,
  })
  m.object(plane, { position: [0, T + 0.0001, 0], rotation: FACE_UP })
}

// Прямоугольная микросхема (или любая деталь-брусок) на плате
export function part(m, x, z, [w, h, d], mat = mats.chip) {
  m.box([w, h, d], mat, { position: [x, T + h / 2, z] })
}

// Микросхема в DIP-корпусе: pins — число ножек, along — 'z' (вдоль платы) или 'x'
export function dip(m, x, z, pins = 16, along = 'z') {
  const length = (pins / 2) * 0.00254 + 0.002
  const size = along === 'z' ? [0.0075, 0.0035, length] : [length, 0.0035, 0.0075]
  part(m, x, z, size)
  return length
}

// Микросхема BIOS с белой наклейкой
export function bios(m, x, z) {
  const length = dip(m, x, z, 28)
  m.box([0.0068, 0.0004, length * 0.6], mats.sticker, { position: [x, T + 0.0037, z] })
}

// Квадратная микросхема с надписью (надпись — общая картинка, её можно передавать нескольким микросхемам)
export function squareChip(m, x, z, size, label, { height = 0.0035, mat = mats.chip, socket = false } = {}) {
  let top = height
  if (socket) {
    part(m, x, z, [size + 0.006, 0.004, size + 0.006], mats.socket)
    m.box([size, height, size], mat, { position: [x, T + 0.004 + height / 2, z] })
    top = 0.004 + height
  } else part(m, x, z, [size, height, size], mat)
  if (label) m.object(label.clone(), { position: [x, T + top + 0.0002, z], rotation: FACE_UP })
}

// Надпись для микросхем
export function chipLabel(text, size, color = '#d8d8d8') {
  return textPlane(`Надпись ${text}`, size * 0.8, size * 0.35, text, { color, size: 0.7 })
}

// Слот ISA вдоль оси z: длинная 8-битная часть и (если double) короткая 16-битная
export function isaSlot(m, x, zShort, zLong, { double = true, shortLength = 0.04, longLength = 0.085 } = {}) {
  part(m, x, zLong, [0.0085, 0.011, longLength], mats.slot)
  if (double) part(m, x, zShort, [0.0085, 0.011, shortLength], mats.slot)
}

// Батарейка-бочонок, разъём клавиатуры, разъём питания
export function battery(m, x, z) {
  m.cylinder(0.0065, 0.013, mats.battery, { position: [x, T + 0.0065, z] }, 18)
}
export function keyboardConnector(m, x, z) {
  m.cylinder(0.0072, 0.014, mats.slot, { position: [x, T + 0.0072, z], rotation: [Math.PI / 2, 0, 0] }, 18)
}
export function powerConnector(m, x, z) {
  part(m, x, z, [0.0065, 0.011, 0.05], mats.connector)
}
export function oscillator(m, x, z) {
  part(m, x, z, [0.013, 0.0055, 0.008], mats.metal)
}

// Простой генератор псевдослучайных чисел с «зерном» (рисунок дорожек всегда одинаковый)
function random(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Рисунок текстолита: зелёная основа, медные дорожки, переходные отверстия, белые надписи
function drawPcb(ctx, w, h, seed, labels, widthMeters) {
  const rnd = random(seed)
  ctx.fillStyle = '#56692e'
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = 'rgba(196, 170, 92, 0.55)'
  ctx.lineWidth = Math.max(1, w / 400)
  for (let i = 0; i < 260; i++) {
    let x = rnd() * w
    let y = rnd() * h
    ctx.beginPath()
    ctx.moveTo(x, y)
    for (let s = 0; s < 4; s++) {
      const len = (0.02 + rnd() * 0.12) * w
      const dir = Math.floor(rnd() * 4)
      if (dir === 0) x += len
      else if (dir === 1) y += len
      else if (dir === 2) { x += len * 0.7; y += len * 0.7 }
      else y -= len
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.fillStyle = 'rgba(214, 190, 110, 0.8)'
  for (let i = 0; i < 300; i++) {
    ctx.beginPath()
    ctx.arc(rnd() * w, rnd() * h, w / 300, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = 'rgba(240, 240, 230, 0.85)'
  const scale = w / widthMeters
  for (const { text, x, z, size = 0.004 } of labels) {
    ctx.font = `bold ${Math.round(size * scale)}px Arial`
    ctx.fillText(text, (x + widthMeters / 2) * scale, z * scale + h / 2)
  }
}
