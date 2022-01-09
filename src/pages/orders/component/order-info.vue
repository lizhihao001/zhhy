<script>
import { defineComponent, reactive, ref, toRefs, inject, computed } from '@vue/composition-api'
import Card from '@/components/Card'
import Price from '@/components/Price'

const orderStatusMap = {
 1: '待支付',
  2: '已支付',
  3: '申请退款中',
  4: '退款中',
  5: '申请失败',
  6: '退款完成',
  7: '已关闭',
  8: '已取消',
  9: '部分支付',
  10: '交易失败'
}

const vm = defineComponent({
  components: { Card, Price },
  setup(props, { attrs }) {
    // const { type } = toRefs(attrs)
    const isApply = ref(true)
    isApply.value = true
    const toTextbook = () => {
      uni.navigateTo({
        url: '/pages/course-manage/textbook',
      })
    }

    const details = inject('orderDetails') // 获取上下文
    const orderStatus = inject('orderDetailsStatus') // 获取上下文
    
    const type = computed(() => {
      return ['申请退款中', '退款中', '申请失败', '退款完成'].includes(orderStatus.value)
        ? 'refundDetail'
        : 'orderDetail'
    })

    const showRefundPopup = ref(false)

    return {
      showRefundPopup,
      details,
      type,
      isApply,
      toTextbook,
      orderStatus,
      toRefundApply() {
        showRefundPopup.value = false
        uni.setStorageSync('refund-apply-info', {
          orderDetails: details,
          orderDetailsStatus: orderStatus,
        })
        uni.navigateTo({
          url: '/pages/orders/refund-apply',
        })
      },
      toRefundDetail(s, t) {
        uni.navigateTo({
          url: `/pages/orders/refund-detail?orderStatus=${s}&orderType=${t}`,
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view>
    <Card class="car" v-if="type === 'orderDetail'">
      <view class="order-title title">{{ details.plan_name }}</view>
      <view class="details-info gap desc">
        <text>{{ details.code }}</text>
        <text>{{ details.start_time }}开课 {{ details.cycle_num }}</text>
      </view>
      <view class="pay-content">
        <view class="pay-data">
          <text class="price">¥ {{ details.totalPrice }}</text>
          <!-- <Price :value="details.total_price" /> -->
          <text class="number">x{{ details.order_detail.length }}</text>
        </view>
        <view class="refund-btn" v-if="orderStatus === '已支付'" @click="showRefundPopup = true">退款</view>
      </view>
      <view class="course-name" v-for="(item, idx) in details.project_name" :key="idx">{{ item }}</view>
      <!-- <view class="course-name">精通救生艇筏和救助艇培训</view> -->
      <template v-if="['已支付', '待支付'].includes(orderStatus)">
        <view class="info">
          <!-- "train_price": "300.00",  培训费
              "exam_price": "0.00", 考试费
              "textbooks_price": "600.00",    教材费
              "test_price": "200.00",   体检费
              "put_price": "0.00",   住宿费 -->
          <view class="info-item">
            <text class="item-name">培训费用</text>
            <text class="item-value">￥{{ details.order_detail[0].train_price }}</text>
          </view>
          <view class="info-item">
            <text class="item-name">考试费用</text>
            <text class="item-value">￥{{ details.order_detail[0].exam_price }}</text>
          </view>
          <view class="info-item">
            <text class="item-name">教材费用</text>
            <text class="item-value">￥{{ details.order_detail[0].textbooks_price }}</text>
          </view>
          <!-- <view class="info-item">
            <text class="item-name">体检费用</text>
            <text class="item-value">￥{{ details.order_detail[0].test_price }}</text>
          </view> -->
          <view class="info-item">
            <text class="item-name">住宿费用</text>
            <text class="item-value">￥{{ details.order_detail[0].put_price }}</text>
          </view>
          <view class="info-item">
            <view class="info-yj">
              <text class="item-name">邮寄费用</text>
              <text class="item-no">（不包含此费用）</text>
            </view>
            <text class="item-value">￥{{ details.order_detail[0].put_price }}</text>
          </view>
        </view>
        <view class="total-data">
          <text>合计</text>
          <text class="total-price">￥{{ details.totalPrice }}</text>
        </view>
      </template>
      <u-modal v-model="showRefundPopup" content="提示" @confirm="toRefundApply" :show-cancel-button="true">
        <view class="text-align-center mt-50 mb-50">是否确认需要退款</view>
      </u-modal>
    </Card>
    <Card class="car" v-if="type === 'refundDetail'">
      <view class="refund-head">退款信息</view>
      <view class="title">{{ details.plan_name }}</view>
      <view class="details-info gap desc">
        <text>{{ details.code }}批次</text>
        <text>{{ details.start_time }}开课 {{ details.cycle_num }}</text>
      </view>
      <view class="pay-content">
        <view class="pay-data">
          <text class="price">¥ {{ details.total_price }}</text>
          <text class="number">x{{ details.total_num }}</text>
        </view>
      </view>
      <view class="course-name" v-for="(item, idx) in details.project_name || []" :key="idx">{{ item }}</view>
      <!-- <view class="course-name">精通救生艇筏和救助艇培训</view> -->
      <view class="info">
        <view class="info-item">
          <text class="item-name">退款原因</text>
          <text class="item-value">{{ details.refund.reason }}</text>
        </view>
        <view class="info-item">
          <text class="item-name">申请时间</text>
          <text class="item-value">{{ details.refund.create_time_text }}</text>
        </view>
      </view>
    </Card>
  </view>
</template>

<style lang="scss" scoped>
.car {
  .details-info {
    color: #666;
    font-size: 32rpx;
    margin-bottom: 18rpx;

    :first-child {
      :after {
        display: inline-block;
        content: '';
        margin: 0 10rpx;
        height: 26rpx;
        width: 1rpx;
        background: #eaeaea;
      }
    }
  }

  .pay-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32rpx;

    .pay-data {
      font-size: 28rpx;
      color: #999;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .price {
        color: #2680eb;
      }
    }

    .refund-btn {
      width: 124rpx;
      height: 56rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: 2rpx solid #e8e8e8;
      border-radius: 12rpx;
      margin-left: 40rpx;
      color: #999;
    }
  }

  .title {
    position: relative;
    font-size: 40rpx;
    font-weight: 700;
    position: relative;
    color: #333;
    margin-bottom: 12rpx;
  }

  .order-title {
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: -50rpx;
      width: 10rpx;
      border-radius: 25rpx;
      background: $color-primary;
    }
  }

  .desc {
    color: #666;
    font-size: 28rpx;
  }

  .mini-card {
    margin-top: 32rpx;
    display: inline-block;
    padding: 16rpx 22rpx;
    border-radius: $card-border-radius;
    background: $color-primary;
    color: #fff;
  }

  .info {
    padding: 32rpx 0;
    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 46rpx;

      &:last-child {
        margin-bottom: 0;
      }
      .info-yj {
        display: flex;
        .item-no {
          font-size: 28rpx;
          color: #999999;
        }
      }

      .item-name {
        color: #666;
        font-size: 28rpx;
      }

      .item-value {
        color: #333;
        font-size: 28rpx;
      }
    }
  }

  .total-data {
    padding-top: 32rpx;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    border-top: 2px solid #f8f8f8;
    color: #999;
    font-size: 28rpx;

    .total-price {
      color: #333;
      margin-left: 6rpx;
      font-size: 36rpx;
    }
  }

  .course-name {
    width: 100%;
    height: 76rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #f4f9ff;
    color: #4da0ed;
    font-size: 26rpx;
    padding-left: 26rpx;
    margin-bottom: 20rpx;
  }
}

.refund-head {
  color: #333;
  font-size: 36rpx;
  margin-bottom: 34rpx;
  font-weight: 700;
}
</style>
