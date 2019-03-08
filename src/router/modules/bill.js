import Layout from '@/views/layout/Layout'

/**
 * 单据
 */
const billRouter = {
  path: '/bill',
  component: Layout,
  redirect: '/bill/warehouse/supplier2warehouse',
  name: 'Bill',
  meta: {
    title: '运营中心',
    icon: 'table',
    power: 'bill_'
  },
  children: [
    {
      path: 'chain',
      component: () => import('@/z/bill/index'),
      name: 'chain',
      meta: {title: '供应链',power: 'bill_chain_'},
      redirect: '/bill/chain/purchase',
      children: [
        {
          path: 'purchase',
          component: () => import('@/z/bill/purchase/list'),
          name: 'purchase',
          meta: {title: '采购单', power: 'bill_chain_purchase'}
        },
        {
          path: 'purchase_create',
          component: () => import('@/z/bill/purchase/detail'),
          name: 'purchase_create',
          hidden: true,
          meta: {title: '采购单-新增'}
        },
        {
          path: 'purchase_update/:id',
          component: () => import('@/z/bill/purchase/detail'),
          name: 'purchase_update',
          hidden: true,
          meta: {title: '采购单-修改'}
        },
        {
          path: 'purchase_detail/:id',
          component: () => import('@/z/bill/purchase/info'),
          name: 'purchase_info',
          hidden: true,
          meta: {title: '采购单-详情'}
        },
        {
          path: 'order',
          component: () => import('@/z/bill/order/list'),
          name: 'order',
          meta: {title: '订货单',power: 'bill_chain_order'}
        },
        {
          path: 'order_create',
          component: () => import('@/z/bill/order/detail'),
          name: 'order_create',
          hidden: true,
          meta: {title: '订货单-新增'}
        },
        {
          path: 'order_update/:id',
          component: () => import('@/z/bill/order/detail'),
          name: 'order_update',
          hidden: true,
          meta: {title: '订货单-修改'}
        },
        {
          path: 'order_detail/:id',
          component: () => import('@/z/bill/order/info'),
          name: 'order_info',
          hidden: true,
          meta: {title: '订货单-详情'}
        },
        {
          path: 'delivery',
          component: () => import('@/z/bill/delivery/list'),
          name: 'delivery',
          meta: {title: '配货单',power: 'bill_chain_delivery'}
        },
        {
          path: 'delivery_create',
          component: () => import('@/z/bill/delivery/detail'),
          name: 'delivery_create',
          hidden: true,
          meta: {title: '配货单-新增'}
        },
        {
          path: 'delivery_update/:id',
          component: () => import('@/z/bill/delivery/detail'),
          name: 'delivery_update',
          hidden: true,
          meta: {title: '配货单-修改'}
        },
        {
          path: 'delivery_detail/:id',
          component: () => import('@/z/bill/delivery/info'),
          name: 'delivery_info',
          hidden: true,
          meta: {title: '配货单-详情'}
        }
      ]
    },
    {
      path: 'warehouse',
      component: () => import('@/z/bill/index'),
      name: 'Warehouse',
      meta: {title: '仓库管理',power: 'bill_warehouse_'},
      redirect: '/bill/warehouse/supplier2warehouse',
      children: [
        {
          path: 'supplier2warehouse',
          component: () => import('@/z/bill/supplier2warehouse/list'),
          name: 'supplier2warehouse',
          meta: {title: '厂家来货', power: 'bill_warehouse_cjlh'}
        },
        {
          path: 'supplier2warehouse_create',
          component: () => import('@/z/bill/supplier2warehouse/detail'),
          name: 'supplier2warehouse_create',
          hidden: true,
          meta: {title: '厂家来货-新增'}
        },
        {
          path: 'supplier2warehouse_update/:id',
          component: () => import('@/z/bill/supplier2warehouse/detail'),
          name: 'supplier2warehouse_update',
          hidden: true,
          meta: {title: '厂家来货-修改'}
        },
        {
          path: 'supplier2warehouse_detail/:id',
          component: () => import('@/z/bill/supplier2warehouse/info'),
          name: 'supplier2warehouse_info',
          hidden: true,
          meta: {title: '厂家来货-详情'}
        },
        {
          path: 'warehouse2channel',
          component: () => import('@/z/bill/warehouse2channel/list'),
          name: 'warehouse2channel',
          meta: {title: '仓库出货',power: 'bill_warehouse_ckch'}
        },
        {
          path: 'warehouse2channel_create',
          component: () => import('@/z/bill/warehouse2channel/detail'),
          name: 'warehouse2channel_create',
          hidden: true,
          meta: {title: '仓库出货-新增'}
        },
        {
          path: 'warehouse2channel_update/:id',
          component: () => import('@/z/bill/warehouse2channel/detail'),
          name: 'warehouse2channel_update',
          hidden: true,
          meta: {title: '仓库出货-修改'}
        },
        {
          path: 'warehouse2channel_detail/:id',
          component: () => import('@/z/bill/warehouse2channel/info'),
          name: 'warehouse2channel_info',
          hidden: true,
          meta: {title: '仓库出货-详情'}
        },
        {
          path: 'warehouse2supplier',
          component: () => import('@/z/bill/warehouse2supplier/list'),
          name: 'warehouse2supplier',
          meta: {title: '仓库退货',power: 'bill_warehouse_ckth'}
        },
        {
          path: 'warehouse2supplier_create',
          component: () => import('@/z/bill/warehouse2supplier/detail'),
          name: 'warehouse2supplier_create',
          hidden: true,
          meta: {title: '仓库退货-新增'}
        },
        {
          path: 'warehouse2supplier_update/:id',
          component: () => import('@/z/bill/warehouse2supplier/detail'),
          name: 'warehouse2supplier_update',
          hidden: true,
          meta: {title: '仓库退货-修改'}
        },
        {
          path: 'warehouse2supplier_detail/:id',
          component: () => import('@/z/bill/warehouse2supplier/info'),
          name: 'warehouse2supplier_info',
          hidden: true,
          meta: {title: '仓库退货-详情'}
        },
        {
          path: 'inwarehouse',
          component: () => import('@/z/bill/inwarehouse/list'),
          name: 'inwarehouse',
          meta: {title: '仓库收退货',power: 'bill_warehouse_cksth'}
        },
        {
          path: 'inwarehouse_create',
          component: () => import('@/z/bill/inwarehouse/detail'),
          name: 'inwarehouse_create',
          hidden: true,
          meta: {title: '仓库收退货-新增'}
        },
        {
          path: 'inwarehouse_update/:id',
          component: () => import('@/z/bill/inwarehouse/detail'),
          name: 'inwarehouse_update',
          hidden: true,
          meta: {title: '仓库收退货-修改'}
        },
        {
          path: 'inwarehouse_detail/:id',
          component: () => import('@/z/bill/inwarehouse/info'),
          name: 'inwarehouse_info',
          hidden: true,
          meta: {title: '仓库收退货-详情'}
        },
        {
          path: 'warehouse_inventory',
          component: () => import('@/z/bill/warehouse_inventory/list'),
          name: 'warehouse_inventory',
          meta: {title: '仓库盘点',power: 'bill_warehouse_ckpd'}
        },
        {
          path: 'warehouse_inventory_create',
          component: () => import('@/z/bill/warehouse_inventory/detail'),
          name: 'warehouse_inventory_create',
          hidden: true,
          meta: {title: '仓库盘点-新增'}
        },
        {
          path: 'warehouse_inventory_update/:id',
          component: () => import('@/z/bill/warehouse_inventory/detail'),
          name: 'warehouse_inventory_update',
          hidden: true,
          meta: {title: '仓库盘点-修改'}
        },
        {
          path: 'warehouse_inventory_detail/:id',
          component: () => import('@/z/bill/warehouse_inventory/info'),
          name: 'warehouse_inventory_info',
          hidden: true,
          meta: {title: '仓库盘点-详情'}
        },
        {
          path: 'warehouse_loss',
          component: () => import('@/z/bill/warehouse_loss/list'),
          name: 'warehouse_loss',
          meta: {title: '仓库损益',power: 'bill_warehouse_cksy'}
        },
        {
          path: 'warehouse_loss_create',
          component: () => import('@/z/bill/warehouse_loss/detail'),
          name: 'warehouse_loss_create',
          hidden: true,
          meta: {title: '仓库损益-新增'}
        },
        {
          path: 'warehouse_loss_update/:id',
          component: () => import('@/z/bill/warehouse_loss/detail'),
          name: 'warehouse_loss_update',
          hidden: true,
          meta: {title: '仓库损益-修改'}
        },
        {
          path: 'warehouse_loss_detail/:id',
          component: () => import('@/z/bill/warehouse_loss/info'),
          name: 'warehouse_loss_info',
          hidden: true,
          meta: {title: '仓库损益-详情'}
        },
        {
          path: 'warehouse_settlement',
          component: () => import('@/z/bill/warehouse_settlement/list'),
          name: 'warehouse_settlement',
          meta: {title: '仓库结存',power: 'bill_warehouse_settlement'}
        }
      ]
    },
    {
      path: 'channel',
      component: () => import('@/z/bill/index'),
      name: 'Channel',
      meta: {title: '渠道管理',power: 'bill_channel_'},
      redirect: '/bill/channel/supplier2channel',
      children: [
        {
          path: 'inchannel',
          component: () => import('@/z/bill/inchannel/list'),
          name: 'inchannel',
          meta: {title: '渠道收货',power: 'bill_channel_qdsh'}
        },
        {
          path: 'inchannel_create',
          component: () => import('@/z/bill/inchannel/detail'),
          name: 'inchannel_create',
          hidden: true,
          meta: {title: '渠道收货-新增'}
        },
        {
          path: 'inchannel_update/:id',
          component: () => import('@/z/bill/inchannel/detail'),
          name: 'inchannel_update',
          hidden: true,
          meta: {title: '渠道收货-修改'}
        },
        {
          path: 'inchannel_detail/:id',
          component: () => import('@/z/bill/inchannel/info'),
          name: 'inchannel_info',
          hidden: true,
          meta: {title: '渠道收货-详情'}
        },
        {
          path: 'channel2channel_out',
          component: () => import('@/z/bill/channel2channel_out/list'),
          name: 'channel2channel_out',
          meta: {title: '渠道调出',power: 'bill_channel_qddc'}
        },
        {
          path: 'channel2channel_out_create',
          component: () => import('@/z/bill/channel2channel_out/detail'),
          name: 'channel2channel_out_create',
          hidden: true,
          meta: {title: '渠道调出-新增'}
        },
        {
          path: 'channel2channel_out_update/:id',
          component: () => import('@/z/bill/channel2channel_out/detail'),
          name: 'channel2channel_out_update',
          hidden: true,
          meta: {title: '渠道调出-修改'}
        },
        {
          path: 'channel2channel_out_detail/:id',
          component: () => import('@/z/bill/channel2channel_out/info'),
          name: 'channel2channel_out_info',
          hidden: true,
          meta: {title: '渠道调出-详情'}
        },
        {
          path: 'channel2channel_in',
          component: () => import('@/z/bill/channel2channel_in/list'),
          name: 'channel2channel_in',
          meta: {title: '渠道调入',power: 'bill_channel_qddr'}
        },
        {
          path: 'channel2channel_in_create',
          component: () => import('@/z/bill/channel2channel_in/detail'),
          name: 'channel2channel_in_create',
          hidden: true,
          meta: {title: '渠道调入-新增'}
        },
        {
          path: 'channel2channel_in_update/:id',
          component: () => import('@/z/bill/channel2channel_in/detail'),
          name: 'channel2channel_in_update',
          hidden: true,
          meta: {title: '渠道调入-修改'}
        },
        {
          path: 'channel2channel_in_detail/:id',
          component: () => import('@/z/bill/channel2channel_in/info'),
          name: 'channel2channel_in_info',
          hidden: true,
          meta: {title: '渠道调入-详情'}
        },
        {
          path: 'channel2warehouse',
          component: () => import('@/z/bill/channel2warehouse/list'),
          name: 'channel2warehouse',
          meta: {title: '渠道退货',power: 'bill_channel_qdth'}
        },
        {
          path: 'channel2warehouse_create',
          component: () => import('@/z/bill/channel2warehouse/detail'),
          name: 'channel2warehouse_create',
          hidden: true,
          meta: {title: '渠道退货-新增'}
        },
        {
          path: 'channel2warehouse_update/:id',
          component: () => import('@/z/bill/channel2warehouse/detail'),
          name: 'channel2warehouse_update',
          hidden: true,
          meta: {title: '渠道退货-修改'}
        },
        {
          path: 'channel2warehouse_detail/:id',
          component: () => import('@/z/bill/channel2warehouse/info'),
          name: 'channel2warehouse_info',
          hidden: true,
          meta: {title: '渠道退货-详情'}
        },
        {
          path: 'supplier2channel',
          component: () => import('@/z/bill/supplier2channel/list'),
          name: 'supplier2channel',
          meta: {title: '渠道采购收货',power: 'bill_channel_qdcgsh'}
        },
        {
          path: 'supplier2channel_create',
          component: () => import('@/z/bill/supplier2channel/detail'),
          name: 'supplier2channel_create',
          hidden: true,
          meta: {title: '渠道采购收货-新增'}
        },
        {
          path: 'supplier2channel_update/:id',
          component: () => import('@/z/bill/supplier2channel/detail'),
          name: 'supplier2channel_update',
          hidden: true,
          meta: {title: '渠道采购收货-修改'}
        },
        {
          path: 'supplier2channel_detail/:id',
          component: () => import('@/z/bill/supplier2channel/info'),
          name: 'supplier2channel_info',
          hidden: true,
          meta: {title: '渠道采购收货-详情'}
        },
        {
          path: 'channel2supplier',
          component: () => import('@/z/bill/channel2supplier/list'),
          name: 'channel2supplier',
          meta: {title: '渠道采购退货',power: 'bill_channel_qdcgth'}
        },
        {
          path: 'channel2supplier_create',
          component: () => import('@/z/bill/channel2supplier/detail'),
          name: 'channel2supplier_create',
          hidden: true,
          meta: {title: '渠道采购退货-新增'}
        },
        {
          path: 'channel2supplier_update/:id',
          component: () => import('@/z/bill/channel2supplier/detail'),
          name: 'channel2supplier_update',
          hidden: true,
          meta: {title: '渠道采购退货-修改'}
        },
        {
          path: 'channel2supplier_detail/:id',
          component: () => import('@/z/bill/channel2supplier/info'),
          name: 'channel2supplier_info',
          hidden: true,
          meta: {title: '渠道采购退货-详情'}
        },
        {
          path: 'channel_inventory',
          component: () => import('@/z/bill/channel_inventory/list'),
          name: 'channel_inventory',
          meta: {title: '渠道盘点',power: 'bill_channel_qdpd'}
        },
        {
          path: 'channel_inventory_create',
          component: () => import('@/z/bill/channel_inventory/detail'),
          name: 'channel_inventory_create',
          hidden: true,
          meta: {title: '渠道盘点-新增'}
        },
        {
          path: 'channel_inventory_update/:id',
          component: () => import('@/z/bill/channel_inventory/detail'),
          name: 'channel_inventory_update',
          hidden: true,
          meta: {title: '渠道盘点-修改'}
        },
        {
          path: 'channel_inventory_detail/:id',
          component: () => import('@/z/bill/channel_inventory/info'),
          name: 'channel_inventory_info',
          hidden: true,
          meta: {title: '渠道盘点-详情'}
        },
        {
          path: 'channel_loss',
          component: () => import('@/z/bill/channel_loss/list'),
          name: 'channel_loss',
          meta: {title: '渠道损益',power: 'bill_channel_qdsy'}
        },
        {
          path: 'channel_loss_create',
          component: () => import('@/z/bill/channel_loss/detail'),
          name: 'channel_loss_create',
          hidden: true,
          meta: {title: '渠道损益-新增'}
        },
        {
          path: 'channel_loss_update/:id',
          component: () => import('@/z/bill/channel_loss/detail'),
          name: 'channel_loss_update',
          hidden: true,
          meta: {title: '渠道损益-修改'}
        },
        {
          path: 'channel_loss_detail/:id',
          component: () => import('@/z/bill/channel_loss/info'),
          name: 'channel_loss_info',
          hidden: true,
          meta: {title: '渠道损益-详情'}
        },
        {
          path: 'notice_channel2channel_out',
          component: () => import('@/z/bill/notice_channel2channel_out/list'),
          name: 'notice_channel2channel_out',
          meta: {title: '渠道调出通知单',power: 'bill_channel_nqddc'}
        },
        {
          path: 'notice_channel2channel_out_create',
          component: () => import('@/z/bill/notice_channel2channel_out/detail'),
          name: 'notice_channel2channel_out_create',
          hidden: true,
          meta: {title: '渠道调出通知单-新增'}
        },
        {
          path: 'notice_channel2channel_out_update/:id',
          component: () => import('@/z/bill/notice_channel2channel_out/detail'),
          name: 'notice_channel2channel_out_update',
          hidden: true,
          meta: {title: '渠道调出通知单-修改'}
        },
        {
          path: 'notice_channel2channel_out_detail/:id',
          component: () => import('@/z/bill/notice_channel2channel_out/info'),
          name: 'notice_channel2channel_out_info',
          hidden: true,
          meta: {title: '渠道调出通知单-详情'}
        },
        {
          path: 'channel_settlement',
          component: () => import('@/z/bill/channel_settlement/list'),
          name: 'channel_settlement',
          meta: {title: '渠道结存',power: 'bill_channel_settlement'}
        }
      ]
    }
  ]
}
export default billRouter
