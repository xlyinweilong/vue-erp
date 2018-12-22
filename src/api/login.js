import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: 'api/user/login/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: 'api/user/login/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: 'api/user/login/info',
    method: 'get',
    params: { token }
  })
}

export function keepAlive(params) {
  return request({
    url: 'api/user/login/keep_alive',
    method: 'get',
    params: params
  })
}

