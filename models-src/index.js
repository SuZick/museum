// Список всех моделей, которые умеет собирать сборщик (builder.html).
// Ключ — имя файла модели (без .glb), значение — функция, которая строит модель.
import schety from './schety.js'
import feliksM from './feliks-m.js'
import b325a from './elektronika-b3-25a.js'
import agat from './agat.js'
import iskra1256 from './iskra-1256.js'
import laserXt3 from './laser-xt3.js'
import epsonLq1050 from './epson-lq-1050.js'
import robotronK6312m from './robotron-k6312m.js'
import vefSigno from './vef-signo.js'
import motherboardVlsi from './motherboard-286-vlsi.js'
import motherboardHeadland from './motherboard-286-headland.js'
import leadingTechnology9000lt from './leading-technology-9000lt.js'
import panasonicCfM32 from './panasonic-cf-m32.js'
import easymouse from './easymouse.js'
import citizenMb165r from './citizen-mb-165r.js'
import ericssonDt290 from './ericsson-dt290.js'

export const models = {
  schety,
  'feliks-m': feliksM,
  'elektronika-b3-25a': b325a,
  agat,
  'iskra-1256': iskra1256,
  'laser-xt3': laserXt3,
  'epson-lq-1050': epsonLq1050,
  'robotron-k6312m': robotronK6312m,
  'vef-signo': vefSigno,
  'motherboard-286-vlsi': motherboardVlsi,
  'motherboard-286-headland': motherboardHeadland,
  'leading-technology-9000lt': leadingTechnology9000lt,
  'panasonic-cf-m32': panasonicCfM32,
  easymouse,
  'citizen-mb-165r': citizenMb165r,
  'ericsson-dt290': ericssonDt290,
}
