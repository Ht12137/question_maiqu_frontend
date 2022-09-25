<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="gotoResetPassword">
            {{ t('sys.login.forgetPassword') }}
          </Button>
<!--          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">-->
<!--            {{ t('sys.login.forgetPassword') }}-->
<!--          </Button>-->
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
      <ACol :md="24" :xs="24" style="margin-top: 10px;">
        <Button block @click="gotoRegister">
          {{ t('sys.login.registerButton') }}
        </Button>
      </ACol>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
import {computed, reactive, ref, unref} from 'vue';

import {Button, Checkbox, Col, Form, Input, Row} from 'ant-design-vue';
import LoginFormTitle from './LoginFormTitle.vue';

import {useI18n} from '/@/hooks/web/useI18n';
import {useMessage} from '/@/hooks/web/useMessage';

import {useUserStore} from '/@/store/modules/user';
import {LoginStateEnum, useFormRules, useFormValid, useLoginState} from './useLogin';
import {useDesign} from '/@/hooks/web/useDesign';
import {useGo} from "/@/hooks/web/usePage";
import {PageEnum} from "/@/enums/pageEnum";
//import { onKeyStroke } from '@vueuse/core';

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  const formData = reactive({
    account: '',
    password: '',
  });

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  const gotoResetPassword = () =>{
    setLoginState(LoginStateEnum.RESET_PASSWORD);
    console.log("当前的state是"+JSON.stringify(getLoginState.value))
  }

const gotoRegister = () =>{
  setLoginState(LoginStateEnum.REGISTER);
  console.log("当前的state是"+JSON.stringify(getLoginState.value))
}

  async function handleLogin() {
    const data = await validForm();
    console.log(data)
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        userPassword: data.password,
        userAccount: data.account,
        mode: 'none', //不要默认的错误提示
      });
      console.log('Login Form 下的' + userInfo);
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.userAccount}`,
          duration: 3,
        });
      }else {
        const go = useGo();
        go();
        go(PageEnum.BASE_LOGIN);
        return {};
      }

    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>
