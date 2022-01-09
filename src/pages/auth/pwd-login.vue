<script>
import { defineComponent, reactive, ref, getCurrentInstance, computed, inject } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import Password from '@/components/Password'
import Timeline from '@/components/Timeline'
import ThirdLogin from '@/components/ThirdLogin'
import services from '@/services'
import { useTest, useForm, useStore } from '@/hooks'

const vm = defineComponent({
  components: { Icon, Card, Password, Timeline, ThirdLogin },
  setup(...args) {
    const store = useStore()
    const test = useTest()
    const agree = ref(false)
    const form = useForm({
      data: {
        mobile: '', // '18012345678',
        password: '', // '12345678',
      },
      rules: {
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
          },
          {
            validator: (rule, value, callback) => {
              return test.mobile(value)
            },
            message: '手机号格式不正确',
          },
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
          },
        ],
      },
      errorType: ['toast'],
    })
    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }
    const redirectTo = (url) => {
      uni.redirectTo({
        url: `/pages/${url}`,
      })
    }

    const login = async () => {
      const valid = await form.validate()
      if (!valid) return

      if (!agree.value) {
        uni.showToast({
          icon: 'none',
          title: '请同意登录协议',
        })
        return
      }

      const res = await services['会员登录']({
        account: form.data.mobile,
        password: form.data.password,
      })

      console.log(res)

      uni.showToast({
        icon: 'none',
        title: res?.msg,
      })
      console.log('res====',res)
      if (res?.success) {
        store.commit('user/userInfo', res?.data?.userinfo)
        store.commit('user/token', res?.data?.userinfo?.token)

        if (res?.data?.userinfo?.label_id === '') {
          navigateTo('auth/label-select')
          return
        }

        setTimeout(() => {
          uni.reLaunch({ url: '/pages/tab/index' })
        }, 500)
      }
    }

    return {
      form,
      login,
      navigateTo,
      agree,
    }
  },
  onLoad(option) {
    // console.log(this.$u)
    this.form.data.mobile = option.phone
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="" :height="50">
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
      <u-form v-bind="form.config" :ref="form.name">
        <u-form-item prop="mobile">
          <u-input class="mt-20" placeholder="请输入手机号" type="number" v-model="form.data.mobile" />
        </u-form-item>
        <u-form-item prop="password">
          <Password class="mt-20" placeholder="请输入密码" v-model="form.data.password" />
        </u-form-item>
      </u-form>
    </view>

    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30 w-full">
      <u-button type="primary" class="mt-30" @click="login">登录</u-button>
      <!-- <u-button type="primary" class="mt-30" plain @click="navigateTo('auth/pwd-login')">密码登录</u-button> -->
    </view>
    <view class="mt-20 flex w-full">
      <view class="flex-1">
        <!-- <text @click="navigateTo('auth/reset-pwd')">忘记密码？</text> -->
      </view>
      <!-- <view>快捷登录</view> -->
      <view><text @click="navigateTo('auth/reset-pwd')">忘记密码？</text></view>
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

.check {
  .icon {
    // color: $color-primary;
    margin-right: 10rpx;
  }

  // margin-bottom: 70rpx;
  padding: 70rpx 100rpx 100rpx;
}
</style>
