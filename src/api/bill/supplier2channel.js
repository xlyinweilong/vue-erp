import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/supplier2channel/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/supplier2channel/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/supplier2channel/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/supplier2channel/delete',
    method: 'post',
    data
  })
}

export function auditEle(data) {
  return request({
    url: 'api/bill/supplier2channel/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(data) {
  return request({
    url: 'api/bill/supplier2channel/un_audit',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/supplier2channel/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

