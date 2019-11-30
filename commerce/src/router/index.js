import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/index';
import login from '@/components/login';
import User from '@/components/user';
import Ro from '@/components/roles';
import NotFound from '@/components/404';
import Rights from '@/components/rights';
import Goods from '@/components/goods';
import GoodsAdd from '@/components/goodsadd';
import Reports from '@/components/reports';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/login',
      component: login,
    },
    {
      path: '/',
      component: Index,
    },
    {
      path: '/',
      component: Index,
      children: [
        {
          path: '/users',
          component: User,
        },
        {
          path: '/roles',
          component: Ro,
        },
        {
          path: '/rights',
          component: Rights,
        },
        {
          path: '/goods',
          component: Goods,
        },
        {
          path: '/goods/add',
          component: GoodsAdd,
        },
        {
          path: '/reports',
          component: Reports,
        },
        {
          path: '*',
          component: NotFound,
        },
      ],
    },
  ],
});
