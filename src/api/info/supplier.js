import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/info/supplier/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/info/supplier/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/info/supplier/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/info/supplier/delete',
    method: 'post',
    data
  })
}


