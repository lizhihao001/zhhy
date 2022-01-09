<script>
import { defineComponent, reactive, ref, computed } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'

import { useForm, useTest, useStore } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  setup() {
    const store = useStore()
    const userInfo = computed(() => store.state?.user?.userInfo ?? {})
    const userProfile = computed(() => store.state?.user?.profile ?? {})
    const test = useTest()
    const form = useForm({
      data: {
        name: userProfile?.value?.name, // '王小虎',
        mobile: userProfile?.value?.mobile, // '18012345678',
        icNo: userProfile?.value?.id_card, // '412928198805281912',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入姓名',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
          },
        ],
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
        icNo: [
          {
            required: true,
            message: '请输入身份证号',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
          },
          {
            validator: (rule, value, callback) => {
              return test.idCard(value)
            },
            message: '身份证号格式不正确',
          },
          // 校验身份证号
          // {
          //   asyncValidator: async (rule, value, callback) => {
          //     const res = await services['身份证验证']({
          //       id_card: value,
          //     })
          //     if (!res?.success) {
          //       callback(new Error('身份证验证失败'))
          //     } else {
          //       // 如果校验通过，也要执行callback()回调
          //       callback()
          //     }
          //   },
          //   // 如果是异步校验，无需写message属性，错误的信息通过Error抛出即可
          //   // message: 'xxx'
          // },
        ],
      },
      // errorType: ['toast'],
    })

    const agree = ref(false)
    const orderInfoParams = uni.getStorageSync('orderInfoParams')

    return {
      agree,
      form,
      async toSubmit() {
        const valid = await form.validate()
        if (!valid) return

        if (!agree.value) {
          uni.showToast({
            icon: 'none',
            title: '请同意协议',
          })
          return
        }

        uni.setStorageSync('orderInfoParams', {
          ...orderInfoParams,
          user_name: form.data.name,
          mobile: form.data.mobile,
          id_number: form.data.icNo,
        })

        // 452123199308133322

        uni.navigateTo({
          url: '/pages/sign-up/submit',
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="在线报名" :height="50"></u-navbar>
    <view class="flex-col">
      <view class="content flex-1">
        <u-form v-bind="form.config" :ref="form.name" label-position="top">
          <u-form-item prop="name" label="姓名">
            <u-input v-model="form.data.name" placeholder="请输入姓名" />
          </u-form-item>
          <u-form-item prop="mobile" label="手机号码">
            <u-input v-model="form.data.mobile" placeholder="请输入手机号码" />
          </u-form-item>
          <u-form-item prop="qq" label="QQ号码（为您提供一对一竭诚服务）">
            <u-input v-model="form.data.qq" placeholder="请输入" />
          </u-form-item>
          <u-form-item prop="icNo" label="身份证号码">
            <u-input v-model="form.data.icNo" placeholder="请输入身份证号码" />
          </u-form-item>
        </u-form>
      </view>
      <view class="footer-area">
        <view class="check flex" @click="agree = !agree">
          <Icon name="checkmark-circle-fill" class="active" :size="40" v-if="agree" />
          <view class="disagree" v-else />
          <text>本人确保以上信息真实有效</text>
        </view>
        <u-button type="primary" @click="toSubmit">下一步</u-button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  .flex-col {
    width: 100%;
  }

  /deep/ {
    .u-form-item--left__content__label::after {
      content: '*';
      display: inline-block;
      color: red;
      margin-left: 16rpx;
    }
  }
}

.disagree {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgb(233, 242, 255);
  margin-right: 10rpx;
}

.content {
  width: 100%;
  padding: 10rpx $wing-gap;
}

.active {
  color: $color-primary !important;
}

.footer-area {
  .check {
    .icon {
      color: #999;
      margin-right: 10rpx;
    }

    margin-bottom: 30rpx;
  }

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.u-btn {
  height: 100rpx;
  border-radius: $card-border-radius;
  box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6);
}
</style>
