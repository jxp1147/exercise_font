/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
 import { notification } from 'antd';
 import { history } from 'umi';
 import { extend } from 'umi-request';
 
 const codeMessage = {
   200: '服务器成功返回请求的数据。',
   201: '新建或修改数据成功。',
   202: '一个请求已经进入后台排队（异步任务）。',
   204: '删除数据成功。',
   400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
   401: '用户未登录',
   403: '用户得到授权，但是访问是被禁止的。',
   404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
   406: '请求的格式不可得。',
   410: '请求的资源被永久删除，且不会再得到的。',
   422: '当创建一个对象时，发生一个验证错误。',
   500: '服务器发生错误，请检查服务器。',
   502: '网关错误。',
   503: '服务不可用，服务器暂时过载或维护。',
   504: '网关超时。',
 };
 
 /**
  * 异常处理程序
  */
 const errorHandler = (error: { response: Response }): Response => {
   const { response } = error;
   if (response && response.status) {
     const { status } = response;
     notification.error({
       message: (codeMessage as any)[status],
     });
     switch (status) {
       case 401:
       case 403:
         history.push('/home');
        // console.log("");
         break;
     }
     console.log(response);
   } else if (!response) {
     notification.error({
       description: '您的网络发生异常，无法连接服务器',
       message: '网络异常',
     });
   }
   return response;
 };
 
 /**
  * 配置request请求时的默认参数
  */
 const request = extend({
   errorHandler, // 默认错误处理
 });
 request.interceptors.request.use((url: string, options: any) => {
   const token = window.localStorage.getItem('token') || '';
   if (token) {
     let headers;
     if (options.requestType === 'form') {
       headers = {
         Authorization: token,
       };
     } else {
       headers = {
         'Content-Type': 'application/json;charset=UTF-8',
         Accept: 'application/json',
         Authorization: token,
       };
     }
     return {
       url,
       options: { ...options, headers },
     };
   }
   return {
     url,
     options: { ...options },
   };
 });
 export default request;