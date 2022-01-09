<script>
import { defineComponent, reactive, ref, watch, onMounted, onActivated } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import Price from '@/components/Price'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import Empty from '@/components/Empty'

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
  components: { Empty, Icon, Card, SignUpInforCard, Timeline, Price },
  setup() {
    const payType = ref(1)
    const showPayPopup = ref(false)
    const showCancelPopup = ref(false)

    const currentTab = ref(0)
    const handleTabChange = (index) => {
      currentTab.value = index
    }

    const orderListService = useService(services['订单列表'], {
      initialData: [],
      presistKey: 'orderList',
      dataFilter: (data) => data?.list ?? [],
    })

    const fetch = async () => {
      console.log(currentTab.value)
      const status =
        [
          '', // 全部
          '1', // 待支付
          '2', // 已支付
          '4', // 退款
        ][currentTab.value] || ''

      orderListService.fetch({
        status,
        page: '',
        pageSize: '',
      })
    }

    watch(currentTab, fetch)

    onMounted(fetch)
    onActivated(fetch)
    // // eslint-disable-next-line no-debugger
    // debugger

    // 订单列表

    const payInfo = ref({})

    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    return {
      show: false,
      timestamp: 86400,
      async cancel(info) {
        
        const res = await services['订单取消']({
          order_id: payInfo.value?.order_id,
        })

        uni.showToast({
          icon: 'none',
          title: res?.msg,
        })

        fetch()
      },
      showCancel(info) {
        console.log('info,ifn',info)
        payInfo.value = info
        this.showCancelPopup = true
      },
      showPay(info) {
        payInfo.value = info
        showPayPopup.value = true
      },
      async pay() {
        const res = await services['订单再次支付']({
          order_id: payInfo.value?.order_id,
          pay_type: payType.value,
        })

        if (!res?.success) {
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
      currentTab,
      showCancelPopup: false,
      handleTabChange,
      dataList: orderListService.data,
      msg: orderListService.msg,
      tabList: [
        {
          name: '全部',
        },
        {
          name: '待支付',
        },
        {
          name: '已支付',
        },
        {
          name: '退款',
        },
      ],
      toDetails(item) {
        uni.navigateTo({
          url: `/pages/orders/order-detail?id=${item?.order_id}`,
        })
      },
      payType,
      payInfo,
      orderList: [
        { type: 'paid', statusLabel: '待支付', status: 'unpaid' },
        { type: 'paid', statusLabel: '已支付', status: 'paid' },
        { type: 'refund', statusLabel: '退款中', status: 'theRefund' },
        { type: 'refund', statusLabel: '退款完成', status: 'haveRefund' },
      ],
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="我的订单" :height="50"> </u-navbar>
    <view class="subsection-bar w-full">
      <view class="subsection w-full">
        <u-subsection
          bg-color="#f7f7f7"
          :height="76"
          :list="tabList"
          :current="currentTab"
          @change="handleTabChange"
          active-color="#4da0ed"
        ></u-subsection>
      </view>
    </view>
    <view class="list" v-if="(dataList || []).length > 0">
      <Card v-for="(item, idx) in dataList" :key="idx" :padding="false" class="item" @click="toDetails(item)">
        <view class="pay-info">
          <text class="time">{{ item.create_time_text }}</text> <!-- 剩余时间 -->
          <!-- <u-count-down :timestamp="timestamp"></u-count-down> -->
          <text class="status">{{ item.status_name }}</text>
        </view>
        <view class="order-info">
          <view class="title">{{ item.plan_name }}</view>
          <view class="info">
            <text>{{ item.code }}</text>
            <text>{{ item.start_time }}开课 {{ item.cycle_num }}</text>
          </view>
          <view class="pay-content">
            <text class="price">¥ {{ item.pay_price }}</text>
            <text class="number">x{{ item.total_num }}</text>
          </view>
          <view class="action-btn" v-if="item.order_status == 1">
            <u-button class="btn"  type="primary" plain @click="showCancel(item)">取消订单</u-button>
            <u-button class="btn" type="primary" @click="showPay(item)">支付</u-button>
          </view>
        </view>
      </Card>
    </view>
    <view class="empty" v-else>
      <Empty></Empty>
    </view>

    <!-- <u-modal
      v-model="showCancelPopup"
      content="确认取消订单吗？"
      confirm-text="取消"
      cancel-text="确认"
      :show-cancel-button="true"
      @cancel="cancel"
    >
    </u-modal> -->

    <u-popup v-model="showCancelPopup" mode="bottom" border-radius="24">
      <view class="popup">
        <text class="cancel">取消订单</text>
        <text class="determine">确定要取消该订单吗？</text>
        <u-line color="#F7F7F7" margin="40rpx 0 40rpx 0" />
        <text class="cancel">取消原因</text>
        <u-input
          placeholder="请输入取消原因"
          placeholder-style="color: #666666; font-size: 28rpx;"
          type="textarea"
          height="318"
          maxlength="999"
          :clearable="false"
        />
        <view class="btn">
          <view class="btn-qr" @click="cancel(info)">确认</view>
          <view class="btn-qx" @click="showCancelPopup = false;">取消</view>
        </view>
      </view>
    </u-popup>

    <u-popup v-model="showPayPopup" mode="bottom" class="popup-wrapper">
      <view class="popup-content">
        <view class="flex">
          <view class="flex-1"></view>
          <view @click="showPayPopup = false">取消</view>
        </view>
        <view class="popup-pay-price">支付金额：{{ payInfo.pay_price }}元</view>
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
  </view>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: calc(30rpx + 50px);
  // padding: 50rpx $wing-gap;
}

.subsection-bar {
  position: fixed;
  z-index: 100;
  top: calc(50px + var(--status-bar-height));
  left: 0;
  padding: 10rpx 56rpx 20rpx;
  background: #fff;
}

.subsection {
  border-radius: $card-border-radius;
  padding: 20rpx 30rpx;
  background: #f7f7f7;

  /deep/ .u-item-bg {
    box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
  }
}

.tabs-list {
  position: fixed;
  top: calc(50px + var(--status-bar-height));
  z-index: 2;
  width: 750rpx;
  height: 80rpx;
  background: #fff;
}

.u-tag {
  border: none !important;

  &.u-mode-plain-primary {
    background-color: rgba($color-primary, 0.1) !important;
  }
}

.u-tag + .u-tag {
  margin-left: 20rpx;
}

.list {
  width: 100%;
  padding: 50rpx $wing-gap;

  .item {
    padding: 24rpx 34rpx;
  }

  .pay-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 28rpx;
    border-bottom: 2px solid #f8f8f8;
    padding-bottom: 18rpx;
    margin-bottom: 24rpx;

    .time {
      color: #999;
    }

    .status {
      color: #ff0000;
    }
  }

  .order-info {
    .title {
      color: #333;
      font-size: 36rpx;
      font-weight: 700;
      margin-bottom: 20rpx;
    }

    .info {
      color: #666;
      font-size: 28rpx;
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
      font-size: 28rpx;
      color: #999;

      .price {
        color: #2680eb;
      }
    }

    .action-btn {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      margin-top: 30rpx;

      .btn {
        width: 172rpx;
        height: 68rpx;
        margin: 0 15rpx;
        color: #ffffff;
      }
    }
  }
}

/deep/ .u-btn--primary--plain{
  background-color: #ffffff !important;
}
.empty {
  padding-top: 150rpx;
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
.popup {
  padding: 12rpx 56rpx 38rpx 56rpx;
  display: flex;
  flex-direction: column;
  .cancel {
    font-size: 32rpx;
    font-weight: bold;
    color: #333333;
    padding-bottom: 30rpx;
  }
  .determine {
    font-size: 36rpx;
    color: #666666;
    border-radius: 20rpx;
  }
  .btn {
    // width: 100%;
    // height: 116rpx;
    background: #f7f7f7;
    padding: 16rpx 30rpx;
    display: flex;
    margin-top: 44rpx;
    border-radius: 14rpx;
    .btn-qr , .btn-qx{
      width: 280rpx;
      height: 96rpx;
      background-color: #D9EBFB;
      color: #ffffff;
      border-radius: 14rpx;
      font-size: 32rpx;
      font-weight: 500;
      text-align: center;
      padding-top: 26rpx;
    }
    .btn-qx{
      background-color: #4DA0ED;
      margin-left: 30rpx;
    }
  }
}
.u-input {
  border-radius: $card-border-radius;
  padding: 0rpx 10rpx 0rpx 10rpx !important;
  background: #ffffff;
  border: 2rpx solid #eeeeee;
  font-size: 28rpx;
  color: #666666;
}
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
