import request from '@/utils/request'

export function getList(params) {
  return request({
    url: 'api/info/goods/list',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/info/goods/save',
    method: 'post',
    data
  })
}

export function get(params) {
  return request({
    url: 'api/info/goods/info',
    method: 'get',
    params: params
  })
}

export function deleteEle(data) {
  return request({
    url: 'api/info/goods/delete',
    method: 'post',
    data
  })
}

/**
 * 查询货品的颜色、内长、尺码
 * @param data
 */
export function getGoodsColorAndSizeList(params) {
  return request({
    url: 'api/info/goods/getGoodsColorAndSizeList',
    method: 'get',
    params: params
  })
}

/**
 * 查询导入状态
 */
export function uploadStatus(params) {
  return request({
    url: 'api/info/goods/upload_goods_status',
    method: 'get',
    params: params
  })
}

