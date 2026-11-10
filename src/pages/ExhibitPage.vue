<!-- Страница экспоната: на телефоне модель сверху и текст снизу, на компьютере модель слева (2/3) и текст справа -->
<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { eras, findExhibit, catalogNumber } from '../data/exhibits.js'
import ModelViewer from '../components/ModelViewer.vue'

// id экспоната берём из адреса страницы: #/exhibit/agat → 'agat'
const route = useRoute()
const exhibit = computed(() => findExhibit(route.params.id))
const era = computed(() => eras.find((e) => e.id === exhibit.value?.era))
</script>

<template>
  <main v-if="exhibit" class="exhibit">
    <div class="exhibit-stage">
      <ModelViewer :model="exhibit.model" :view="exhibit.view" :alt="'3D-модель: ' + exhibit.name" />
    </div>

    <article class="exhibit-info">
      <RouterLink to="/" class="back-link">← Назад к списку</RouterLink>

      <h1>{{ exhibit.name }}</h1>
      <p class="exhibit-subtitle">Экспонат {{ catalogNumber(exhibit) }}. {{ era.title }}</p>

      <!-- Вступление: коротко, что это за экспонат -->
      <p v-if="exhibit.summary" class="exhibit-lead">{{ exhibit.summary }}</p>

      <section class="exhibit-section">
        <h2>Характеристики</h2>
        <table class="specs">
          <tbody>
            <tr>
              <th>Тип</th>
              <td>{{ exhibit.type }}</td>
            </tr>
            <tr>
              <th>Годы выпуска</th>
              <td>{{ exhibit.year }}</td>
            </tr>
            <tr v-for="row in exhibit.specs" :key="row[0]">
              <th>{{ row[0] }}</th>
              <td>{{ row[1] }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Разделы описания: «История», «Как работает» и т.д. -->
      <section v-for="section in exhibit.sections" :key="section.title" class="exhibit-section">
        <h2>{{ section.title }}</h2>
        <p v-for="(paragraph, index) in section.text" :key="index">{{ paragraph }}</p>
      </section>

      <section v-if="!exhibit.sections?.length" class="exhibit-section">
        <h2>Описание</h2>
        <p class="placeholder">Описание экспоната готовится.</p>
      </section>

      <!-- Интересный факт -->
      <aside v-if="exhibit.fact" class="exhibit-fact">
        <p><span class="fact-title">Интересно:</span> {{ exhibit.fact }}</p>
      </aside>

      <section v-if="exhibit.sources?.length" class="exhibit-sources">
        <h2>Источники</h2>
        <ol>
          <li v-for="source in exhibit.sources" :key="source.url">
            <a :href="source.url" target="_blank" rel="noopener">{{ source.title }}</a>
          </li>
        </ol>
      </section>
    </article>
  </main>

  <main v-else class="not-found">
    <h1>Экспонат не найден</h1>
    <RouterLink to="/" class="back-link">← Назад к списку</RouterLink>
  </main>
</template>
