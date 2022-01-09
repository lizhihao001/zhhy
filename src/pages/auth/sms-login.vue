<script>
import { defineComponent, reactive, ref, onMounted, inject } from '@vue/composition-api'
// import { useStore } from 'vuex'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import { useLockSecond, useStore } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  setup() {
    const store = useStore()
    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }
    const { isLocked, restSecond, lock, reset } = useLockSecond({
      namespace: 'sms-lock-user-login',
      lockSecond: 60,
    })
    const phone = ref('')
    const codes = reactive([])
    const show = ref(false)

    const add = (value) => {
      if (codes.length >= 6) {
        return
      }
      codes.push(value)
    }

    const del = () => {
      codes.pop()
    }

    const clear = () => {
      while (codes.length > 0) {
        del()
      }
    }

    const login = async () => {
      // const valid = await form.validate()
      // if (!valid) return

      const res = await services['手机验证码登录']({
        mobile: phone.value,
        captcha: codes.join(''),
      })

      console.log(res)

      await uni.showToast({
        icon: 'none',
        title: res?.msg,
      })

      if (res?.success) {
        store.commit('user/userInfo', res?.data?.userinfo)
        store.commit('user/token', res?.data?.userinfo?.token)

        if (res?.data?.userinfo?.label_id === '') {
          navigateTo('auto/label-select')
          return
        }

        setTimeout(() => {
          uni.reLaunch({ url: '/pages/tab/index' })
        }, 500)
      }
    }

    const send = async () => {
      if (isLocked.value) {
        return
      }
      // const valid = await form.validate(['mobile'])
      // if (!valid) return
      const res = await services['发送手机验证码']({
        // password: form.password, // string	是	密码
        mobile: phone.value, // string	是	手机号
        key: 'user_login_',
        // captcha: form.captcha, // string	是	验证码
      })

      if (res?.msg !== 'ok') {
        uni.showToast({
          icon: 'none',
          title: res?.msg ?? '请求失败，请稍后再试',
        })
      } else {
        uni.showToast({
          icon: 'none',
          title: '验证码已发送至手机号，请注意查收', // String(res?.data?.code),
          duration: 3000,
        })

        clear()
        // String(res?.data?.code).split('').forEach(add)

        show.value = true
        lock()
      }

      console.log(res)
    }

    onMounted(() => {
      send()
    })

    return {
      isLocked,
      restSecond,
      lock,
      phone,
      codes,
      show,
      add,
      del,
      send,
      login,
      navigateTo,
    }
  },
  onLoad(option) {
    // console.log(this.$u)
    this.phone = option.phone
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="" :height="50">
      <!-- <template v-slot:right>
        <text class="header-text">登录</text>
      </template> -->
    </u-navbar>
    <view class="mt-20"></view>
    <view class="title w-full">
      <view>输入验证码</view>
      <view class="desc mt-30" v-if="isLocked">验证码已发送至手机号{{ phone }}</view>
      <view class="desc my-30" v-else>请手动点击发送验证码至手机号{{ phone }}</view>
    </view>

    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30"></view>

    <view class="w-full code-area" @click="show = true">
      <view class="flex">
        <view
          class="code flex-1 flex"
          :class="{
            pass: idx - 1 <= codes.length,
            active: idx - 1 == codes.length,
          }"
          v-for="idx in 6"
          :key="idx"
        >
          {{ codes[idx - 1] }}
        </view>
      </view>
    </view>

    <view
      class="send-msg"
      :class="{
        locked: isLocked,
      }"
    >
      <text v-if="!isLocked" @click="send">发送手机验证码</text>
      <text v-else>重新发送{{ restSecond }}s</text>
    </view>

    <u-keyboard
      ref="uKeyboard"
      mode="number"
      :dot-enabled="false"
      :mask="false"
      v-model="show"
      @change="add"
      @backspace="del"
      @confirm="login"
    ></u-keyboard>
    <!-- <view class="mt-20"></view>
    <view class="w-full mt-30">
      <u-input class="mt-20" placeholder="请输入手机号"/>
      <view class="flex mt-20">
        <view class="flex-1">
          <u-input placeholder="请输入验证码" />
        </view>
        <u-button size="mini">获取验证码</u-button>
      </view>
      <u-input class="mt-20" placeholder="新密码长度8-20位" type="password" />
    </view>

    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30 w-full action">
      <u-button type="primary" class="mt-30">绑定</u-button>
      <u-button type="primary" class="mt-30" plain @click="navigateTo('auth/pwd-login')">密码登录</u-button>
    </view>
    <view class="mt-20 flex w-full">
      <view class="flex-1">
        <text>忘记密码？</text>
      </view>
      <view>绑定已有账号</view>
    </view>

    <view class="fixed-bottom w-full">
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

.code {
  justify-content: center;
  width: 72rpx;
  height: 92rpx;
  border: 2rpx solid #f4f4f4;
  opacity: 1;
  border-radius: 6rpx;
  position: relative;

  & + & {
    margin-left: 36rpx;
  }

  &.active,
  &.pass {
    border: 2rpx solid #2680eb;
    box-shadow: 0rpx 6rpx 12rpx #e2efff;
  }

  &.active {
    &::after {
      content: '';
      width: 2rpx;
      height: 50%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: #666;
      animation: blink infinite 0.8s;
    }
  }
}

@keyframes blink {
  0% {
    opacity: 0;
  }

  49% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 1;
  }
}

.code-area {
  padding: 30rpx;
}
</style>
