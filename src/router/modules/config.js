import Layout from '@/views/layout/Layout'

/**
 * 配置
 */
const configRouter = {
  path: '/config',
  component: Layout,
  redirect: '/config/sysconfig',
  name: 'config',
  meta: {
    title: '配置中心',
    icon: 'table'
    // power: 'info_'
  },
  children: [
    {
      path: 'sysconfig',
      component: () => import('@/z/config/sysconfig/sysconfig'),
      name: 'sysconfig',
      meta: {title: '系统配置'}
    },
    {
      path: 'payment',
      component: () => import('@/z/config/sysconfig/sysconfig'),
      name: 'payment',
      meta: {title: '支付方式'}
    }
  ]
}
export default configRouter
