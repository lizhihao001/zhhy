<script>
import { defineComponent, toRefs } from '@vue/composition-api'

const vm = defineComponent({
  setup(props, { attrs }) {
    return {
      ...toRefs(attrs),
    }
  },
})

export default vm
</script>

<template>
  <view class="timeline">
    <u-time-line>
      <u-time-line-item node-top="2" v-for="(item, idx) in data" :key="idx" :class="{ active: item.active }">
        <template v-slot:node>
          <slot name="node" :item="item"><view class="timeline-node"></view></slot>
        </template>
        <template v-slot:content>
          <slot :item="item">
            <view>
              <view class="timeline-title">{{ item.name }}</view>
              <view class="timeline-time">{{ item.time }}</view>
            </view>
          </slot>
        </template>
      </u-time-line-item>
    </u-time-line>
  </view>
</template>

<style lang="scss" scoped>
.timeline {
  .u-time-axis {
    margin-top: 40rpx;
    padding-left: 56rpx;

    &::before {
      left: 16rpx;
      // bottom: 56rpx;
      border-left: 1px dashed #666;
    }
  }
}

.u-time-axis-item:last-child {
  &::after {
    content: '';
    width: 40rpx;
    position: absolute;
    top: 0;
    bottom: 0;
    left: -40rpx;
    background: #fff;
    z-index: 0;
    transform: translateX(-50%);
  }
}

.active {
  .timeline-node {
    border: 10rpx solid #50a1ec;
  }

  .timeline-title {
    color: #50a1ec;
  }
}

.timeline-time,
.timeline-title {
  position: relative;
  left: 10rpx;
}

.timeline-node {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: #fff;
  border: 10rpx solid #ccc;
}

.timeline-title {
  color: #333333;
  font-weight: bold;
  font-size: 36rpx;
}

.timeline-time {
  margin-top: 10rpx;
  color: rgb(200, 200, 200);
  font-size: 30rpx;
}
</style>
