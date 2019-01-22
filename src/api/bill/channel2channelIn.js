import request from '@/utils/request'

export function getList(data) {
  return request({
    url: 'api/bill/channel2channel_in/list',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: 'api/bill/channel2channel_in/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/bill/channel2channel_in/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/bill/channel2channel_in/delete',
    method: 'post',
    data
  })
}

export function exportEle(data) {
  return request({
    url: 'api/bill/channel2channel_in/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function getParentBill(params) {
  return request({
    url: 'api/bill/channel2channel_in/parent_bill',
    method: 'get',
    params: params
  })
}

export function getParentBillGoods(params) {
  return request({
    url: 'api/bill/channel2channel_in/parent_bill_goods',
    method: 'get',
    params: params
  })
}

