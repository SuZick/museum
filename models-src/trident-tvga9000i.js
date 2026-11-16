// 3D-модель видеокарты Trident TVGA9000I-1 (1992 г.) для шины ISA.
// Расположение деталей — по фото экспоната (photo_8_2026-11-16): видеочип Trident в центре,
// слева 4 микросхемы видеопамяти и кварцевый генератор, справа RAMDAC и BIOS, на планке разъём VGA.
import { ModelBuilder, canvasPlane, textPlane, FACE_UP } from './lib.js'
import { mats, T, dip, part, squareChip, chipLabel } from './boards.js'
import { cardPcb, bracket, dsub, resistor, ceramicCap, electrolyticCap, tantalumCap, jumpers, sticker } from './cards.js'

const L = 0.16 // длина платы (без планки)
const H = 0.0566 // высота платы (без контактов)
const mm = 0.001

export default function buildTridentTvga9000i() {
  const m = new ModelBuilder('Видеокарта Trident TVGA9000I-1')

  // Плата светло-зелёная; контакты ISA: короткий 16-битный участок и длинный 8-битный
  cardPcb(m, {
    length: L,
    height: H,
    pitch: 2.54 * mm,
    fingers: [
      { from: 3.2 * mm, to: 50.1 * mm },
      { from: 55.8 * mm, to: 138.8 * mm },
    ],
    colors: { base: '#5d9447', traces: 'rgba(150, 200, 115, 0.4)' },
    edgeColor: 0x4d7e3a,
    seed: 11,
    labels: [
      { text: '9016X2/4    COPYRIGHT 1992    5120', x: -0.012, z: -0.0258, size: 0.0022 },
      { text: 'MADE IN TAIWAN', x: -0.008, z: 0.0128, size: 0.0022 },
      { text: 'DC101', x: -0.079, z: 0.0275, size: 0.0019 },
      { text: 'DC102', x: -0.03, z: 0.0275, size: 0.0019 },
    ],
  })

  // Видеопамять: 4 микросхемы TC514256AP-70
  const ramLabel = textPlane('Надпись TC514256AP', 0.022, 0.004, 'TC514256AP-70', { color: '#cfcfcf', size: 0.75 })
  for (const z of [-21.5 * mm, -10.4 * mm]) {
    for (const x of [-64.4 * mm, -33 * mm]) {
      dip(m, x, z, 20, 'x')
      m.object(ramLabel.clone(), { position: [x, T + 0.0037, z], rotation: FACE_UP })
    }
  }

  // Видеочип Trident TVGA9000 в квадратном корпусе с ножками по четырём сторонам
  part(m, 3.5 * mm, -6.4 * mm, [0.0305, 0.0006, 0.0305], mats.metal)
  squareChip(m, 3.5 * mm, -6.4 * mm, 0.0275, chipLabel('Trident', 0.0275), { height: 0.003 })

  // Справа: RAMDAC (в панельке) и BIOS с наклейкой Quadtel — широкие корпуса на 28 ножек
  part(m, 45.3 * mm, -10.7 * mm, [0.039, 0.0025, 0.0158], mats.socket)
  m.box([0.0372, 0.0035, 0.0142], mats.chip, { position: [45.3 * mm, T + 0.0025 + 0.00175, -10.7 * mm] })
  m.object(textPlane('Надпись RAMDAC', 0.026, 0.005, 'KDA0476CN-66', { color: '#cfcfcf', size: 0.75 }), {
    position: [45.3 * mm, T + 0.0061, -10.7 * mm],
    rotation: FACE_UP,
  })
  part(m, 45.3 * mm, 12.4 * mm, [0.0372, 0.0035, 0.0142], mats.chip)
  sticker(m, 'Наклейка BIOS', 45.3 * mm, T + 0.0036, 12.4 * mm, [0.022, 0.0095], 'Quadtel', { background: '#e7e3d6', color: '#3a3a3a' })

  // Генератор частот Trident и кварцевый генератор 40 МГц
  dip(m, -50.7 * mm, 11 * mm, 16, 'x')
  part(m, -70.9 * mm, 7.8 * mm, [0.0115, 0.0052, 0.0125], mats.metal)
  m.object(textPlane('Надпись TXC', 0.009, 0.0045, 'TXC 40.000', { color: '#555555', size: 0.6 }), {
    position: [-70.9 * mm, T + 0.0053, 7.8 * mm],
    rotation: [-Math.PI / 2, 0, Math.PI / 2],
  })

  // Мелкие детали
  for (const z of [-0.9, 1.1, 3.1, 5.1]) resistor(m, -40 * mm, z * mm)
  for (const x of [52, 59, 66]) resistor(m, x * mm, -23.5 * mm)
  for (const z of [15, 18, 21, 24]) resistor(m, 71 * mm, z * mm)
  for (const [x, z] of [[-49.2, 1.6], [-56.4, 4.5], [-54.3, 18.2], [30.9, 24], [21.5, 21.8]]) ceramicCap(m, x * mm, z * mm)
  for (const [x, z] of [[-73, 24.3], [-21.1, 23.2], [51, 24.3]]) electrolyticCap(m, x * mm, z * mm, { radius: 0.0022, height: 0.005 })
  tantalumCap(m, -55.7 * mm, 24 * mm)
  jumpers(m, -16 * mm, 25 * mm)

  // Наклейка с серийным номером
  sticker(m, 'Наклейка S/N', 1 * mm, T + 0.00015, 19.6 * mm, [0.025, 0.0045], 'S/N0588529', { background: '#f2d21b', color: '#1a1a1a', size: 0.8 })

  // Разъём монитора VGA и планка
  dsub(m, L / 2, -4.2 * mm)
  // Круглая розовая наклейка «QC OK» (проверено на заводе)
  const qc = canvasPlane('Наклейка QC', 0.0075, 0.0075, (ctx, w, h) => {
    ctx.fillStyle = '#c2185b'
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, w / 2 - 1, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.font = `bold ${Math.round(h * 0.3)}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('QC', w / 2, h * 0.33)
    ctx.fillText('OK', w / 2, h * 0.68)
  })
  m.object(qc, { position: [L / 2 - 0.0065, T + 0.0119, -4.2 * mm], rotation: FACE_UP })
  bracket(m, L / 2 + 0.0005, { top: -65.1 * mm, bottom: 55 * mm })

  return m.build()
}
