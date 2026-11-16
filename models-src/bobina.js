// 3D-модель бобины с магнитной лентой (фото photo_2_2026-11-16): белая пластмассовая катушка
// с тремя большими окнами, сквозь которые видна тёмная лента. Бобина лежит на столе,
// свободный конец ленты выпал наружу.
import * as THREE from 'three'
import { ModelBuilder, material } from './lib.js'
import { tapeMats, sectorPath, flatExtrude } from './tapes.js'

const R = 0.065 // радиус бобины
const FLANGE = 0.0012 // толщина щёчки
const GAP = 0.0066 // ширина ленты (расстояние между щёчками)

// Щёчка катушки: круг с тремя большими окнами, тремя маленькими у ступицы и отверстием в центре
function flangeShape() {
  const s = new THREE.Shape()
  s.absarc(0, 0, R, 0, Math.PI * 2, false)
  for (let i = 0; i < 3; i++) {
    const a = (i * 2 * Math.PI) / 3 + 0.35
    s.holes.push(sectorPath(R * 0.34, R * 0.88, a, a + (80 * Math.PI) / 180))
    s.holes.push(sectorPath(R * 0.13, R * 0.24, a + 0.25, a + 1.25))
  }
  const center = new THREE.Path()
  center.absarc(0, 0, R * 0.05, 0, Math.PI * 2, true)
  s.holes.push(center)
  return s
}

export default function buildBobina() {
  const m = new ModelBuilder('Бобина с магнитной лентой')
  const plastic = material('Бобина', 0xe8e2cf, { roughness: 0.45 })

  // Две щёчки, между ними ступица и намотанная лента
  const flange = flatExtrude(flangeShape(), FLANGE, 10)
  m.add(flange, plastic, { position: [0, 0, 0] })
  m.add(flange, plastic, { position: [0, FLANGE + GAP, 0] })
  m.cylinder(R * 0.85, GAP, tapeMats.tape, { position: [0, FLANGE + GAP / 2, 0] }, 40)
  m.cylinder(R * 0.27, GAP + 0.0002, plastic, { position: [0, FLANGE + GAP / 2, 0] }, 24)
  // Трёхлучевая втулка в центре (за неё бобину надевают на ось магнитофона)
  for (let i = 0; i < 3; i++) {
    const a = (i * 2 * Math.PI) / 3
    m.box([0.0012, FLANGE * 2 + GAP, R * 0.07], material('Втулка', 0x9a8e7c, { roughness: 0.5 }), {
      position: [Math.sin(a) * R * 0.04, (FLANGE * 2 + GAP) / 2, Math.cos(a) * R * 0.04],
      rotation: [0, a, 0],
    })
  }

  // Свободный конец ленты: выходит между щёчками и ложится на стол плавной дугой
  const tapeEnd = material('Конец ленты', 0x3a2d24, { roughness: 0.35, metalness: 0.2 })
  const out = R + 0.004
  m.box([out - R * 0.85, GAP * 0.95, 0.0001], tapeEnd, { position: [(R * 0.85 + out) / 2, FLANGE + GAP / 2, 0.004] })
  // Лента лежит отрезками; heading — направление очередного отрезка (0 — к зрителю, вдоль +z)
  let point = new THREE.Vector3(out, 0, 0.004)
  let heading = 0.6
  const step = 0.006
  for (let i = 0; i < 26; i++) {
    const next = point.clone().add(new THREE.Vector3(Math.sin(heading) * step, 0, Math.cos(heading) * step))
    m.box([0.0064, 0.0001, step * 1.05], tapeEnd, {
      position: [(point.x + next.x) / 2, 0.0002, (point.z + next.z) / 2],
      rotation: [0, heading, 0],
    })
    point = next
    heading -= 0.06
  }

  return m.build()
}
