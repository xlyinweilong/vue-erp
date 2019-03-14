import request from '@/utils/request'

export function getGoodsList(params) {
  return request({
    url: 'api/info/goods/list_by_bill',
    method: 'get',
    params: params
  })
}

/**
 * 扫码
 * @param params
 */
export function searchBarCode(params) {
  return request({
    url: 'api/info/barCode/info_by_code',
    method: 'get',
    params: params
  })
}

/**
 * 查询会员
 */
export function searchVip(params) {
  return request({
    url: 'api/pos/cash/vip',
    method: 'get',
    params: params
  })
}

/**
 * 查询促销活动
 *
 * @param params
 */
export function activityList(params) {
  return request({
    url: 'api/pos/cash/activity_list',
    method: 'get',
    params: params
  })
}

/**
 * 支付
 *
 * @param data
 */
export function pay(data) {
  return request({
    url: 'api/pos/cash/pay',
    method: 'post',
    data
  })
}

/**
 * 查询销售
 *
 * @param params
 */
export function getPosList(data) {
  return request({
    url: 'api/pos/cash/pos_list',
    method: 'post',
    data
  })
}
