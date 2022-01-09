<script>
import { defineComponent, provide, ref } from '@vue/composition-api'
import Card from '@/components/Card'
import Icon from '@/components/Icon'
import Footer from '@/components/Footer'
import RefundTips from '@/components/RefundTips'

import ViewStatus from '@/components/ViewStatus'
import OrderInfo from './component/order-info.vue'
import Creatinfo from './component/creat-info.vue'
import OrderStatus from './component/order-status.vue'

import get from 'lodash/get'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { ViewStatus, Icon, Card, Footer, RefundTips, OrderInfo, Creatinfo, OrderStatus },
  setup() {
    const { orderDetails, orderDetailsStatus: orderStatus } = uni.getStorageSync('refund-apply-info')
    console.log(orderDetails)
    const details = ref(orderDetails.value)

    provide('orderDetails', details) // 提供上下文
    provide('orderDetailsStatus', orderStatus) // 提供上下文
    const toTextbook = () => {
      uni.navigateTo({
        url: '/pages/course-manage/textbook',
      })
    }

    const refundReasonListService = useService(services['订单退款原因'], {
      // initialData: [],
      // presistKey: 'refundReasonListService',
      dataFilter: (data) => Object.values(data ?? {}) ?? [],
    })

    refundReasonListService.fetch({
      order_id: orderDetails.value.order_id,
    })

    const showReasonPicker = ref(false)
    const selectedReason = ref(null)
    const remark = ref('')
    const refundReasonList = refundReasonListService.data

    return {
      get,
      loading: refundReasonListService.loading,
      refundReasonList,
      toTextbook,
      details,
      orderStatus,
      selectedReason,
      remark,
      showReasonPicker,
      selectReason([idx]) {
        const range = refundReasonList.value.slice(0)
        selectedReason.value = range[idx]
        // console.log(data)
      },
      async refundApply() {
        console.log('selectedReason.value',selectedReason.value)
        if (!selectedReason.value) {
          uni.showToast({
            icon: 'none',
            title: '请选择退款原因',
          })

          return
        }

        if (!remark.value && selectedReason.value === '其它') {
          uni.showToast({
            icon: 'none',
            title: '请输入退款备注说明',
          })

          return
        }

        const res = await services['申请退款']({
          order_id: orderDetails.value.order_id,
          reason: selectedReason.value,
          remark: remark.value,
        })

        if (res?.success) {
          uni.showToast({
            icon: 'none',
            title: res?.msg,
          })

          setTimeout(() => {
            uni.navigateBack()
          }, 2000)
        } else {
          uni.showToast({
            icon: 'none',
            title: res?.msg ?? '请求错误，请稍后再试',
          })
        }
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="退款申请" :height="50"></u-navbar>
    <ViewStatus :loading="loading || !details || !refundReasonList">
      <template v-if="!!refundReasonList">
        <view class="content">
          <Card class="car">
            <view class="order-title title">{{ details.title }}</view>
            <view class="details-info gap desc">
              <text>{{ get(details, 'code', '--') }}批次</text>
              <text>{{ get(details, 'start_time', '--') }}开课 {{ get(details, 'cycle_num', '--') }}</text>
            </view>
            <view class="pay-content">
              <view class="pay-data">
                <text class="price">¥ {{ details.totalPrice }}</text>
                <!-- <Price :value="get(details, 'total_price', '--')" /> -->
                <text class="number">x{{ details.order_status }}</text>
              </view>
            </view>
            <view class="course-name" v-for="(item, idx) in get(details, 'project_name', [])" :key="idx">{{
              item
            }}</view>
          </Card>
          <Card class="refund-reason mt-50">
            <view class="reason-title">退款信息</view>
            <view class="reason-select">
              <text>退款原因</text>
              <view class="select-content" @click="showReasonPicker = true">
                <text>{{ '请选择' }}</text>
                <image class="seletcte-icon" src="@/static/icons/seletcte-icon.png"></image>
                <u-picker mode="selector" v-model="showReasonPicker" @confirm="selectReason" :range="refundReasonList">
                </u-picker>
              </view>
              <!-- <view class="select-content" v-else>
                <text>请选择</text>
              </view> -->
            </view>

            <view v-if="!!selectedReason" class="course-name flex">
              <view class="flex-1">
                {{ selectedReason }}
              </view>
              <!-- <Icon name="checkmark" class="mr-20" :size="40" /> -->
            </view>
            <!-- <view
              class="course-name flex"
              v-for="(name, idx) in refundReasonList.slice(0, 3)"
              :key="idx"
              @click="selectedReason = name"
            >
              <view class="flex-1">
                {{ name }}
              </view>
              <Icon name="checkmark" class="mr-20" v-if="selectedReason === name" :size="40" />
            </view> -->
          </Card>

          <Card class="refund-reason">
            <view class="reason-title">退款信息</view>
            <view class="reason-input">
              <u-input type="textarea" placeholder="请具体输入退款备注说明" height="160" v-model="remark" />
            </view>
          </Card>

          <RefundTips></RefundTips>
        </view>
        <Footer>
          <view class="action-btn">
            <u-button class="btn" type="primary" @click="refundApply">提交</u-button>
          </view>
        </Footer>
      </template>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
}

.content {
  padding: 0 $wing-gap;
  margin-top: 10rpx;
  padding-bottom: 150rpx;
}

.refund-reason {
  .reason-title {
    color: #333;
    font-size: 36rpx;
    margin-bottom: 26rpx;
    font-weight: 700;
  }

  .reason-input {
    background: #f3f3f3;
    border-radius: 12rpx;
    padding: 18rpx 24rpx;
  }

  .reason-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #666;
    font-size: 28rpx;
    margin-bottom: 34rpx;

    .select-content {
      color: #999;
      display: flex;
      align-items: center;

      .seletcte-icon {
        height: 36rpx;
        width: 36rpx;
        margin-left: 5rpx;
      }
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

.rule {
  display: flex;
  align-items: center;
  color: #333;
  font-size: 28rpx;
  margin-top: 34rpx;

  .tips {
    height: 56rpx;
    width: 56rpx;
    margin-right: 8rpx;
  }
}
.action-btn {
  // position: fixed;
  // bottom: 0rpx;
  // left: 36rpx;
  // right: 36rpx;
  // // width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #f7f7f7;
  padding: 20rpx;
  border-radius: 12rpx;
  // height: 100rpx;

  .btn {
    flex: 1;
    height: 68rpx;
    margin: 0 15rpx;
  }
}

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
</style>
