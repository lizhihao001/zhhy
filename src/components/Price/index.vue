<script>
import { computed, defineComponent, ref, toRefs } from '@vue/composition-api'

const vm = defineComponent({
  props: {
    unit: {
      type: String,
      default: '¥',
    },
    value: [String, Number],
  },
  // setup(props, { attrs }) {
  //   const toFixedValue = computed(() => {
  //     return Number(props.value).toFixed(2)
  //   })
  //   return {
  //     toFixedValue,
  //   }
  // },
})

export default vm
</script>

<template>
  <view class="price">
    <text class="unit">{{ unit }}</text>
    <text class="value">{{ Number(value).toFixed(2) }}</text>
  </view>
</template>

<style lang="scss" scoped>
.price {
  display: inline-block;
  color: $color-primary;
}

.unit {
  font-size: 26rpx;
  margin-right: 4rpx;
}

.value {
  font-size: 34rpx;
  font-weight: 700;
}
</style>
