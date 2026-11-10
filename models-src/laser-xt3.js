// 3D-модель Laser XT/3-8086: бежевый настольный корпус IBM PC XT-совместимого компьютера.
// По фото экспоната (photo_6, photo_7): ребристая полоса сверху, табличка LASER, «шеврон» внизу слева.
// Расположение дисководов справа — предположение (полного фото передней панели нет).
import { ModelBuilder, material, canvasPlane } from './lib.js'

const plastic = material('Корпус', 0xcfc5aa, { roughness: 0.6 })
const relief = material('Рельеф', 0xa89e86, { roughness: 0.7 })
const bezel = material('Панель дисководов', 0x3a3835, { roughness: 0.6 })
const slot = material('Щель', 0x0c0c0c, { roughness: 0.9 })
const latch = material('Защёлка', 0x8d877a, { roughness: 0.5 })
const ledGreen = material('Индикатор', 0x36d16a, { emissive: 0x20c050, emissiveIntensity: 0.8 })

const W = 0.4
const H = 0.14
const D = 0.4
const FRONT = D / 2

export default function buildLaserXt3() {
  const m = new ModelBuilder('Laser XT/3')

  m.roundedBox([W, H, D], 0.008, plastic, { position: [0, H / 2, 0] })

  // Ребристая полоса вдоль верхнего края передней панели
  for (let x = -0.19; x <= 0.19; x += 0.0125) {
    m.roundedBox([0.0065, 0.022, 0.006], 0.0015, plastic, { position: [x, 0.123, FRONT + 0.002] }, 1)
  }
  m.box([W - 0.01, 0.002, 0.002], latch, { position: [0, 0.109, FRONT + 0.0005] })

  // Табличка «LASER XT/3-8086»
  m.object(canvasPlane('Табличка', 0.12, 0.016, drawLabel, { transparent: false }), { position: [-0.11, 0.094, FRONT + 0.0006] })

  // «Шеврон» из ступенчатых рельефных линий внизу слева
  for (let i = 0; i < 6; i++) {
    const y = 0.07 - i * 0.008
    const bend = -0.08 + i * 0.011
    const length = bend + 0.195
    m.box([length, 0.003, 0.004], relief, { position: [-0.195 + length / 2, y, FRONT + 0.002] })
    const drop = y - 0.008
    m.box([drop * Math.SQRT2, 0.003, 0.004], relief, {
      position: [bend + drop / 2, (y + 0.008) / 2, FRONT + 0.002],
      rotation: [0, 0, -Math.PI / 4],
    })
  }

  // Два дисковода 5,25" справа
  for (const y of [0.084, 0.04]) {
    m.box([0.15, 0.04, 0.004], bezel, { position: [0.11, y, FRONT + 0.002] })
    m.box([0.12, 0.005, 0.002], slot, { position: [0.11, y + 0.004, FRONT + 0.0045] })
    m.box([0.024, 0.009, 0.006], latch, { position: [0.11, y - 0.008, FRONT + 0.005] })
    m.box([0.005, 0.003, 0.002], ledGreen, { position: [0.05, y - 0.012, FRONT + 0.0045] })
  }

  // Индикаторы питания и TURBO рядом с табличкой
  m.box([0.005, 0.003, 0.002], ledGreen, { position: [-0.03, 0.094, FRONT + 0.001] })
  m.box([0.005, 0.003, 0.002], ledGreen, { position: [-0.018, 0.094, FRONT + 0.001] })

  // Сзади — решётка вентилятора блока питания
  for (let i = 0; i < 7; i++) m.box([0.07, 0.003, 0.002], slot, { position: [0.13, 0.05 + i * 0.008, -FRONT - 0.0005] })
  for (let i = 0; i < 9; i++) m.box([0.012, 0.06, 0.002], slot, { position: [-0.17 + i * 0.022, 0.07, -FRONT - 0.0005] })

  return m.build()
}

function drawLabel(ctx, w, h) {
  ctx.fillStyle = '#ebebec'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#b9b9bb'
  for (let i = 0; i < 4; i++) ctx.fillRect(w * 0.03 + i * h * 0.22, h * 0.25, h * 0.12, h * 0.5)
  ctx.fillStyle = '#1f4aa8'
  ctx.fillRect(w * 0.15, h * 0.16, w * 0.32, h * 0.06)
  ctx.font = `italic 900 ${Math.round(h * 0.62)}px Arial, sans-serif`
  ctx.textBaseline = 'middle'
  ctx.fillText('LASER', w * 0.17, h * 0.6)
  ctx.fillStyle = '#8a8a8c'
  ctx.font = `bold ${Math.round(h * 0.55)}px Arial, sans-serif`
  ctx.fillText('XT/3-8086', w * 0.52, h * 0.6)
}
