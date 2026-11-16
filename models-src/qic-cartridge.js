// 3D-модель большого ленточного картриджа для стримера (формат QIC, 6 × 4 дюйма).
// По фото экспоната (photo_3_2026-11-16): алюминиевое основание, дымчатая полупрозрачная крышка,
// внутри видны белые катушки, ролик ремённой передачи, наклейка «Index» с надписями от руки.
import { ModelBuilder, material } from './lib.js'
import { tapeMats, tapeReel, topPicture, HANDWRITING } from './tapes.js'

const W = 0.1524
const D = 0.1016
const BASE = 0.0015 // толщина алюминиевого основания
const H = 0.0154 // высота крышки
const mm = 0.001

export default function buildQicCartridge() {
  const m = new ModelBuilder('Ленточный картридж QIC')
  const top = BASE + H

  // Основание и полупрозрачная крышка
  m.box([W, BASE, D], tapeMats.aluminum, { position: [0, BASE / 2, 0] })
  m.roundedBox([W - 0.001, H, D - 0.001], 0.002, tapeMats.smoke, { position: [0, BASE + H / 2, 0] })

  // Внутри: две катушки (на правой намотана лента), ролик ремня, направляющие ролики
  tapeReel(m, -28.3 * mm, BASE, 6.5 * mm, { hub: 0.0186, pack: 0.0205, height: 0.0125 })
  tapeReel(m, 22.6 * mm, BASE, 4.9 * mm, { hub: 0.016, pack: 0.0265, height: 0.0125 })
  m.cylinder(0.0097, 0.012, tapeMats.roller, { position: [3.2 * mm, BASE + 0.006, -31.5 * mm] }, 24)
  for (const x of [-59.8, 59.8]) m.cylinder(0.005, 0.012, tapeMats.hub, { position: [x * mm, BASE + 0.006, 41.2 * mm] }, 16)
  m.box([0.006, 0.012, 0.009], tapeMats.hub, { position: [-21 * mm, BASE + 0.006, -37 * mm] })
  // Металлическая дверца сверху справа (через неё головка стримера касается ленты)
  m.box([0.045, 0.012, 0.0015], tapeMats.aluminum, { position: [34.5 * mm, BASE + 0.006, -D / 2 + 0.003] })

  // Переключатель защиты от записи SAFE
  m.cylinder(0.0042, 0.0012, tapeMats.black, { position: [-59 * mm, top + 0.0006, -42 * mm] }, 20)
  topPicture(m, 'Надпись SAFE', -49 * mm, top + 0.0001, -42 * mm, 0.01, 0.004, (ctx, w, h) => {
    ctx.fillStyle = '#e8e8e8'
    ctx.font = `bold ${Math.round(h * 0.8)}px Arial`
    ctx.textBaseline = 'middle'
    ctx.fillText('SAFE', 0, h / 2)
  }, { transparent: true })

  // Наклейка Index с надписями от руки
  topPicture(m, 'Наклейка Index', 34 * mm, top + 0.0001, 17.8 * mm, 0.068, 0.034, (ctx, w, h) => {
    ctx.fillStyle = '#f2f0ea'
    ctx.fillRect(0, 0, w, h)
    ctx.strokeStyle = '#b8b4c0'
    ctx.lineWidth = Math.max(1, h / 150)
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath()
      ctx.moveTo(w * 0.04, h * (0.18 + i * 0.18))
      ctx.lineTo(w * 0.96, h * (0.18 + i * 0.18))
      ctx.stroke()
    }
    ctx.fillStyle = '#c0392b'
    ctx.font = `${Math.round(h * 0.09)}px Arial`
    ctx.fillText('Index', w * 0.05, h * 0.12)
    ctx.fillStyle = '#26263a'
    ctx.font = `${Math.round(h * 0.15)}px ${HANDWRITING}`
    ctx.fillText('PR14 - 2.3.3', w * 0.1, h * 0.33)
    ctx.fillText('sysadmin', w * 0.12, h * 0.51)
    ctx.fillText('ТОМ 2', w * 0.3, h * 0.69)
  })

  return m.build()
}
