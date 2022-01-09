<script>
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  setup() {
    return {}
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="地图" :height="50"></u-navbar>
    <view class="w-full">
      <map class="w-full map"> </map>
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
  .map {
    height: calc(100vh - 50px);
  }
}

.text {
  font-size: 32rpx;
  color: #666;
  text-indent: 40rpx;
}

.image {
  width: 100%;
  margin: 20rpx 0;
}

.contact-us {
  width: 100%;
  padding: 26rpx 40rpx;
  background: #f4faff;
  border-radius: $card-border-radius;

  .title {
    font-size: 32rpx;
    font-weight: 500;
    color: #2781eb;
    margin-bottom: 10rpx;
  }

  .info-line {
    margin-top: 18rpx;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}

.u-btn {
  width: 100%;
  height: 100rpx;
  border-radius: $card-border-radius;
  box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6);
}
</style>
