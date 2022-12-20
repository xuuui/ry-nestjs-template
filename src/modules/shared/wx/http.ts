import axios from 'axios'

const wxHttp = axios.create({
  // 公共配置
  baseURL: 'https://api.weixin.qq.com',
  timeout: 5000,
})

wxHttp.interceptors.response.use((res) => {
  if (res.data?.errcode) {
    throw new Error(res.data.errmsg)
  }
  return res
})

export default wxHttp
