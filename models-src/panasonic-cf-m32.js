// 3D-модель ноутбука Panasonic CF-M32 с порт-репликатором (док-станцией) CF-VEBM31.
// Тёмно-серый корпус, экран 8,4", сенсорная панель. По фото экспоната (photo_2) и фото из интернета.
import { ModelBuilder, material } from './lib.js'
import { laptop, laptopRows } from './laptop.js'

const body = material('Корпус', 0x3b3d40, { roughness: 0.55 })
const bezel = material('Рамка экрана', 0x1d1e20, { roughness: 0.5 })
const well = material('Подложка клавиатуры', 0x151617, { roughness: 0.8 })
const keyDark = material('Клавиши', 0x2a2b2e, { roughness: 0.5 })
const keyGrey = material('Клавиши серые', 0x45474b, { roughness: 0.5 })
const pad = material('Сенсорная панель', 0x2c2d30, { roughness: 0.35 })
const port = material('Разъёмы', 0x0d0d0d, { roughness: 0.8 })

const W = 0.28
const D = 0.22
const H = 0.04

export default function buildPanasonicCfM32() {
  const m = new ModelBuilder('Panasonic CF-M32')
  laptop(m, {
    width: W,
    depth: D,
    baseHeight: H,
    lidLength: 0.2,
    lidThickness: 0.012,
    openAngle: 112,
    bodyMat: body,
    bezelMat: bezel,
    wellMat: well,
    screen: { width: 0.171, height: 0.128, centerY: 0.11, draw: drawScreen, glow: 0.6 },
    keys: { rows: laptopRows(keyDark, keyGrey), pitch: 0.0165, z0: -0.075, height: 0.004 },
    bezelLabel: { text: 'Panasonic', color: '#d8d8d8' },
    lidLogo: { text: 'Panasonic', color: '#b8bcc2' },
  })

  // Сенсорная панель с двумя кнопками на подставке для запястий
  m.roundedBox([0.06, 0.0015, 0.042], 0.003, pad, { position: [0, H + 0.0004, 0.06] })
  for (const side of [-1, 1]) m.roundedBox([0.028, 0.002, 0.01], 0.002, keyGrey, { position: [side * 0.015, H + 0.0006, 0.09] })

  // Порт-репликатор, пристыкованный сзади
  m.roundedBox([W, 0.03, 0.06], 0.004, body, { position: [0, 0.015, -D / 2 - 0.03] })
  for (const [x, w] of [[-0.1, 0.03], [-0.055, 0.04], [0, 0.025], [0.045, 0.035], [0.1, 0.02]]) {
    m.box([w, 0.009, 0.002], port, { position: [x, 0.015, -D / 2 - 0.0605] })
  }
  return m.build()
}

// Рабочий стол в стиле Windows 95: бирюзовый фон, значки, панель задач с кнопкой «Пуск»
function drawScreen(ctx, w, h) {
  ctx.fillStyle = '#008080'
  ctx.fillRect(0, 0, w, h)
  const icon = h * 0.07
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = ['#f3e27a', '#c0c0c0', '#7fb2ff', '#f3e27a'][i]
    ctx.fillRect(w * 0.04, h * (0.05 + i * 0.16), icon, icon)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(w * 0.03, h * (0.05 + i * 0.16) + icon * 1.2, icon * 1.3, h * 0.012)
  }
  ctx.fillStyle = '#c0c0c0'
  ctx.fillRect(0, h * 0.92, w, h * 0.08)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, h * 0.92, w, h * 0.005)
  ctx.fillStyle = '#d4d0c8'
  ctx.fillRect(w * 0.01, h * 0.93, w * 0.13, h * 0.06)
  ctx.fillStyle = '#000'
  ctx.font = `bold ${Math.round(h * 0.045)}px Arial`
  ctx.textBaseline = 'middle'
  ctx.fillText('Пуск', w * 0.045, h * 0.962)
  ctx.fillText('12:00', w * 0.88, h * 0.962)
}
