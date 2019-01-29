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

