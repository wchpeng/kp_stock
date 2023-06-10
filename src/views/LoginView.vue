<template>
  <div class="demo-login">
      <Login @on-submit="handleSubmit">
          <UserName name="username" />
          <Password name="password" />
          <div class="demo-auto-login">
              <Checkbox v-model="autoLogin" size="large">自动登录</Checkbox>
              <a>忘记密码</a>
          </div>
          <Submit />
      </Login>
  </div>
</template>
<script setup>
import { api_login } from '@/api/index'
import { Message } from 'view-ui-plus'
import { useRouter } from 'vue-router'
import store from '@/store/index'
import { ref, reactive } from 'vue'

const autoLogin = ref(false)
const router = useRouter()

async function handleSubmit(valid, { username, password }){
  if (valid) {
      console.log(api_login)
      let response = await api_login(username, password)
      console.log('response: ', response)
      if (response.code != 0){
        Message.warning(response.msg)
      } else {
        store.commit('setToken', response.data.token)
        router.push({'path': '/'})
      }
  }
}
</script>

<style scoped>
.demo-login{
  width: 400px;
  margin: 100px auto;
}
</style>