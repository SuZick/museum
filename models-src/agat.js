// 3D-модель ПЭВМ «Агат»: светлый системный блок с рёбрами на передней панели
// и отдельная клавиатура. По фото экспоната (photo_17) и фото Агата-7 с Wikimedia.
// Монитора в коллекции нет — модель без него.
import { ModelBuilder, material, canvasPlane, deskKeyboard } from './lib.js'

const plastic = material('Корпус', 0xcbbd9c, { roughness: 0.6 })
const seam = material('Швы', 0x9c9483, { roughness: 0.8 })
const keyLight = material('Клавиши', 0xefe9dc, { roughness: 0.5 })
const keyGrey = material('Клавиши серые', 0x9a948a, { roughness: 0.5 })
const keyRed = material('Клавиши красные', 0xc4473a, { roughness: 0.45 })
const chrome = material('Замок', 0xc8c8c8, { roughness: 0.3, metalness: 0.9 })
const led = material('Индикатор', 0xff3b2f, { emissive: 0xff2010, emissiveIntensity: 0.8 })

const W = 0.46
const H = 0.14
const D = 0.36
const FRONT = D / 2

export default function buildAgat() {
  const m = new ModelBuilder('Агат')

  // Системный блок
  m.roundedBox([W, H, D], 0.01, plastic, { position: [0, H / 2, 0] })
  m.box([W - 0.01, 0.002, 0.002], seam, { position: [0, 0.026, FRONT + 0.0005] }) // шов над цоколем

  // Рёбра на левой части передней панели и внизу
  for (let i = 0; i < 7; i++) {
    m.roundedBox([0.015, 0.098, 0.012], 0.003, plastic, { position: [-0.21 + i * 0.024, 0.085, FRONT + 0.003] })
  }
  for (let i = 0; i < 18; i++) {
    m.roundedBox([0.016, 0.016, 0.01], 0.003, plastic, { position: [-0.21 + i * 0.0247, 0.012, FRONT + 0.002] }, 1)
  }

  // Логотип «АГАТ», ключ-замок и индикатор питания
  m.object(canvasPlane('Логотип', 0.06, 0.022, drawLogo, { transparent: false }), { position: [0.07, 0.085, FRONT + 0.0006] })
  m.cylinder(0.008, 0.006, chrome, { position: [0.185, 0.1, FRONT + 0.002], rotation: [Math.PI / 2, 0, 0] })
  m.box([0.0012, 0.008, 0.002], seam, { position: [0.185, 0.1, FRONT + 0.0055] })
  m.box([0.006, 0.003, 0.003], led, { position: [0.185, 0.072, FRONT + 0.001] })

  // Вентиляция сверху сзади
  for (let i = 0; i < 10; i++) m.box([0.2, 0.001, 0.005], seam, { position: [0.06, H + 0.0003, -0.15 + i * 0.012] })

  // Клавиатура
  const K = [1, keyLight]
  const G = [1, keyGrey]
  deskKeyboard(m, {
    z: FRONT + 0.03 + 0.085,
    width: 0.42,
    depth: 0.17,
    frontHeight: 0.024,
    backHeight: 0.042,
    caseMat: plastic,
    backMargin: 0.03,
    main: [
      [[1, keyRed], ...Array(11).fill(G), [1, keyRed]],
      Array(13).fill(K),
      [[1.5, keyLight], ...Array(10).fill(K), [1.5, keyLight]],
      [[1.75, keyGrey], ...Array(10).fill(K), [1.25, keyGrey]],
      [[2.25, keyGrey], ...Array(9).fill(K), [1.75, keyGrey]],
      [[2, keyGrey], [9, keyLight], [2, keyGrey]],
    ],
    pad: [[G, G, G], [K, K, K], [K, K, K], [K, K, K], [K, K, K], [[2, keyLight], [1, keyRed]]],
  })

  return m.build()
}

function drawLogo(ctx, w, h) {
  ctx.fillStyle = '#3b2b22'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#f1ece2'
  ctx.font = `900 ${Math.round(h * 0.78)}px "Arial Black", Arial, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = `${Math.round(h * 0.02)}px`
  ctx.fillText('АГАТ', w / 2, h / 2 + 2)
}
