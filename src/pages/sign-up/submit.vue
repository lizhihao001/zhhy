<script>
import { defineComponent, provide, reactive, ref, watch } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import Price from '@/components/Price'
import dayjs from 'dayjs'
import qs from 'qs'
import get from 'lodash/get'
import ViewStatus from '@/components/ViewStatus'

import { useService, useTest } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { ViewStatus, Icon, Card, SignUpInforCard, Timeline, Price },
  setup() {
    const orderInfoParams = uni.getStorageSync('orderInfoParams')
    const previewDetailsService = useService(services['订单预览'])

    // console.log(orderInfoParams, {
    //   plan_id: orderInfoParams?.plan_id,
    //   project_ids: orderInfoParams?.project_ids,
    //   pack_project_ids: orderInfoParams?.pack_project_ids,
    // })

    previewDetailsService.fetch({
      plan_id: orderInfoParams?.plan_id,
      project_ids: orderInfoParams?.project_ids,
      pack_project_ids: orderInfoParams?.pack_project_ids,
    })
    const form = reactive({
      msg: '',
    })

    // 1 支付宝 2 微信
    const payType = ref(1)

    const details = previewDetailsService.data

    watch(previewDetailsService.msg, () => {
      if ([/报名人数已满/, /库存不足/].some((reg) => reg.test(previewDetailsService.msg.value))) {
        setTimeout(() => {
          uni.navigateBack({
            delta: 2,
          })
        }, 2000)
      }
    })

    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    return {
      get,
      payType,
      loading: previewDetailsService.loading,
      msg: previewDetailsService.msg,
      toCoupons() {
        uni.navigateTo({
          url: `/pages/tab/Coupons`
        })
      },
      // dayjs,
      format(date, formatType) {
        return dayjs(date).format(formatType)
      },
      form,
      details,
      labels: [
        { key: 'price', label: '培训费' },
        { key: 'exam_price', label: '考试费' },
        { key: 'room_price', label: '住宿费' },
        // totalPrice: "培训费",
        { key: 'test_price', label: '体检费' },
        { key: 'textbooks_price', label: '教材费' },
      ],
      async signUp() {
        const res = await services['提交订单']({
          ...orderInfoParams,
          mark: form.msg,
          pay_type: payType.value,
          pay_price: Number(details.value.totalPrice),
        })
        console.log('提交订单res======', res)
        if (!res?.success) {
          uni.showToast({
            icon: 'none',
            title: res?.msg,
            duration: 3000,
          })
          return
        }

        const data = qs.parse(res?.data, {
          decode: true,
        })

        uni.requestPayment({
          provider: {
            1: 'alipay',
            2: 'wxpay',
          }[payType.value],
          orderInfo: res?.data?.paymentParams ?? res?.data?.payment_params ?? res?.data,
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
            //             uni.showModal({
            //               content: `参数类型：${typeof res?.data}
            // ----------- 参数：${typeof res?.data === 'string' ? res?.data : JSON.stringify(res?.data)}
            // ----------- 错误信息：${JSON.stringify(err)}`,
            //             })
            uni.showToast({
              icon: 'none',
              title: '支付失败！',
              duration: 3000,
              mask: true,
            })

            setTimeout(() => {
              const orderId = res?.data?.orderId ?? res?.data?.order_id
              if (orderId) {
                uni.redirectTo({
                  url: `/pages/orders/order-detail?id=${orderId}`,
                })
              } else {
                uni.navigateBack({
                  delta: 2,
                })
              }
            }, 3000)
          },
        })

        console.log(res)
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper flex-col">
    <u-navbar :title-size="38" title="提交订单" :height="50"></u-navbar>

    <ViewStatus :loading="loading || !details" :empty="!details" :text="msg">
      <template v-if="!!details">
        <view class="content flex-1">
          <SignUpInforCard :title="get(details, 'title', '--')" :tags="[]">
            <template v-slot:infor-bar>{{ null }}</template>
            <view class="desc"
              >{{ get(details, 'code', '--') }}批次 | {{ get(details, 'start_time', '--') }}开课
              {{ get(details, 'cycle_num', '--') }}</view
            >
            <view v-for="(item, idx) in get(details, 'course', [])" :key="idx" class="train-item"
              >{{ item }}
              <view class="time">
                {{ !details.start_time ? '--' : format(details.start_time, 'MM月DD日') }}开课 |
                {{ get(details, 'cycle_num', '--') }}
              </view>
            </view>
            <u-cell-group>
              <u-cell-item
                v-for="(config, idx) in labels"
                :key="idx"
                :title="config.label"
                :value="`¥${get(details.price_detail, [config.key], '--')}`"
                :arrow="false"
              ></u-cell-item>
            </u-cell-group>
            <u-form :model="form" ref="uForm" label-position="top">
              <u-form-item label="留言"
                ><u-input
                  v-model="form.msg"
                  placeholder="建议留言前先与商家沟通确认"
                  type="textarea"
                  :clearable="false"
              /></u-form-item>
            </u-form>
            <view class="flex mt-30">
              <view class="flex-1"></view>
              <view class="hj"> 合计：<Price class="active" :value="get(details, 'totalPrice', 0)" /> </view>
            </view>
          </SignUpInforCard>
          <Card>
            <view class="Coupons" @click="toCoupons">
              <view class="Coupons-left">
                <image class="Coupons-img" src="@/static/icons/quan.png">
                <text class="Coupons-text">优惠券</text>
              </view>
              <text class="Coupons-right">一张可用</text>
            </view>
          </Card>
          <Card :padding="false">
            <view class="flex payment" @click="payType = 1">
              <view class="flex flex-1 zhifubao">
                <Icon name="zhifubao-circle-fill" :size="80" />
                支付宝支付
              </view>
              <Icon name="checkmark" class="check" :class="{ active: payType === 1 }" :size="26" />
              <!-- <image class="check" :class="{ active: payType === 1 }" src="@/static/icons/xuanzhong.png"> -->
            </view>
            <view class="flex payment" @click="payType = 2">
              <view class="flex flex-1 wechat">
                <Icon name="weixin-circle-fill" :size="80" />
                微信支付
              </view>
              <Icon name="checkmark" class="check" :class="{ active: payType === 2 }" :size="26" />
              <!-- <image class="check" :class="{ active: payType === 2 }" src="@/static/icons/weixuanzhong.png"> -->
            </view>
          </Card>
        </view>
        <view class="agree">
          <text class="agree-tit">支付即同意</text>
          <text class="agree-tit active">《服务条款，隐私协议》</text>
        </view>
        <view class="footer fixed footer-area">
          <u-row class="footer-content" justify="between">
            <u-row class="main"> 需支付 <Price :value="get(details, 'totalPrice', 0)" /> </u-row>
            <u-button shape="square" type="primary" @click="signUp">立即支付</u-button>
          </u-row>
        </view>
      </template>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 200rpx;
}

.content {
  width: 100%;
  padding: 20rpx $wing-gap;
}

.title {
  .icon {
    margin-right: 16rpx;
    position: relative;
    left: -10rpx;
    color: $color-primary;
  }
  margin-bottom: 50rpx;

  color: #333;
  font-size: 40rpx;
  font-weight: 700;
}

.desc {
  margin-bottom: 30rpx;
}

.train-item {
  border-radius: $card-border-radius;
  padding: 20rpx 26rpx;
  background-color: #f7f7f7;
  color: #333333;
  font-size: 26rpx;
  margin-top: 20rpx;
  font-weight: 400;
  .time {
    font-size: 22rpx;
    font-weight: 500;
    color: #666666;
    padding-top: 6rpx;
  }
}
.hj {
  font-size: 28rpx;
  font-weight: 400;
  color: #999999;
}
.Coupons {
  display: flex;
  justify-content: space-between;
  align-content: center;
  .Coupons-left {
    display: flex;
    padding-top: 6rpx;
    .Coupons-img {
      width: 48rpx;
      height: 43rpx;
    }
    .Coupons-text {
      font-size: 32rpx;
      color: #666666;
      padding-left: 20rpx;
    }
  }
  .Coupons-right {
    background: #e95536;
    border-radius: 8rpx;
    padding: 10rpx 20rpx;
    color: #fff;
  }
}
.price {
  padding-left: 10rpx;
  &.active {
    color: #333333;
    font-size: 36rpx;
    font-weight: 500;
    padding: 0;
  }
}
.u-cell-box {
  margin-top: 30rpx;

  /deep/ {
    .u-cell {
      padding: 14rpx 0;
    }

    .u-border-top:after {
      border-top-width: 0px !important;
    }

    .u-border-bottom:after {
      border-bottom-width: 0px !important;
    }
  }
}

.u-form {
  .u-border-bottom:after {
    border-bottom-width: 0px !important;
  }

  .u-input {
    border-radius: $card-border-radius;
    padding: 20rpx 26rpx !important;
    background-color: #f3f3f3;
  }
}
/deep/ .u-form-item--left {
  font-weight: 600;
}
/deep/ .u-cell__value {
  color: #333333;
}
.agree {
  display: flex;
  justify-content: center;
  padding: 20rpx 0 10rpx 0;
  .agree-tit {
    color: #cbcbcb;
    font-size: 24rpx;
    &.active {
      color: #333333;
    }
  }
}
.footer {
  &.fixed {
    position: fixed;
    // z-index: 99999;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }

  width: 100%;
  height: 184rpx;
  padding: 28rpx $wing-gap;
  background: #fff;

  .main {
    flex: 1;

    .action {
      display: flex;
      flex-direction: column;
      color: #aaa;

      + .action {
        margin-left: 40rpx;
      }
    }
  }

  .footer-content {
    padding: 20rpx 40rpx;
    background: #f8f6f9;
    border-radius: $card-border-radius;
  }
}

.payment {
  padding: 40rpx 40rpx;
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
    background: #dce5f0;
    color: #fff;
    width: 32rpx;
    height: 32rpx;
    border-radius: 8rpx;
    display: flex;
    justify-content: center;
    align-content: center;

    &.active {
      // color: $color-primary;
      color: #fff;
      background: #4da0ed;
    }
  }
}
</style>
