import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/order/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/order/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/order/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/order/delete',
    method: 'post',
    data
  })
}

export function auditEle(data) {
  return request({
    url: 'api/bill/order/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(data) {
  return request({
    url: 'api/bill/order/un_audit',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/order/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function getParentBill(params) {
  return request({
    url: 'api/bill/order/parent_bill',
    method: 'get',
    params: params
  })
}

export function getParentBillGoods(params) {
  return request({
    url: 'api/bill/order/parent_bill_goods',
    method: 'get',
    params: params
  })
}


