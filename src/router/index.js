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
    {
      path: "/resizing",
      name: "resizing",
      component: () => import("../views/Resizing.vue"),
    },
    {
      path: "/geometry",
      name: "geometry",
      component: () => import("../views/Geometry.vue"),
    },
    {
      path: "/debug",
      name: "debug",
      component: () => import("../views/Debug.vue"),
    },
    {
      path: "/texture",
      name: "texture",
      component: () => import("../views/Texture.vue"),
    },
    {
      path: "/materials",
      name: "materials",
      component: () => import("../views/Materials.vue"),
    },
  ],
});

export default router;
