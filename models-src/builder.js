// Сборщик моделей (работает только при запущенном `npm run dev`).
//   builder.html?model=iskra-1256          — показать одну модель (крутить мышью)
//   builder.html?model=iskra-1256&save=1   — и сохранить её в public/models/iskra-1256.glb
//   builder.html?model=all                 — миниатюры всех моделей с размером файлов
//   builder.html?model=all&save=1          — сохранить все модели разом
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { models } from './index.js'

const params = new URLSearchParams(location.search)
const id = params.get('model') ?? Object.keys(models)[0]
const save = params.has('save')
const status = document.getElementById('status')

document.getElementById('models').innerHTML = ['all', ...Object.keys(models)]
  .map((name) => `<a href="?model=${name}">${name}</a>`)
  .join('')

// ---------- Общее ----------
const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
renderer.setPixelRatio(devicePixelRatio)
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x2a2622)
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture
const camera = new THREE.PerspectiveCamera(30, 1, 0.001, 100)

// Поставить камеру вокруг модели: угол по горизонтали (0 — спереди) и по вертикали, в градусах
function aim(model, azimuth = 30, elevation = 20, zoom = 1) {
  const bounds = new THREE.Box3().setFromObject(model)
  const center = bounds.getCenter(new THREE.Vector3())
  const radius = bounds.getSize(new THREE.Vector3()).length() / 2
  const a = THREE.MathUtils.degToRad(azimuth)
  const e = THREE.MathUtils.degToRad(elevation)
  const dist = ((radius / Math.sin(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.05) / zoom
  camera.position.set(
    center.x + dist * Math.cos(e) * Math.sin(a),
    center.y + dist * Math.sin(e),
    center.z + dist * Math.cos(e) * Math.cos(a),
  )
  camera.near = dist / 100
  camera.far = dist * 10
  camera.updateProjectionMatrix()
  camera.lookAt(center)
  return center
}

async function exportModel(name, model) {
  const glb = await new GLTFExporter().parseAsync(model, { binary: true })
  let triangles = 0
  model.traverse((o) => {
    if (o.isMesh) triangles += (o.geometry.index?.count ?? o.geometry.attributes.position.count) / 3
  })
  let saved = ''
  if (save) {
    const response = await fetch(`/__save-model?name=${name}`, { method: 'POST', body: glb })
    saved = response.ok ? ' — сохранено' : ' — ОШИБКА сохранения'
  }
  return `${name}: ${Math.round(glb.byteLength / 1024)} КБ, ${triangles} треуг.${saved}`
}

if (save) history.replaceState(null, '', `?model=${id}`) // чтобы при перезагрузке не сохранять повторно

if (id === 'all') {
  // ---------- Миниатюры всех моделей ----------
  document.body.style.overflow = 'auto'
  const grid = document.createElement('div')
  grid.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:4px;padding:40px 4px 40px'
  document.body.append(grid)
  renderer.setPixelRatio(1)
  renderer.setSize(400, 300)
  camera.aspect = 4 / 3
  const report = []
  for (const name of Object.keys(models)) {
    const model = models[name]()
    scene.add(model)
    aim(model, 30, 25, 1.4)
    renderer.render(scene, camera)
    const line = await exportModel(name, model)
    report.push(line)
    grid.insertAdjacentHTML(
      'beforeend',
      `<figure style="margin:0"><img src="${renderer.domElement.toDataURL()}" style="width:100%">` +
        `<figcaption style="font-size:12px">${line}</figcaption></figure>`,
    )
    scene.remove(model)
  }
  status.textContent = `Готово: ${report.length} моделей`
  window.report = report
} else if (!models[id]) {
  status.textContent = `Нет модели «${id}»`
} else {
  // ---------- Одна модель ----------
  const model = models[id]()
  scene.add(model)
  renderer.setSize(innerWidth, innerHeight)
  camera.aspect = innerWidth / innerHeight
  document.body.prepend(renderer.domElement)
  const controls = new OrbitControls(camera, renderer.domElement)
  window.setView = (azimuth, elevation, zoom) => {
    controls.target.copy(aim(model, azimuth, elevation, zoom))
    controls.update()
  }
  window.setView()
  renderer.setAnimationLoop(() => renderer.render(scene, camera))
  const line = await exportModel(id, model)
  status.textContent = save ? line : `${line} — предпросмотр (добавьте &save=1 к адресу, чтобы сохранить)`
}
