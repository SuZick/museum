// Общие детали для моделей оптических дисков: прозрачная основа с отверстием
// и отражающий слой с радужными бликами (так диск переливается на свету).
import * as THREE from 'three'
import { material, canvasPlane, FACE_UP } from './lib.js'
import { flatExtrude } from './tapes.js'

export const THICK = 0.0012 // толщина диска

// Прозрачная основа: кольцо от отверстия до края
export function discBody(m, radius, hole = 0.0075) {
  const s = new THREE.Shape()
  s.absarc(0, 0, radius, 0, Math.PI * 2, false)
  const h = new THREE.Path()
  h.absarc(0, 0, hole, 0, Math.PI * 2, true)
  s.holes.push(h)
  const clear = material('Поликарбонат', 0xdfe6ee, { transparent: true, opacity: 0.35, roughness: 0.05 })
  m.add(flatExtrude(s, THICK, 48), clear)
}

// Отражающий слой-кольцо от r1 до r2. base — основной цвет, draw — дополнительный рисунок (надписи)
export function reflectiveLayer(m, name, r1, r2, { base, tint = 'rgba(255, 255, 255, 0)', draw } = {}) {
  const plane = canvasPlane(name, r2 * 2, r2 * 2, (ctx, w, h) => {
    ctx.fillStyle = base
    ctx.fillRect(0, 0, w, h)
    // Радужные лучи от центра
    const g = ctx.createConicGradient(0.3, w / 2, h / 2)
    const colors = ['rgba(255,60,120,0.55)', 'rgba(255,230,80,0.5)', 'rgba(60,220,140,0.5)', 'rgba(70,140,255,0.55)']
    for (let i = 0; i < 6; i++) {
      const p = i / 6
      g.addColorStop(p, 'rgba(255,255,255,0)')
      g.addColorStop(p + 0.03, colors[i % 4])
      g.addColorStop(p + 0.06, 'rgba(255,255,255,0.25)')
      g.addColorStop(p + 0.09, colors[(i + 2) % 4])
      g.addColorStop(p + 0.12, 'rgba(255,255,255,0)')
    }
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = tint
    ctx.fillRect(0, 0, w, h)
    if (draw) draw(ctx, w, h)
  }, { transparent: false, pixelsPerMeter: 6000 })
  plane.geometry = new THREE.RingGeometry(r1, r2, 96, 1)
  plane.material.metalness = 0.55
  plane.material.roughness = 0.2
  // Диск лежит рабочей стороной вверх: слой виден сквозь прозрачную основу
  m.object(plane, { position: [0, 0.00015, 0], rotation: FACE_UP })
}

// Надпись по кругу радиуса r (мелкий текст на внутреннем кольце диска)
export function arcText(ctx, w, h, text, r, startAngle, { color = '#3a3a3a', size = 0.02 } = {}) {
  ctx.save()
  ctx.translate(w / 2, h / 2)
  ctx.fillStyle = color
  ctx.font = `bold ${Math.round(h * size)}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let a = startAngle
  const step = (h * size * 0.75) / r
  for (const ch of text) {
    ctx.save()
    ctx.rotate(a)
    ctx.translate(0, -r)
    ctx.fillText(ch, 0, 0)
    ctx.restore()
    a += step
  }
  ctx.restore()
}
