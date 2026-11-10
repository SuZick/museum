<!-- Каркас сайта: шапка, текущая страница, подвал -->
<script setup>
// BASE_URL — корень сайта (так путь к логотипу верный и локально, и на хостинге)
const logo = import.meta.env.BASE_URL + 'logo.svg'
</script>

<template>
  <header class="site-header">
    <RouterLink to="/" class="brand">
      <img :src="logo" alt="" class="brand-logo" />
      Музей вычислительной техники
    </RouterLink>
  </header>

  <!-- Сюда Vue Router подставляет нужную страницу: главную или страницу экспоната -->
  <RouterView />

  <footer class="site-footer">Учебный проект, 2026</footer>
</template>
