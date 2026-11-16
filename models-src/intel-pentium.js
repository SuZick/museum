// 3D-модель процессора Intel Pentium первого поколения (1993 г.): керамический корпус PGA с 273 ножками.
// Как в витрине (photo_16_2026-11-16), процессоров два: один лежит надписью вверх,
// другой перевёрнут — видны позолоченные ножки и металлическая крышка кристалла.
import { ModelBuilder } from './lib.js'
import { chipBody, pinGrid, pins, centerText } from './chips.js'

const SIZE = 0.0495
const THICK = 0.0032
const PIN = 0.0035
const GAP = 0.029 // смещение каждого процессора от центра

// Ножки: сетка 21 × 21, заняты четыре ряда по краю
const PINS = pinGrid(21, 0.00254, (i, j, ring) => ring < 4)

export default function buildIntelPentium() {
  const m = new ModelBuilder('Процессор Intel Pentium')

  // Процессор надписью вверх
  pins(m, PINS, { x: -GAP, y0: 0, length: PIN })
  chipBody(m, 'Керамика', {
    x: -GAP,
    size: SIZE,
    thick: THICK,
    y0: PIN,
    color: 0x2f2b35,
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#302c37'
      ctx.fillRect(0, 0, w, h)
      centerText(ctx, w, h, 'intel', 0.28, 0.13)
      centerText(ctx, w, h, 'pentium', 0.44, 0.12)
      ctx.font = `bold ${Math.round(h * 0.04)}px Arial`
      ctx.fillText('®', w * 0.66, h * 0.24)
      ctx.fillText('®', w * 0.81, h * 0.42)
      // Золотистая наклейка со штрихкодом внизу
      ctx.fillStyle = '#c9a54e'
      ctx.fillRect(w * 0.24, h * 0.8, w * 0.52, h * 0.09)
      ctx.fillStyle = '#3a3022'
      for (let i = 0; i < 34; i++) ctx.fillRect(w * (0.26 + i * 0.0142), h * 0.815, w * (i % 3 ? 0.005 : 0.009), h * 0.045)
    },
  })

  // Перевёрнутый процессор: лежит на крышке, ножки торчат вверх
  chipBody(m, 'Керамика снизу', {
    x: GAP,
    size: SIZE,
    thick: THICK,
    y0: 0,
    color: 0x2f2b35,
    draw: (ctx, w, h) => {
      ctx.fillStyle = '#2d2a31'
      ctx.fillRect(0, 0, w, h)
      // Позолоченная рамка и металлическая крышка кристалла в середине (потёртая)
      ctx.fillStyle = '#c9a54e'
      ctx.fillRect(w * 0.29, h * 0.29, w * 0.42, h * 0.42)
      ctx.fillStyle = '#8d8e92'
      ctx.fillRect(w * 0.32, h * 0.32, w * 0.36, h * 0.36)
      ctx.fillStyle = 'rgba(210, 210, 215, 0.6)'
      for (let i = 0; i < 40; i++) {
        const a = i * 2.4
        ctx.beginPath()
        ctx.arc(w * (0.5 + Math.cos(a) * 0.12 * ((i % 5) / 5)), h * (0.5 + Math.sin(a) * 0.13 * ((i % 7) / 7)), w * 0.02, 0, Math.PI * 2)
        ctx.fill()
      }
    },
  })
  pins(m, PINS, { x: GAP, y0: THICK, length: PIN })

  return m.build()
}
