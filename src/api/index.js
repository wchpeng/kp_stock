import store from '@/store/index'
import axios from 'axios'


const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_API + '/kp-stock-api',
  timeout: 5000,
  headers: {'X-Custom-Header': 'foobar'}
});

instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  let token = store.state.token
  if (!token) {
    window.location = '/'
  }
  config['headers']['Authorization'] = token
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if(response.data.code == 400){
    store.commit('setToken', '')
    window.location = '/'
  }
  return response;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});


async function request(method, url, params, data){
  let response = await instance.request({
    url: url,
    method: method,
    params: params,
    data: data
  })
  console.log('method:', method)
  console.log('url:', url)
  console.log('params:', params)
  console.log('data:', data)
  return response.data
}


export async function api_login(username, password){
  return await request('post', '/account/login/v1', {}, {username: username, password: password})
}

export async function api_stock_list(params){
  return await request('get', '/stock-list/v1', params, {})
}

export async function api_stock_add(data){
  return await request('post', '/add-stock/v1', {}, data)
}

export async function api_stock_del(data){
  return await request('post', '/del-stock/v1', {}, data)
}

export async function api_stock_price(params){
  return await request('get', '/stock-price/v1', params, {})
}

export async function api_selected_list(){
  return await request('get', '/select-stock-list/v1', {}, {})
}

export async function api_selected_mod(add_ts_codes, del_ts_codes){
  return await request('post', '/modify-select-stock/v1', {}, {add_ts_codes: add_ts_codes, del_ts_codes: del_ts_codes})
}