<template>
  <view class="card" :class="{ block, shadow, padding }" @click="$emit('click')">
    <slot></slot>
  </view>
</template>

<script>
import { defineComponent, toRefs } from '@vue/composition-api'

const vm = defineComponent({
  setup(props, { attrs }) {
    const { block = true, shadow = true, padding = true } = toRefs(attrs)

    return {
      padding,
      block,
      shadow,
    }
  },
})

export default vm
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  border-radius: $card-border-radius;

  & + & {
    margin-top: 50rpx;
  }

  &.padding {
    padding: 50rpx;
  }

  &.block {
    width: 100%;
  }

  &.shadow {
    box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
  }

  // .title {
  //   font-size: 40rpx;
  //   font-weight: 700;
  //   position: relative;

  //   &::before {
  //     content: '';
  //     position: absolute;
  //     top: 0;
  //     bottom: 0;
  //     left: -50rpx;
  //     width: 10rpx;
  //     border-radius: 25rpx;
  //     background: #50a1ec;
  //   }
  // }

  // .desc {
  //   margin-top: 20rpx;
  //   color: #666;
  //   font-size: 28rpx;
  // }

  // .mini-card {
  //   margin-top: 32rpx;
  //   display: inline-block;
  //   padding: 16rpx 22rpx;
  //   border-radius: $card-border-radius;
  //   background: #50a1ec;
  //   color: #fff;
  // }

  // .u-time-axis {
  //   margin-top: 40rpx;
  //   padding-left: 56rpx;

  //   &::before {
  //     left: 16rpx;
  //     bottom: 56rpx;
  //     border-left: 1px dashed #666;
  //   }
  // }
}
</style>
