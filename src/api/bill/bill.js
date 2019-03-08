import request from '@/utils/request'

export function getList(billType, data) {
  return request({
    url: 'api/bill/' + billType + '/list',
    method: 'post',
    data
  })
}

export function deleteEle(billType, data) {
  return request({
    url: 'api/bill/' + billType + '/delete',
    method: 'post',
    data
  })
}

export function auditEle(billType, data) {
  return request({
    url: 'api/bill/' + billType + '/audit',
    method: 'post',
    data
  })
}

export function unAuditEle(billType, data) {
  return request({
    url: 'api/bill/' + billType + '/un_audit',
    method: 'post',
    data
  })
}

export function deleteBillEle(data) {
  return request({
    url: 'api/bill/bill/delete',
    method: 'post',
    data
  })
}

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

/**
 * 重置导入状态
 * @param data
 */
export function resetUploadStatus(params) {
  return request({
    url: 'api/bill/common/reset_upload_status',
    method: 'get',
    params: params
  })
}

/**
 * 查询导入状态
 */
export function uploadStatus(params) {
  return request({
    url: 'api/bill/common/upload_status',
    method: 'get',
    params: params
  })
}

/**
 * 查询可以盘点的时间
 */
export function loadInventoryDateList(billType, params) {
  return request({
    url: 'api/bill/' + billType + '/load_inventory_date_list',
    method: 'get',
    params: params
  })
}

/**
 * 盘点
 *
 * @param data
 */
export function inventory(billType, data) {
  return request({
    url: 'api/bill/' + billType + '/inventory',
    method: 'post',
    data
  })
}

