import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/info/channel/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/info/channel/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/info/channel/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/info/channel/delete',
    method: 'post',
    data
  })
}


