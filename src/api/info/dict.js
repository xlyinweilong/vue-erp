import request from '@/utils/request'

export function getDictList(params) {
  return request({
    url: '/user/dict/list',
    method: 'get',
    params: params
  })
}

export function saveDict(data) {
  return request({
    url: '/user/dict/save',
    method: 'post',
    data
  })
}

export function getDict(params) {
  return request({
    url: '/user/dict/info',
    method: 'get',
    params: params
  })
}

export function deleteDict(data) {
  return request({
    url: '/user/dict/delete',
    method: 'post',
    data
  })
}

export function getDictType(params) {
  return request({
    url: '/user/dict/dict_list',
    method: 'get',
    params: params
  })
}

