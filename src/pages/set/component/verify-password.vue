<script>
import { defineComponent, reactive, ref, getCurrentInstance, onMounted } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Password from '@/components/Password'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import services from '@/services'
import { useTest, useForm, useLockSecond } from '@/hooks'
import { pick } from 'lodash'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline, Password },
  setup() {
    const self = getCurrentInstance()
    const { isLocked, restSecond, lock } = useLockSecond({
      namespace: 'sms-lock-change-pwd',
      lockSecond: 60,
    })
    const test = useTest()
    const form = useForm({
      data: {
        password: '',
        checkPassword: '',
      },
      rules: {
        password: [
          {
            required: true,
            message: '请输入新密码',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
          },
        ],
        checkPassword: [
          {
            required: true,
            message: '请输入新密码',
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

    const modify = async () => {
      const valid = await form.validate()
      if (!valid) return
      const res = await services['修改密码']({
        newpassword: form.data.password,
        renewpassword: form.data.checkPassword,
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
      navigateTo,
      modify,
      showPwd: false,
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
  onLoad(option) {
    // console.log(this.$u)
    this.form.data.mobile = option.phone
  },
})

export default vm
</script>

<template>
  <view class="w-full">
    <view class="w-full">
      <u-form v-bind="form.config" :ref="form.name">
        <u-form-item prop="password">
          <view class="label">新密码</view>
          <Password placeholder="请输入新密码" v-model="form.data.password" />
        </u-form-item>
        <u-form-item prop="checkPassword">
          <view class="flex mt-20 w-full">
            <view class="flex-1 flex">
              <view class="label">确认密码</view>
              <Password placeholder="请输入新密码" v-model="form.data.checkPassword" />
            </view>
            <!-- <image v-if="showPwd" class="input-icon" src="@/static/icons/hide-pwd-icon.png"></image>
            <image v-if="!showPwd" class="input-icon" src="@/static/icons/show-pwd-icon.png"></image> -->
          </view>
        </u-form-item>
      </u-form>
    </view>

    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30 w-full action">
      <u-button type="primary" class="mt-30" @click="modify">下一步</u-button>
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

.label {
  font-size: 32rpx;
  color: #333;
  width: 128rpx;
  margin-right: 36rpx;
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
