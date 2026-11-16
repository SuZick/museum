// 3D-модель видеокарты Matrox Mystique (1996 г.) для шины PCI.
// Расположение деталей — по фото экспоната (photo_9_2026-11-16): графический чип MGA-1064SG внизу,
// две микросхемы памяти справа, разъёмы расширения памяти, на планке слева два разъёма.
import { ModelBuilder, material } from './lib.js'
import { mats, T, part, squareChip, chipLabel } from './boards.js'
import { cardPcb, bracket, dsub, jumpers, smdRow, tantalumCap, barcode, memChip, cardMats } from './cards.js'

const L = 0.156
const H = 0.091
const mm = 0.001

export default function buildMatroxMystique() {
  const m = new ModelBuilder('Видеокарта Matrox Mystique')

  // Плата тёмная серо-зелёная; контакты PCI: короткий участок у планки, ключ, длинный участок
  cardPcb(m, {
    length: L,
    height: H,
    pitch: 1.27 * mm,
    fingers: [
      { from: 41 * mm, to: 55 * mm },
      { from: 57.5 * mm, to: 119.7 * mm },
    ],
    colors: { base: '#3f5a4c', traces: 'rgba(150, 180, 160, 0.3)' },
    edgeColor: 0x334a3e,
    seed: 31,
    labels: [
      { text: 'MATROX   618-02 REV: A', x: -0.072, z: -0.04, size: 0.0034 },
      { text: 'COPYRIGHT 1996', x: -0.046, z: -0.0355, size: 0.0026 },
      { text: 'P1   FEATURE CONNECTOR', x: -0.016, z: -0.0395, size: 0.0024 },
      { text: 'VGA DISABLE   VGA ENABLE', x: -0.058, z: -0.028, size: 0.0022 },
    ],
  })

  // Графический чип MGA-1064SG
  squareChip(m, -0.9 * mm, 23.1 * mm, 0.0275, chipLabel('MGA', 0.0275), { height: 0.0025 })

  // Две микросхемы видеопамяти SGRAM (с ножками по бокам) и микросхема ST рядом
  for (const x of [23, 55.3]) {
    part(m, x * mm, -8.2 * mm, [0.0205, 0.0005, 0.0265], mats.metal)
    memChip(m, x * mm, -8.2 * mm, [0.0175, 0.0255])
  }
  squareChip(m, -1.2 * mm, -8.2 * mm, 0.012, chipLabel('ST', 0.012))
  part(m, -18 * mm, -9 * mm, [0.009, 0.0016, 0.0055], cardMats.chip)

  // Разъём для подключения других плат (feature connector) — гребёнка 2 × 13 штырьков
  jumpers(m, -0.3 * mm, -35.8 * mm, 13, 2)
  // Два длинных разъёма для платы расширения памяти
  part(m, 50.5 * mm, -31.6 * mm, [0.051, 0.006, 0.0055], cardMats.plastic)
  part(m, 45.3 * mm, 24.9 * mm, [0.051, 0.006, 0.0055], cardMats.plastic)

  // Наклейка со штрихкодом
  barcode(m, 44.2 * mm, T + 0.00015, -38.9 * mm, [0.042, 0.0068], 'EAH02198')

  // Жёлтые танталовые конденсаторы, кварцевый генератор, мелкие детали
  const yellow = material('Конденсаторы жёлтые', 0xd9a520, { roughness: 0.45 })
  for (const x of [-50, -45]) for (const z of [23, 29, 35]) tantalumCap(m, x * mm, z * mm, yellow)
  part(m, -26.4 * mm, 40.5 * mm, [0.012, 0.004, 0.0048], mats.metal)
  for (let i = 0; i < 6; i++) part(m, (-52 + i * 7.5) * mm, 2 * mm, [0.0055, 0.0012, 0.0022], cardMats.chip)
  smdRow(m, -60 * mm, -20 * mm, 10, { along: 'z' })
  smdRow(m, -56 * mm, -20 * mm, 10, { along: 'z' })
  smdRow(m, -30 * mm, 12 * mm, 8)
  smdRow(m, 15 * mm, 12 * mm, 10)
  smdRow(m, 18 * mm, 36 * mm, 12)

  // Планка с двумя разъёмами: верхний со светло-серым изолятором, нижний — синий VGA
  const grey = material('Изолятор серый', 0x9b978c, { roughness: 0.6 })
  dsub(m, -L / 2, -16 * mm, { dir: -1, insulator: grey })
  dsub(m, -L / 2, 28.4 * mm, { dir: -1, insulator: cardMats.vgaBlue })
  bracket(m, -L / 2 - 0.0005, { top: -56 * mm, bottom: 64 * mm, dir: -1 })

  return m.build()
}
