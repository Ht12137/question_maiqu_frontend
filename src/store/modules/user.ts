import type {UserInfo} from '/#/store';
import type {ErrorMessageMode} from '/#/axios';
import {defineStore} from 'pinia';
import {store} from '/@/store';
import {RoleEnum} from '/@/enums/roleEnum';
import {PageEnum} from '/@/enums/pageEnum';
import {ROLES_KEY, TOKEN_KEY, USER_INFO_KEY} from '/@/enums/cacheEnum';
import {getAuthCache, setAuthCache} from '/@/utils/auth';
import {GetUserInfoModel, LoginParams} from '/@/api/sys/model/userModel';
import {doLogout, getUserInfo, loginApi} from '/@/api/sys/user';
import {useI18n} from '/@/hooks/web/useI18n';
import {useMessage} from '/@/hooks/web/useMessage';
import {router} from '/@/router';
import {usePermissionStore} from '/@/store/modules/permission';
import {RouteRecordRaw} from 'vue-router';
import {PAGE_NOT_FOUND_ROUTE} from '/@/router/routes/basic';
import {h} from 'vue';
import {message} from "ant-design-vue";

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleList: RoleEnum[];
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  userRole:number;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info 用户信息
    userInfo: null,
    // token 请求所携带的token
    token: undefined,
    // 角色列表 暂时不用
    roleList: [] as Array<any> ,
    // 这次登录是否被废弃 ,否代表没有废弃，仍然有登录态
    sessionTimeout: false,
    // 最后更新时间
    lastUpdateTime: 0,
    //自定义角色
    userRole:0,
  }),
  getters: {
    //获取用户信息
    getUserInfo(): UserInfo {
      return this.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
    },
    //获取token
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    //获取角色列表，暂时不用
    getRoleList(): RoleEnum[] {
      return this.roleList.length > 0 ? this.roleList : getAuthCache<RoleEnum[]>(ROLES_KEY);
    },
    //判断是否登录废弃
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    //获取最新更新时间
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
    //获取当前登录用户的权限
    getUserRole(): number{
      return this.userRole;
    }
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setRoleList(roleList: RoleEnum[]) {
      this.roleList = roleList;
      setAuthCache(ROLES_KEY, roleList);
    },
    setUserRole(userRole :number){
      this.userRole = userRole;
      setAuthCache(ROLES_KEY,userRole);
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info;
      this.lastUpdateTime = new Date().getTime();
      setAuthCache(USER_INFO_KEY, info);
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    //重置所有的state，目的是为了让网页上的用户登录态消失
    resetState() {
      this.userInfo = null;
      this.token = '';
      this.roleList = [];
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */

    //用户登录，登录页面触发
    async login(
      params: LoginParams & {
        goHome?: boolean;
        mode?: ErrorMessageMode;
      },
    ): Promise<GetUserInfoModel | null> {
      try {
        const { goHome = true, mode, ...loginParams } = params;
        //这里用的自己封装的login
        //todo 把所有请求都封装成 myAnxios
        const data = await loginApi(loginParams);
        if(data.code == 0){
          const token = data.data;
          console.log("modules/users的token" + token)
          // 设置token到全局状态管理
          this.setToken(token);
          return this.afterLoginAction(goHome);
        }
        message.info(data.description);

      } catch (error) {
        console.log(error)
        return Promise.reject(error);
      }
    },


    /**
     * 定义了调用login接口以后的行为
     * @Description 在调用登录api之后，设置全局变量中的会话时间不过期，定义一些userInfo等全局变量，设置路由
     * @param goHome
     */
    async afterLoginAction(goHome?: boolean): Promise<GetUserInfoModel | null> {
      //这个方法必须要有token存在
      if (!this.getToken) return null;
      // 先获取用户信息
      const userInfo = await this.getUserInfoAction();
      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        //如果说当前会话过期了，那么就重新设置它没有过期
        this.setSessionTimeout(false);
      } else {
        //权限仓库
        const permissionStore = usePermissionStore();
        if (!permissionStore.isDynamicAddedRoute) {
          //如果没有动态添加过route,就取出所有route，加入router中
          const routes = await permissionStore.buildRoutesAction();
          routes.forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          router.addRoute(PAGE_NOT_FOUND_ROUTE as unknown as RouteRecordRaw);
          permissionStore.setDynamicAddedRoute(true);
        }
        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    /**
     * @description 这个方法的目的是，设置角色权限和用户信息到pinia状态管理中
     */
    async getUserInfoAction(): Promise<UserInfo | null> {
      //保险判断，可以不做
      if (!this.getToken) return null;
      const result = await getUserInfo();
      const userInfo: UserInfo = result.data;
      console.log( '每次登录都会去请求当前的用户:' + userInfo);
      const role = userInfo.userRole;
      if(!role){
        this.setUserRole(-1);
      }else {
        this.setUserRole(role);
      }
      console.log("从store取到的userRole "+this.getUserRole);
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false) {
      if (this.getToken) {
        try {
          // await doLogout();
          this.resetState();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      goLogin && router.push(PageEnum.BASE_LOGIN);
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});
// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
