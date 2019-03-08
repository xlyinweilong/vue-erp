import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/channel2channel_out/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/channel2channel_out/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/channel2channel_out/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/channel2channel_out/delete',
    method: 'post',
    data
  })
}

export function auditEle(data) {
  return request({
    url: 'api/bill/channel2channel_out/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(data) {
  return request({
    url: 'api/bill/channel2channel_out/un_audit',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/channel2channel_out/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function getParentBill(params) {
  return request({
    url: 'api/bill/channel2channel_out/parent_bill',
    method: 'get',
    params: params
  })
}

export function getParentBillGoods(params) {
  return request({
    url: 'api/bill/channel2channel_out/parent_bill_goods',
    method: 'get',
    params: params
  })
}

