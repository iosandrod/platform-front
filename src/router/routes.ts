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
];

export default routes;
