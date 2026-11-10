// 3D-модель компьютера VEF-Signo: настольный корпус IBM PC/AT-совместимого компьютера
// с замком, кнопкой RESET, индикаторами и горизонтальными жалюзи. По фото экспоната (photo_5).
import { ModelBuilder, material, canvasPlane, textPlane, frameGeometry } from './lib.js'

const plastic = material('Корпус', 0xc5c0b1, { roughness: 0.85 })
const chrome = material('Замок', 0xd2d2d2, { roughness: 0.25, metalness: 0.9 })
const slot = material('Щель', 0x101010, { roughness: 0.9 })
const red = material('Кнопка RESET', 0xd42a1f, { roughness: 0.4 })
const bezel = material('Панель дисковода', 0xbfbab0, { roughness: 0.7 })
const ledGreen = material('Индикатор питания', 0x8fd18a, { emissive: 0x40c040, emissiveIntensity: 0.6 })
const ledOrange = material('Индикатор диска', 0xc98b5a, { emissive: 0xc06020, emissiveIntensity: 0.4 })
const ledYellow = material('Индикатор TURBO', 0xd7b46a, { emissive: 0xc09020, emissiveIntensity: 0.4 })

const W = 0.43
const H = 0.16
const D = 0.42
const FRONT = D / 2
const PANEL_X = -0.06 // центр панели с кнопками
const PANEL_Y = 0.125
const PANEL_W = 0.27
const panelX = (fraction) => PANEL_X - PANEL_W / 2 + PANEL_W * fraction

export default function buildVefSigno() {
  const m = new ModelBuilder('VEF-Signo')

  m.roundedBox([W, H, D], 0.008, plastic, { position: [0, H / 2, 0] })

  // Панель с замком, RESET и индикаторами
  m.add(frameGeometry({ width: PANEL_W + 0.012, height: 0.046, radius: 0.003 }, { width: PANEL_W, height: 0.035, radius: 0.002 }, 0.003), plastic, {
    position: [PANEL_X, PANEL_Y, FRONT],
  })
  m.object(canvasPlane('Панель', PANEL_W, 0.035, drawPanel, { transparent: false }), { position: [PANEL_X, PANEL_Y, FRONT + 0.0005] })
  m.cylinder(0.0095, 0.006, chrome, { position: [panelX(0.08), PANEL_Y, FRONT + 0.003], rotation: [Math.PI / 2, 0, 0] })
  m.box([0.0015, 0.011, 0.002], slot, { position: [panelX(0.08), PANEL_Y, FRONT + 0.0062] })
  m.box([0.016, 0.014, 0.006], red, { position: [panelX(0.37), PANEL_Y - 0.004, FRONT + 0.003] })
  for (const [fraction, mat] of [[0.57, ledGreen], [0.7, ledOrange], [0.85, ledYellow]]) {
    m.box([0.012, 0.003, 0.002], mat, { position: [panelX(fraction), PANEL_Y - 0.01, FRONT + 0.0012] })
  }

  // Наклейка «VEF-SIGNO»
  m.object(textPlane('Наклейка', 0.075, 0.013, 'VEF-SIGNO', { background: '#111', italic: true, size: 0.6 }), {
    position: [-0.15, 0.1515, FRONT + 0.0006],
  })

  // Горизонтальные вентиляционные жалюзи
  for (let i = 0; i < 8; i++) {
    m.roundedBox([0.285, 0.0065, 0.01], 0.002, plastic, { position: [PANEL_X + 0.005, 0.018 + i * 0.0105, FRONT + 0.003] })
  }

  // Справа — дисковод 5,25" и заглушка
  m.box([0.105, 0.034, 0.004], bezel, { position: [0.15, 0.12, FRONT + 0.002] })
  m.box([0.09, 0.004, 0.002], slot, { position: [0.15, 0.124, FRONT + 0.0045] })
  m.box([0.018, 0.008, 0.006], bezel, { position: [0.15, 0.112, FRONT + 0.005] })
  m.box([0.105, 0.034, 0.003], bezel, { position: [0.15, 0.075, FRONT + 0.0015] })

  // Сзади — вентилятор блока питания и прорези плат расширения
  m.cylinder(0.035, 0.002, slot, { position: [0.14, 0.09, -FRONT - 0.0005], rotation: [Math.PI / 2, 0, 0] }, 20)
  for (let i = 0; i < 8; i++) m.box([0.012, 0.08, 0.002], slot, { position: [-0.17 + i * 0.022, 0.07, -FRONT - 0.0005] })

  return m.build()
}

// Табличка панели: значки замка, надписи RESET и TURBO, значки питания и жёсткого диска
function drawPanel(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#d2c59e')
  g.addColorStop(1, '#bfb187')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  ctx.strokeStyle = '#3a3428'
  ctx.fillStyle = '#3a3428'
  ctx.lineWidth = Math.max(2, h * 0.04)
  // Значки «открыто/закрыто» у замка
  const lockX = w * 0.165
  ctx.strokeRect(lockX, h * 0.12, h * 0.22, h * 0.18)
  ctx.beginPath()
  ctx.arc(lockX + h * 0.2, h * 0.1, h * 0.08, Math.PI, 0)
  ctx.stroke()
  ctx.strokeRect(lockX, h * 0.6, h * 0.22, h * 0.18)
  ctx.beginPath()
  ctx.arc(lockX + h * 0.11, h * 0.58, h * 0.08, Math.PI, 0)
  ctx.stroke()
  // Надписи
  ctx.font = `bold ${Math.round(h * 0.2)}px Arial`
  ctx.textAlign = 'center'
  ctx.fillText('RESET', w * 0.37, h * 0.18)
  ctx.fillText('TURBO', w * 0.85, h * 0.32)
  // Значок лампочки (питание) и цилиндра (жёсткий диск)
  ctx.beginPath()
  ctx.arc(w * 0.57, h * 0.3, h * 0.1, 0, Math.PI * 2)
  ctx.stroke()
  ctx.strokeRect(w * 0.7 - h * 0.08, h * 0.12, h * 0.16, h * 0.34)
}
