import request from '@/utils/request'

/**
 * 获取列表
 *
 * @param params
 */
export function getList(params) {
  return request({
    url: 'api/vip/coupon/list',
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
    url: 'api/vip/coupon/save',
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
    url: 'api/vip/coupon/delete',
    method: 'post',
    data
  })
}

/**
 * 我的列表
 *
 * @param params
 */
export function getMyList(params) {
  return request({
    url: 'api/vip/coupon/my_list',
    method: 'get',
    params: params
  })
}

/**
 * 查询可用的代用卷
 *
 * @param params
 */
export function findByCodeForCanUse(params) {
  return request({
    url: 'api/vip/coupon/find_by_code_for_can_use',
    method: 'get',
    params: params
  })
}
