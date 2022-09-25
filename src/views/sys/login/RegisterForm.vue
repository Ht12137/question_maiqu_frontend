<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="account" class="enter-x">
        <Input
          class="fix-auto-fill"
          size="large"
          v-model:value="formData.account"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem>
      <FormItem name="mobile" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.mobile"
          :placeholder="t('sys.login.mobile')"
          class="fix-auto-fill"
        />
      </FormItem>

      <FormItem name="email" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.email"
          :placeholder="t('sys.login.email')"
          class="fix-auto-fill"
        />
      </FormItem>
<!--      <FormItem name="sms" class="enter-x">-->
<!--        <CountdownInput-->
<!--          size="large"-->
<!--          class="fix-auto-fill"-->
<!--          v-model:value="formData.sms"-->
<!--          :placeholder="t('sys.login.smsCode')"-->
<!--        />-->
<!--      </FormItem>-->
      <FormItem name="password" class="enter-x">
        <StrengthMeter
          size="large"
          v-model:value="formData.password"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem name="confirmPassword" class="enter-x">
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.confirmPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <FormItem class="enter-x" name="policy">
        <!-- No logic, you need to deal with it yourself -->
        <Checkbox v-model:checked="formData.policy" size="small">
          {{ t('sys.login.policy') }}
        </Checkbox>
      </FormItem>

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >
        {{ t('sys.login.registerButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
import {computed, reactive, ref, unref} from 'vue';
import LoginFormTitle from './LoginFormTitle.vue';
import {Button, Checkbox, Form, Input, message} from 'ant-design-vue';
import {StrengthMeter} from '/@/components/StrengthMeter';
import {useI18n} from '/@/hooks/web/useI18n';
import {LoginStateEnum, useFormRules, useFormValid, useLoginState} from './useLogin';
import myAxios from "/@/utils/http/anxiosOrigin/MyAxios";


const FormItem = Form.Item;
  const InputPassword = Input.Password;

  const { t } = useI18n();
  const { handleBackLogin, getLoginState ,setLoginState} = useLoginState();

  const formRef = ref();
  const loading = ref(false);

const formData = reactive({
  account: '',
  password: '',
  confirmPassword: '',
  mobile: '',
  sms: '',
  email:'',
  policy: false,
});


const sendData = ref({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
  phone: '',
  email:'',
})

const convertToDto = (data) =>{
  sendData.value.userAccount = data.account;
  sendData.value.userPassword = data.password;
  sendData.value.checkPassword = data.confirmPassword;
  sendData.value.phone = data.mobile
  sendData.value.email = data.email
}


  const { getFormRules } = useFormRules(formData);
  const { validForm } = useFormValid(formRef);

  const getShow = computed(() =>  getLoginState.value === LoginStateEnum.REGISTER);

  async function handleRegister() {
    const data = await validForm();
    if (!data) return;
    convertToDto(data);
    console.log(sendData.value)
    const result = await myAxios.post("/api/user/register",sendData.value);
    if(result.code === 0){
      message.info("注册成功");
      setLoginState(LoginStateEnum.LOGIN)
    }else {
      console.log("注册失败")
    }
    console.log(data);
  }
</script>
