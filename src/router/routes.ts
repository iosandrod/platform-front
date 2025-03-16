import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    meta: {
      title: '首页',
      renderMenu: false,
      icon: 'CreditCardOutlined',
    },
  },
  {
    path: '/login',
    name: '登录',
    meta: {
      icon: 'LoginOutlined',
      view: 'blank',
      target: '_blank',
      cacheable: false,
    },
    component: () => import('@/pages/login'),
  },
  {
    path: '/home',
    name: '首页',
    meta: {
      view: 'blank',
    },
    component: () => import('@/pages/home/Home'),
  },
  {
    path: "/config",
    name: "配置", 
    meta: {
      view: 'blank',
    },
    component: () => import('@/pages/home/Config1'),
  },
  { 
    path: '/403',
    name: '403',
    props: true,
    meta: {
      renderMenu: false,
    },
    component: () => import('@/pages/Exp403.vue'),
  },
  {
    path: '/:pathMatch(.*)*', 
    name: '404',
    props: true,
    meta: {
      icon: 'CreditCardOutlined',
      renderMenu: false,
      cacheable: false,
      _is404Page: true,
    },
    component: () => import('@/pages/Exp404.vue'),
  },
];

export default routes;
