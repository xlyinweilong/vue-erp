import request from '@/utils/request'

/**
 * 获取列表
 *
 * @param params
 */
export function getList(params) {
  return request({
    url: 'api/vip/integral_up_rule/list',
    method: 'get',
    params: params
  })
}

/**
 * 保存
 *
 * @param data
 */
export function save(data) {
  return request({
    url: 'api/vip/integral_up_rule/save',
    method: 'post',
    data
  })
}

/**
 * 删除
 *
 * @param data
 */
export function deleteEle(data) {
  return request({
    url: 'api/vip/integral_up_rule/delete',
    method: 'post',
    data
  })
}

/**
 * 货品列表
 *
 * @param params
 */
export function getGoodsList(params) {
  return request({
    url: 'api/vip/integral_up_rule/goods_list',
    method: 'get',
    params: params
  })
}

/**
 * 保存货品
 * @param data
 */
export function saveGoods(data) {
  return request({
    url: 'api/vip/integral_up_rule/save_goods',
    method: 'post',
    data
  })
}

/**
 * 删除货品
 *
 * @param data
 */
export function deleteGoods(data) {
  return request({
    url: 'api/vip/integral_up_rule/delete_goods',
    method: 'post',
    data
  })
}
