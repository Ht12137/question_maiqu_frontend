import axios, {AxiosInstance} from "axios";
import {getToken} from "/@/utils/auth";
import {router} from "/@/router";

const myAxios : AxiosInstance= axios.create({
  baseURL: 'http://localhost:8080/maiqu',
});



// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = getToken();
  if(token){
    // @ts-ignore
    config.headers.token = token;
    console.log("我要发请求了");
  }else {
    router.push("/login")
  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器


myAxios.interceptors.response.use(function (response) {
  console.log('我发送完请求了')
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error);
});
export default  myAxios;
