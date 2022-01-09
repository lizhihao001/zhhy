<script>
import { defineComponent } from '@vue/composition-api'
import Empty from '../Empty'

const vm = defineComponent({
  components: { Empty },
  props: {
    loading: Boolean,
    empty: Boolean,
    mode: {
      type: String,
      default: 'data',
    },
    src: String,
    title: String,
    text: String,
  },
  setup() {},
})

export default vm
</script>

<template>
  <view class="loading w-full flex" v-if="loading">
    <u-loading mode="flower" :size="60"></u-loading>
  </view>
  <view class="empty w-full" v-else-if="empty">
    <Empty :src="src" :title="title" :text="text"></Empty>
  </view>
  <view class="w-full" v-else>
    <slot></slot>
  </view>
</template>

<style lang="scss" scoped>
.empty {
  padding-top: 150rpx;
}

.loading {
  padding-top: 200rpx;
  justify-content: center;
}
</style>
