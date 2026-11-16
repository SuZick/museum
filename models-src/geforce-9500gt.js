// 3D-модель видеокарты NVIDIA GeForce 9500 GT (2008 г.) для шины PCI Express.
// По фото экспоната (photo_11_2026-11-16): зелёная плата, круглый радиатор с розово-красными
// рёбрами и вентилятором FORSA, столбик серебристых конденсаторов, дроссели, на планке S-Video, VGA и DVI.
import { ModelBuilder, material, FACE_UP } from './lib.js'
import { T } from './boards.js'
import {
  cardPcb, pcieFingers, bracket, dsub, dvi, svideo, memChip, choke, electrolyticCap, fan, roundSticker, smdRow, cardMats,
} from './cards.js'

const L = 0.171
const H = 0.108
const mm = 0.001

// Радиатор: центр, внутренний и внешний радиус рёбер, высота
const SINK = { x: 19.5 * mm, z: 8 * mm, r1: 0.02, r2: 0.039, h: 0.011 }

export default function buildGeforce9500gt() {
  const m = new ModelBuilder('Видеокарта GeForce 9500 GT')

  cardPcb(m, {
    length: L,
    height: H,
    pitch: 1 * mm,
    fingers: pcieFingers(43 * mm),
    colors: { base: '#3f8a45', traces: 'rgba(150, 210, 140, 0.3)' },
    edgeColor: 0x36773b,
    seed: 79,
    pixelsPerMeter: 3800,
    labels: [],
  })
  // Контакты для соединения двух видеокарт (SLI) на верхнем краю
  m.box([0.013, 0.0003, 0.004], material('Контакты SLI', 0xd9ab45, { roughness: 0.3, metalness: 1 }), {
    position: [-36.4 * mm, T + 0.00015, -H / 2 + 0.0025],
  })

  // Память вокруг графического процессора (частично под радиатором)
  for (const [x, z] of [[-16, -32.5], [19.5, -32.5], [56, -10], [56, 25]]) memChip(m, x * mm, z * mm, [0.012, 0.0095])

  // Столбик твердотельных конденсаторов (серебристые с синей полосой) и ещё два справа вверху
  const solid = material('Конденсаторы твердотельные', 0xd2d7dd, { roughness: 0.3, metalness: 0.6 })
  const solidTop = material('Верх конденсаторов', 0x3d6fd0, { roughness: 0.4 })
  for (const z of [-24.3, -11.9, -0.3, 11.2, 22.8]) electrolyticCap(m, -40 * mm, z * mm, { radius: 0.004, height: 0.009, mat: solid, top: solidTop })
  for (const x of [67.3, 77.9]) electrolyticCap(m, x * mm, -34 * mm, { radius: 0.0035, height: 0.008, mat: solid, top: solidTop })

  // Дроссели с надписями и транзисторы питания
  choke(m, -59.7 * mm, 5.4 * mm, 0.0115, 'R56')
  choke(m, -50.6 * mm, 37.6 * mm, 0.009, '1R0')
  choke(m, 65.7 * mm, -46 * mm, 0.0095, '2R2')
  for (const [x, z] of [[-62, -22], [-52, -22], [-62, -12], [-52, -12], [-50, 52 - 30]]) {
    m.box([0.0065, 0.0022, 0.0055], cardMats.chip, { position: [x * mm, T + 0.0011, z * mm] })
  }
  smdRow(m, -66 * mm, 20 * mm, 8, { along: 'z' })
  smdRow(m, -30 * mm, -45 * mm, 14)
  smdRow(m, 66 * mm, -20 * mm, 12, { along: 'z' })

  // Круглый радиатор: основание и тонкие рёбра лучами
  const fin = material('Рёбра радиатора', 0xc23f6e, { roughness: 0.4, metalness: 0.5 })
  const base = material('Основание радиатора', 0x2a2a2e, { roughness: 0.5, metalness: 0.4 })
  m.cylinder(SINK.r1, 0.003, base, { position: [SINK.x, T + 0.0015, SINK.z] }, 32)
  const fins = 40
  const len = SINK.r2 - SINK.r1 + 0.003
  for (let i = 0; i < fins; i++) {
    const a = (i / fins) * Math.PI * 2 + 0.2
    const r = SINK.r1 - 0.003 + len / 2
    m.box([0.0007, SINK.h, len], fin, {
      position: [SINK.x + Math.sin(a) * r, T + SINK.h / 2, SINK.z + Math.cos(a) * r],
      rotation: [0, a + 0.25, 0],
    })
  }
  // Красные пластиковые крепления по четырём сторонам
  const red = material('Крепления кулера', 0xd2343f, { roughness: 0.5 })
  for (const a of [0.8, 2.35, 3.95, 5.5]) {
    m.roundedBox([0.009, 0.004, 0.012], 0.0015, red, {
      position: [SINK.x + Math.sin(a) * 0.03, T + SINK.h + 0.001, SINK.z + Math.cos(a) * 0.03],
      rotation: [0, a, 0],
    })
  }

  // Вентилятор с наклейкой FORSA
  const fanY = T + SINK.h - 0.001
  fan(m, SINK.x, fanY, SINK.z, { radius: 0.026, blades: 9, height: 0.005, hubRatio: 0.45 })
  m.object(roundSticker('Наклейка FORSA', 0.026 * 0.88, (ctx, w, h) => {
    ctx.fillStyle = '#1d1e21'
    ctx.fillRect(0, 0, w, h)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#f0f0f0'
    ctx.font = `bold ${Math.round(h * 0.22)}px Arial`
    ctx.fillText('FORSA', w / 2, h * 0.56)
    ctx.font = `${Math.round(h * 0.07)}px Arial`
    ctx.fillText('See the difference', w / 2, h * 0.7)
  }), { position: [SINK.x, fanY + 0.0051, SINK.z], rotation: FACE_UP })

  // Провод вентилятора и разъём
  m.box([0.006, 0.004, 0.003], cardMats.dviWhite, { position: [-44 * mm, T + 0.002, 42 * mm] })

  // Планка: S-Video, VGA, DVI
  svideo(m, -L / 2, -35 * mm)
  dsub(m, -L / 2, -9.4 * mm, { dir: -1, insulator: cardMats.vgaBlue })
  dvi(m, -L / 2, 36.8 * mm)
  bracket(m, -L / 2 - 0.0005, { top: -60 * mm, bottom: 66 * mm, dir: -1 })

  return m.build()
}
