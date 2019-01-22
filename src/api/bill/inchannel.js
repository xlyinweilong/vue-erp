import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/in_channel/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/in_channel/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/in_channel/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/in_channel/delete',
    method: 'post',
    data
  })
}

export function auditEle(data) {
  return request({
    url: 'api/bill/in_channel/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(data) {
  return request({
    url: 'api/bill/in_channel/un_audit',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/in_channel/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function getParentBill(params) {
  return request({
    url: 'api/bill/in_channel/parent_bill',
    method: 'get',
    params: params
  })
}

export function getParentBillGoods(params) {
  return request({
    url: 'api/bill/in_channel/parent_bill_goods',
    method: 'get',
    params: params
  })
}


