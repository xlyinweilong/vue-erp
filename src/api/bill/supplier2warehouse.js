import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/supplier2warehouse/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/supplier2warehouse/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/supplier2warehouse/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/supplier2warehouse/delete',
    method: 'post',
    data
  })
}

export function auditEle(data) {
  return request({
    url: 'api/bill/supplier2warehouse/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(data) {
  return request({
    url: 'api/bill/supplier2warehouse/un_audit',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/supplier2warehouse/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function getParentBill(params) {
  return request({
    url: 'api/bill/supplier2warehouse/parent_bill',
    method: 'get',
    params: params
  })
}

export function getParentBillGoods(params) {
  return request({
    url: 'api/bill/supplier2warehouse/parent_bill_goods',
    method: 'get',
    params: params
  })
}

