import Layout from '@/views/layout/Layout'

/**
 * 报表
 */
const reportRouter = {
  path: '/report',
  component: Layout,
  redirect: '/report/bill_list',
  name: 'Report',
  meta: {
    title: '报表',
    icon: 'table',
  },
  children: [
    {
      path: 'base',
      component: () => import('@/z/report/index'),
      name: 'report_base',
      meta: {title: '基本查询'},
      redirect: '/report/base/chain/purchase',
      children: [
        {
          path: 'chain',
          component: () => import('@/z/report/index'),
          name: 'chain',
          meta: {title: '供应链', power: 'bill_chain_purchase'},
          redirect: '/report/base/chain/purchase',
          children: [
            {
              path: 'purchase',
              component: () => import('@/z/report/base/chain/purchase'),
              name: 'report_purchase',
              meta: {title: '采购单'}
            },
            {
              path: 'order',
              component: () => import('@/z/report/base/chain/order'),
              name: 'report_order',
              meta: {title: '订货单'}
            },
            {
              path: 'delivery',
              component: () => import('@/z/report/base/chain/delivery'),
              name: 'report_delivery',
              meta: {title: '配货单'}
            }
          ]
        },
        {
          path: 'warehouse',
          component: () => import('@/z/report/index'),
          name: 'report_warehouse',
          meta: {title: '仓库管理'},
          redirect: '/report/base/warehouse/supplier2warehouse',
          children: [
            {
              path: 'supplier2warehouse',
              component: () => import('@/z/report/base/warehouse/supplier2warehouse'),
              name: 'report_supplier2warehouse',
              meta: {title: '厂家来货'}
            },
            {
              path: 'warehouse2channel',
              component: () => import('@/z/report/base/warehouse/warehouse2channel'),
              name: 'report_warehouse2channel',
              meta: {title: '仓库出货'}
            },
            {
              path: 'warehouse2supplier',
              component: () => import('@/z/report/base/warehouse/warehouse2supplier'),
              name: 'report_warehouse2supplier',
              meta: {title: '仓库退货'}
            },
            {
              path: 'inwarehouse',
              component: () => import('@/z/report/base/warehouse/inwarehouse'),
              name: 'report_inwarehouse',
              meta: {title: '仓库收退货'}
            },
            {
              path: 'warehouse_inventory',
              component: () => import('@/z/report/base/warehouse/warehouse_inventory'),
              name: 'report_warehouse_inventory',
              meta: {title: '仓库盘点'}
            },
            {
              path: 'warehouse_loss',
              component: () => import('@/z/report/base/warehouse/warehouse_loss'),
              name: 'report_warehouse_loss',
              meta: {title: '仓库损益'}
            }
          ]
        },
        {
          path: 'channel',
          component: () => import('@/z/report/index'),
          name: 'report_channel',
          meta: {title: '渠道管理'},
          redirect: '/report/base/channel/inchannel',
          children: [
            {
              path: 'inchannel',
              component: () => import('@/z/report/base/channel/inchannel'),
              name: 'report_inchannel',
              meta: {title: '渠道收货'}
            },
            {
              path: 'channel2channel_out',
              component: () => import('@/z/report/base/channel/channel2channel_out'),
              name: 'report_channel2channel_out',
              meta: {title: '渠道调出'}
            },
            {
              path: 'channel2channel_in',
              component: () => import('@/z/report/base/channel/channel2channel_in'),
              name: 'report_channel2channel_in',
              meta: {title: '渠道调入'}
            },
            {
              path: 'channel2warehouse',
              component: () => import('@/z/report/base/channel/channel2warehouse'),
              name: 'report_channel2warehouse',
              meta: {title: '渠道退货'}
            },
            {
              path: 'supplier2channel',
              component: () => import('@/z/report/base/channel/supplier2channel'),
              name: 'report_supplier2channel',
              meta: {title: '渠道采购收货'}
            },
            {
              path: 'channel2supplier',
              component: () => import('@/z/report/base/channel/channel2supplier'),
              name: 'report_channel2supplier',
              meta: {title: '渠道采购退货'}
            },
            {
              path: 'channel_inventory',
              component: () => import('@/z/report/base/channel/channel_inventory'),
              name: 'report_channel_inventory',
              meta: {title: '渠道盘点'}
            },
            {
              path: 'channel_loss',
              component: () => import('@/z/report/base/channel/channel_loss'),
              name: 'report_channel_loss',
              meta: {title: '渠道损益'}
            },
            {
              path: 'notice_channel2channel_out',
              component: () => import('@/z/report/base/channel/notice_channel2channel_out'),
              name: 'report_notice_channel2channel_out',
              meta: {title: '渠道调出通知单'}
            }
          ]
        },
        {
          path: 'pos',
          component: () => import('@/z/report/index'),
          name: 'report_pos',
          meta: {title: '销售查询'},
          redirect: '/report/base/pos/pos',
          children: [
            {
              path: 'pos',
              component: () => import('@/z/report/base/pos/pos'),
              name: 'report_pos',
              meta: {title: '销售查询'}
            }
          ]
        }
      ]
    },
    {
      path: 'cross',
      component: () => import('@/z/diy/cash/list'),
      name: 'cross_report',
      meta: {title: '交叉查询'}
    }
  ]
}
export default reportRouter
