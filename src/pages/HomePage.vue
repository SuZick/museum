<!-- Главная страница: вступление и список экспонатов по эпохам -->
<script setup>
import { eras, exhibitsOfEra, catalogNumber } from '../data/exhibits.js'
</script>

<template>
  <main class="home">
    <section class="hero">
      <h1>Музей вычислительной техники</h1>
      <p class="lead">
        Здесь собрана старая вычислительная техника: от счётов до ноутбуков. Нажмите на экспонат,
        чтобы покрутить его 3D-модель и почитать про него.
      </p>
    </section>

    <!-- v-for повторяет блок для каждой эпохи из data/exhibits.js -->
    <section v-for="era in eras" :key="era.id" class="era">
      <header class="era-header">
        <h2>{{ era.title }}</h2>
        <p class="era-period">{{ era.period }}</p>
      </header>

      <ul class="catalog">
        <li v-for="exhibit in exhibitsOfEra(era.id)" :key="exhibit.id">
          <RouterLink :to="'/exhibit/' + exhibit.id" class="catalog-item">
            <span class="catalog-number">{{ catalogNumber(exhibit) }}</span>
            <span class="catalog-name">{{ exhibit.name }}</span>
            <span class="catalog-meta">{{ exhibit.type }}, {{ exhibit.year }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>
  </main>
</template>
