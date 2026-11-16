// 3D-модель видеокарты Palit GeForce 8400 GS (2007 г.) для шины PCI Express.
// По фото экспоната (photo_12_2026-11-16): невысокая красная плата, чёрный радиатор с вентилятором,
// на высокой планке три разъёма: VGA (подключён к плате плоским шлейфом), HDMI и DVI.
import { ModelBuilder, material, FACE_UP } from './lib.js'
import { T } from './boards.js'
import {
  cardPcb, pcieFingers, bracket, dsub, dvi, hdmi, memChip, electrolyticCap, fan, roundSticker, smdRow, jumpers, barcode, cardMats,
} from './cards.js'

const L = 0.156
const H = 0.069
const mm = 0.001

export default function buildPalit8400gs() {
  const m = new ModelBuilder('Видеокарта Palit GeForce 8400 GS')

  cardPcb(m, {
    length: L,
    height: H,
    pitch: 1 * mm,
    fingers: pcieFingers(36.3 * mm),
    colors: { base: '#9e2332', traces: 'rgba(230, 120, 130, 0.3)' },
    edgeColor: 0x861c2a,
    seed: 67,
    labels: [{ text: 'Audio IN', x: -0.05, z: -0.0285, size: 0.0026 }],
  })

  // Детали питания слева: транзисторы, конденсаторы с серебристым верхом
  for (const [x, z] of [[-32.3, -19.4], [-32.3, -8], [-30.7, 1.6], [-39, 15.3]]) {
    m.box([0.0065, 0.0022, 0.0065], cardMats.chip, { position: [x * mm, T + 0.0011, z * mm] })
  }
  const capTop = material('Верх конденсаторов', 0xbfc3c8, { roughness: 0.3, metalness: 0.8 })
  for (const [x, z] of [[-17.3, -22.6], [-16.5, 0], [-17.3, 14.5], [-48.8, 11.3]]) {
    electrolyticCap(m, x * mm, z * mm, { radius: 0.0028, height: 0.007, top: capTop })
  }
  smdRow(m, -60 * mm, -12 * mm, 10, { along: 'z' })
  smdRow(m, -45 * mm, 20 * mm, 8)
  smdRow(m, 55 * mm, -28 * mm, 8)

  // Память справа от радиатора
  memChip(m, 59.5 * mm, -20.8 * mm, [0.0085, 0.012])
  memChip(m, 59.5 * mm, 5.8 * mm, [0.0085, 0.012])

  // Радиатор (чёрная пластина) и вентилятор с жёлтой надписью PALiT
  const sinkMat = material('Радиатор', 0x1c1d20, { roughness: 0.5, metalness: 0.4 })
  m.roundedBox([0.066, 0.004, 0.054], 0.0015, sinkMat, { position: [21.5 * mm, T + 0.002, -3.6 * mm] })
  const fanY = T + 0.004
  fan(m, 13.4 * mm, fanY, -4.8 * mm, { radius: 0.0178, blades: 7, height: 0.006, hubRatio: 0.42 })
  m.object(roundSticker('Наклейка PALiT', 0.0178 * 0.82, (ctx, w, h) => {
    ctx.fillStyle = '#18191b'
    ctx.fillRect(0, 0, w, h)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#f2d12a'
    ctx.font = `bold ${Math.round(h * 0.3)}px Arial`
    ctx.fillText('PALiT', w / 2, h * 0.6)
    ctx.font = `${Math.round(h * 0.09)}px Arial`
    ctx.fillText('www.palit.biz', w / 2, h * 0.33)
  }), { position: [13.4 * mm, fanY + 0.0061, -4.8 * mm], rotation: FACE_UP })

  // Наклейка со штрихкодом под радиатором
  barcode(m, 20 * mm, T + 0.00015, 27.5 * mm, [0.029, 0.0045], '', { seed: 7 })

  // Разъёмы: DVI и HDMI на плате, VGA висит на планке выше платы и соединён шлейфом
  dvi(m, -L / 2, 8.9 * mm)
  hdmi(m, -L / 2, -22.6 * mm)
  dsub(m, -L / 2, -42.8 * mm, { dir: -1, insulator: cardMats.plastic })
  jumpers(m, -47 * mm, -26.6 * mm, 8, 2, { pins: false })
  const ribbon = material('Шлейф', 0x8f9396, { roughness: 0.7 })
  const dx = -47 * mm - (-L / 2 + 0.012)
  const dz = -26.6 * mm - -42.8 * mm
  m.box([Math.hypot(dx, dz), 0.0008, 0.009], ribbon, {
    position: [(-47 * mm + (-L / 2 + 0.012)) / 2, T + 0.007, (-26.6 * mm + -42.8 * mm) / 2],
    rotation: [0, -Math.atan2(dz, dx), 0],
  })
  bracket(m, -L / 2 - 0.0005, { top: -69.5 * mm, bottom: 47 * mm, dir: -1 })

  return m.build()
}
