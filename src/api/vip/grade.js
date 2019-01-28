import request from '@/utils/request'

/**
 * 获取等级
 *
 * @param params
 */
export function getList(params) {
  return request({
    url: 'api/vip/grade/list',
    method: 'get',
    params: params
  })
}

/**
 * 保存的等级
 *
 * @param data
 */
export function save(data) {
  return request({
    url: 'api/vip/grade/save',
    method: 'post',
    data
  })
}

/**
 * 删除等级
 *
 * @param data
 */
export function deleteEle(data) {
  return request({
    url: 'api/vip/grade/delete',
    method: 'post',
    data
  })
}

/**
 * 设置等级上下关系
 * @param data
 */
export function setGrade(data) {
  return request({
    url: 'api/vip/grade/set_grade',
    method: 'post',
    data
  })
}

/**
 * 设置默认等级
 *
 * @param data
 */
export function setDefaultGrade(data) {
  return request({
    url: 'api/vip/grade/set_default_grade',
    method: 'post',
    data
  })
}

/**
 * 设置升级规则
 *
 * @param data
 */
export function setGradeUpRule(data) {
  return request({
    url: 'api/vip/grade/set_grade_up_rule',
    method: 'post',
    data
  })
}
