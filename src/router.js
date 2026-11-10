import { createRouter, createWebHashHistory } from 'vue-router'
import HomePage from './pages/HomePage.vue'
import ExhibitPage from './pages/ExhibitPage.vue'

// Адреса страниц сайта:
//   #/                — главная со списком экспонатов
//   #/exhibit/agat    — страница экспоната (agat — его id из data/exhibits.js)
// Знак # в адресе нужен, чтобы сайт работал на любом статическом хостинге без настройки сервера.
export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: HomePage },
    { path: '/exhibit/:id', component: ExhibitPage },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  // При переходе на другую страницу — прокрутка в начало
  scrollBehavior: () => ({ top: 0 }),
})
