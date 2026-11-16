// 3D-модель процессора Intel Celeron для разъёма Socket 370 (около 1999 г.).
// Как в витрине (photo_19_2026-11-16), процессор лежит ножками вверх:
// по краям поле позолоченных ножек в шахматном порядке, в середине чёрная площадка с надписью intel celeron.
import { ModelBuilder } from './lib.js'
import { chipBody, pinGrid, pins, centerText } from './chips.js'

const SIZE = 0.0495
const THICK = 0.0025

export default function buildIntelCeleron() {
  const m = new ModelBuilder('Процессор Intel Celeron')

  chipBody(m, 'Корпус', {
    size: SIZE,
    thick: THICK,
    y0: 0,
    color: 0x2b2722,
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#2e2a25'
      ctx.fillRect(0, 0, w, h)
      ctx.fillStyle = '#121212'
      ctx.fillRect(w * 0.29, h * 0.29, w * 0.42, h * 0.42)
      centerText(ctx, w, h, 'intel', 0.45, 0.06, { color: '#9a9a9a' })
      centerText(ctx, w, h, 'celeron', 0.53, 0.055, { color: '#9a9a9a', weight: 'normal' })
    },
  })

  // 370 ножек: шахматная сетка с шагом 1,27 мм, шесть рядов по краю
  pins(m, pinGrid(37, 0.00127, (i, j, ring) => ring < 6 && (i + j) % 2 === 0), { y0: THICK, length: 0.0028, radius: 0.00022 })

  return m.build()
}
