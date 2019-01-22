import request from '@/utils/request'

export function sotckInfo(params) {
  return request({
    url: 'api/stock/channel/stock_info',
    method: 'get',
    params: params
  })
}

