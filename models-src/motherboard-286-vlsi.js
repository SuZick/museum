// 3D-модель материнской платы на процессоре 80286 с чипсетом VLSI (около 1990 г.).
// Расположение деталей — по фото экспоната (photo_12).
import { ModelBuilder } from './lib.js'
import { mats, board, dip, bios, squareChip, chipLabel, isaSlot, battery, keyboardConnector, powerConnector, oscillator, part } from './boards.js'

const W = 0.22
const D = 0.33

export default function buildMotherboardVlsi() {
  const m = new ModelBuilder('Материнская плата 286 (VLSI)')

  board(m, W, D, 7, [
    { text: 'SLOT 8   7   6   5   4   3   2   1', x: -0.04, z: 0.158, size: 0.004 },
    { text: 'REV B.6', x: 0.05, z: 0.012, size: 0.005 },
    { text: '9003-47478', x: 0.08, z: 0.025, size: 0.004 },
  ])

  // Память: 4 ряда по 9 микросхем в панельках (дальний правый угол)
  for (let row = 0; row < 4; row++) {
    for (let i = 0; i < 9; i++) {
      const x = -0.012 + i * 0.0118
      const z = -0.145 + row * 0.02
      part(m, x, z, [0.0095, 0.002, 0.016], mats.socket)
      m.box([0.0068, 0.003, 0.013], mats.chip, { position: [x, 0.0016 + 0.002 + 0.0015, z] })
    }
  }

  // Мелкие микросхемы логики в левом верхнем углу
  for (let row = 0; row < 2; row++) for (let i = 0; i < 5; i++) dip(m, -0.09 + i * 0.012, -0.145 + row * 0.024, 14)

  // Чипсет VLSI, процессор 286 в панельке
  const vlsi = chipLabel('VLSI', 0.024)
  squareChip(m, -0.06, -0.06, 0.024, vlsi)
  for (const x of [-0.035, 0.005, 0.045, 0.085]) squareChip(m, x, -0.005, 0.024, vlsi)
  squareChip(m, -0.08, -0.005, 0.022, chipLabel('286', 0.022, '#e8e4dc'), { socket: true, mat: mats.ceramic })

  // BIOS, контроллер клавиатуры, генератор, батарейка
  bios(m, -0.088, 0.055)
  bios(m, -0.066, 0.055)
  oscillator(m, -0.04, 0.03)
  dip(m, -0.045, 0.06, 40)
  dip(m, -0.088, 0.105, 16)
  dip(m, -0.072, 0.105, 16)
  battery(m, -0.093, 0.14)
  keyboardConnector(m, -0.065, D / 2 - 0.008)
  powerConnector(m, -W / 2 + 0.006, 0.105)

  // 8 слотов расширения ISA (первый — только 8-битный)
  for (let i = 0; i < 8; i++) {
    isaSlot(m, -0.028 + i * 0.0175, 0.035, 0.11, { double: i > 0, shortLength: 0.04, longLength: 0.085 })
  }

  return m.build()
}
