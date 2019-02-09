import request from '@/utils/request'

/**
 * 获取列表
 *
 * @param params
 */
export function getList(params) {
  return request({
    url: 'api/activity/list',
    method: 'get',
    params: params
  })
}

export function getInfo(params) {
  return request({
    url: 'api/activity/info',
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
    url: 'api/activity/save',
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
    url: 'api/activity/delete',
    method: 'post',
    data
  })
}

