import request from '@/utils/request'

/**
 * 报表dict
 *
 * @param params
 */
export function reportDicJson(data) {
  return request({
    url: 'api/report/base/json',
    method: 'post',
    data
  })
}

export function dictTableFieldList(params) {
  return request({
    url: 'api/report/base/dict_table_field_list',
    method: 'get',
    params: params
  })
}

export function search(data) {
  return request({
    url: 'api/report/base/search',
    method: 'post',
    data
  })
}
