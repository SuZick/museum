<!--
  Окно с 3D-моделью. Внутри — готовый компонент <model-viewer> от Google:
  он сам умеет вращать модель (мышью или пальцем) и приближать (колесо мыши или два пальца).
  Если у экспоната ещё нет модели, показывается заглушка.
-->
<script setup>
import { computed } from 'vue'

// 3D-движок весит ~300 КБ, поэтому загружаем его только когда открыта страница экспоната,
// а не сразу на главной — так главная быстрее открывается на телефоне.
import('@google/model-viewer')

const props = defineProps({
  model: { type: String, default: null }, // имя файла из public/models, например 'agat.glb'
  alt: { type: String, default: '3D-модель экспоната' },
  // Начальный ракурс: «угол по кругу, угол от вертикали, расстояние».
  // По умолчанию — «три четверти» чуть справа и сверху.
  view: { type: String, default: '30deg 72deg auto' },
})

// BASE_URL — корень сайта; так путь к модели будет верным и локально, и на хостинге
const modelUrl = computed(
  () => import.meta.env.BASE_URL + 'models/' + (props.model ?? 'placeholder.glb'),
)
</script>

<template>
  <div class="viewer">
    <!--
      camera-controls  — вращение и приближение
      camera-orbit     — начальный ракурс (см. view выше)
      touch-action     — на телефоне вертикальный свайп листает страницу, горизонтальный — вращает модель
      auto-rotate      — медленное вращение, пока посетитель ничего не трогает
      disable-pan      — модель нельзя «утащить» из центра
    -->
    <model-viewer
      :src="modelUrl"
      :alt="alt"
      camera-controls
      :camera-orbit="view"
      touch-action="pan-y"
      disable-pan
      auto-rotate
      auto-rotate-delay="2000"
      rotation-per-second="18deg"
      interaction-prompt="none"
      environment-image="neutral"
      exposure="1.05"
      shadow-intensity="1"
      shadow-softness="0.9"
    ></model-viewer>

    <p v-if="!model" class="viewer-note">3D-модель готовится</p>
    <p class="viewer-hint viewer-hint--mouse">Крутите мышкой, колёсико - приблизить</p>
    <p class="viewer-hint viewer-hint--touch">Крутите пальцем, двумя пальцами - приблизить</p>
  </div>
</template>
