// 封装ajax

import axios from 'axios'
import qs from 'qs'

//请求拦截器
axios.interceptors.request.use( config => {
    const {method, data} = config
    
    if (method.toLowerCase() === 'post' && typeof data === 'object') {
        config.data = qs.stringify(data)
    }
    return config
})

//响应拦截器
axios.interceptors.response.use( response => {
    // console.log(response.data)
    return response.data
  }, error => {
      return new Promise(() => {})
  });

export default axios