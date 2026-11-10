// 3D-модель матричного принтера Epson LQ-1050: широкий бежевый корпус, дымчатая крышка,
// тракторная подача сзади и лента бумаги с напечатанным текстом.
import * as THREE from 'three'
import { ModelBuilder, material, canvasPlane, textPlane, FACE_UP } from './lib.js'

const plastic = material('Корпус', 0xcdc4ad, { roughness: 0.6 })
const smoked = material('Крышка', 0x3d3a36, { roughness: 0.15 })
const dark = material('Механизм', 0x2a2a2a, { roughness: 0.7 })
const knob = material('Ручка валика', 0x1c1c1c, { roughness: 0.5 })
const button = material('Кнопки', 0xb3aa94, { roughness: 0.5 })
const ledGreen = material('Индикатор', 0x4ad46e, { emissive: 0x20c050, emissiveIntensity: 0.8 })
const ledOrange = material('Индикатор 2', 0xffa040, { emissive: 0xff8020, emissiveIntensity: 0.6 })

const W = 0.6
const D = 0.37
const FRONT = D / 2

export default function buildEpsonLq1050() {
  const m = new ModelBuilder('Epson LQ-1050')

  // Корпус, задний отсек подачи бумаги, дымчатая крышка над печатающей головкой
  m.roundedBox([W, 0.085, D], 0.012, plastic, { position: [0, 0.0425, 0] })
  m.roundedBox([W - 0.02, 0.035, 0.11], 0.01, plastic, { position: [0, 0.1, -0.125] })
  m.roundedBox([0.5, 0.012, 0.17], 0.004, smoked, { position: [0, 0.091, 0.015], rotation: [-0.06, 0, 0] })

  // Щель для бумаги и тракторы с обеих сторон
  m.box([0.48, 0.004, 0.025], dark, { position: [0, 0.1175, -0.105] })
  for (const x of [-0.215, 0.215]) m.roundedBox([0.04, 0.022, 0.09], 0.004, dark, { position: [x, 0.125, -0.125] })

  // Лента бумаги, выходящая назад
  const paper = canvasPlane('Бумага', 0.42, 0.22, drawPaper, { transparent: false, roughness: 0.9 })
  paper.material.side = THREE.DoubleSide
  const tilt = -0.35
  m.object(paper, { position: [0, 0.12 + 0.11 * Math.cos(tilt), -0.105 + 0.11 * Math.sin(tilt)], rotation: [tilt, 0, 0] })

  // Ручка прокрутки валика справа
  m.cylinder(0.024, 0.02, knob, { position: [W / 2 + 0.01, 0.075, -0.03], rotation: [0, 0, Math.PI / 2] }, 20)

  // Панель управления: кнопки и индикаторы, надписи EPSON и LQ-1050
  for (let i = 0; i < 4; i++) m.roundedBox([0.018, 0.006, 0.012], 0.002, button, { position: [0.16 + i * 0.026, 0.086, FRONT - 0.03] })
  m.box([0.005, 0.002, 0.004], ledGreen, { position: [0.16, 0.0855, FRONT - 0.012] })
  m.box([0.005, 0.002, 0.004], ledGreen, { position: [0.186, 0.0855, FRONT - 0.012] })
  m.box([0.005, 0.002, 0.004], ledOrange, { position: [0.212, 0.0855, FRONT - 0.012] })
  m.object(textPlane('Логотип', 0.075, 0.016, 'EPSON', { color: '#1d3f9c', letterSpacing: 0.12 }), {
    position: [-0.22, 0.0857, FRONT - 0.025],
    rotation: FACE_UP,
  })
  m.object(textPlane('Модель', 0.06, 0.012, 'LQ-1050', { color: '#5f5a50' }), {
    position: [-0.14, 0.0857, FRONT - 0.025],
    rotation: FACE_UP,
  })

  // Сзади — разъёмы интерфейсов
  m.box([0.06, 0.02, 0.004], dark, { position: [-0.1, 0.045, -FRONT - 0.001] })
  m.box([0.04, 0.015, 0.004], dark, { position: [0.05, 0.045, -FRONT - 0.001] })

  return m.build()
}

// Бумага с перфорацией по краям и строками, напечатанными «иголками»
function drawPaper(ctx, w, h) {
  ctx.fillStyle = '#f4f1e8'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#c9c4b8'
  const margin = w * 0.045
  for (let y = h * 0.04; y < h; y += h * 0.07) {
    ctx.beginPath()
    ctx.arc(margin / 2, y, w * 0.009, 0, Math.PI * 2)
    ctx.arc(w - margin / 2, y, w * 0.009, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillRect(margin, 0, 1, h)
  ctx.fillRect(w - margin, 0, 1, h)
  ctx.fillStyle = '#2b2b2b'
  ctx.font = `bold ${Math.round(h * 0.06)}px "Courier New", monospace`
  const lines = ['МУЗЕЙ ВЫЧИСЛИТЕЛЬНОЙ ТЕХНИКИ', '', 'EPSON LQ-1050', '24-ИГОЛЬЧАТЫЙ МАТРИЧНЫЙ ПРИНТЕР', '', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', '0123456789 !?#%&*()+-=/<>']
  lines.forEach((line, i) => ctx.fillText(line, w * 0.09, h * (0.14 + i * 0.1)))
}
