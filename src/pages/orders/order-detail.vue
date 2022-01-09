<script>
import { defineComponent, reactive, onMounted, watch, provide, computed, ref, onActivated } from '@vue/composition-api'
import Card from '@/components/Card'
import Icon from '@/components/Icon'
import Footer from '@/components/Footer'
import OrderInfo from './component/order-info.vue'
import Creatinfo from './component/creat-info.vue'
import OrderStatus from './component/order-status.vue'
import ViewStatus from '@/components/ViewStatus'
import CustomService from '@/components/CustomService'
import ContactUs from '@/components/ContactUs'
import { useService } from '@/hooks'
import services from '@/services'

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
  components: { ContactUs, Icon, Card, Footer, OrderInfo, Creatinfo, OrderStatus, ViewStatus },
  setup() {
    const payType = ref(1)
    const showPayPopup = ref(false)
    const showCancelPopup = ref(false)
    const option = reactive({
      id: '',
      orderStatus: 'unpaid',
      orderType: 'paid',
    })

    const toTextbook = () => {
      uni.navigateTo({
        url: '/pages/course-manage/textbook',
      })
    }

    const orderDetailService = useService(services['订单详情'], {
      initialData: null,
      // presistKey: 'orderDetailService',
    })

    const orderStatus = computed(() => {
      return orderStatusMap[orderDetailService.data?.value?.order_status]
    })

    provide('orderDetails', orderDetailService.data) // 提供上下文
    provide('orderDetailsStatus', orderStatus) // 提供上下文

    const fetch = async () => {
      await orderDetailService.fetch({
        order_id: option.id,
      })
    }

    onMounted(fetch)
    onActivated(fetch)

    const showRevertRefundPopup = ref(false)
    const details = orderDetailService.data

    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    return {
      fetch,
      payType,
      orderStatus,
      toTextbook,
      option,
      details,
      loading: orderDetailService.loading,
      showRevertRefundPopup,
      async revertRefund() {
        const res = await services['撤销申请退款']({
          order_id: details.value?.order_id,
        })

        uni.showToast({
          icon: 'none',
          title: res?.msg,
        })

        fetch()
      },
      async cancel() {
        const res = await services['订单取消']({
          order_id: details.value?.order_id,
        })

        uni.showToast({
          icon: 'none',
          title: res?.msg,
        })

        fetch()
      },
      async pay() {
        const res = await services['订单再次支付']({
          order_id: details.value?.order_id,
          pay_type: payType.value,
        })
		console.log('params',{
          order_id: details.value?.order_id,
          pay_type: payType.value,
        })
        if (!res?.success) {
			console.log('res===',res)
          uni.showToast({
            icon: 'none',
            title: res?.msg,
            duration: 3000,
          })
          return
        }

        // const data = qs.parse(res?.data, {
        //   decode: true,
        // })

        uni.requestPayment({
          provider: {
            1: 'alipay',
            2: 'wxpay',
          }[payType.value],
          orderInfo: res?.data,
          success(res) {
            console.log(res)
            uni.showToast({
              icon: 'success',
              title: '支付成功！',
              duration: 3000,
              mask: true,
            })

            setTimeout(() => {
              navigateTo('pay-success')
            }, 1500)
          },
          fail(err) {
            console.error(err)
            // uni.showModal({
            //   content: `参数类型：${typeof res?.data}
            // ----------- 参数：${typeof res?.data === 'string' ? res?.data : JSON.stringify(res?.data)}
            // ----------- 错误信息：${JSON.stringify(err)}`,
            // })
            uni.showToast({
              icon: 'none',
              title: '支付失败！',
              duration: 3000,
              mask: true,
            })
          },
        })

        fetch()
        showPayPopup.value = false

        console.log(res)
      },
      showPayPopup,
      showCancelPopup,
    }
  },
  onLoad: function (option) {
    this.option.id = option.id
    // this.option.orderStatus = option.orderStatus
    // this.option.orderType = option.orderType
   
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="订单详情" :height="50"></u-navbar>
    <ViewStatus :loading="!details || loading">
      <template v-if="!!details">
        <view class="content">
          
          <OrderStatus :orderStatus="details.orderStatus" @end="fetch" />
          <OrderInfo type="orderDetail" :orderStatus="option.orderStatus" class="mt-50" />
          <Creatinfo class="mt-50" />
        </view>
        <Footer v-if="orderStatus === '待支付'">
          <view class="action-btn">
            <u-button class="btn" type="primary" plain @click="showCancelPopup = true">取消订单</u-button>
            <u-button class="btn" type="primary" @click="showPayPopup = true">支付</u-button>
          </view>
        </Footer>
        <Footer v-if="orderStatus === '申请退款中'">
          <view class="action-btn">
            <u-button class="btn" type="primary" plain> <ContactUs>联系我们</ContactUs></u-button>
            <u-button class="btn z-0" type="primary" @click="showRevertRefundPopup = true">撤销申请</u-button>
          </view>
        </Footer>

        <u-modal
          v-model="showCancelPopup"
          content="确定要取消该订单吗？"
          confirm-text="取消"
          cancel-text="确认"
          :show-cancel-button="true"
          @cancel="cancel"
        >
        </u-modal>

        <u-modal
          v-model="showRevertRefundPopup"
          content="确认撤销退款申请吗？"
          :show-cancel-button="true"
          @confirm="revertRefund"
        >
        </u-modal>

        <u-popup v-model="showPayPopup" mode="bottom" class="popup-wrapper">
          <view class="popup-content">
            <view class="flex">
              <view class="flex-1"></view>
              <view @click="showPayPopup = false">取消</view>
            </view>
            <view class="popup-pay-price">支付金额：{{ details.pay_price }}元</view>
            <Card :padding="false">
              <view class="flex payment" @click="payType = 1">
                <view class="flex flex-1 zhifubao">
                  <Icon name="zhifubao-circle-fill" :size="80" />
                  支付宝支付
                </view>
                <Icon name="checkmark-circle-fill" class="check" :class="{ active: payType === 1 }" :size="40" />
              </view>
              <view class="flex payment" @click="payType = 2">
                <view class="flex flex-1 wechat">
                  <Icon name="weixin-circle-fill" :size="80" />
                  微信支付
                </view>
                <Icon name="checkmark-circle-fill" class="check" :class="{ active: payType === 2 }" :size="40" />
              </view>
            </Card>
            <u-button class="btn mt-50" type="primary" @click="pay()">立即支付</u-button>
          </view>
        </u-popup>
      </template>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
}

.content {
  padding: 0 36rpx;
  margin-top: 10rpx;
  padding-bottom: 200rpx;
}

.loading {
  padding-top: 200rpx;
  justify-content: center;
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

  .z-0 {
    position: relative;
    z-index: 0;
  }

  .btn {
    width: 48%;
    height: 68rpx;
    // margin: 0 15rpx;
  }
}
.payment {
  padding: 40rpx;
  & + .payment {
    margin-top: -40rpx;
  }

  .zhifubao,
  .wechat {
    font-size: 28rpx;
    font-weight: 700;
    color: #888;

    .icon {
      margin-right: 20rpx;
    }
  }

  .zhifubao {
    .icon {
      color: #00a9f2;
    }
  }

  .wechat {
    .icon {
      color: #0abc64;
    }
  }

  .check {
    color: rgba($color-primary, 0.3);

    &.active {
      color: $color-primary;
    }
  }
}
</style>

<style lang="scss" scoped>
.popup-pay-price {
  width: 100%;
  font-size: 32rpx;
  font-weight: 700;
  color: #333;
  text-align: center;
  padding: 30rpx 0;
}
.popup-wrapper {
  /deep/ .u-drawer-content {
    border-top-left-radius: $card-border-radius;
    border-top-right-radius: $card-border-radius;
    // max-height: 90%;
  }

  .popup-container {
    height: 100%;
    flex-direction: column;
  }

  .popup-content {
    padding: 42rpx $wing-gap;
    width: 100%;
  }

  .popup-scroll-view {
    flex: 1;
    overflow-y: scroll;
    max-height: 600rpx;
  }

  .main {
    .price {
      margin-left: 16rpx;
    }
  }

  .title {
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
