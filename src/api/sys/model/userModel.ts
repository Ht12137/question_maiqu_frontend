/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  userAccount: string;
  userPassword: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  data: any;
  code: string;
  message:string;
  description:string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  userRole: number;
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  userAccount: string;
  // 头像
  avatarUrl: string;
  // 介绍
  profile?: string;
}
