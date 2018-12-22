import request from '@/utils/request'

export function getDictList(params) {
  return request({
    url: 'api/info/dict/list',
    method: 'get',
    params: params
  })
}

export function saveDict(data) {
  return request({
    url: 'api/info/dict/save',
    method: 'post',
    data
  })
}

export function getDict(params) {
  return request({
    url: 'api/info/dict/info',
    method: 'get',
    params: params
  })
}

export function deleteDict(data) {
  return request({
    url: 'api/info/dict/delete',
    method: 'post',
    data
  })
}

export function getDictType(params) {
  return request({
    url: 'api/info/dict/dict_list',
    method: 'get',
    params: params
  })
}

