// 3D-модель ноутбука Leading Technology 9000LT (начало 1990-х).
// В коллекции есть только фото наклейки на днище (photo_1), поэтому внешний вид — типовой
// для ноутбуков той эпохи: светлый пластик, клавиатура у переднего края, монохромный ЖК-экран.
import { ModelBuilder, material } from './lib.js'
import { laptop, laptopRows } from './laptop.js'

const body = material('Корпус', 0xcac2ae, { roughness: 0.6 })
const bezel = material('Рамка экрана', 0x8c867a, { roughness: 0.6 })
const well = material('Подложка клавиатуры', 0x5c584f, { roughness: 0.8 })
const keyLight = material('Клавиши', 0xe2ddd0, { roughness: 0.5 })
const keyGrey = material('Клавиши серые', 0x9f998c, { roughness: 0.5 })

export default function buildLeadingTechnology9000LT() {
  const m = new ModelBuilder('Leading Technology 9000LT')
  laptop(m, {
    width: 0.31,
    depth: 0.25,
    baseHeight: 0.045,
    lidLength: 0.22,
    lidThickness: 0.014,
    openAngle: 108,
    bodyMat: body,
    bezelMat: bezel,
    wellMat: well,
    screen: { width: 0.195, height: 0.145, centerY: 0.118, draw: drawScreen, glow: 0.35 },
    keys: { rows: laptopRows(keyLight, keyGrey), pitch: 0.0175, z0: -0.04, height: 0.005 },
    bezelLabel: { text: 'LEADING TECHNOLOGY', color: '#2b2a26' },
    baseLabel: { text: 'Leading Technology  9000LT', color: '#3a3832', z: -0.085, width: 0.2 },
  })
  return m.build()
}

// Монохромный ЖК-экран с приглашением MS-DOS
function drawScreen(ctx, w, h) {
  ctx.fillStyle = '#a9b8b4'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#26364a'
  ctx.font = `bold ${Math.round(h / 16)}px "Courier New", monospace`
  ctx.textBaseline = 'top'
  const lines = ['Microsoft(R) MS-DOS(R)', '(C)Copyright Microsoft Corp', '', 'C:\\>dir /w', '', 'C:\\>_']
  lines.forEach((line, i) => ctx.fillText(line, w * 0.05, h * (0.06 + i * 0.085)))
}
