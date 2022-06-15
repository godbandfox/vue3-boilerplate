import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios'
import router from '@/router/index'

const service = axios.create({
  baseURL:'http://localhost:8080',
  timeout: 10000 // 超时时间
})

service.defaults.headers.common['Authorization'] = localStorage.getItem('token') || ''
// / 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return config
  },
  (err: AxiosError) => {
    Promise.reject(err)
  }
)

// 响应拦截
service.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (err: any) => {
    let errMsg = ''
    if (err && err.response.status) {
      switch (err.response.status) {
        case 401:
          errMsg = '登录状态失效，请重新登录'
          router.push('/login')
          break
        case 403:
          errMsg = '拒绝访问'
          break
        case 408:
          errMsg = '请求超时'
          break
        case 500:
          errMsg = '服务器内部错误'
          break
        case 501:
          errMsg = '服务未实现'
          break
        case 502:
          errMsg = '网关错误'
          break
        case 503:
          errMsg = '服务不可用'
          break
        case 504:
          errMsg = '网关超时'
          break
        case 505:
          errMsg = 'HTTP版本不受支持'
          break
        default:
          errMsg = err.response.data.msg
          break
      }
    } else {
      errMsg = err
    }
    return Promise.reject(err)
  }
)

export default service
