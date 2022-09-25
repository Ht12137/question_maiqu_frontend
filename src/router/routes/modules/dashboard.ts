import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const dashboard: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: LAYOUT,
  redirect: '/dashboard/analysis',
  meta: {
    orderNo: 10,
    icon: 'ion:grid-outline',
    title: t('routes.dashboard.dashboard'),
  },
  children: [
    {
      path: 'analysis',
      name: 'Analysis',
      component: () => import('/@/views/dashboard/analysis/index.vue'),
      meta: {
        // affix: true,
        title: t('routes.dashboard.analysis'),
      },
    },
    {
      path: 'workbench',
      name: 'Workbench',
      component: () => import('/@/views/dashboard/workbench/index.vue'),
      meta: {
        title: t('routes.dashboard.workbench'),
      },
    },
    {
      path:'pychotest',
      name:'pychotest',
      component: () => import('/@/views/dashboard/pychotest/index.vue'),
      meta: {
        title: t('routes.dashboard.pychotest'),
      },

    },
    {
      path:'usermanage',
      name:'usermanage',
      component: () => import('/@/views/manage/userManage/index.vue'),
      meta: {
        title: t('routes.dashboard.userManage'),
      },

    },
  ],
};

export default dashboard;
