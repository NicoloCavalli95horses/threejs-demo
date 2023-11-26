// ==============
// Import
// ==============
import { 
  createRouter,
  createWebHistory
} from "vue-router";

// ==============
// Router
// ==============
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "nav",
      component: () => import("../views/Nav.vue"),
    },
    {
      path: "/basics",
      name: "basics",
      component: () => import("../views/Basics.vue"),
    },
    {
      path: "/animations",
      name: "animations",
      component: () => import("../views/Animations.vue"),
    },
    {
      path: "/camera",
      name: "camera",
      component: () => import("../views/Camera.vue"),
    },
  ],
});

export default router;
