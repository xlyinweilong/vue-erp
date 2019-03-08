import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/delivery/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/delivery/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/delivery/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/delivery/delete',
    method: 'post',
    data
  })
}

export function auditEle(data) {
  return request({
    url: 'api/bill/delivery/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(data) {
  return request({
    url: 'api/bill/delivery/un_audit',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/delivery/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function getParentBill(params) {
  return request({
    url: 'api/bill/delivery/parent_bill',
    method: 'get',
    params: params
  })
}

export function getParentBillGoods(params) {
  return request({
    url: 'api/bill/delivery/parent_bill_goods',
    method: 'get',
    params: params
  })
}


