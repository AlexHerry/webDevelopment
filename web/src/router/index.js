import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/index';
import Login from '@/components/login';
import Users from '@/components/users';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/users',
          component: Users,
        },
      ],
    },
  ],
});
