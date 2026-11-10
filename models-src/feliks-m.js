// 3D-модель арифмометра «Феликс-М»: литое основание, каретка со счётчиками,
// полукруглый корпус с 9 прорезями для установки чисел и рукоятка справа.
// По фото экспоната (photo_11) и фото с Wikimedia.
import * as THREE from 'three'
import { ModelBuilder, material, canvasPlane } from './lib.js'

const enamel = material('Эмаль', 0x7f9ea2, { roughness: 0.55, metalness: 0.2 })
const chrome = material('Хром', 0xd0d0d0, { roughness: 0.25, metalness: 0.9 })
const slot = material('Прорези', 0x1a1d1e, { roughness: 0.8 })
const knob = material('Ручка', 0x151515, { roughness: 0.4 })

const DRUM_R = 0.05 // радиус полукруглого корпуса
const DRUM_Y = 0.068 // высота оси корпуса
const DRUM_Z = -0.02

// Точка на поверхности полукруглого корпуса: угол θ отсчитывается от передней нижней кромки вверх
const onDrum = (x, theta, lift = 0) => [x, DRUM_Y + (DRUM_R + lift) * Math.sin(theta), DRUM_Z + (DRUM_R + lift) * Math.cos(theta)]

export default function buildFeliksM() {
  const m = new ModelBuilder('Феликс-М')

  // Основание с «лапами» по бокам и корпус механизма
  m.roundedBox([0.27, 0.018, 0.15], 0.006, enamel, { position: [0, 0.009, 0] })
  for (const side of [-1, 1]) m.roundedBox([0.05, 0.03, 0.17], 0.01, enamel, { position: [side * 0.135, 0.015, 0] })
  m.roundedBox([0.24, 0.05, 0.12], 0.008, enamel, { position: [0, 0.043, -0.01] })

  // Полукруглый корпус (полуцилиндр, лежащий вдоль оси x)
  m.add(new THREE.CylinderGeometry(DRUM_R, DRUM_R, 0.21, 28, 1, false, 0, Math.PI), enamel, {
    position: [-0.01, DRUM_Y, DRUM_Z],
    rotation: [0, 0, Math.PI / 2],
  })

  // 9 прорезей с рычажками установки цифр
  const leverAngles = [0.5, 0.3, 0.42, 0.22, 0.55, 0.35, 0.25, 0.47, 0.3]
  for (let i = 0; i < 9; i++) {
    const x = 0.0 + i * 0.0105
    m.add(new THREE.CylinderGeometry(DRUM_R + 0.0005, DRUM_R + 0.0005, 0.0035, 14, 1, true, 0.12 * Math.PI, 0.55 * Math.PI), slot, {
      position: [x, DRUM_Y, DRUM_Z],
      rotation: [0, 0, Math.PI / 2],
    })
    const theta = leverAngles[i] * Math.PI
    m.box([0.003, 0.009, 0.004], chrome, { position: onDrum(x, theta, 0.004), rotation: [Math.PI / 2 - theta, 0, 0] })
  }

  // Надпись «Феликс М» на корпусе
  const labelTheta = 0.3 * Math.PI
  m.object(canvasPlane('Надпись', 0.075, 0.03, drawLabel), {
    position: onDrum(-0.075, labelTheta, 0.0015),
    rotation: [-labelTheta, 0, 0],
  })

  // Каретка со счётчиками результата и оборотов
  m.roundedBox([0.3, 0.036, 0.05], 0.006, enamel, { position: [0, 0.06, 0.06] })
  m.object(canvasPlane('Счётчики', 0.28, 0.026, drawCounters), { position: [0, 0.062, 0.0855] })
  m.box([0.29, 0.004, 0.004], chrome, { position: [0, 0.045, 0.0865] })
  for (const x of [-0.085, 0.02, 0.07]) m.box([0.004, 0.012, 0.006], chrome, { position: [x, 0.05, 0.088] })
  for (const side of [-1, 1]) {
    m.box([0.022, 0.012, 0.004], chrome, { position: [side * 0.162, 0.06, 0.06], rotation: [0, 0, side * 0.3] })
  }

  // Передняя крышка с чёрной ручкой гашения
  m.roundedBox([0.07, 0.03, 0.012], 0.003, enamel, { position: [-0.04, 0.03, 0.08] })
  m.cylinder(0.009, 0.016, knob, { position: [-0.06, 0.02, 0.09], rotation: [Math.PI / 2, 0, 0] })

  // Рукоятка справа
  m.cylinder(0.009, 0.03, chrome, { position: [0.125, 0.07, DRUM_Z], rotation: [0, 0, Math.PI / 2] })
  m.box([0.04, 0.009, 0.009], chrome, { position: [0.155, 0.07, DRUM_Z] })
  m.box([0.009, 0.009, 0.07], chrome, { position: [0.172, 0.07, DRUM_Z + 0.03] })
  m.cylinder(0.008, 0.035, knob, { position: [0.19, 0.07, DRUM_Z + 0.065], rotation: [0, 0, Math.PI / 2] })

  return m.build()
}

// Надпись «Феликс» и «М» под ней — серебристые буквы
function drawLabel(ctx, w, h) {
  ctx.fillStyle = '#e4e8e8'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `italic bold ${Math.round(h * 0.5)}px Georgia, serif`
  ctx.fillText('Феликс', w / 2, h * 0.32)
  ctx.fillRect(w * 0.2, h * 0.62, w * 0.6, Math.max(2, h * 0.03))
  ctx.font = `bold ${Math.round(h * 0.32)}px Arial, sans-serif`
  ctx.fillText('М', w / 2, h * 0.83)
}

// Окошки счётчиков: слева 8 разрядов, справа 13, над окошками — номера разрядов
function drawCounters(ctx, w, h) {
  const groups = [
    { from: 0.04, count: 8 },
    { from: 0.37, count: 13 },
  ]
  const step = w * 0.045
  for (const { from, count } of groups) {
    for (let i = 0; i < count; i++) {
      const x = w * from + i * step
      ctx.fillStyle = '#f2f2ee'
      ctx.font = `bold ${Math.round(h * 0.3)}px Arial`
      ctx.textAlign = 'center'
      ctx.fillText(String(count - i), x + step * 0.35, h * 0.3)
      ctx.fillStyle = '#f4f1e8'
      ctx.fillRect(x, h * 0.45, step * 0.7, h * 0.45)
      ctx.fillStyle = '#111'
      ctx.font = `bold ${Math.round(h * 0.38)}px Arial`
      ctx.fillText('0', x + step * 0.35, h * 0.83)
    }
  }
}
