<script>
import { defineComponent, reactive, ref, getCurrentInstance } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import ThirdLogin from '@/components/ThirdLogin'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import services from '@/services'
import { useTest, useLocalStorage } from '@/hooks'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline, ThirdLogin },
  setup() {
    const test = useTest()

    const phone = useLocalStorage('login-account-number', '') // ref('18012345678')
    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }
    const checkPhone = async () => {
      if (!phone.value) {
        uni.showToast({
          icon: 'none',
          title: '请填写手机号',
        })
        return
      }

      if (!test.mobile(phone.value)) {
        uni.showToast({
          icon: 'none',
          title: '手机号格式不正确',
        })
        return
      }
      // const res = await services['检测手机存在']({
      //   mobile: phone.value,
      // })

      // // console.log(res)

      const pass = true

      // if (!pass) {
      //   uni.showToast({
      //     icon: 'none',
      //     title: res?.msg ?? '验证失败',
      //   })
      // }

      return pass
    }
    const agree = ref(false)

    return {
      agree,
      phone,
      navigateTo,
      async toSms() {
        if (!agree.value) {
          uni.showToast({
            icon: 'none',
            title: '请同意登录协议',
          })
          return
        }
        if (!phone.value) {
          uni.showToast({
            icon: 'none',
            title: '请填写手机号',
          })
          return
        }

        if (!test.mobile(phone.value)) {
          uni.showToast({
            icon: 'none',
            title: '手机号格式不正确',
          })
          return
        }
        navigateTo(`auth/sms-login?phone=${phone.value}`)
      },
      async toPwd() {
        if (!agree.value) {
          uni.showToast({
            icon: 'none',
            title: '请同意登录协议',
          })
          return
        }

        if (!test.mobile(phone.value)) {
          uni.showToast({
            icon: 'none',
            title: '手机号格式不正确',
          })
          return
        }

        navigateTo(`auth/pwd-login?phone=${phone.value}`)
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="" :height="50" :is-back="false">
      <template v-slot:right>
        <text class="header-text" @click="navigateTo('auth/register-account')">注册</text>
      </template>
    </u-navbar>
    <view class="mt-20"></view>
    <view class="title w-full">
      <view>你好！</view>
      <view>欢迎来到武汉海事职业学院</view>
    </view>
    <view class="mt-20"></view>
    <view class="w-full mt-30">

      <u-form>
        <u-form-item prop="mobile">
          <u-input class="mt-20" placeholder="请输入手机号" type="number" v-model="phone" />
        </u-form-item>
      </u-form>
    </view>

    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30 w-full">
      <u-button type="primary" class="mt-30" @click="toSms">获取验证码</u-button>
      <u-button type="primary" class="mt-30" plain @click="toPwd">密码登录</u-button>
    </view>

    <view class="fixed-bottom w-full">
      <u-divider>其他登录</u-divider>
      <view class="mt-30"></view>
      <ThirdLogin />

      <view class="check flex w-full">
        <Icon name="checkmark" :size="26" :class="{ agree }" @click="agree = !agree" />
        登录即同意<text class="terms" @click="navigateTo('terms')">《服务条款，隐私协议》</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.ccontent-wrapper {
  width: 100%;
  height: 600rpx;
}
.terms {
  color: #333;
}
.check {
  color: #999;

  .icon {
    margin-right: 16rpx;
    color: #fff;
    background: #dce5f0;
    border-radius: 8rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32rpx;
    height: 32rpx;
    &.agree {
      background: $color-primary;
    }
  }
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 50rpx $wing-gap 460rpx;
}

.text {
  font-size: 32rpx;
  color: #666;
  text-indent: 40rpx;
}

.image {
  width: 100%;
  margin: 20rpx 0;
}

.title {
  font-size: 48rpx;
}

.u-btn {
  width: 100%;
  height: 100rpx;
  border-radius: $card-border-radius;
  // box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6);
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  padding-top: 20rpx;
  background: #fff;
}

.check {
  .icon {
    // color: $color-primary;
    margin-right: 10rpx;
  }

  // margin-bottom: 70rpx;
  padding: 70rpx 100rpx 100rpx;
}
</style>
