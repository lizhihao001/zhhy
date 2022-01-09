<script>
import { computed, defineComponent, toRefs, ref } from '@vue/composition-api'
import clamp from 'lodash/clamp'

const vm = defineComponent({
  props: {
    count: {
      type: Number,
      default: 0,
    },
    isDot: {
      type: Boolean,
      default: true,
    },
    size: {
      type: Number,
      default: 50,
    },
    name: String,
  },
  setup(props, { attrs }) {
    return {
      clamp,
    }
  },
})

export default vm
</script>

<template>
  <view class="icon" @click="$emit('click')">
    <u-badge :count="clamp(count, 0, 100)" :is-dot="isDot" type="error" :offset="[0, 0]"> </u-badge>
    <u-icon :size="size" :name="name" />
  </view>
</template>

<style lang="scss" scoped>
.icon + .icon {
  margin-left: 18rpx;
}

.icon {
  display: inline-block;
  position: relative;

  // color: #999;
}
</style>
