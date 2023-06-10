import { createStore } from 'vuex'

export default createStore({
  state: {
    nickname: '我是谁',
    token: sessionStorage.getItem('token') ?sessionStorage.getItem('token') : ''
  },
  getters: {
  },
  mutations: {
    setToken (state, token) {
      state.token = token;
      console.log('token: ', token)
      sessionStorage.setItem('token', token);
    }
  },
  actions: {
  },
  modules: {
  }
})
