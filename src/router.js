import { createRouter, createWebHistory } from 'vue-router'
import { setPageMeta } from './lib/head.js'
import HomeView from './views/HomeView.vue'
import EpisodesView from './views/EpisodesView.vue'
import WatchView from './views/WatchView.vue'
import AboutView from './views/AboutView.vue'
import NotFoundView from './views/NotFoundView.vue'

export function createAppRouter(history = createWebHistory()) {
  const router = createRouter({
    history,
    routes: [
      {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { title: 'UrbanWild · Saving the wild, one life at a time' },
      },
      { path: '/episodes', name: 'episodes', component: EpisodesView, meta: { title: 'Episodes · UrbanWild' } },
      { path: '/episodes/:key', name: 'watch', component: WatchView },
      { path: '/about', name: 'about', component: AboutView, meta: { title: 'About · UrbanWild' } },
      {
        path: '/learn',
        name: 'learn',
        redirect: (to) =>
          to.query.key
            ? { name: 'watch', params: { key: String(to.query.key) } }
            : { name: 'episodes' },
      },
      {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFoundView,
        meta: { title: 'Page not found · UrbanWild' },
      },
    ],
    scrollBehavior: (to, from, savedPosition) => savedPosition || { top: 0 },
  })

  router.afterEach((to) => {
    if (to.meta.title) setPageMeta({ title: to.meta.title })
  })

  return router
}
