// 3D-модель материнской платы на процессоре AMD 80286-16 с чипсетом Headland (около 1991 г.).
// Расположение деталей — по фото экспоната (photo_15).
import { ModelBuilder } from './lib.js'
import { mats, board, dip, bios, squareChip, chipLabel, isaSlot, battery, keyboardConnector, powerConnector, oscillator, part } from './boards.js'

const W = 0.22
const D = 0.25

export default function buildMotherboardHeadland() {
  const m = new ModelBuilder('Материнская плата 286 (Headland)')

  board(m, W, D, 23, [
    { text: 'BANK0   BANK1', x: 0.028, z: -0.036, size: 0.004 },
    { text: 'REV 1.1', x: 0.06, z: 0.1, size: 0.005 },
  ])

  // Два кварцевых генератора и крупная микросхема слева вверху
  oscillator(m, -0.07, -0.11)
  oscillator(m, -0.045, -0.11)
  dip(m, -0.095, -0.065, 40)

  // Процессор AMD 286 в панельке и чипсет Headland
  squareChip(m, -0.058, -0.072, 0.024, chipLabel('AMD', 0.024, '#e8e4dc'), { socket: true, mat: mats.ceramic })
  squareChip(m, -0.005, -0.075, 0.03, chipLabel('Headland', 0.03))

  // Память: 8 микросхем в два ряда и мелкие микросхемы над ними
  for (let row = 0; row < 2; row++) for (let i = 0; i < 4; i++) dip(m, 0.03 + i * 0.013, -0.085 + row * 0.03, 18)
  for (let i = 0; i < 4; i++) dip(m, -0.01 + i * 0.013, -0.112, 14, 'z')

  // Слоты памяти SIMM (белые) у правого края
  part(m, 0.097, -0.055, [0.008, 0.012, 0.09], mats.slotWhite)
  part(m, 0.097, 0.05, [0.008, 0.012, 0.09], mats.slotWhite)

  // Логика, BIOS, батарейка, разъёмы
  for (let i = 0; i < 4; i++) dip(m, -0.088 + i * 0.016, -0.015, 16)
  for (const x of [-0.088, -0.068, -0.048]) bios(m, x, 0.05)
  dip(m, -0.03, 0.095, 16, 'x')
  battery(m, -0.045, 0.108)
  keyboardConnector(m, -0.085, D / 2 - 0.008)
  powerConnector(m, -W / 2 + 0.006, 0.075)

  // 8 слотов ISA (два первых — только 8-битные)
  for (let i = 0; i < 8; i++) {
    isaSlot(m, -0.02 + i * 0.0145, -0.013, 0.05, { double: i > 1, shortLength: 0.038, longLength: 0.085 })
  }

  return m.build()
}
