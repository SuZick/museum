// 3D-модель электронной записной книжки Citizen MB-165R: чёрная «раскладушка»,
// ЖК-экран, крестовина и кнопки с русскими буквами. По фото экспоната (photo_22).
import { ModelBuilder, material, canvasPlane, textPlane, placeKeys, keyLabels, FACE_UP } from './lib.js'

const body = material('Корпус', 0x1b1b1d, { roughness: 0.5 })
const lidInner = material('Крышка внутри', 0x232326, { roughness: 0.4 })
const frame = material('Рамка экрана', 0x2c2c2f, { roughness: 0.5 })
const key = material('Кнопки', 0x2e2f33, { roughness: 0.45 })
const keyGrey = material('Кнопки серые', 0x6d6f74, { roughness: 0.45 })

const W = 0.11
const D = 0.07
const H = 0.009

export default function buildCitizenMb165r() {
  const m = new ModelBuilder('Citizen MB-165R')

  m.roundedBox([W, H, D], 0.003, body, { position: [0, H / 2, 0] })

  // Название и экран
  m.object(textPlane('Название', 0.06, 0.0075, 'CITIZEN  MB-165R', { font: 'Georgia, serif', align: 'left', size: 0.8 }), {
    position: [-0.02, H + 0.0002, -0.027],
    rotation: FACE_UP,
  })
  m.box([0.054, 0.0006, 0.016], frame, { position: [-0.021, H + 0.0003, -0.0155] })
  m.object(canvasPlane('Экран', 0.05, 0.012, drawLcd, { transparent: false, roughness: 0.3 }), {
    position: [-0.021, H + 0.0007, -0.0155],
    rotation: FACE_UP,
  })

  // Кнопки вверх/вниз и крестовина справа от экрана
  const dpad = [
    [0.017, -0.021, '▲'],
    [0.017, -0.011, '▼'],
    [0.041, -0.024, '▲'],
    [0.041, -0.008, '▼'],
    [0.032, -0.016, '◀'],
    [0.05, -0.016, '▶'],
  ]
  const dpadKeys = dpad.map(([x, z, label]) =>
    placeKeys(m, [[[1, keyGrey, label, '#1b1b1d']]], { x0: x - 0.004, z0: z, pitch: 0.008, rowPitch: 0.007, gap: 0.0012, height: 0.0025, surfaceY: () => H, rounded: 0.0012 })[0],
  )

  // Ряд функциональных кнопок
  const fnLabels = ['ВЫКЛ', 'ВКЛ', 'ТЕЛ', 'ЗАМЕТ', 'ЧАСЫ', 'КУРС']
  const fnKeys = placeKeys(m, [fnLabels.map((label) => [1, key, label])], {
    x0: -0.05,
    z0: -0.003,
    pitch: 0.0165,
    rowPitch: 0.0065,
    gap: 0.003,
    height: 0.0025,
    surfaceY: () => H,
    rounded: 0.0012,
  })

  // Буквенные кнопки
  const k = (label, units = 1) => [units, key, label]
  const letters = placeKeys(
    m,
    [
      ['А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', '✲'].map((l) => k(l)),
      [[0.4, null], ...['Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С'].map((l) => k(l))],
      ['СДВ', 'ТУ', 'ФХ', 'ЦЧ', 'ШЩ', 'ЪЫ', 'ЬЭ', 'ЮЯ', 'ЄЇ'].map((l) => k(l)),
      [k('CE/C'), k('🔔'), k('ДЕНЬ'), k('ПРОБЕЛ', 3.2), k('ЗАГЛ'), k('ИСП', 1.8)],
    ],
    { x0: -0.049, z0: 0.0065, pitch: 0.0098, rowPitch: 0.0085, gap: 0.0016, height: 0.0025, surfaceY: () => H, rounded: 0.0012 },
  )
  keyLabels(m, 'Подписи кнопок', [...letters, ...fnKeys, ...dpadKeys], { size: 0.62 })

  // Шарнир и откинутая крышка
  m.cylinder(0.003, W - 0.02, body, { position: [0, H, -D / 2 + 0.003], rotation: [0, 0, Math.PI / 2] }, 12)
  const lid = new ModelBuilder('Крышка')
  lid.roundedBox([W, 0.068, 0.004], 0.002, body, { position: [0, 0.034, -0.002] })
  lid.box([W - 0.012, 0.056, 0.0004], lidInner, { position: [0, 0.036, 0.0002] })
  lid.box([0.022, 0.012, 0.0008], body, { position: [0, 0.058, 0.0005] })
  m.object(lid.build(), { position: [0, H, -D / 2 + 0.004], rotation: [-0.35, 0, 0] })

  return m.build()
}

function drawLcd(ctx, w, h) {
  ctx.fillStyle = '#a3ad98'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#20251c'
  ctx.font = `bold ${Math.round(h * 0.45)}px "Courier New", monospace`
  ctx.textBaseline = 'middle'
  ctx.fillText('ПН 10-11  12:00', w * 0.05, h * 0.5)
}
