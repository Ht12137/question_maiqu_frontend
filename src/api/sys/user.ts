import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import myAxios from "/@/utils/http/anxiosOrigin/MyAxios";

enum Api {
  Login = '/api/user/loginByToken',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams) {
  return myAxios.post<LoginResultModel>("/api/user/loginByToken",{
    'userAccount':params.userAccount,
    'userPassword':params.userPassword
  })
}


/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return myAxios.get<GetUserInfoModel>("/api/user/currentByToken");
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}
