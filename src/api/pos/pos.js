import request from '@/utils/request'

export function getGoodsList(params) {
  return request({
    url: 'api/info/goods/list_by_bill',
    method: 'get',
    params: params
  })
}

export function searchBarCode(params) {
  return request({
    url: 'api/info/barCode/info_by_code',
    method: 'get',
    params: params
  })
}

