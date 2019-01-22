import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/channel_inventory/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/channel_inventory/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/channel_inventory/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/channel_inventory/delete',
    method: 'post',
    data
  })
}

export function auditEle(data) {
  return request({
    url: 'api/bill/channel_inventory/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(data) {
  return request({
    url: 'api/bill/channel_inventory/un_audit',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/channel_inventory/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

