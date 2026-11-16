// Общие детали для моделей процессоров: корпус-пластина с надписями и ножки.
import * as THREE from 'three'
import { material, canvasPlane, FACE_UP } from './lib.js'

export const chipMats = {
  pin: material('Ножки', 0xdcb553, { roughness: 0.3, metalness: 1 }),
}

// Позиции ножек: квадратная сетка count × count с шагом pitch (центр в нуле).
// keep(i, j, ring) решает, есть ли ножка в клетке; ring — номер «кольца» от края (0 — самый край).
export function pinGrid(count, pitch, keep) {
  const positions = []
  const half = ((count - 1) * pitch) / 2
  for (let i = 0; i < count; i++) {
    for (let j = 0; j < count; j++) {
      const ring = Math.min(i, j, count - 1 - i, count - 1 - j)
      if (keep(i, j, ring)) positions.push([i * pitch - half, j * pitch - half])
    }
  }
  return positions
}

// Ножки — тонкие стерженьки от высоты y0 вверх на length.
// Трёхгранные и без торцов: файл в несколько раз легче, а на таком размере разницы не видно.
export function pins(m, positions, { x = 0, z = 0, y0, length = 0.003, radius = 0.00025 }) {
  const g = new THREE.CylinderGeometry(radius, radius, length, 3, 1, true)
  for (const [px, pz] of positions) m.add(g, chipMats.pin, { position: [x + px, y0 + length / 2, z + pz] })
}

// Корпус процессора: квадрат size × size толщиной thick, нижняя грань на высоте y0.
// draw(ctx, w, h) рисует верхнюю грань (надписи, логотипы).
export function chipBody(m, name, { x = 0, z = 0, size, thick, y0, color, draw, pixelsPerMeter = 12000 }) {
  m.box([size, thick, size], material(name, color, { roughness: 0.5 }), { position: [x, y0 + thick / 2, z] })
  if (draw) {
    const face = canvasPlane(`${name}: надписи`, size, size, draw, { transparent: false, pixelsPerMeter })
    m.object(face, { position: [x, y0 + thick + 0.0001, z], rotation: FACE_UP })
  }
}

// Строчки мелкой маркировки, которые на фото не читаются: рисуем просто светлыми полосками
export function markingLines(ctx, x, y, widths, lineHeight, color = 'rgba(220, 220, 225, 0.55)') {
  ctx.fillStyle = color
  widths.forEach((width, i) => ctx.fillRect(x, y + i * lineHeight * 1.8, width, lineHeight))
}

// Надпись по центру: text, высота букв size (в долях высоты картинки), координата y (в долях)
export function centerText(ctx, w, h, text, y, size, { color = '#f2f2f2', weight = 'bold', italic = false, x = 0.5 } = {}) {
  ctx.fillStyle = color
  ctx.font = `${italic ? 'italic ' : ''}${weight} ${Math.round(h * size)}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w * x, h * y)
}
