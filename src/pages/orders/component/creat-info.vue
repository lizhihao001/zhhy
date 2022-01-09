<script>
import { defineComponent, reactive, inject } from '@vue/composition-api'
import Card from '@/components/Card'
import CustomService from '@/components/CustomService'
import ContactUs from '@/components/ContactUs'

const vm = defineComponent({
  components: { Card },
  components: {
    CustomService,
    ContactUs,
  },
  setup() {
    const details = inject('orderDetails') // 获取上下文
    const orderStatus = inject('orderDetailsStatus') // 获取上下文

    return {
      details,
      orderStatus,
      async copy(data) {
        uni.setClipboardData({
          data: this.details.out_trade_no,
          success: function () {
            uni.showToast({
              title: '复制成功',
              icon: 'none',
            })
          },
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="card">
    <Card>
      <view class="title">订单信息
        <view class="right">
          <CustomService class="mr-20">
            <view class="zx">咨询
            <image class="img" src="@/static/icons/zx.png">
          </view>
          </CustomService>
          <ContactUs class="mr-20">
            <view class="lx">联系
            <image class="img" src="@/static/icons/lx.png">
          </view>
          </ContactUs>
        </view>
      </view>
      <view class="info flex">
        <view class="label flex-1">订单编号</view>
        <view class="fz" @click="copy()">复制</view>
        <text class="value">{{ details.out_trade_no }}</text>
      </view>
      <view class="info flex">
        <view class="label flex-1">创建时间</view>
        <text class="value">{{ details.create_time }}</text>
      </view>
      <view class="info flex" v-if="orderStatus === '已完成'">    <!-- v-if="orderStatus === '已完成'" -->
        <view class="label flex-1">支付时间</view>
        <text class="value">{{ details.pay_time_text }}</text>
      </view>
      <template v-if="details.refund">
        <view class="info flex">
          <view class="label flex-1">申请退款时间</view>
          <text class="value">{{ details.refund.create_time_text }}</text>
        </view>
        <view class="info flex">
          <view class="label flex-1">退款完成时间</view>
          <text class="value">{{ details.refund.update_time_text }}</text>
        </view>
      </template>
    </Card>
  </view>
</template>

<style lang="scss" scoped>
.card {
  margin-top: 18rpx;
  background: rgba(255, 255, 255, 0.39);
  box-shadow: 0rpx 0rpx 32rpx rgba(128, 128, 128, 0.16);
  border-radius: 18rpx;
  padding: 54rpx;
}

.title {
  font-size: 36rpx;
  color: #333;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  align-content: center;
  .right {
    display: flex;
    padding-top: 6rpx;
    .zx,
    .lx {
      font-size: 28rpx;
      font-weight: 500;
      color: #afb4c1;
      display: flex;
      align-content: center;
      .img {
        width: 40rpx;
        height: 40rpx;
        padding-left: 10rpx;
      }
    }
    .lx {
      padding-left: 42rpx;
    }
  }
}

.info {
  margin-top: 26rpx;
  display: flex;
  align-items: center;
  font-size: 28rpx;
  color: #333;

  .label {
    margin-right: 102rpx;
    color: #666;
  }
  .fz {
    width: 80rpx;
    height: 40rpx;
    background: #ffffff;
    border: 2rpx solid #4da0ed;
    border-radius: 8rpx;
    font-size: 26rpx;
    color: #999999;
    text-align: center;
    margin-right: 26rpx;
  }
}
</style>
