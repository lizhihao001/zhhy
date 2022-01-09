<script>
import { defineComponent, reactive, ref, getCurrentInstance, onMounted, computed } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import services from '@/services'
import { useTest, useForm, useLockSecond, useStore } from '@/hooks'
import { pick } from 'lodash'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  props: {
    mode: String,
    type: String,
  },
  setup(props) {
    const store = useStore()
    const userInfo = computed(() => store.state?.user?.userInfo ?? {})
    const self = getCurrentInstance()
    const { mode, type } = props
    const { isLocked, restSecond, lock } = useLockSecond({
      namespace: `sms-verify-lock-${type}`,
      lockSecond: 60,
    })
    const test = useTest()
    const form = useForm({
      data: {
        mobile: userInfo.value?.mobile, // '18012345678',
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

    const send = async () => {
      const valid = await form.validate(['mobile'])
      if (!valid) return
      const res = await services['发送手机验证码']({
        // password: form.password, // string	是	密码
        mobile: form.data.mobile, // string	是	手机号
        key: mode === 'old' ? 'uppwd_' : 'upmobile_',
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

    const verify = async () => {
      const valid = await form.validate()
      if (!valid) return
      const res = await services[mode === 'old' ? '修改密码验证手机号' : '修改手机号']({
        mobile: form.data.mobile,
        captcha: form.data.captcha,
      })

      if (!res?.success) {
        uni.showToast({
          icon: 'none',
          title: res?.msg ?? '请求失败，请稍后再试',
        })
      } else {
        self.emit('next')
      }
    }

    return {
      isLocked,
      restSecond,
      lock,
      form,
      send,
      verify,
      navigateTo,
      numList: [
        {
          name: '验证手机号',
        },
        {
          name: '绑定新手机号',
        },
        {
          name: '更换成功',
        },
      ],
    }
  },
  // onLoad(option) {
  //   // console.log(this.$u)
  //   this.form.data.mobile = option.phone
  // },
})

export default vm
</script>

<template>
  <view class="w-full">
    <view class="w-full">
      <u-form v-bind="form.config" :ref="form.name">
        <u-form-item prop="mobile">
          <image class="input-icon flex" src="@/static/icons/mobile-icon.png"></image>
          <u-input class="mt-20" placeholder="请输入手机号" type="number" v-model="form.data.mobile" :disabled="mode === 'old'" />
        </u-form-item>
        <u-form-item prop="captcha">
          <view class="flex mt-20 w-full">
            <view class="flex-1 flex">
              <image class="input-icon" src="@/static/icons/code-icon.png"></image>
              <u-input placeholder="请输入验证码" type="number" v-model="form.data.captcha" />
            </view>
            <u-button size="mini" class="ml-20" @click="send" :disabled="isLocked">{{
              isLocked ? `${restSecond}s` : '获取验证码'
            }}</u-button>
          </view>
        </u-form-item>
      </u-form>
    </view>

    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30 w-full action">
      <u-button type="primary" class="mt-30" @click="verify">下一步</u-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.content {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  // width: 100%;
  // padding: 50rpx $wing-gap 460rpx;
}

.input-icon {
  height: 44rpx;
  width: 44rpx;
  margin-right: 40rpx;
}

.text {
  font-size: 32rpx;
  color: #666;
  text-indent: 40rpx;
}

.result-view {
  font-size: 32rpx;
  color: #999;

  .result-icon {
    width: 180rpx;
    height: 180rpx;
    margin-bottom: 32rpx;
  }

  .result-text {
    font-size: 40rpx;
    font-weight: 700;
    color: #3f454e;
    margin-bottom: 20rpx;
  }
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
