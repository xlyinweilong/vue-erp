import Layout from '@/views/layout/Layout'

/**
 * 资料中心
 */
const infoRouter = {
  path: '/info',
  component: Layout,
  redirect: '/info/base/goods',
  name: 'Info',
  meta: {
    title: '资料中心',
    icon: 'table'
  },
  children: [
    {
      path: 'base',
      component: () => import('@/z/info/base/index'),
      name: 'base',
      meta: {title: '基本资料'}
    },
    {
      path: 'supplier',
      component: () => import('@/z/info/supplier/list'),
      name: 'supplier',
      meta: {title: '供应商资料'}
    },
    {
      path: 'supplier_create',
      component: () => import('@/z/info/supplier/detail'),
      name: 'supplier_create',
      hidden: true,
      meta: {title: '供应商资料-新增'}
    },
    {
      path: 'supplier_update/:id',
      component: () => import('@/z/info/supplier/detail'),
      name: 'supplier_update',
      hidden: true,
      meta: {title: '供应商资料-修改'}
    },
    {
      path: 'supplier_detail/:id',
      component: () => import('@/z/info/supplier/detail'),
      name: 'supplier_detail',
      hidden: true,
      meta: {title: '供应商资料-详情'}
    },
    {
      path: 'warehouse',
      component: () => import('@/z/info/warehouse/list'),
      name: 'warehouse',
      meta: {title: '仓库资料'}
    },
    {
      path: 'warehouse_create',
      component: () => import('@/z/info/warehouse/detail'),
      name: 'warehouse_create',
      hidden: true,
      meta: {title: '仓库资料-新增'}
    },
    {
      path: 'warehouse_update/:id',
      component: () => import('@/z/info/warehouse/detail'),
      name: 'warehouse_update',
      hidden: true,
      meta: {title: '仓库资料-修改'}
    },
    {
      path: 'warehouse_detail/:id',
      component: () => import('@/z/info/warehouse/detail'),
      name: 'warehouse_detail',
      hidden: true,
      meta: {title: '仓库资料-详情'}
    },
    {
      path: 'channel',
      component: () => import('@/z/info/channel/list'),
      name: 'channel',
      meta: {title: '渠道资料'}
    },
    {
      path: 'channel_create',
      component: () => import('@/z/info/channel/detail'),
      name: 'channel_create',
      hidden: true,
      meta: {title: '渠道资料-新增'}
    },
    {
      path: 'channel_update/:id',
      component: () => import('@/z/info/channel/detail'),
      name: 'channel_update',
      hidden: true,
      meta: {title: '渠道资料-修改'}
    },
    {
      path: 'channel_detail/:id',
      component: () => import('@/z/info/channel/detail'),
      name: 'channel_detail',
      hidden: true,
      meta: {title: '渠道资料-详情'}
    },
    {
      path: 'goods',
      component: () => import('@/z/info/goods/list'),
      name: 'goods',
      meta: {title: '货品资料'}
    },
    {
      path: 'goods_create',
      component: () => import('@/z/info/goods/detail'),
      name: 'goods_create',
      hidden: true,
      meta: {title: '货品资料-新增'}
    },
    {
      path: 'goods_update/:id',
      component: () => import('@/z/info/goods/detail'),
      name: 'goods_update',
      hidden: true,
      meta: {title: '货品资料-修改'}
    },
    {
      path: 'goods_detail/:id',
      component: () => import('@/z/info/goods/detail'),
      name: 'goods_detail',
      hidden: true,
      meta: {title: '货品资料-详情'}
    },
    {
      path: 'barCode',
      component: () => import('@/z/info/barCode/list'),
      name: 'barCode',
      meta: {title: '条形码资料'}
    },
    {
      path: 'barCode_create',
      component: () => import('@/z/info/barCode/detail'),
      name: 'employ_create',
      hidden: true,
      meta: {title: '条形码资料-新增'}
    },
    {
      path: 'barCode_update/:id',
      component: () => import('@/z/info/barCode/detail'),
      name: 'barCode_update',
      hidden: true,
      meta: {title: '条形码资料-修改'}
    },
    {
      path: 'barCode_detail/:id',
      component: () => import('@/z/info/barCode/detail'),
      name: 'barCode_detail',
      hidden: true,
      meta: {title: '条形码资料-详情'}
    },
    {
      path: 'employ',
      component: () => import('@/z/info/employ/list'),
      name: 'employ',
      meta: {title: '员工资料'}
    },
    {
      path: 'employ_create',
      component: () => import('@/z/info/employ/detail'),
      name: 'employ_create',
      hidden: true,
      meta: {title: '员工资料-新增'}
    },
    {
      path: 'employ_update/:id',
      component: () => import('@/z/info/employ/detail'),
      name: 'employ_update',
      hidden: true,
      meta: {title: '员工资料-修改'}
    },
    {
      path: 'employ_detail/:id',
      component: () => import('@/z/info/employ/detail'),
      name: 'employ_detail',
      hidden: true,
      meta: {title: '员工资料-详情'}
    }
  ]
}
export default infoRouter
