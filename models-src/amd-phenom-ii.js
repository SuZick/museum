// 3D-модель процессора AMD Phenom II, который лежит в витрине рядом с табличкой «Phenom II X4 945»
// (photo_15_2026-11-16). На фото процессор с открытым кристаллом на тёмно-зелёной подложке и надписью
// AMD Phenom II — так выглядят мобильные (ноутбучные) Phenom II. Модель сделана по самому процессору.
import { ModelBuilder, material } from './lib.js'
import { chipBody, pinGrid, pins, markingLines, centerText } from './chips.js'

const SIZE = 0.035
const THICK = 0.0012
const PIN = 0.002

export default function buildAmdPhenomII() {
  const m = new ModelBuilder('Процессор AMD Phenom II')

  // Около 640 ножек: сетка 27 × 27 без середины
  pins(m, pinGrid(27, 0.00127, (i, j, ring) => ring < 9), { y0: 0, length: PIN, radius: 0.0002 })

  chipBody(m, 'Подложка', {
    size: SIZE,
    thick: THICK,
    y0: PIN,
    color: 0x203528,
    pixelsPerMeter: 20000,
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#1f3427'
      ctx.fillRect(0, 0, w, h)
      markingLines(ctx, w * 0.2, h * 0.07, [w * 0.6, w * 0.45], h * 0.022)
      // Мелкие конденсаторы вокруг кристалла
      ctx.fillStyle = '#b9b2a2'
      for (let i = 0; i < 9; i++) {
        ctx.fillRect(w * (0.25 + i * 0.058), h * 0.2, w * 0.03, h * 0.018)
        ctx.fillRect(w * (0.25 + i * 0.058), h * 0.78, w * 0.03, h * 0.018)
      }
      for (let i = 0; i < 7; i++) {
        ctx.fillRect(w * 0.2, h * (0.27 + i * 0.07), w * 0.018, h * 0.03)
        ctx.fillRect(w * 0.78, h * (0.27 + i * 0.07), w * 0.018, h * 0.03)
      }
      centerText(ctx, w, h, 'AMD Phenom II', 0.88, 0.05, { color: '#e6e6e6' })
    },
  })

  // Открытый кристалл (серебристый)
  m.box([0.012, 0.0007, 0.0135], material('Кристалл', 0x8d9196, { roughness: 0.25, metalness: 0.6 }), {
    position: [0, PIN + THICK + 0.00035, 0],
  })

  return m.build()
}
