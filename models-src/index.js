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
import tridentTvga9000i from './trident-tvga9000i.js'
import matroxMystique from './matrox-mystique.js'
import gigabyte6600gt from './gigabyte-6600gt.js'
import xfx6600gt from './xfx-6600gt.js'
import palit8400gs from './palit-8400gs.js'
import geforce9500gt from './geforce-9500gt.js'
import intel486dx2 from './intel-486dx2.js'
import intelPentium from './intel-pentium.js'
import intelCeleron from './intel-celeron.js'
import amdSocketA from './amd-socket-a.js'
import amdPhenomII from './amd-phenom-ii.js'
import perfokarta from './perfokarta.js'
import bobina from './bobina.js'
import qicCartridge from './qic-cartridge.js'
import dc2120Cartridge from './dc2120-cartridge.js'
import mk60Cassette from './mk-60-cassette.js'
import romCartridge from './rom-cartridge.js'
import opticalDisc from './optical-disc.js'
import miniCd from './mini-cd.js'

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
  'trident-tvga9000i': tridentTvga9000i,
  'matrox-mystique': matroxMystique,
  'gigabyte-6600gt': gigabyte6600gt,
  'xfx-6600gt': xfx6600gt,
  'palit-8400gs': palit8400gs,
  'geforce-9500gt': geforce9500gt,
  'intel-486dx2': intel486dx2,
  'intel-pentium': intelPentium,
  'intel-celeron': intelCeleron,
  'amd-socket-a': amdSocketA,
  'amd-phenom-ii': amdPhenomII,
  perfokarta,
  bobina,
  'qic-cartridge': qicCartridge,
  'dc2120-cartridge': dc2120Cartridge,
  'mk-60-cassette': mk60Cassette,
  'rom-cartridge': romCartridge,
  'optical-disc': opticalDisc,
  'mini-cd': miniCd,
}
