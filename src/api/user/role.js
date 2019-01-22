import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/user/role/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/user/role/save',
    method: 'post',
    data
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/user/role/delete',
    method: 'post',
    data
  })
}

