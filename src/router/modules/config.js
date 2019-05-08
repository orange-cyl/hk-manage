// 系统设置的路由配置
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const configRouter = {
  path: '/config',
  component: Layout,
  redirect: 'noredirect',
  name: '系统设置',
  meta: {
    title: '系统设置',
    icon: 'nested'
  },
  children: [
    {
      path: 'user',
      component: () => import('@/pages/config/user/Layout.vue'),
      name: 'user',
      meta: { title: '用户管理' }
    },
    {
      path: 'role',
      name: 'role',
      component: () => import('@/pages/config/role/Layout.vue'),
      meta: { title: '权限管理' }
    }
  ]
}

export default configRouter
