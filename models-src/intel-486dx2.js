// 3D-модель процессора Intel 486 DX2 (1992 г.): керамический корпус PGA с 168 ножками.
// По фото экспоната (photo_16_2026-11-16): тёмная керамика, белые логотипы intel и i486 DX2.
import { ModelBuilder } from './lib.js'
import { chipBody, pinGrid, pins, markingLines, centerText } from './chips.js'

const SIZE = 0.0447
const PIN = 0.0035 // длина ножек

export default function buildIntel486dx2() {
  const m = new ModelBuilder('Процессор Intel 486 DX2')

  // 168 ножек: сетка 17 × 17, заняты три ряда по краю
  pins(m, pinGrid(17, 0.00254, (i, j, ring) => ring < 3), { y0: 0, length: PIN })

  chipBody(m, 'Керамика', {
    size: SIZE,
    thick: 0.0028,
    y0: PIN,
    color: 0x3f3a45,
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#403b46'
      ctx.fillRect(0, 0, w, h)
      centerText(ctx, w, h, 'intel', 0.24, 0.13, { x: 0.5 })
      ctx.font = `bold ${Math.round(h * 0.04)}px Arial`
      ctx.fillText('®', w * 0.66, h * 0.19)
      // Логотип i486: белый прямоугольник с тёмными буквами, рядом DX2 курсивом
      ctx.fillStyle = '#ecebee'
      ctx.fillRect(w * 0.14, h * 0.37, w * 0.38, h * 0.13)
      centerText(ctx, w, h, 'i486', 0.435, 0.11, { color: '#403b46', x: 0.33 })
      centerText(ctx, w, h, 'DX2', 0.43, 0.13, { italic: true, x: 0.67 })
      ctx.font = `${Math.round(h * 0.035)}px Arial`
      ctx.fillText('™', w * 0.545, h * 0.38)
      ctx.fillText('™', w * 0.83, h * 0.38)
      markingLines(ctx, w * 0.24, h * 0.66, [w * 0.5, w * 0.36, w * 0.44, w * 0.3], h * 0.025)
    },
  })

  return m.build()
}
