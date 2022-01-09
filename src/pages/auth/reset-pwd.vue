<script>
import { defineComponent, reactive, ref, getCurrentInstance, onMounted } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import Password from '@/components/Password'
import Timeline from '@/components/Timeline'
import services from '@/services'
import { useTest, useForm, useLockSecond } from '@/hooks'
import { pick } from 'lodash'

const vm = defineComponent({
  components: { Icon, Card, Password, Timeline },
  setup() {
    const { isLocked, restSecond, lock } = useLockSecond({
      namespace: 'reset_pwd_sms-lock',
      lockSecond: 60,
    })
    const test = useTest()
    const form = useForm({
      data: {
        mobile: '', // '18012345678',
        captcha: '',
        password: '',
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
        captcha: [
          {
            required: true,
            message: '请输入验证码',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
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

    const reset = async () => {
      const valid = await form.validate()
      if (!valid) return
      const res = await services['重置密码']({
        newpassword: form.data.password, // string	是	密码
        mobile: form.data.mobile, // string	是	手机号
        captcha: form.data.captcha, // string	是	验证码
      })

      uni.showToast({
        icon: 'none',
        title: res?.msg ?? '请求失败，请稍后再试',
      })

      if (res?.success) {
        setTimeout(() => {
          uni.reLaunch({ url: '/pages/auth/login-type' })
        }, 1500)
      }

      console.log(res)
    }

    const send = async () => {
      const valid = await form.validate(['mobile'])
      if (!valid) return
      const res = await services['发送手机验证码']({
        // password: form.password, // string	是	密码
        mobile: form.data.mobile, // string	是	手机号
        key: 'reset_pwd_',
        // captcha: form.captcha, // string	是	验证码
      })

      if (res?.msg !== 'ok') {
        uni.showToast({
          icon: 'none',
          title: res?.msg ?? '请求失败，请稍后再试',
        })
      } else {
        // // 开发模式下自动填充 code
        // if (process.env.NODE_ENV === 'development') {
        //   form.data.captcha = res?.data?.code
        // }
        lock()
      }

      console.log(res)
    }

    return {
      isLocked,
      restSecond,
      lock,
      form,
      reset,
      send,
      navigateTo,
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
      <!-- <template v-slot:right>
        <text class="header-text">注册</text>
      </template> -->
    </u-navbar>
    <view class="mt-20"></view>
    <view class="title w-full">
      <view>重置密码</view>
      <!-- <view class="desc mt-30">绑定的手机号{{form.data.mobile}}</view> -->
    </view>
    <view class="mt-20"></view>
    <view class="w-full mt-30">
      <u-form v-bind="form.config" :ref="form.name">
        <u-form-item prop="mobile">
          <u-input class="mt-20" placeholder="请输入手机号" type="number" v-model="form.data.mobile" />
        </u-form-item>
        <u-form-item prop="captcha">
          <view class="flex mt-20 w-full">
            <view class="flex-1">
              <u-input placeholder="请输入验证码" type="number" v-model="form.data.captcha" />
            </view>
            <u-button size="mini" class="ml-20" @click="send" :disabled="isLocked">{{
              isLocked ? `${restSecond}s` : '获取验证码'
            }}</u-button>
          </view>
        </u-form-item>
        <u-form-item prop="password">
          <Password class="mt-20" placeholder="新密码长度8-20位" v-model="form.data.password" />
        </u-form-item>
      </u-form>
    </view>

    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30 w-full action">
      <u-button type="primary" class="mt-30" @click="reset">确认修改</u-button>
      <!-- <u-button type="primary" class="mt-30" plain @click="navigateTo('auth/pwd-login')">密码登录</u-button> -->
    </view>
    <!-- <view class="mt-20 flex w-full">
      <view class="flex-1">
        <text>忘记密码？</text>
      </view>
      <view>快捷登录</view>
    </view> -->

    <!-- <view class="fixed-bottom w-full">
      <u-divider>其他登录</u-divider>
      <view class="mt-30"></view>
      <view class="login-icon flex w-full mt-30">
        <view class="icon-view flex weixin"><Icon name="weixin-fill" /></view>
        <view class="icon-view flex qq"><Icon name="qq-fill" /></view>
      </view>

      <view class="check flex w-full">
        <Icon name="checkmark-circle-fill" :size="40" />
        登录即同意<text @click="navigateTo('terms')">《服务条款，隐私协议》</text>
      </view>
    </view> -->
  </view>
</template>

<style lang="scss" scoped>
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

  .desc {
    font-size: 28rpx;
  }
}

.action {
  .u-btn {
    width: 100%;
    height: 100rpx;
    border-radius: $card-border-radius;
    // box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6);
  }
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
    color: $color-primary;
    margin-right: 10rpx;
  }

  // margin-bottom: 70rpx;
  padding: 70rpx 100rpx 100rpx;
}
</style>
