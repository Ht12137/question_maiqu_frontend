<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">


      <FormItem name="userAccount" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.userAccount"
          :placeholder="t('sys.login.userAccount')"
        />
      </FormItem>



      <FormItem name="phone" class="enter-x">
        <Input size="large" v-model:value="formData.phone" :placeholder="t('sys.login.phone')" />
      </FormItem>

      <FormItem name="email" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.email"
          :placeholder="t('sys.login.email')"
        />
      </FormItem>

      <FormItem name="newPassword" class="enter-x">
        <InputPassword
          size="large"
          v-model:value="formData.newPassword"
          :placeholder="t('sys.login.newPassword')"
          />
      </FormItem>

      <FormItem name="checkPassword" class="enter-x">
        <InputPassword
          size="large"
          v-model:value="formData.checkPassword"
          :placeholder="t('sys.login.checkPassword')"
        />
      </FormItem>


      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleReset" :loading="loading">
          {{ t('common.resetText') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts" setup>
import {computed, ref} from 'vue';
import LoginFormTitle from './LoginFormTitle.vue';
import {Button, Form, Input, message} from 'ant-design-vue';
import {useI18n} from '/@/hooks/web/useI18n';
import {LoginStateEnum, useFormRules, useLoginState} from './useLogin';
import myAxios from "/@/utils/http/anxiosOrigin/MyAxios";

const InputPassword = Input.Password;

  const FormItem = Form.Item;
  const { t } = useI18n();
  const { handleBackLogin, getLoginState, setLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);

  const formData = ref({
    userAccount: '',
    phone: '',
    email: '',
    newPassword:'',
    checkPassword:''
  });

  const getShow = computed(() => getLoginState.value === LoginStateEnum.RESET_PASSWORD);

  async function handleReset() {
    const result = await myAxios.post("/api/user/cfl/forgetPassword",formData.value);
    if(result.code === 0){
      setLoginState(LoginStateEnum.LOGIN);
      message.info('密码修改成功');
    }
    console.log(result.data)
    console.log(formData.value)
  }
</script>
