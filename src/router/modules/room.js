// 系统设置的路由配置
/** When your routing table is too long, you can split it into small modules**/
import Layout from '@/views/layout/Layout'

const roomRouter = {
  path: '/room',
  component: Layout,
  redirect: 'noredirect',
  name: 'room',
  meta: {
    title: '机房建设',
    icon: 'nested'
  },
  children: [
    {
      path: 'manager',
      name: 'manager',
      component: () => import('@/pages/room/manager/Layout'),
      meta: { title: '机房管理' }
    },
    {
      path: 'deviceType',
      name: 'deviceType',
      component: () => import('@/pages/room/deviceType/Layout'),
      meta: { title: '设备类型' }
    },
    {
      path: 'device',
      name: 'device',
      component: () => import('@/pages/room/device/Layout'),
      meta: { title: '设备管理' }
    }
  ]
}

export default roomRouter
