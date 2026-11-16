// 3D-модель компакт-кассеты МК-60-1 (фото photo_4_2026-11-16): белый корпус, этикетка «Свема»
// с оранжевой полосой, надписи «МК-60-1», «1983 г. июнь», «Цена 6 р.», сверху список записей от руки.
import { ModelBuilder, material, canvasPlane, FACE_UP } from './lib.js'
import { HANDWRITING } from './tapes.js'

const W = 0.1004
const D = 0.0638
const H = 0.012

function drawFace(ctx, w, h) {
  const X = (f) => w * f
  const Y = (f) => h * f
  ctx.fillStyle = '#ecebe4'
  ctx.fillRect(0, 0, w, h)

  // Этикетка: сверху белое поле с линейками и записями от руки, снизу оранжевая полоса
  ctx.fillStyle = '#f6f4ec'
  ctx.fillRect(X(0.05), Y(0.06), X(0.9), Y(0.4))
  ctx.fillStyle = '#e4893f'
  ctx.fillRect(X(0.05), Y(0.43), X(0.9), Y(0.36))
  ctx.strokeStyle = '#e4a070'
  ctx.lineWidth = Math.max(1, h / 300)
  for (let i = 0; i < 4; i++) {
    ctx.beginPath()
    ctx.moveTo(X(0.08), Y(0.15 + i * 0.075))
    ctx.lineTo(X(0.92), Y(0.15 + i * 0.075))
    ctx.stroke()
  }
  // Записи от руки: номера и неразборчивые «росчерки» вместо названий
  ctx.fillStyle = '#3a3550'
  ctx.strokeStyle = '#3a3550'
  ctx.font = `${Math.round(h * 0.055)}px ${HANDWRITING}`
  ctx.lineWidth = Math.max(1.5, h / 260)
  const scribble = (x, y, length, seed) => {
    ctx.beginPath()
    ctx.moveTo(x, y)
    for (let t = 0; t <= length; t += w * 0.006) {
      ctx.lineTo(x + t, y - Math.abs(Math.sin(t * 0.09 + seed)) * h * 0.035 + Math.sin(t * 0.31 + seed * 2) * h * 0.008)
    }
    ctx.stroke()
  }
  for (let i = 0; i < 4; i++) {
    ctx.fillText(`${i + 1}.`, X(0.09), Y(0.135 + i * 0.075))
    scribble(X(0.13), Y(0.135 + i * 0.075), X(0.22 + (i % 2) * 0.06), i)
    ctx.fillText('(  )', X(0.4), Y(0.135 + i * 0.075))
  }
  for (let i = 0; i < 3; i++) {
    ctx.fillText(i === 1 ? '' : `${i === 0 ? 5 : 6}.`, X(0.5), Y(0.135 + i * 0.075))
    scribble(X(0.54), Y(0.135 + i * 0.075), X(0.25), i + 5)
  }

  // Окно с катушками и окошко ленты
  ctx.fillStyle = '#f2f1ec'
  ctx.beginPath()
  ctx.roundRect(X(0.2), Y(0.45), X(0.6), Y(0.22), Y(0.11))
  ctx.fill()
  for (const cx of [0.31, 0.69]) {
    ctx.fillStyle = '#4a4440'
    ctx.beginPath()
    ctx.arc(X(cx), Y(0.56), X(0.055), 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#e8e6df'
    for (let t = 0; t < 6; t++) {
      const a = (t / 6) * Math.PI * 2
      ctx.fillRect(X(cx) + Math.cos(a) * X(0.04) - 3, Y(0.56) + Math.sin(a) * X(0.04) - 3, 6, 6)
    }
  }
  ctx.fillStyle = '#16120f'
  ctx.fillRect(X(0.41), Y(0.515), X(0.18), Y(0.09))

  // Надписи на оранжевой полосе
  ctx.fillStyle = '#f6f4ec'
  ctx.beginPath()
  ctx.arc(X(0.84), Y(0.505), X(0.035), 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(X(0.08), Y(0.67), X(0.12), Y(0.08), Y(0.02))
  ctx.fill()
  ctx.fillStyle = '#e4893f'
  ctx.font = `italic bold ${Math.round(h * 0.055)}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('Свема', X(0.14), Y(0.712))
  ctx.fillStyle = '#f6f4ec'
  ctx.font = `bold ${Math.round(h * 0.11)}px Arial`
  ctx.fillText('МК-60-1', X(0.43), Y(0.71))
  ctx.font = `${Math.round(h * 0.04)}px Arial`
  ctx.fillText('Цена 6 р.', X(0.13), Y(0.6))
  ctx.font = `${Math.round(h * 0.045)}px Arial`
  ctx.fillText('1983 г.', X(0.82), Y(0.62))
  ctx.font = `${Math.round(h * 0.038)}px Arial`
  ctx.fillText('июнь', X(0.8), Y(0.665))
  ctx.fillText('Прейскурант', X(0.8), Y(0.705))
  ctx.fillText('№ 137-1973/79', X(0.8), Y(0.745))

  // Трапеция внизу с отверстиями для валов магнитофона, винты по углам
  ctx.strokeStyle = '#c9c6bd'
  ctx.lineWidth = Math.max(2, h / 200)
  ctx.beginPath()
  ctx.moveTo(X(0.15), Y(0.995))
  ctx.lineTo(X(0.19), Y(0.83))
  ctx.lineTo(X(0.81), Y(0.83))
  ctx.lineTo(X(0.85), Y(0.995))
  ctx.stroke()
  ctx.fillStyle = '#5a5650'
  for (const [cx, r] of [[0.27, 0.02], [0.37, 0.016], [0.63, 0.016], [0.73, 0.02]]) {
    ctx.beginPath()
    ctx.arc(X(cx), Y(0.91), X(r), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.fillStyle = '#b9b6ae'
  for (const [cx, cy] of [[0.03, 0.04], [0.97, 0.04], [0.03, 0.96], [0.97, 0.96], [0.5, 0.88]]) {
    ctx.beginPath()
    ctx.arc(X(cx), Y(cy), X(0.01), 0, Math.PI * 2)
    ctx.fill()
  }
}

export default function buildMk60Cassette() {
  const m = new ModelBuilder('Компакт-кассета МК-60-1')
  const body = material('Корпус кассеты', 0xecebe4, { roughness: 0.45 })
  m.roundedBox([W, H, D], 0.0015, body, { position: [0, H / 2, 0] })

  const face = canvasPlane('Этикетка МК-60-1', W - 0.0016, D - 0.0016, drawFace, { transparent: false, pixelsPerMeter: 10000 })
  m.object(face, { position: [0, H + 0.0001, 0], rotation: FACE_UP })

  // На переднем торце — окошки, в которых видна лента
  const tape = material('Магнитная лента', 0x2b211b, { roughness: 0.35 })
  for (const x of [-0.022, 0, 0.022]) m.box([0.012, 0.006, 0.0006], tape, { position: [x, H / 2, D / 2 + 0.0001] })

  return m.build()
}
