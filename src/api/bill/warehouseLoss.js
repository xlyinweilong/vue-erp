import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/warehouse_loss/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/warehouse_loss/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/warehouse_loss/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/warehouse_loss/delete',
    method: 'post',
    data
  })
}

export function auditEle(data) {
  return request({
    url: 'api/bill/warehouse_loss/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(data) {
  return request({
    url: 'api/bill/warehouse_loss/un_audit',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/warehouse_loss/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

