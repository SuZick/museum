// 3D-модель шариковой мыши EasyMouse (Genius, 1990-е): овальный светло-серый корпус, две кнопки,
// провод с разъёмом COM-порта. По фото экспоната (photo_16) и фото из интернета.
import * as THREE from 'three'
import { ModelBuilder, material, ellipseShape, textPlane } from './lib.js'

const plastic = material('Корпус', 0xd3cfc4, { roughness: 0.55 })
const groove = material('Линии кнопок', 0x6b675e, { roughness: 0.8 })
const cable = material('Провод', 0xcfcabd, { roughness: 0.6 })
const plug = material('Разъём', 0xbdb8ab, { roughness: 0.5 })
const metal = material('Металл', 0xc8c8c8, { roughness: 0.3, metalness: 0.9 })

const RX = 0.031 // полуширина
const RZ = 0.056 // полудлина
const BASE = 0.006 // высота нижней части
const DOME = 0.03 // высота «купола»

// Высота верхней поверхности мыши в точке (x, z)
const topAt = (x, z) => BASE + DOME * Math.sqrt(Math.max(0, 1 - (x / RX) ** 2 - (z / RZ) ** 2))

export default function buildEasyMouse() {
  const m = new ModelBuilder('Мышь EasyMouse')

  // Основание (плоский эллипс) и купол (половина сплюснутой сферы)
  m.add(new THREE.ExtrudeGeometry(ellipseShape(RX, RZ), { depth: BASE, bevelEnabled: false, curveSegments: 24 }), plastic, {
    rotation: [-Math.PI / 2, 0, 0],
  })
  m.add(new THREE.SphereGeometry(1, 28, 12, 0, Math.PI * 2, 0, Math.PI / 2), plastic, {
    position: [0, BASE, 0],
    scale: [RX, DOME, RZ],
  })

  // Линии, разделяющие две кнопки и корпус
  const line = (points) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 24, 0.0007, 5)
  const along = []
  for (let z = RZ * 0.97; z >= 0.016; z -= 0.004) along.push(new THREE.Vector3(0, topAt(0, z) + 0.0002, z))
  m.add(line(along), groove)
  const across = []
  for (let x = -RX * 0.93; x <= RX * 0.93; x += 0.004) across.push(new THREE.Vector3(x, topAt(x, 0.016) + 0.0002, 0.016))
  m.add(line(across), groove)

  // Надпись на корпусе
  m.object(textPlane('Надпись', 0.03, 0.006, 'EasyMouse', { color: '#6b675e' }), {
    position: [0, topAt(0, -0.025) + 0.0006, -0.025],
    rotation: [-Math.PI / 2 - 0.26, 0, 0],
  })

  // Провод с разъёмом
  const path = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.012, RZ - 0.002),
    new THREE.Vector3(0, 0.01, 0.075),
    new THREE.Vector3(0.012, 0.004, 0.1),
    new THREE.Vector3(0.035, 0.003, 0.125),
    new THREE.Vector3(0.042, 0.004, 0.16),
  ])
  m.add(new THREE.TubeGeometry(path, 40, 0.0018, 6), cable)
  m.roundedBox([0.032, 0.012, 0.02], 0.002, plug, { position: [0.042, 0.006, 0.17] })
  m.box([0.02, 0.008, 0.008], metal, { position: [0.042, 0.006, 0.184] })

  return m.build()
}
