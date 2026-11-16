// 3D-модель игрового картриджа World Rally Camp (K1181) для 8-битной приставки (фото photo_5_2026-11-16).
// Жёлтый пластиковый корпус с рёбрышками сверху и большой цветной этикеткой. Рисунок этикетки
// упрощённый: красная спортивная машина на дороге, название игры и код K1181.
import * as THREE from 'three'
import { ModelBuilder, material, canvasPlane, FACE_UP } from './lib.js'
import { flatExtrude } from './tapes.js'

const THICK = 0.016
const mm = 0.001

// Контур картриджа «лицом к нам»: сверху широкая часть, снизу чуть уже (вставляется в приставку)
function outline() {
  const s = new THREE.Shape()
  s.moveTo(-0.0453, 0)
  s.lineTo(0.0453, 0)
  s.lineTo(0.0453, 0.0104)
  s.lineTo(0.0525, 0.0104)
  s.lineTo(0.0525, 0.0659)
  s.lineTo(-0.0525, 0.0659)
  s.lineTo(-0.0525, 0.0104)
  s.lineTo(-0.0453, 0.0104)
  s.closePath()
  return s
}

function drawLabel(ctx, w, h) {
  // Фон: тёмный с цветными полосами «скорости»
  const bg = ctx.createLinearGradient(0, h, w, 0)
  bg.addColorStop(0, '#2b2f3a')
  bg.addColorStop(0.5, '#3d3550')
  bg.addColorStop(1, '#253a3a')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, w, h)
  const streaks = ['rgba(255, 80, 160, 0.45)', 'rgba(255, 220, 60, 0.4)', 'rgba(80, 180, 255, 0.4)', 'rgba(120, 255, 140, 0.35)']
  for (let i = 0; i < 9; i++) {
    ctx.fillStyle = streaks[i % 4]
    ctx.beginPath()
    const y = h * (0.15 + i * 0.1)
    ctx.moveTo(0, y + h * 0.1)
    ctx.lineTo(w, y - h * 0.35)
    ctx.lineTo(w, y - h * 0.32)
    ctx.lineTo(0, y + h * 0.14)
    ctx.fill()
  }
  // Жёлтые полосы дорожной разметки
  ctx.fillStyle = '#f3d321'
  for (let i = 0; i < 6; i++) {
    const x = w * (0.08 + i * 0.16)
    const y = h * (0.92 - i * 0.12)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + w * 0.07, y - h * 0.05)
    ctx.lineTo(x + w * 0.09, y - h * 0.01)
    ctx.lineTo(x + w * 0.02, y + h * 0.04)
    ctx.fill()
  }
  // Красная спортивная машина (простые формы)
  ctx.fillStyle = '#d8261c'
  ctx.beginPath()
  ctx.moveTo(w * 0.06, h * 0.62)
  ctx.lineTo(w * 0.16, h * 0.42)
  ctx.lineTo(w * 0.36, h * 0.36)
  ctx.lineTo(w * 0.5, h * 0.42)
  ctx.lineTo(w * 0.66, h * 0.52)
  ctx.lineTo(w * 0.66, h * 0.66)
  ctx.lineTo(w * 0.5, h * 0.8)
  ctx.lineTo(w * 0.12, h * 0.74)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#a3170f'
  ctx.beginPath()
  ctx.moveTo(w * 0.12, h * 0.74)
  ctx.lineTo(w * 0.5, h * 0.8)
  ctx.lineTo(w * 0.66, h * 0.66)
  ctx.lineTo(w * 0.62, h * 0.62)
  ctx.lineTo(w * 0.48, h * 0.72)
  ctx.lineTo(w * 0.1, h * 0.66)
  ctx.fill()
  ctx.fillStyle = '#1e2430'
  ctx.beginPath()
  ctx.moveTo(w * 0.22, h * 0.44)
  ctx.lineTo(w * 0.35, h * 0.4)
  ctx.lineTo(w * 0.42, h * 0.46)
  ctx.lineTo(w * 0.27, h * 0.5)
  ctx.fill()
  for (const [cx, cy, r] of [[0.2, 0.72, 0.075], [0.47, 0.77, 0.085]]) {
    ctx.fillStyle = '#1a1a1a'
    ctx.beginPath()
    ctx.ellipse(w * cx, h * cy, w * r * 0.55, h * r * 1.15, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#c8c8c8'
    ctx.beginPath()
    ctx.ellipse(w * cx, h * cy, w * r * 0.35, h * r * 0.75, -0.3, 0, Math.PI * 2)
    ctx.fill()
  }
  // Название и код
  ctx.font = `italic bold ${Math.round(h * 0.15)}px Georgia, serif`
  ctx.textAlign = 'center'
  ctx.lineWidth = h * 0.012
  ctx.strokeStyle = '#3a3010'
  ctx.fillStyle = '#f5e24a'
  for (const [text, x, y] of [['WORLD RALLY', 0.7, 0.24], ['CAMP', 0.8, 0.42]]) {
    ctx.strokeText(text, w * x, h * y)
    ctx.fillText(text, w * x, h * y)
  }
  ctx.fillStyle = '#f5e24a'
  ctx.beginPath()
  ctx.roundRect(w * 0.79, h * 0.76, w * 0.17, h * 0.15, h * 0.05)
  ctx.fill()
  ctx.strokeStyle = '#c0281c'
  ctx.lineWidth = h * 0.01
  ctx.stroke()
  ctx.fillStyle = '#1b1b1b'
  ctx.font = `bold ${Math.round(h * 0.1)}px Arial`
  ctx.textBaseline = 'middle'
  ctx.fillText('K1181', w * 0.875, h * 0.84)
}

export default function buildRomCartridge() {
  const m = new ModelBuilder('Игровой картридж World Rally Camp')
  const yellow = material('Корпус картриджа', 0xe8df74, { roughness: 0.5 })

  // Корпус лежит на столе этикеткой вверх, разъём (узкая часть) — к зрителю
  m.add(flatExtrude(outline(), THICK, 1), yellow, { position: [0, 0, 0.033] })

  // Рёбрышки вверху: четыре слева и три справа
  for (const z of [-31, -29.3, -27.6, -25.9]) m.box([0.031, 0.0005, 0.0007], yellow, { position: [-36.7 * mm, THICK + 0.00025, z * mm] })
  for (const z of [-31.4, -28.8, -26.1]) m.box([0.072, 0.0005, 0.0007], yellow, { position: [16 * mm, THICK + 0.00025, z * mm] })

  // Этикетка
  const label = canvasPlane('Этикетка World Rally Camp', 0.0887, 0.045, drawLabel, { transparent: false, pixelsPerMeter: 9000 })
  m.object(label, { position: [-0.25 * mm, THICK + 0.0001, 0.65 * mm], rotation: FACE_UP })

  // Щель разъёма на нижнем торце, в глубине — плата с контактами
  m.box([0.08, 0.006, 0.0004], material('Щель разъёма', 0x262420, { roughness: 0.8 }), { position: [0, THICK / 2, 0.033 + 0.0001] })

  return m.build()
}
