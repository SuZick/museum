// 3D-модель оптического диска диаметром 12 см (фото photo_6_2026-11-16). Диск лежит рабочей стороной вверх:
// фиолетовый оттенок бывает у записываемых дисков (CD-R или DVD-R) — это цвет красителя,
// на который записывает лазер. По поверхности бегут радужные блики.
import { ModelBuilder } from './lib.js'
import { discBody, reflectiveLayer } from './discs.js'

export default function buildOpticalDisc() {
  const m = new ModelBuilder('Оптический диск 12 см')
  discBody(m, 0.06)
  reflectiveLayer(m, 'Рабочий слой диска', 0.0225, 0.0588, { base: '#7e76b8', tint: 'rgba(90, 60, 170, 0.18)' })
  return m.build()
}
