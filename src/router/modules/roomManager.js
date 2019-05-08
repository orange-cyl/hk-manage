// 系统设置的路由配置
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const roomManagerRouter = {
  path: '/roomManager',
  component: Layout,
  redirect: 'noredirect',
  name: 'roomManager',
  meta: {
    title: '机房管理',
    icon: 'nested'
  },
  children: [
    {
      path: 'monitor',
      name: 'monitor',
      component: () => import('@/views/nested/menu2/index'),
      meta: { title: '机房监控' }
    },
    {
      path: 'alarm',
      name: 'alarm',
      component: () => import('@/views/nested/menu2/index'),
      meta: { title: '报警管理' }
    }
  ]
}

export default roomManagerRouter
