import request from '@/utils/request'

export function stockInfo(params) {
  return request({
    url: 'api/stock/warehouse/stock_info',
    method: 'get',
    params: params
  })
}

export function stockList(params) {
  return request({
    url: 'api/stock/warehouse/stock_list',
    method: 'get',
    params: params
  })
}

