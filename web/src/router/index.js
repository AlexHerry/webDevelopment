import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/components/index';
import Login from '@/components/login';
import Users from '@/components/users';
import Rights from '@/components/rights';
import Roles from '@/components/roles';
import Goods from '@/components/goods';
import AddGoods from '@/components/addGoods';
import EditGoods from '@/components/editGoods';
import Params from '@/components/params';

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
        {
          path: '/rights',
          component: Rights,
        },
        {
          path: '/roles',
          component: Roles,
        },
        {
          path: '/goods',
          component: Goods,
        },
        {
          path: '/goods/addGoods',
          component: AddGoods,
        },
        {
          path: '/goods/editGoods/:id',
          component: EditGoods,
        },
        {
          path: '/params',
          component: Params,
        },
      ],
    },
  ],
});
