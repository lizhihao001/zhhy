<script>
import { computed, defineComponent, ref, toRefs } from '@vue/composition-api'
import Icon from '../Icon'

import { useStore } from '@/hooks'
import services from '@/services'

const getOpenId = (provider) =>
  new Promise((resolve, reject) => {
    uni.getProvider({
      service: 'oauth',
      fail: reject,
      success(res) {
        console.log(res)
        // 支持微信、qq和微博等
        uni.login({
          provider,
          fail: reject,
          success(loginRes) {
            let access_token = loginRes.authResult.access_token
            let openid = loginRes.authResult.openid
            console.log('-------获取openid(unionid)-----')
            console.log('token', access_token)
            console.log('openid', openid)
            // console.log(JSON.stringify(loginRes))
            // loginResRef.value = loginRes
            resolve(openid)

            // emit('success', openid)
            // 获取用户信息
            // uni.getUserInfo({
            //   provider,
            //   success(infoRes) {
            //     console.log('-------获取微信用户所有-----')
            //     console.log(JSON.stringify(infoRes.userInfo))

            //     infoResRef.value = infoRes
            //     showPopup.value = true
            //   },
            // })
          },
        })
      },
    })
  })

export default defineComponent({
  components: { Icon },
  props: {},
  setup(props, { emit }) {
    const store = useStore()
    const loginResRef = ref({})
    const infoResRef = ref({})
    const showPopup = ref(false)

    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    return {
      showPopup,
      loginResRef,
      infoResRef,
      navigateTo,
      async thirdLogin(provider) {
        try {
          const openId = await getOpenId(provider)
          // const openId = 'oRrdQt4-iVk8Skh3KEmoJRFmx2wk'
          const platform =
            {
              weixin: 'wechat',
            }[provider] ?? provider

          const res = await services['第三方登录']({
            platform: platform,
            open_id: openId,
          })
          console.log('loginres===',res)
          const hasBindAccount = res?.data?.is_bind_mobile === 0

          if (hasBindAccount) {
            store.commit('user/userInfo', res?.data?.userinfo)
            store.commit('user/token', res?.data?.userinfo?.token)

            setTimeout(() => {
              uni.reLaunch({ url: '/pages/tab/index' })
            }, 500)
          } else {
            navigateTo(`auth/bind-account?openId=${openId}&platform=${platform}`)
          }

          console.log(res)
        } catch (err) {
          console.error(err)
        }

        // navigateTo('auth/bind-account')
      },
      async copy(data) {
        uni.setClipboardData({
          data,
          success: function () {
            uni.showToast({
              title: '复制成功',
              icon: 'none',
            })
          },
        })
      },
    }
  },
})
</script>

<template>
  <view class="login-icon flex w-full mt-30">
    <view class="icon-view flex weixin" @click="thirdLogin('weixin')"><Icon name="weixin-fill" /></view>
    <view class="icon-view flex qq" @click="thirdLogin('qq')"><Icon name="qq-fill" /></view>

    <u-modal v-model="showPopup">
      <view class="connect-popup mt-30 mb-50">
        <u-button class="mt-20" @click="copy(JSON.stringify(loginResRef))">复制登录信息</u-button>
        <u-button class="mt-20" @click="copy(JSON.stringify(infoResRef))">复制用户信息</u-button>
        <scroll-view class="content-wrapper" scroll-x scroll-y>
          <view>
            <view>登录信息</view>
            <view>{{ JSON.stringify(loginResRef) }}</view>
          </view>
          <view class="mt-50">
            <view>用户信息</view>
            <view>{{ JSON.stringify(infoResRef) }}</view>
          </view>
        </scroll-view>
      </view>
    </u-modal>
  </view>
</template>

<style lang="scss" scoped>
.login-icon {
  justify-content: center;
}

.icon-view {
  justify-content: center;
  width: 104rpx;
  height: 104rpx;
  background: #f5f5f5;
  border-radius: 50%;

  &.weixin {
    .icon {
      color: #1ad725;
    }
  }

  &.qq {
    .icon {
      color: #2680eb;
    }
  }
}

.icon-view + .icon-view {
  margin-left: 30rpx;
}
</style>
