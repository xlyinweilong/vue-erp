import request from '@/utils/request'

/**
 * 列表
 *
 * @param params
 */
export function getList(params) {
  return request({
    url: 'api/report/plan/list',
    method: 'get',
    params: params
  })
}

/**
 * 明细
 *
 * @param params
 */
export function info(params) {
  return request({
    url: 'api/report/plan/info',
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
    url: 'api/report/plan/save',
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
    url: 'api/report/plan/delete',
    method: 'post',
    data
  })
}

