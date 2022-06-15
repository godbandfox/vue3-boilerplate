<template>
  <div class="login-container">
    <a-form :model="formState" :rules="rules" ref="loginForm" @finish="handleFinish">
      <div class="title-container">
        <span class="title">欢迎登录</span>
      </div>
      <a-form-item name="userName">
        <a-input v-model:value="userName">
          <template #prefix>
            <user-outlined type="user"/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="passWord">
        <a-input v-model:value="passWord" type="password">
          <template #prefix>
            <unlock-outlined/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="code">
        <a-input v-model:value="code" type="code" class='verification-form'>
          <template #prefix>
            <verified-outlined/>
          </template>
        </a-input>
      </a-form-item>
      <div class="verification-parent">
        <span>点击刷新验证码</span>
        <img class="verification" @change="imgChange" :src='"data:image/jpg;base64,"+baseImg'/>
      </div>
      <a-form-item>
        <a-button size="large" type="primary" html-type="submit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import {reactive, ref, toRaw, toRef, toRefs} from 'vue'
import type {UnwrapRef} from 'vue'
import {UserOutlined, UnlockOutlined} from '@ant-design/icons-vue'
import type {RuleObject} from 'ant-design-vue/es/form/interface'
import {useRouter} from 'vue-router'
import {login, getCode} from '@/axios/api'
import _default from "ant-design-vue/es/vc-slick/src/inner-slider";
import beforeMount = _default.beforeMount;

const router = useRouter()

interface FormState {
  userName: string
  passWord: string | number
  code: string | number
}

interface CodeResult {
  code: number
  data: {
    img: string,
    uuid: string
  }
  msg: string | number
  path: string | number
  extra: string | number
  timestamp: string | number
  isSuccess: boolean
  isError: boolean
}

const formState: UnwrapRef<FormState> = reactive({
  userName: 'admin',
  passWord: '123456',
  code: 'y1b2'
})
const rules = {
  userName: [
    {
      required: true,
      validator: (_rule: RuleObject, value: string): Promise<void | string> => {
        if (!value) {
          return Promise.reject('请输入账号')
        } else if (!new RegExp('^[A-Za-z0-9]{1,20}$').test(value))
            /*else if (value !== 'admin') {
              return Promise.reject('请输入正确的账号')
            }*/
        {
          return Promise.reject('请输入长度为1-20个字母或数字的账号')
        } else {
          return Promise.resolve()
        }
      },
      trigger: 'blur'
    }
  ],
  passWord: [
    {
      required: true,
      validator: (_rule: RuleObject, value: string | number): Promise<void | string> => {
        if (!value) {
          return Promise.reject('请输入密码')
        } else if (!new RegExp('^.{1,20}$').test(value + '')) {
          return Promise.reject('请输入1-20位密码')
        }
        /*else if (value !== '123456') {
          return Promise.reject('请输入正确的密码')
        }*/
        else {
          return Promise.resolve()
        }
      },
      trigger: 'blur'
    }
  ],
  code: [{
    required: true,
    validator: (_rule: RuleObject, value: string | number): Promise<void | string> => {
      if (!value) {
        return Promise.reject('请输入4位验证码')
      } else if (!new RegExp('^\w{4}$').test(value.toString())) {
        return Promise.reject('请输入4位验证码')
      } else {
        return Promise.resolve()
      }
    },
    trigger: 'blur'
  }
  ]
}
const handleFinish = (values: FormState): void => {
  login({}).then((res: any) => {
    if (res.data.code === '1') {
      localStorage.setItem('token', res.data.data.token)
      router.push('/home')

    }
  })
}

const {userName, passWord, code} = toRefs(formState)
const baseImg = ref<any>('');
// 第一次进入页面获取验证码
getCode({}).then((res: any) => {
  // is not assignable to type 'Ref '
  baseImg.value = window.atob(res.data.data.img)
  // console.log(window.atob(res.data.data.img))
  // console.log(baseImg)
})
    .catch((err) => {
    })
// 点击图片刷新验证码
const imageChange = (value : any) : void =>{
  console.log(value)
}
</script>
<style lang="scss">
.login-container {
  min-height: 100vh;
  width: 100%;
  background: url('src/assets/login-main.jpg') no-repeat center center;
  background-size: cover;
  overflow: hidden;

  .ant-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    margin: 0 auto;

    .ant-form-item {
      background: #2d3a4b;
      border-radius: 5px;
      color: #454545;

      .ant-input-affix-wrapper {
        height: 50px;
        width: 100%;
        background-color: rgba(0, 0, 0, 0);

        .ant-input-prefix {
          .anticon {
            font-size: 20px;
            color: #ccc;
          }
        }

        .ant-input {
          background-color: rgba(0, 0, 0, 0);
          color: #fff;
        }
      }

      .ant-input-affix-wrapper:hover {
        //border-color: none;
      }

      .ant-btn {
        width: 100%;
      }
    }

    .title-container {
      position: relative;
      margin: 0 auto 40px auto;
      text-align: center;

      .title {
        font-size: 26px;
        color: #eee;
        font-weight: bold;
      }
    }
  }
}

.verification-parent {
  font-size: 20px;
  line-height: 20px;
  text-align: center;
  align-items: center;
  color: #eeeeee;
  display: flex;
  justify-content: right;
  margin-bottom: 24px;

  span {
    margin-right: 5px;
  }

  .verification {
    width: 10vw;
  }

}

</style>
