// 3D-модель видеокарты XFX GeForce 6600 GT (середина 2000-х) для шины PCI Express.
// По фото экспоната (photo_13_2026-11-16): синяя плата, кулер с вентилятором под фирменной
// наклейкой XFX, память сверху и справа, на планке S-Video и два разъёма DVI.
import { ModelBuilder, material, canvasPlane, FACE_UP } from './lib.js'
import { T } from './boards.js'
import {
  cardPcb, pcieFingers, bracket, dvi, svideo, memChip, choke, electrolyticCap, fan, roundSticker, smdRow, barcode, cardMats,
} from './cards.js'

const L = 0.17
const H = 0.106
const mm = 0.001

// Кулер: прямоугольный кожух, вентилятор слева
const SHROUD = { x: -5 * mm, z: 6.5 * mm, w: 0.086, d: 0.065, h: 0.009 }
const FAN = { x: -35 * mm, z: 4.3 * mm, r: 0.0175 }

export default function buildXfx6600gt() {
  const m = new ModelBuilder('Видеокарта XFX GeForce 6600 GT')

  cardPcb(m, {
    length: L,
    height: H,
    pitch: 1 * mm,
    fingers: pcieFingers(42 * mm),
    colors: { base: '#22449a', traces: 'rgba(120, 160, 230, 0.35)' },
    edgeColor: 0x1d3a83,
    seed: 53,
    pixelsPerMeter: 3800,
    labels: [{ text: '050517A', x: -0.012, z: -0.044, size: 0.0045 }],
  })

  // Память: две микросхемы сверху, две справа
  // (надписи на микросхемах на фото не читаются, поэтому их нет)
  memChip(m, -8.6 * mm, -36 * mm, [0.012, 0.012])
  memChip(m, 12 * mm, -36 * mm, [0.012, 0.012])
  memChip(m, 52 * mm, 2.6 * mm, [0.012, 0.012])
  memChip(m, 52 * mm, 28 * mm, [0.012, 0.012])

  // Конденсаторы, дроссель, транзисторы питания
  const capTop = material('Верх конденсаторов', 0xbfc3c8, { roughness: 0.3, metalness: 0.8 })
  const purple = material('Конденсаторы синие', 0x3c3f8f, { roughness: 0.4 })
  for (const [x, z] of [[30.8, -48], [31.6, -36], [54.7, -47], [68.4, -48], [66.7, -12.8], [77.8, -12.8], [68.4, 24], [78.6, 24]]) {
    electrolyticCap(m, x * mm, z * mm, { radius: 0.0034, height: 0.008, top: capTop })
  }
  for (const [x, z] of [[41, -26], [66.7, 13.7]]) electrolyticCap(m, x * mm, z * mm, { radius: 0.003, height: 0.007, mat: purple, top: capTop })
  electrolyticCap(m, -45.5 * mm, -36 * mm, { radius: 0.0025, height: 0.006, top: capTop })
  choke(m, 52 * mm, -22.6 * mm, 0.0095)
  for (const [x, z] of [[62, -36], [70, -36], [62, -28], [70, -28]]) m.box([0.0055, 0.002, 0.005], cardMats.chip, { position: [x * mm, T + 0.001, z * mm] })
  smdRow(m, -66 * mm, -40 * mm, 8, { along: 'z' })
  smdRow(m, -62 * mm, -40 * mm, 8, { along: 'z' })
  smdRow(m, 30 * mm, -15 * mm, 12, { along: 'z' })
  smdRow(m, 40 * mm, 40 * mm, 10)

  // Кожух кулера с наклейкой: синий рисунок, надписи XFX и GeForce, тёмный круг под вентилятором
  const shroudMat = material('Кожух кулера', 0x1f3f8a, { roughness: 0.45 })
  m.roundedBox([SHROUD.w, SHROUD.h, SHROUD.d], 0.002, shroudMat, { position: [SHROUD.x, T + SHROUD.h / 2, SHROUD.z] })
  const art = canvasPlane('Наклейка XFX', SHROUD.w - 0.002, SHROUD.d - 0.002, (ctx, w, h) => {
    const g = ctx.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#0d2a6e')
    g.addColorStop(0.5, '#2f78d0')
    g.addColorStop(1, '#0c2560')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    // Светлые «волны» на фоне
    ctx.strokeStyle = 'rgba(160, 210, 255, 0.35)'
    ctx.lineWidth = w / 60
    for (let i = 0; i < 6; i++) {
      ctx.beginPath()
      ctx.arc(w * 0.85, h * 0.2, w * (0.15 + i * 0.12), 1.6, 3.6)
      ctx.stroke()
    }
    // Тёмный круг — отверстие под вентилятор
    const fx = ((FAN.x - SHROUD.x) / SHROUD.w + 0.5) * w
    const fz = ((FAN.z - SHROUD.z) / SHROUD.d + 0.5) * h
    ctx.fillStyle = '#10141c'
    ctx.beginPath()
    ctx.arc(fx, fz, (FAN.r / SHROUD.w) * w * 1.08, 0, Math.PI * 2)
    ctx.fill()
    // Надписи
    ctx.textAlign = 'center'
    ctx.fillStyle = '#e8f0ff'
    ctx.font = `bold ${Math.round(h * 0.14)}px Arial`
    ctx.fillText('XFX', w * 0.7, h * 0.7)
    ctx.font = `italic bold ${Math.round(h * 0.12)}px Arial`
    ctx.fillStyle = '#7fdc3a'
    ctx.fillText('GEFORCE', w * 0.7, h * 0.86)
    ctx.fillStyle = 'rgba(232, 240, 255, 0.85)'
    ctx.font = `${Math.round(h * 0.035)}px Arial`
    ctx.fillText('DEFENDERS OF THE GAMING REVOLUTION', w * 0.7, h * 0.76)
  }, { transparent: false, pixelsPerMeter: 4000 })
  m.object(art, { position: [SHROUD.x, T + SHROUD.h + 0.0001, SHROUD.z], rotation: FACE_UP })

  // Вентилятор над тёмным кругом наклейки
  const fanY = T + SHROUD.h
  fan(m, FAN.x, fanY, FAN.z, { radius: FAN.r, blades: 11, height: 0.0035 })
  m.object(roundSticker('Ступица вентилятора', FAN.r * 0.72, (ctx, w, h) => {
    ctx.fillStyle = '#2a2f38'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#c86a3a'
    for (let i = 0; i < 3; i++) {
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, w * 0.3, i * 2.1, i * 2.1 + 0.6)
      ctx.lineTo(w / 2, h / 2)
      ctx.fill()
    }
    ctx.fillStyle = '#9aa0aa'
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, w * 0.12, 0, Math.PI * 2)
    ctx.fill()
  }), { position: [FAN.x, fanY + 0.0036, FAN.z], rotation: FACE_UP })

  // Разъём питания вентилятора
  m.box([0.006, 0.004, 0.003], cardMats.dviWhite, { position: [-50 * mm, T + 0.002, 37 * mm] })

  // Планка: S-Video и два DVI, на разъёмах наклейка со штрихкодом
  svideo(m, -L / 2, -38.5 * mm)
  dvi(m, -L / 2, -13.7 * mm)
  dvi(m, -L / 2, 29 * mm)
  barcode(m, -L / 2 + 0.008, T + 0.0119, 8 * mm, [0.045, 0.0062], '7 78656 04029 8', { rotation: [-Math.PI / 2, 0, Math.PI / 2] })
  bracket(m, -L / 2 - 0.0005, { top: -61 * mm, bottom: 60 * mm, dir: -1 })

  return m.build()
}
