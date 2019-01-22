import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/channel2supplier/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/channel2supplier/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/channel2supplier/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/channel2supplier/delete',
    method: 'post',
    data
  })
}

export function auditEle(data) {
  return request({
    url: 'api/bill/channel2supplier/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(data) {
  return request({
    url: 'api/bill/channel2supplier/un_audit',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/channel2supplier/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

