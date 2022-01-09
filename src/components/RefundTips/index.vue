<script>
import { defineComponent, ref } from '@vue/composition-api'
import services from '@/services'

const vm = defineComponent({
  props: {
    text: {
      type: String,
      default: '平台退款规则',
    },
  },
  setup() {
    const showPopup = ref(false)
    const content = ref('')

    return {
      showPopup,
      content,
      async show() {
        const res = await services['退款说明']({
          type: 1,
        })
        content.value = res?.data
        showPopup.value = true
      },
    }
  },
})

export default vm
</script>

<template>
  <view @click="show" class="refund-rule">
    <slot>
      <image class="tips-icon" src="@/static/icons/tips-icon.png"></image>
      <text class="text">平台退款规则</text>
    </slot>
    <u-popup v-model="showPopup" closeable mode="bottom" class="popup-wrapper">
      <view class="popup-container mt-30">
        <view class="popup-content">
          <view class="refund-tips">退款说明</view>
          <scroll-view scroll-y="true" class="popup-scroll-view">
            <view class="mt-20">
              <u-parse :html="content" />
            </view>
          </scroll-view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<style lang="scss" scoped>
.refund-rule {
  display: flex;
  align-items: center;
  color: #333;
  font-size: 26rpx;
  margin-top: 34rpx;

  .tips-icon {
    height: 56rpx;
    width: 56rpx;
    margin-right: 8rpx;
  }

  // .text {}
}

.refund-tips {
  font-size: 36rpx;
  font-weight: 700;
  position: relative;
  margin-bottom: 60rpx;

  &::before {
    content: '';
    position: absolute;
    bottom: -18rpx;
    width: 20rpx;
    height: 10rpx;
    border-radius: 25rpx;
    background: $color-primary;
  }
}
</style>

<style lang="scss" scoped>
.popup-wrapper {
  /deep/ .u-drawer-content {
    border-top-left-radius: $card-border-radius;
    border-top-right-radius: $card-border-radius;
    // max-height: 60%;
  }

  .popup-container {
    height: 100%;
    flex-direction: column;
  }

  .popup-content {
    padding: 10rpx 56rpx;
    width: 100%;
  }

  .popup-scroll-view {
    flex: 1;
    overflow-y: scroll;
    max-height: 600rpx;

    .scroll-content {
      padding: 10rpx 56rpx;
    }

    // /deep/ {
    //   .uni-scroll-view-content {

    //   }
    // }
  }

  .main {
    .price {
      margin-left: 16rpx;
    }
  }

  .title {
    padding: 0 $wing-gap;
    font-size: 36rpx;
    margin-bottom: 50rpx;

    .icon {
      margin-right: 16rpx;
      color: $color-primary;
    }
  }

  .option {
    &.active {
      .icon {
        color: $color-primary;
      }
    }
    .icon {
      margin-right: 16rpx;
      color: #ccc;
    }
  }
}
</style>
