<script>
import { defineComponent, reactive, ref, getCurrentInstance, onMounted } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import ViewStatus from '@/components/ViewStatus'
import services from '@/services'
import VerifyMobile from './component/verify-mobile.vue'
import SuccessResult from './component/success-result.vue'
import { useTest, useForm, useLockSecond } from '@/hooks'
import { pick, get } from 'lodash'

import dayjs from 'dayjs'

import { useLocalStorage, useService } from '@/hooks'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, ViewStatus, VerifyMobile, SuccessResult },
  setup() {
    const aboutUsService = useService(services['关于我们'])

    aboutUsService.fetch()

    return {
      get,
      aboutUs: aboutUsService.data,
      loading: aboutUsService.loading,
    }
  },
})

export default vm
</script>

<template>
  <view class="content w-full">
    <u-navbar :title-size="38" :title="get(aboutUs, 'title', '关于我们')" :height="50"> </u-navbar>
    <image class="logo" src="@/static/icons/logo-icon.png"></image>

    <view class="name">智慧海院APP</view>
    <view class="version">1.2.1版本</view>
    <ViewStatus :loading="loading || !aboutUs">
      <template v-if="!!aboutUs">
        <view class="content-info">
          <u-parse :html="get(aboutUs, 'content', '--')"></u-parse>
        </view>
      </template>
    </ViewStatus>
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

.logo {
  width: 242rpx;
  height: 242rpx;
  margin-bottom: 6rpx;
}

.name {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 4rpx;
}

.version {
  font-size: 28rpx;
  color: #999;
  margin-top: 5rpx;
}

.content-info {
  margin-top: 42rpx;
  font-size: 28rpx;
  color: #333;
  line-height: 64rpx;
}
</style>
