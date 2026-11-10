// 3D-модель микрокалькулятора «Электроника Б3-25А»: корпус цвета слоновой кости,
// чёрная табличка с названием, зелёный индикатор, алюминиевая панель с белыми и красными кнопками.
// По фото экспоната (photo_21).
import { ModelBuilder, material, canvasPlane, placeKeys, keyLabels, FACE_UP } from './lib.js'

const ivory = material('Корпус', 0xdcd2b6, { roughness: 0.5 })
const dark = material('Окно индикатора', 0x0c0f0d, { roughness: 0.2 })
const keyWhite = material('Кнопки белые', 0xf1ece0, { roughness: 0.4 })
const keyRed = material('Кнопки красные', 0xc0392b, { roughness: 0.4 })
const black = material('Переключатели', 0x1a1a1a, { roughness: 0.5 })

const W = 0.09
const D = 0.155
const H = 0.026
const TOP = H + 0.0002

export default function buildB325A() {
  const m = new ModelBuilder('Электроника Б3-25А')

  m.roundedBox([W, H, D], 0.005, ivory, { position: [0, H / 2, 0] })

  // Табличка с названием
  m.object(canvasPlane('Табличка', 0.082, 0.011, drawNameplate, { transparent: false }), {
    position: [0, TOP, -0.066],
    rotation: FACE_UP,
  })

  // Индикатор: тёмное окно и светящиеся зелёные цифры
  m.box([0.08, 0.002, 0.03], dark, { position: [0, H, -0.042] })
  m.object(canvasPlane('Индикатор', 0.07, 0.016, drawDisplay, { transparent: false, glow: 0.9 }), {
    position: [0, H + 0.0012, -0.042],
    rotation: FACE_UP,
  })

  // Алюминиевая панель с подписями переключателей
  m.object(canvasPlane('Панель', 0.082, 0.09, drawPanel, { transparent: false, roughness: 0.35 }), {
    position: [0, TOP, 0.022],
    rotation: FACE_UP,
  })
  for (const x of [-0.025, 0.025]) {
    m.box([0.004, 0.0015, 0.009], black, { position: [x, H + 0.0006, -0.012] })
    m.box([0.003, 0.003, 0.003], black, { position: [x, H + 0.0015, -0.014] })
  }

  // Кнопки: цифры белые, операции красные
  const W1 = (label) => [1, keyWhite, label, '#222']
  const R1 = (label) => [1, keyRed, label, '#fff']
  const space = [0.4, null]
  const keys = placeKeys(
    m,
    [
      [W1('7'), W1('8'), W1('9'), space, R1('↔'), R1('C')],
      [W1('4'), W1('5'), W1('6'), space, R1('='), R1('/–/')],
      [W1('1'), W1('2'), W1('3'), space, R1('×'), R1('÷')],
      [W1('0'), W1(','), [1, null], space, R1('+'), R1('–')],
    ],
    { x0: -0.03915, z0: 0.006, pitch: 0.0145, gap: 0.0032, height: 0.006, surfaceY: () => TOP, rounded: 0.0012 },
  )
  keyLabels(m, 'Подписи кнопок', keys, { size: 0.62 })

  return m.build()
}

function drawNameplate(ctx, w, h) {
  ctx.fillStyle = '#111'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#d8d8d8'
  ctx.fillRect(0, h * 0.08, w, h * 0.04)
  ctx.fillRect(0, h * 0.88, w, h * 0.04)
  ctx.textBaseline = 'middle'
  ctx.font = `bold ${Math.round(h * 0.5)}px Arial`
  ctx.letterSpacing = `${Math.round(h * 0.08)}px`
  ctx.fillText('ЭЛЕКТРОНИКА', w * 0.04, h / 2)
  ctx.beginPath()
  ctx.strokeStyle = '#d8d8d8'
  ctx.lineWidth = Math.max(2, h * 0.06)
  ctx.arc(w * 0.66, h / 2, h * 0.3, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillText('Б3-25А', w * 0.74, h / 2)
}

function drawDisplay(ctx, w, h) {
  ctx.fillStyle = '#06100b'
  ctx.fillRect(0, 0, w, h)
  ctx.font = `${Math.round(h * 0.75)}px "Courier New", monospace`
  ctx.textAlign = 'right'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(80, 255, 170, 0.08)'
  ctx.fillText('88888888', w * 0.95, h / 2) // погасшие сегменты
  ctx.fillStyle = '#5dffb0'
  ctx.shadowColor = '#5dffb0'
  ctx.shadowBlur = h * 0.15
  ctx.fillText('0.', w * 0.95, h / 2)
}

function drawPanel(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h)
  g.addColorStop(0, '#c9ccce')
  g.addColorStop(0.5, '#b4b8bb')
  g.addColorStop(1, '#c6c9cb')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(255,255,255,0.08)' // «шлифовка» алюминия
  for (let x = 0; x < w; x += 3) ctx.fillRect(x, 0, 1, h)
  ctx.fillStyle = '#222'
  ctx.font = `bold ${Math.round(h * 0.055)}px Arial`
  ctx.textAlign = 'center'
  const left = w * 0.22
  const right = w * 0.78
  ctx.fillText('ВКЛ', left, h * 0.07)
  ctx.fillText('ОТКЛ', left, h * 0.32)
  ctx.fillText('ЗАР1', right, h * 0.07)
  ctx.fillText('ЗАР2', right, h * 0.32)
  ctx.beginPath()
  ctx.arc(w / 2, h * 0.17, h * 0.015, 0, Math.PI * 2)
  ctx.fill()
}
