// 3D-модель мини-картриджа для стримера 3M DC 2120 (120 МБ).
// По фото экспоната (photo_3_2026-11-16): дымчатый полупрозрачный корпус, белая наклейка 3M,
// две белые катушки (на правой намотана лента), ролики внизу.
import { ModelBuilder } from './lib.js'
import { tapeMats, tapeReel, topPicture } from './tapes.js'

const W = 0.0813
const D = 0.061
const BASE = 0.0012
const H = 0.014
const mm = 0.001

export default function buildDc2120Cartridge() {
  const m = new ModelBuilder('Мини-картридж 3M DC 2120')
  const top = BASE + H

  m.box([W, BASE, D], tapeMats.aluminum, { position: [0, BASE / 2, 0] })
  m.roundedBox([W - 0.0008, H, D - 0.0008], 0.0015, tapeMats.smoke, { position: [0, BASE + H / 2, 0] })

  tapeReel(m, -13.5 * mm, BASE, 1.75 * mm, { hub: 0.0105, pack: 0.0112, height: 0.0115 })
  tapeReel(m, 14.5 * mm, BASE, 1.75 * mm, { hub: 0.0095, pack: 0.014, height: 0.0115 })
  for (const x of [-29.2, 28.5]) m.cylinder(0.004, 0.011, tapeMats.roller, { position: [x * mm, BASE + 0.0055, 20 * mm] }, 16)

  // Наклейка 3M
  topPicture(m, 'Наклейка 3M DC 2120', 2.6 * mm, top + 0.0001, -15.8 * mm, 0.065, 0.014, (ctx, w, h) => {
    ctx.fillStyle = '#f4f3ef'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#d32027'
    ctx.font = `bold ${Math.round(h * 0.36)}px Arial`
    ctx.textBaseline = 'middle'
    ctx.fillText('3M', w * 0.03, h * 0.3)
    ctx.fillStyle = '#1f1f1f'
    ctx.font = `bold ${Math.round(h * 0.2)}px Arial`
    ctx.fillText('DC 2120', w * 0.03, h * 0.7)
    ctx.font = `bold ${Math.round(h * 0.13)}px Arial`
    ctx.fillText('MINI DATA CARTRIDGE TAPE', w * 0.25, h * 0.72)
    ctx.textAlign = 'right'
    ctx.font = `bold ${Math.round(h * 0.16)}px Arial`
    ctx.fillText('120 Mbytes', w * 0.86, h * 0.28)
    ctx.font = `${Math.round(h * 0.1)}px Arial`
    ctx.fillText('307.5 ft (93.7 m)', w * 0.86, h * 0.47)
    ctx.fillStyle = '#333333'
    ctx.fillRect(w * 0.9, h * 0.12, w * 0.07, h * 0.4) // квадратик-код в углу
  })

  return m.build()
}
