import request from '@/utils/request'

/**
 * 挂单
 * @param data
 */
export function putUpIn(data) {
  return request({
    url: 'api/pos/put_up/in',
    method: 'post',
    data
  })
}

/**
 * 挂单列表
 * @param params
 */
export function putUpList(params) {
  return request({
    url: 'api/pos/put_up/list',
    method: 'get',
    params: params
  })
}

/**
 * 挂出
 * @param data
 */
export function putUpOut(data) {
  return request({
    url: 'api/pos/put_up/out',
    method: 'post',
    data
  })
}
