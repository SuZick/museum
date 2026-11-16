// 3D-модель перфокарты (фото photo_1_2026-11-16): тонкий картон 187,325 × 82,55 мм со срезанным углом,
// 80 колонок и 12 рядов. Карта чистая (без пробивок), напечатаны цифры 0–9 в каждой колонке,
// сбоку надписи «ТЕХНОИНФОРМ» и «III 1985 г. ТУ 57-7-81».
import * as THREE from 'three'
import { ModelBuilder, material, canvasPlane, FACE_UP } from './lib.js'
import { flatExtrude } from './tapes.js'

const W = 0.187325
const D = 0.08255
const THICK = 0.0004 // настоящая карта тоньше (0,18 мм), но так её лучше видно
const CUT = [0.0065, 0.011] // срезанный левый верхний угол

// Контур карты в долях (0..1): по нему строится и сама карта, и картинка на ней
function outline(w, d) {
  const s = new THREE.Shape()
  s.moveTo(0, 0)
  s.lineTo(w, 0)
  s.lineTo(w, d)
  s.lineTo(CUT[0] * (w / W), d)
  s.lineTo(0, d - CUT[1] * (d / D))
  s.closePath()
  return s
}

// Рисунок карты: ряды цифр 0–9 по 80 колонок, номера колонок, надписи по бокам
function drawCard(ctx, w, h) {
  const mmX = w / (W * 1000)
  const mmY = h / (D * 1000)
  ctx.fillStyle = '#e4d8b8'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#5a5248'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const colX = (c) => (6.35 + (c - 1) * 2.2098) * mmX // центр колонки c (1..80)
  const rowY = (digit) => (19.05 + digit * 6.35) * mmY // центр ряда с цифрой 0..9
  ctx.font = `${Math.round(3.3 * mmY)}px Arial`
  for (let digit = 0; digit <= 9; digit++) {
    for (let c = 1; c <= 80; c++) ctx.fillText(String(digit), colX(c), rowY(digit))
  }
  // Номера колонок мелко: над рядом нулей и над рядом девяток
  ctx.font = `${Math.round(1.9 * mmY)}px Arial`
  for (const y of [rowY(0) - 3.4 * mmY, rowY(9) - 3.4 * mmY]) {
    for (let c = 1; c <= 80; c++) if (c === 1 || c % 2 === 0) ctx.fillText(String(c), colX(c), y)
  }
  // Надписи по бокам, снизу вверх
  ctx.font = `bold ${Math.round(2.4 * mmY)}px Arial`
  ctx.save()
  ctx.translate(3.2 * mmX, h * 0.55)
  ctx.rotate(-Math.PI / 2)
  ctx.fillText('«ТЕХНОИНФОРМ»', 0, 0)
  ctx.restore()
  ctx.save()
  ctx.translate(w - 3.0 * mmX, h * 0.5)
  ctx.rotate(-Math.PI / 2)
  ctx.font = `${Math.round(2.4 * mmY)}px Arial`
  ctx.fillText('III 1985 г.  ТУ 57-7-81', 0, 0)
  ctx.restore()
}

export default function buildPerfokarta() {
  const m = new ModelBuilder('Перфокарта')

  // Сам картон
  const card = outline(W, D)
  m.add(flatExtrude(card, THICK, 1), material('Картон', 0xdcd0ae, { roughness: 0.9 }), { position: [-W / 2, 0, D / 2] })

  // Картинка сверху той же формы: контур в долях даёт правильную раскладку рисунка
  const plane = canvasPlane('Печать на карте', W, D, drawCard, { transparent: false, pixelsPerMeter: 6000, roughness: 0.9 })
  const g = new THREE.ShapeGeometry(outline(1, 1))
  g.scale(W, D, 1)
  g.translate(-W / 2, -D / 2, 0)
  plane.geometry = g
  m.object(plane, { position: [0, THICK + 0.00005, 0], rotation: FACE_UP })

  return m.build()
}
