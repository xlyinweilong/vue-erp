import request from '@/utils/request'

export function stockInfo(params) {
  return request({
    url: 'api/stock/channel/stock_info',
    method: 'get',
    params: params
  })
}

export function stockList(params) {
  return request({
    url: 'api/stock/channel/stock_list',
    method: 'get',
    params: params
  })
}

export function stockTotal(params) {
  return request({
    url: 'api/stock/channel/stock_total',
    method: 'get',
    params: params
  })
}

