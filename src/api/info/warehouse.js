import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user/warehouse/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/user/warehouse/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: '/user/warehouse/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: '/user/warehouse/delete',
    method: 'post',
    data
  })
}


