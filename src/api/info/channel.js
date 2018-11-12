import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user/channel/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: '/user/channel/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: '/user/channel/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: '/user/channel/delete',
    method: 'post',
    data
  })
}


