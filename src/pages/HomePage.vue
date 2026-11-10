<!-- Главная страница: вступление и список экспонатов по эпохам -->
<script setup>
import { eras, exhibitsOfEra, catalogNumber } from '../data/exhibits.js'

const logo = import.meta.env.BASE_URL + 'logo.svg'
</script>

<template>
  <main class="home">
    <section class="hero">
      <img :src="logo" alt="" class="hero-logo" />
      <p class="eyebrow">Виртуальная экспозиция</p>
      <h1>Музей вычислительной техники</h1>
      <div class="rule"></div>
      <p class="lead">
        От деревянных счётов до первых ноутбуков. Выберите экспонат, чтобы рассмотреть его
        3D-модель со всех сторон и узнать его историю.
      </p>
    </section>

    <!-- v-for повторяет блок для каждой эпохи из data/exhibits.js -->
    <section v-for="era in eras" :key="era.id" class="era">
      <header class="era-header">
        <p class="era-period">{{ era.period }}</p>
        <h2>{{ era.title }}</h2>
      </header>

      <ul class="catalog">
        <li v-for="exhibit in exhibitsOfEra(era.id)" :key="exhibit.id">
          <RouterLink :to="'/exhibit/' + exhibit.id" class="catalog-item">
            <span class="catalog-number">{{ catalogNumber(exhibit) }}</span>
            <span class="catalog-name">{{ exhibit.name }}</span>
            <span class="catalog-meta">{{ exhibit.type }} · {{ exhibit.year }}</span>
          </RouterLink>
        </li>
      </ul>
    </section>
  </main>
</template>
