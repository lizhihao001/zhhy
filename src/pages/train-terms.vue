<script>
import { defineComponent, reactive, ref, getCurrentInstance, onMounted } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import ViewStatus from '@/components/ViewStatus'
import services from '@/services'
import { useTest, useForm, useLockSecond } from '@/hooks'
import { pick, get } from 'lodash'

import dayjs from 'dayjs'

import { useLocalStorage, useService } from '@/hooks'

const vm = defineComponent({
  components: { Icon, Card, ViewStatus },
  setup() {
    const termsService = useService(services['获取培训协议'])

    termsService.fetch()

    return {
      get,
      terms: termsService.data,
      loading: termsService.loading,
    }
  },
})

export default vm
</script>

<template>
  <view class="content w-full">
    <u-navbar :title-size="38" title="调取办证协议" :height="50"> </u-navbar>
    <ViewStatus :loading="loading || !terms">
      <template v-if="!!terms">
        <view class="content-info">
          <u-parse :html="terms || '--'"></u-parse>
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
  padding: 20rpx $wing-gap;
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
  font-size: 28rpx;
  color: #333;
  line-height: 64rpx;
}
</style>
