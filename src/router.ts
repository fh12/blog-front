import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
  // mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import(/* webpackChunkName: "home" */ "./views/home.vue")
    },
    {
      path: "/articles",
      name: "articles",
      // route level code-splitting
      // this generates a separate chunk (articles.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "articles" */ "./views/articles.vue")
    },
    {
      path: "/myblog",
      name: "admin",
      component: () =>
        import(/* webpackChunkName: "archive" */ "./views/admin.vue")
    },
    {
      path: "/user",
      name: "user",
      component: () =>
        import(/* webpackChunkName: "archive" */ "./views/userCenter.vue")
    },
    {
      path: "/newblog",
      name: "newblog",
      component: () =>
        import(/* webpackChunkName: "archive" */ "./views/newblog.vue")
    },
    {
      path: "/editblog",
      name: "editblog",
      component: () =>
        import(/* webpackChunkName: "archive" */ "./views/edit.vue")
    },
    {
      path: "/message",
      name: "message",
      component: () =>
        import(/* webpackChunkName: "message" */ "./views/message.vue")
    },
    {
      path: "/about",
      name: "about",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/articleDetail.vue")
    },
    {
      path: "/articleDetail",
      name: "articleDetail",
      component: () =>
        import(/* webpackChunkName: "articleDetail" */ "./views/articleDetail.vue")
    }
  ]
});
