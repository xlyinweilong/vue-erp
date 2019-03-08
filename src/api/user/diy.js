import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/user/diy/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/user/diy/save',
    method: 'post',
    data
  })
}

