<script>
import { computed, defineComponent, toRefs, ref } from '@vue/composition-api'
import clamp from 'lodash/clamp'

const vm = defineComponent({
  setup(props, { attrs }) {
    // const { count = ref(0), isDot = ref(true), size = ref(50), ...rest } = toRefs(attrs)

    // const clampedCount = computed(() => {
    //   // console.log(count.value, clamp(count.value, 0, 100))

    //   return clamp(count.value, 0, 100)
    // })

    return {
      // count: clampedCount,
      // isDot,
      // size,
      // ...rest,
    }
  },
})

export default vm
</script>

<template>
  <view class="footer fixed">
    <slot></slot>
  </view>
</template>

<style lang="scss" scoped>
.footer {
  &.fixed {
    position: fixed;
    // z-index: 99999;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  width: 100%;
  // min-height: 184rpx;
  padding: 28rpx $wing-gap;
  background: #fff;
}
</style>
