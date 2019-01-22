import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/user/user/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/user/user/save',
    method: 'post',
    data
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/user/user/delete',
    method: 'post',
    data
  })
}

