import request from '@/utils/request'

export function get(params) {
  return request({
    url: 'api/user/role_power/info',
    method: 'get',
    params: params
  })
}

export function save(data) {
  return request({
    url: 'api/user/role_power/save',
    method: 'post',
    data
  })
}

export function powerAndMenu(params) {
  return request({
    url: 'api/user/role_power/power_and_menu',
    method: 'get',
    params: params
  })
}

export function groupList(params) {
  return request({
    url: 'api/user/role_power/group_list',
    method: 'get',
    params: params
  })
}
