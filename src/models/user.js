import services from '@/services'
const userInfo = uni.getStorageSync('userInfo') ?? {}
const profile = uni.getStorageSync('userProfile') ?? {}

// uni.setStorageSync('token', userInfo?.token ?? '')

export default {
  namespaced: true,
  state: () => ({
    userInfo,
    profile,
  }),
  getters: {
    token(state) {
      return state.userInfo?.token
    },
  },
  mutations: {
    userInfo(state, userInfo) {
      state.userInfo = userInfo
      uni.setStorageSync('userInfo', userInfo)
    },
    profile(state, profile) {
      state.profile = profile
      uni.setStorageSync('userProfile', profile)
    },
    token(state, token) {
      uni.setStorageSync('token', token ?? '')
    },
  },
  actions: {
    async fetchProfile({ commit }) {
      const res = await services['获取会员个人信息']()

      commit('profile', res?.data ?? {})
    },
  },
}
