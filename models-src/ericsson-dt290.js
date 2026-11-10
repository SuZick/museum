// 3D-модель радиотелефона Ericsson DT290 (стандарт DECT): серая трубка с короткой антенной,
// зелёный ЖК-экран и тёмно-синие кнопки. По фото экспоната (photo_20).
import { ModelBuilder, material, canvasPlane, textPlane, placeKeys, keyLabels, FACE_UP } from './lib.js'

const body = material('Корпус', 0x7c7f83, { roughness: 0.5 })
const dark = material('Решётка и рамка', 0x3a3c40, { roughness: 0.6 })
const key = material('Кнопки', 0x1f2836, { roughness: 0.4 })

const W = 0.05
const H = 0.024
const TOP = H

export default function buildEricssonDt290() {
  const m = new ModelBuilder('Ericsson DT290')

  // Корпус, выступ динамика и антенна
  m.roundedBox([W, H, 0.155], 0.008, body, { position: [0, H / 2, 0.0025] })
  m.roundedBox([0.04, 0.004, 0.03], 0.0018, body, { position: [0, TOP - 0.0005, -0.056] })
  m.roundedBox([0.013, 0.013, 0.032], 0.0055, body, { position: [-0.014, 0.012, -0.084] })

  // Прорези динамика, надпись ERICSSON, экран
  for (const z of [-0.063, -0.057, -0.051]) m.box([0.012, 0.001, 0.0025], dark, { position: [0.002, TOP + 0.0015, z], rotation: [0, 0.45, 0] })
  m.object(textPlane('Логотип', 0.034, 0.005, 'ERICSSON ≡', { color: '#3a3c40', letterSpacing: 0.1 }), {
    position: [0, TOP + 0.0002, -0.036],
    rotation: FACE_UP,
  })
  m.box([0.036, 0.0008, 0.021], dark, { position: [0, TOP + 0.0004, -0.019] })
  m.object(canvasPlane('Экран', 0.031, 0.017, drawLcd, { transparent: false, glow: 0.25, roughness: 0.3 }), {
    position: [0, TOP + 0.0009, -0.019],
    rotation: FACE_UP,
  })

  // Кнопки
  const options = { gap: 0.0028, height: 0.003, surfaceY: () => TOP, rounded: 0.0015 }
  const top = placeKeys(
    m,
    [
      [[1.3, key, 'YES', '#9fc3ff'], [1, key, 'C'], [1.3, key, 'NO', '#ff8f8f']],
      [[1.2, key, '◀'], [1.2, null], [1.2, key, '▶']],
    ],
    { ...options, x0: -0.0216, z0: 0.0, pitch: 0.0125, rowPitch: 0.0105 },
  )
  const digits = placeKeys(
    m,
    [
      [[1, key, '1'], [1, key, '2'], [1, key, '3']],
      [[1, key, '4'], [1, key, '5'], [1, key, '6']],
      [[1, key, '7'], [1, key, '8'], [1, key, '9']],
      [[1, key, '*'], [1, key, '0'], [1, key, '#']],
      [[0.5, null], [1, key, '✉'], [1, key, 'INT']],
    ],
    { ...options, x0: -0.02025, z0: 0.0215, pitch: 0.0135, rowPitch: 0.0105 },
  )
  keyLabels(m, 'Подписи кнопок', [...top, ...digits], { size: 0.62 })

  m.object(textPlane('Модель', 0.016, 0.004, 'DT290', { color: '#2b2d31' }), {
    position: [0.012, TOP + 0.0002, 0.074],
    rotation: FACE_UP,
  })
  return m.build()
}

function drawLcd(ctx, w, h) {
  ctx.fillStyle = '#9fc27f'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#1f2a14'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `bold ${Math.round(h * 0.28)}px Arial`
  ctx.fillText('Ericsson', w / 2, h * 0.32)
  ctx.font = `${Math.round(h * 0.24)}px Arial`
  ctx.fillText('12:00', w / 2, h * 0.7)
}
