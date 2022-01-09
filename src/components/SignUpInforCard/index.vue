<script>
import { computed, defineComponent, toRefs } from '@vue/composition-api'
import { isArray } from 'lodash'

import Card from '../Card'
import SignUpInforBar from '../SignUpInforBar'

const vm = defineComponent({
  components: { Card, SignUpInforBar },
  props: {
    tags: Array,
  },
  setup(props, { attrs }) {
    const { ...rest } = toRefs(attrs)

    return {
      ...rest,
      price: rest.price,
      count: rest.count,
    }
  },
})

export default vm
</script>

<template>
  <Card class="sign-up-infor-card" @click="$emit('click')">
    <view class="title">
      <slot name="title">{{ title }}</slot>
    </view>
    <view class="gap desc">
      <slot></slot>
    </view>
    <view class="gap">
      <u-tag v-for="(tag, idx) in tags" :key="idx" :text="tag" mode="plain" shape="circle" />
    </view>

    <slot name="infor-bar">
      <SignUpInforBar class="gap" :price="price" :count="count">
        <!-- <slot name="price"></slot> -->
      </SignUpInforBar>
    </slot>
  </Card>
</template>

<style scoped lang="scss">
.card {
  border-radius: 13px;
  .gap {
    margin-bottom: 32rpx;
    &:last-child{
      margin-bottom: 0;
    }
  }

  .title {
    font-size: 40rpx;
    font-weight: 700;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 10rpx;
      height: 36rpx;
      left: -50rpx;
      width: 10rpx;
      border-radius: 25rpx;
      background: $color-primary;
    }
  }

  .desc {
    color: #666;
    font-size: 28rpx;
    margin-bottom: 24rpx;
  }
}

.u-tag {
  border: none !important;

  &.u-mode-plain-primary {
    background-color: rgba($color-primary, 0.1) !important;
  }
}

.u-tag  {
  margin-right: 20rpx;
  margin-top: 20rpx;
}
</style>
