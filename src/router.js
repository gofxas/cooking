import { createRouter, createWebHistory } from "vue-router";
import Index from "./Index.vue";
import About from "./About.vue";
import Setting from "./Setting.vue";

const router = createRouter({
  history: createWebHistory("/"),
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
    },
    {
      path: "/about",
      name: "about",
      component: About,
    },
    {
      path: "/setting",
      name: "setting",
      component: Setting,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const visited = localStorage.getItem("visited");
  if (to.name != "about" && !visited) {
    next("/about");
  } else {
    next();
  }
});

export default router;
