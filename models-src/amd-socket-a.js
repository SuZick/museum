// 3D-модель процессора AMD для разъёма Socket A (начало 2000-х; Athlon или Duron — по фото не разобрать).
// По фото экспоната (photo_19_2026-11-16): серо-фиолетовая керамика, логотип AMD,
// открытый сиреневый кристалл в середине, наклейка со штрихкодом слева.
import { ModelBuilder, material } from './lib.js'
import { chipBody, pinGrid, pins, centerText } from './chips.js'

const SIZE = 0.0495
const THICK = 0.0028
const PIN = 0.003

export default function buildAmdSocketA() {
  const m = new ModelBuilder('Процессор AMD (Socket A)')

  // 462 ножки: шахматная сетка с шагом 1,27 мм, восемь рядов по краю
  pins(m, pinGrid(37, 0.00127, (i, j, ring) => ring < 8 && (i + j) % 2 === 0), { y0: 0, length: PIN, radius: 0.00022 })

  chipBody(m, 'Керамика', {
    size: SIZE,
    thick: THICK,
    y0: PIN,
    color: 0x4a4350,
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#4b4452'
      ctx.fillRect(0, 0, w, h)
      // Логотип AMD со стрелкой
      centerText(ctx, w, h, 'AMD', 0.14, 0.085, { x: 0.36 })
      ctx.fillStyle = '#f2f2f2'
      ctx.beginPath()
      ctx.moveTo(w * 0.47, h * 0.105)
      ctx.lineTo(w * 0.52, h * 0.105)
      ctx.lineTo(w * 0.52, h * 0.165)
      ctx.lineTo(w * 0.505, h * 0.15)
      ctx.lineTo(w * 0.505, h * 0.12)
      ctx.lineTo(w * 0.485, h * 0.12)
      ctx.closePath()
      ctx.fill()
      // Позолоченные перемычки над кристаллом
      ctx.fillStyle = '#c9a54e'
      for (let i = 0; i < 12; i++) ctx.fillRect(w * (0.36 + i * 0.024), h * 0.3, w * 0.012, h * 0.03)
      // Наклейка со штрихкодом слева (вертикально)
      ctx.fillStyle = '#f2f0ea'
      ctx.fillRect(w * 0.05, h * 0.25, w * 0.1, h * 0.5)
      ctx.fillStyle = '#111111'
      for (let i = 0; i < 30; i++) ctx.fillRect(w * 0.065, h * (0.27 + i * 0.015), w * 0.05, h * (i % 3 ? 0.004 : 0.008))
    },
  })

  // Открытый кристалл и четыре резиновые подушечки вокруг него
  const top = PIN + THICK
  m.box([0.0105, 0.0008, 0.0125], material('Кристалл', 0xb39cc4, { roughness: 0.25, metalness: 0.4 }), { position: [0, top + 0.0004, 0] })
  const pad = material('Подушечки', 0x1c1c1e, { roughness: 0.8 })
  for (const x of [-0.0135, 0.0135]) for (const z of [-0.0135, 0.0135]) m.cylinder(0.0018, 0.0009, pad, { position: [x, top + 0.00045, z] }, 12)

  return m.build()
}
