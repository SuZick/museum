// 3D-модель мини-диска диаметром 8 см (фото photo_6_2026-11-16). Серебристая рабочая сторона,
// у центра белое печатное кольцо и мелкая надпись по кругу «Camera CD» с номером диска.
import * as THREE from 'three'
import { ModelBuilder, material, FACE_UP } from './lib.js'
import { discBody, reflectiveLayer, arcText } from './discs.js'

const R = 0.04
const DATA = [0.0125, 0.0392] // рабочий слой от и до

export default function buildMiniCd() {
  const m = new ModelBuilder('Мини-диск 8 см')
  discBody(m, R)
  reflectiveLayer(m, 'Рабочий слой мини-диска', DATA[0], DATA[1], {
    base: '#c9c4ba',
    draw: (ctx, w, h) => {
      // Тёмное кольцо у внутреннего края с надписью по кругу
      const px = (meters) => (meters / (DATA[1] * 2)) * w
      ctx.strokeStyle = 'rgba(90, 90, 95, 0.55)'
      ctx.lineWidth = px(0.0028)
      ctx.beginPath()
      ctx.arc(w / 2, h / 2, px(0.0142), 0, Math.PI * 2)
      ctx.stroke()
      arcText(ctx, w, h, '70509-08109  A3  Camera CD', px(0.0142), 2.2, { color: '#e8e8e8', size: 0.022 })
    },
  })
  // Белое печатное кольцо вокруг отверстия
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.0113, 0.0123, 64), material('Белое кольцо', 0xf2f2ef, { roughness: 0.6 }))
  m.object(ring, { position: [0, 0.0002, 0], rotation: FACE_UP })
  return m.build()
}
