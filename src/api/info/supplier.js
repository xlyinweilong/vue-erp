import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user/supplier/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/user/supplier/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: '/user/supplier/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: '/user/supplier/delete',
    method: 'post',
    data
  })
}

