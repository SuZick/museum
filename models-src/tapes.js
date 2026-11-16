// Общие детали для моделей носителей на магнитной ленте (бобина, кассеты, картриджи стримеров).
import * as THREE from 'three'
import { material, canvasPlane, FACE_UP } from './lib.js'

export const tapeMats = {
  // Полупрозрачный дымчатый пластик — сквозь него видно катушки с лентой
  smoke: material('Дымчатый пластик', 0x70737b, { transparent: true, opacity: 0.35, roughness: 0.15 }),
  aluminum: material('Алюминиевое основание', 0xb9bcc0, { roughness: 0.35, metalness: 0.9 }),
  hub: material('Катушки', 0xe9e7e0, { roughness: 0.5 }),
  tape: material('Магнитная лента', 0x2b211b, { roughness: 0.35, metalness: 0.2 }),
  roller: material('Ролики', 0x9a9ca0, { roughness: 0.4 }),
  black: material('Чёрный пластик', 0x1b1b1d, { roughness: 0.5 }),
}

// Катушка с намотанной лентой: белая ступица радиусом hub и тёмный «блин» ленты радиусом pack
export function tapeReel(m, x, y, z, { hub, pack, height }) {
  if (pack > hub) m.cylinder(pack, height * 0.9, tapeMats.tape, { position: [x, y + height / 2, z] }, 32)
  m.cylinder(hub, height, tapeMats.hub, { position: [x, y + height / 2, z] }, 24)
}

// Сектор кольца между радиусами r1 и r2 от угла a1 до a2 (окошки в катушках)
export function sectorPath(r1, r2, a1, a2) {
  const path = new THREE.Path()
  path.absarc(0, 0, r2, a1, a2, false)
  path.absarc(0, 0, r1, a2, a1, true)
  path.closePath()
  return path
}

// Плоскую фигуру выдавить на толщину depth и положить на стол (выдавливание идёт вверх)
export function flatExtrude(shape, depth, curveSegments = 24) {
  const g = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments })
  g.rotateX(-Math.PI / 2)
  return g
}

// Картинка, лежащая сверху на высоте y (наклейка, этикетка)
export function topPicture(m, name, x, y, z, width, depth, draw, { pixelsPerMeter = 9000, transparent = false } = {}) {
  const plane = canvasPlane(name, width, depth, draw, { transparent, pixelsPerMeter })
  m.object(plane, { position: [x, y, z], rotation: FACE_UP })
  return plane
}

// Шрифт «от руки» для надписей на наклейках
export const HANDWRITING = '"Segoe Print", "Comic Sans MS", cursive'
