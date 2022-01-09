<script>
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  onLoad(option) {
    this.title = option.title ?? ''
    this.src = decodeURIComponent(option.src) ?? ''

    uni.setNavigationBarTitle({
      title: option.title ?? '',
    })
  },
  setup() {
    const title = ref('')
    const src = ref('')

    return {
      title,
      src,
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <!-- <u-navbar :title-size="38" :title="title" :height="50"></u-navbar> -->
    <view class="w-full">
      <web-view class="w-full webview" :src="src"> </web-view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  // padding: 50rpx $wing-gap;
  .webview {
    position: absolute;
    top: calc(50px + var(--status-bar-height));
    height: calc(100vh - 50px - var(--status-bar-height));
  }
}
</style>
