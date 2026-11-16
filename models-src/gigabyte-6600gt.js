// 3D-модель видеокарты Gigabyte GV-NX66T128DE (GeForce 6600 GT, 2004 г.) для шины PCI Express.
// По фото экспоната (photo_10_2026-11-16): синяя плата без кулера и без планки — видно сам
// графический процессор NVIDIA, вокруг него 4 микросхемы памяти Hynix, слева детали питания и разъёмы.
import { ModelBuilder, material, textPlane, FACE_UP } from './lib.js'
import { T } from './boards.js'
import {
  cardPcb, pcieFingers, dsub, dvi, svideo, bga, memChip, chipText, toroid, electrolyticCap, smdRow, sticker, cardMats,
} from './cards.js'

const L = 0.19
const H = 0.105
const mm = 0.001

export default function buildGigabyte6600gt() {
  const m = new ModelBuilder('Видеокарта Gigabyte GeForce 6600 GT')

  cardPcb(m, {
    length: L,
    height: H,
    pitch: 1 * mm,
    fingers: pcieFingers(47.7 * mm),
    colors: { base: '#1f3f93', traces: 'rgba(120, 160, 230, 0.35)' },
    edgeColor: 0x1b357a,
    seed: 41,
    pixelsPerMeter: 3800,
    labels: [
      { text: 'D33006', x: -0.084, z: -0.046, size: 0.0045 },
      { text: 'GIGABYTE   GV-NX66T128DE', x: -0.03, z: 0.048, size: 0.0042 },
      { text: 'REV:1.0', x: 0.052, z: 0.047, size: 0.0035 },
      { text: 'CE', x: 0.045, z: -0.002, size: 0.006 },
    ],
  })

  // Графический процессор GeForce 6600 GT (без радиатора) и 4 крепёжных отверстия кулера вокруг
  bga(m, 12 * mm, 17.8 * mm, 0.036, { die: 0.013, substrate: 0x3d5a3a })
  m.object(textPlane('Надпись NVIDIA', 0.011, 0.003, 'NVIDIA', { color: '#cfcfcf', size: 0.8 }), {
    position: [12 * mm, T + 0.0021, 15 * mm],
    rotation: FACE_UP,
  })
  const ring = material('Металлические кольца', 0xc9c9c9, { roughness: 0.3, metalness: 0.9 })
  for (const x of [-11.8, 35.8]) for (const z of [-5.3, 40]) m.cylinder(0.0022, 0.0002, ring, { position: [x * mm, T + 0.0001, z * mm] }, 16)

  // Память Hynix: две сверху, две справа (повёрнуты)
  const hynix = chipText('Hynix', 0.009, 0.003)
  memChip(m, -4.4 * mm, -34.9 * mm, [0.0135, 0.017], hynix)
  memChip(m, 29.3 * mm, -34.9 * mm, [0.0135, 0.017], hynix)
  memChip(m, 66.3 * mm, -0.3 * mm, [0.017, 0.0135], hynix, { rotate: true })
  memChip(m, 66.3 * mm, 32.6 * mm, [0.017, 0.0135], hynix, { rotate: true })

  // Питание: медные катушки, конденсаторы (тёмные с серебристым верхом), транзисторы
  toroid(m, -52 * mm, 3.8 * mm, 0.0055)
  toroid(m, -53.5 * mm, 41.5 * mm, 0.0045)
  toroid(m, 85 * mm, -39.8 * mm, 0.0042)
  const capTop = material('Верх конденсаторов', 0xbfc3c8, { roughness: 0.3, metalness: 0.8 })
  const capMat = material('Конденсаторы тёмные', 0x30333a, { roughness: 0.4 })
  for (const [x, z] of [[-57, -19], [-40, -7], [-38.6, 7], [-45, 22], [-64, 33.5], [-66.5, 45], [-47.7, 38.5], [52.6, -33], [80.6, -31.5], [52, -24]]) {
    electrolyticCap(m, x * mm, z * mm, { radius: 0.0034, height: 0.009, mat: capMat, top: capTop })
  }
  electrolyticCap(m, -35 * mm, 18.5 * mm, { radius: 0.0028, height: 0.007, mat: cardMats.yellowCap, top: capTop })
  for (const [x, z] of [[-60, -10], [-36, 26], [-34, 34], [-50, 52 - 7]]) m.box([0.0065, 0.0022, 0.006], cardMats.chip, { position: [x * mm, T + 0.0011, z * mm] })
  smdRow(m, -52 * mm, -28 * mm, 8)
  smdRow(m, -20 * mm, -45 * mm, 10)
  smdRow(m, 40 * mm, -10 * mm, 10, { along: 'z' })
  smdRow(m, 52 * mm, 8 * mm, 10, { along: 'z' })

  // Голубая наклейка GIGABYTE
  sticker(m, 'Наклейка GIGABYTE', -51 * mm, T + 0.0015, -46.5 * mm, [0.015, 0.0075], 'GIGABYTE', { background: '#6fb6e6', color: '#24507a', size: 0.5 })
  m.box([0.015, 0.0013, 0.0075], material('Голубой пластик', 0x6fb6e6, { roughness: 0.5 }), { position: [-51 * mm, T + 0.00065, -46.5 * mm] })

  // Разъёмы на левом краю (планки у экспоната нет): S-Video, DVI, VGA
  svideo(m, -L / 2, -37 * mm)
  dvi(m, -L / 2, -5 * mm)
  dsub(m, -L / 2, 35 * mm, { dir: -1, insulator: cardMats.vgaBlue })

  return m.build()
}
