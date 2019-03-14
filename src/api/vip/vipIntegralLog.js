import request from '@/utils/request'

/**
 * 获取列表
 *
 * @param params
 */
export function getList(params) {
  return request({
    url: 'api/vip/integral_log/list',
    method: 'get',
    params: params
  })
}
