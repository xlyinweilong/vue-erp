import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/in_warehouse/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/in_warehouse/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/in_warehouse/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/in_warehouse/delete',
    method: 'post',
    data
  })
}

export function auditEle(data) {
  return request({
    url: 'api/bill/in_warehouse/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(data) {
  return request({
    url: 'api/bill/in_warehouse/un_audit',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/in_warehouse/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function getParentBill(params) {
  return request({
    url: 'api/bill/in_warehouse/parent_bill',
    method: 'get',
    params: params
  })
}

export function getParentBillGoods(params) {
  return request({
    url: 'api/bill/in_warehouse/parent_bill_goods',
    method: 'get',
    params: params
  })
}


