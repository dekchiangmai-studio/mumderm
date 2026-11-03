import { createRouter, createWebHistory } from 'vue-router'
import { initializeAuth, useAuth } from '../lib/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/places',
      name: 'places',
      component: () => import('../views/PlacesView.vue'),
    },
    {
      path: '/places/:placeId',
      name: 'place-detail',
      component: () => import('../views/PlaceDetailView.vue'),
    },
    {
      path: '/places/:placeId/shot-points/:shotPointId',
      name: 'shot-point-detail',
      component: () => import('../views/ShotPointDetailView.vue'),
    },
    {
      path: '/places/:placeId/shot-points/:shotPointId/capture',
      name: 'capture',
      meta: { requiresAuth: true },
      component: () => import('../views/CaptureView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      meta: { requiresAuth: true },
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/my-submissions',
      name: 'my-submissions',
      meta: { requiresAuth: true },
      component: () => import('../views/MySubmissionsView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(async (to) => {
  await initializeAuth()
  const auth = useAuth()

  if (to.meta.requiresAuth && !auth.user) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'login' && auth.user) {
    return { name: 'profile' }
  }
})

export default router
