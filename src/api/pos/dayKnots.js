import request from '@/utils/request'

/**
 * 最后日结
 * @param data
 */
export function getLast(params) {
  return request({
    url: 'api/pos/day_knots/get_last',
    method: 'get',
    params: params
  })
}

/**
 * 日结
 * @param data
 */
export function doDayKnots(data) {
  return request({
    url: 'api/pos/day_knots/do_day_knots',
    method: 'post',
    data
  })
}

/**
 * 取消日结
 *
 * @param data
 */
export function cancelDayKnots(data) {
  return request({
    url: 'api/pos/day_knots/cancel_day_knots',
    method: 'post',
    data
  })
}

