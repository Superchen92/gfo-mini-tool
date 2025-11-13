import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home/IndexContainer.vue'),
    },
    {
      path: '/quotationandconfirm',
      name: 'QuotationAndConfirm',
      component: () => import('../views/QuotationAndConfirm/IndexContainer.vue'),
    },
    {
      path: '/besttime',
      name: 'BestTime',
      component: () => import('../views/BestTime/IndexContainer.vue'),
    },
  ],
})

export default router
