// Общий шаблон ноутбука: корпус с клавиатурой и откинутая крышка с экраном.
import { ModelBuilder, canvasPlane, textPlane, frameGeometry, placeKeys, FACE_UP } from './lib.js'

export function laptop(
  m,
  {
    width,
    depth,
    baseHeight,
    lidLength,
    lidThickness = 0.012,
    openAngle = 110, // угол раскрытия крышки в градусах (90 — вертикально)
    bodyMat,
    lidMat = bodyMat,
    bezelMat,
    wellMat, // подложка под клавишами
    screen, // { width, height, centerY, draw, glow }
    keys, // { rows, pitch, z0, height }
    bezelLabel, // { text, color }
    lidLogo, // { text, color }
    baseLabel, // { text, color, z, width } — надпись на корпусе за клавиатурой
  },
) {
  // Корпус
  m.roundedBox([width, baseHeight, depth], 0.006, bodyMat, { position: [0, baseHeight / 2, 0] })

  // Клавиатура
  const units = Math.max(...keys.rows.map((row) => row.reduce((sum, [u]) => sum + u, 0)))
  const kbWidth = units * keys.pitch
  const kbDepth = keys.rows.length * keys.pitch
  m.box([kbWidth + 0.006, 0.0006, kbDepth + 0.006], wellMat, {
    position: [0, baseHeight + 0.0003, keys.z0 - keys.pitch / 2 + kbDepth / 2],
  })
  placeKeys(m, keys.rows, {
    x0: -kbWidth / 2,
    z0: keys.z0,
    pitch: keys.pitch,
    gap: keys.pitch * 0.17,
    height: keys.height ?? 0.004,
    surfaceY: () => baseHeight,
  })

  if (baseLabel) {
    // Надпись по центру корпуса, ширина таблички — не больше корпуса
    const labelWidth = Math.min(baseLabel.width ?? 0.12, width - 0.02)
    m.object(textPlane('Надпись на корпусе', labelWidth, 0.009, baseLabel.text, { color: baseLabel.color }), {
      position: [0, baseHeight + 0.0003, baseLabel.z],
      rotation: FACE_UP,
    })
  }

  // Шарниры
  const hingeZ = -depth / 2 + lidThickness
  for (const side of [-1, 1]) {
    m.cylinder(0.007, 0.04, bodyMat, { position: [side * (width / 2 - 0.035), baseHeight, hingeZ], rotation: [0, 0, Math.PI / 2] }, 16)
  }

  // Крышка строится отдельно (как будто стоит вертикально), потом поворачивается на шарнирах
  const lid = new ModelBuilder('Крышка')
  lid.roundedBox([width, lidLength, lidThickness], 0.005, lidMat, { position: [0, lidLength / 2, -lidThickness / 2] })
  lid.add(
    frameGeometry(
      { width: screen.width + 0.016, height: screen.height + 0.016, radius: 0.004 },
      { width: screen.width, height: screen.height, radius: 0.001 },
      0.002,
    ),
    bezelMat,
    { position: [0, screen.centerY, 0] },
  )
  lid.object(canvasPlane('Экран', screen.width, screen.height, screen.draw, { transparent: false, glow: screen.glow ?? 0.5, pixelsPerMeter: 3500 }), {
    position: [0, screen.centerY, 0.0006],
  })
  if (bezelLabel) {
    lid.object(textPlane('Надпись под экраном', 0.07, 0.008, bezelLabel.text, { color: bezelLabel.color }), {
      position: [0, screen.centerY - screen.height / 2 - 0.009, 0.0025],
    })
  }
  if (lidLogo) {
    lid.object(textPlane('Логотип на крышке', 0.09, 0.016, lidLogo.text, { color: lidLogo.color }), {
      position: [0, lidLength * 0.55, -lidThickness - 0.0006],
      rotation: [0, Math.PI, 0],
    })
  }
  const tilt = -((openAngle - 90) * Math.PI) / 180
  m.object(lid.build(), { position: [0, baseHeight, hingeZ], rotation: [tilt, 0, 0] })
}

// Типовая раскладка клавиатуры ноутбука на 15 «шагов» в ширину
export function laptopRows(K, G) {
  const k = (n) => Array(n).fill([1, K])
  return [
    Array(15).fill([1, G]),
    [...k(13), [2, G]],
    [[1.5, G], ...k(12), [1.5, K]],
    [[1.75, G], ...k(11), [2.25, G]],
    [[2.25, G], ...k(10), [1.75, G], [1, K]],
    [[1.5, G], [1.5, G], [6, K], [1.5, G], [1.5, G], [1, G], [1, G], [1, G]],
  ]
}
