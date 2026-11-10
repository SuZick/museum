// 3D-модель матричного принтера Robotron K 6312 M (ГДР): светлый корпус со скруглённым передним краем,
// чёрная полоса с названием и кнопками, щель для бумаги сверху сзади.
import { ModelBuilder, material, textPlane } from './lib.js'

const plastic = material('Корпус', 0xd2cbb6, { roughness: 0.6 })
const cover = material('Крышка', 0xc6bea7, { roughness: 0.6 })
const black = material('Полоса', 0x161616, { roughness: 0.5 })
const button = material('Кнопки', 0xe4e0d4, { roughness: 0.5 })
const knob = material('Ручка валика', 0x2a2a2a, { roughness: 0.5 })
const ledRed = material('Индикатор', 0xff4a3a, { emissive: 0xff2010, emissiveIntensity: 0.7 })
const ledGreen = material('Индикатор 2', 0x4ad46e, { emissive: 0x20c050, emissiveIntensity: 0.7 })

const W = 0.6
const D = 0.4
const FRONT = D / 2

export default function buildRobotronK6312M() {
  const m = new ModelBuilder('Robotron K 6312 M')

  // Корпус и приподнятая крышка механизма
  m.roundedBox([W, 0.11, D], 0.035, plastic, { position: [0, 0.055, 0] })
  m.roundedBox([0.52, 0.03, 0.22], 0.012, cover, { position: [0, 0.112, -0.05] })
  m.box([0.46, 0.004, 0.03], black, { position: [0, 0.1265, -0.1] }) // щель для бумаги

  // Чёрная полоса спереди: надпись слева, кнопки и индикаторы справа
  m.box([0.53, 0.03, 0.004], black, { position: [0, 0.052, FRONT + 0.001] })
  m.object(textPlane('Надпись', 0.22, 0.016, 'robotron  K 6312 M', { italic: true, align: 'left', size: 0.75 }), {
    position: [-0.15, 0.052, FRONT + 0.0035],
  })
  for (let i = 0; i < 5; i++) m.roundedBox([0.016, 0.01, 0.006], 0.002, button, { position: [0.12 + i * 0.026, 0.052, FRONT + 0.004] })
  m.box([0.004, 0.003, 0.002], ledGreen, { position: [0.085, 0.058, FRONT + 0.0035] })
  m.box([0.004, 0.003, 0.002], ledRed, { position: [0.085, 0.047, FRONT + 0.0035] })

  // Ручка валика справа
  m.cylinder(0.022, 0.02, knob, { position: [W / 2 + 0.01, 0.08, -0.05], rotation: [0, 0, Math.PI / 2] }, 20)

  // Сзади — разъём кассеты интерфейса
  m.box([0.08, 0.03, 0.006], black, { position: [0.12, 0.05, -FRONT - 0.002] })

  return m.build()
}
