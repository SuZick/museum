// 3D-модель «Счёты»: деревянная рамка, 10 спиц по 10 костяшек и спица с 4 костяшками.
// На счётах «отложено» число 1986 — костяшки сдвинуты влево.
import * as THREE from 'three'
import { ModelBuilder, material } from './lib.js'

const wood = material('Рамка', 0xc59a5e, { roughness: 0.7 })
const bead = material('Костяшки', 0x8e4a1c, { roughness: 0.45 })
const beadDark = material('Костяшки тёмные', 0x3b2416, { roughness: 0.45 })
const wire = material('Спицы', 0xb8b8b8, { roughness: 0.3, metalness: 0.9 })

const W = 0.24 // ширина рамки (вдоль спиц)
const D = 0.32 // длина рамки
const BAR = 0.02 // толщина бруска рамки
const H = 0.024 // высота рамки
const ROWS = 11
const QUARTER_ROW = 7 // спица с четырьмя костяшками
const DIGITS = { 3: 1, 4: 9, 5: 8, 6: 6 } // ряд → сколько костяшек отложено влево

// Костяшка — «бочонок», выточенный вокруг оси (как на токарном станке)
const beadShape = new THREE.LatheGeometry(
  [
    new THREE.Vector2(0.0025, -0.0068),
    new THREE.Vector2(0.0085, -0.0046),
    new THREE.Vector2(0.0105, 0),
    new THREE.Vector2(0.0085, 0.0046),
    new THREE.Vector2(0.0025, 0.0068),
  ],
  8,
)
const BEAD_LEN = 0.0137

export default function buildSchety() {
  const m = new ModelBuilder('Счёты')

  // Рамка
  for (const side of [-1, 1]) {
    m.roundedBox([BAR, H, D], 0.004, wood, { position: [side * (W / 2 - BAR / 2), H / 2, 0] })
    m.roundedBox([W - BAR, H * 0.85, BAR], 0.004, wood, { position: [0, H * 0.425, side * (D / 2 - BAR / 2)] })
  }

  // Спицы и костяшки
  const inner = D - 2 * BAR
  const left = -W / 2 + BAR + 0.001
  const right = W / 2 - BAR - 0.001
  for (let row = 0; row < ROWS; row++) {
    const z = -inner / 2 + (inner / (ROWS + 1)) * (row + 1)
    m.cylinder(0.0012, W - BAR, wire, { position: [0, H / 2, z], rotation: [0, 0, Math.PI / 2] }, 6)

    const count = row === QUARTER_ROW ? 4 : 10
    const moved = DIGITS[row] ?? 0 // сколько костяшек сдвинуто влево
    for (let i = 0; i < count; i++) {
      const x =
        i < moved
          ? left + BEAD_LEN / 2 + i * BEAD_LEN
          : right - BEAD_LEN / 2 - (count - 1 - i) * BEAD_LEN
      const mat = count === 10 && (i === 4 || i === 5) ? beadDark : bead
      m.add(beadShape, mat, { position: [x, H / 2, z], rotation: [0, 0, Math.PI / 2] })
    }
  }
  return m.build()
}
