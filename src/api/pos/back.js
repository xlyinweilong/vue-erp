import request from '@/utils/request'

/**
 * 查询原单据
 *
 * @param params
 */
export function findByBillCode(params) {
  return request({
    url: 'api/pos/back/find_by_bill_code',
    method: 'get',
    params: params
  })
}

/**
 * 退货
 * @param data
 */
export function doBack(data) {
  return request({
    url: 'api/pos/back/do_back',
    method: 'post',
    data
  })
}

/**
 * 退货支付方式
 *
 * @param data
 */
export function backPayment(data) {
  return request({
    url: 'api/pos/back/back_payment',
    method: 'post',
    data
  })
}
