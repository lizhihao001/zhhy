<script>
import { defineComponent, reactive, ref, getCurrentInstance, onMounted } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import Steps from '@/components/Steps'
import Timeline from '@/components/Timeline'
import services from '@/services'
import VerifyMobile from './component/verify-mobile.vue'
import SuccessResult from './component/success-result.vue'
import VerifyPassword from './component/verify-password.vue'
import { useTest, useForm, useLockSecond } from '@/hooks'
import { pick } from 'lodash'

const vm = defineComponent({
  components: { Icon, Card, Steps, Timeline, VerifyMobile, SuccessResult, VerifyPassword },
  setup() {
    const step = ref(1)
    return {
      step,
      numList: [
        {
          name: '验证手机号',
        },
        {
          name: '输入新密码',
        },
        {
          name: '更换成功',
        },
      ],
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="修改密码" :height="50">
      <!-- <template v-slot:right>
        <text class="header-text">注册</text>
      </template> -->
    </u-navbar>
    <view class="steps">
      <!-- <u-steps :list="numList" :current="step - 1" active-color="#4da0ed" un-active-color="#777"></u-steps> -->
      <Steps :list="numList" :current="step - 1" active-color="#4da0ed" un-active-color="#777" mode="number"></Steps>
    </view>

    <view class="mt-30"></view>
    <view class="mt-30"></view>
    <view class="mt-30"></view>

    <VerifyMobile v-if="step === 1" :key="step" mode="old" type="pwd" @next="step = step + 1" />
    <VerifyPassword v-if="step === 2" :key="step" @next="step = step + 1" />
    <SuccessResult v-if="step === 3" text="您已成功更改密码，需重新登录" />
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

.steps {
  width: 100%;
}
</style>
