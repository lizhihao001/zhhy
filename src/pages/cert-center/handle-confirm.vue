<script>
import { defineComponent, onActivated, onDeactivated, onMounted, reactive, ref } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import ViewStatus from '@/components/ViewStatus'
import Price from '@/components/Price'
import { get } from 'lodash'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, ViewStatus, Price },
  onShow() {
    if (this.fetch) {
      this.fetch()
    }
  },
  onHide() {
    if (this.fetch) {
      this.fetch()
    }
  },
  setup() {
    const { details, params: orderInfoParams } = uni.getStorageSync('certHandleInfo')
    const msg = ref(orderInfoParams.remark)

    const certHandlePreviewService = useService(services['证书订单预览'])
    const addressService = useService(services['收货地址'])

    const fetch = () => {
      certHandlePreviewService.fetch({
        ...orderInfoParams,
        treaty: '1',
      })
      addressService.fetch()
    }

    onMounted(fetch)

    // 1 支付宝 2 微信
    const payType = ref(1)
    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    const address = addressService.data

    const agree = ref(false)

    return {
      fetch,
      msg,
      get,
      agree,
      navigateTo,
      payType,
      details,
      address,
      preview: certHandlePreviewService.data,
      loading: certHandlePreviewService.loading,
      async confirmPay() {
        if (!agree.value) {
          uni.showToast({
            icon: 'none',
            title: '请同意协议',
            duration: 3000,
          })
          return
        }

        const res = await services['确认证书订单']({
          ...orderInfoParams,
          remark: msg.value,
          address_id: address.value?.id,
          pay_type: payType.value,
          // pay_price: Number(details.value.totalPrice),
        })
        if (!res?.success) {
          uni.showToast({
            icon: 'none',
            title: res?.msg ?? '请求错误，请稍后再试',
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
            console.log('pay zs res',res)
            uni.showToast({
              icon: 'success',
              title: '支付成功！',
              duration: 3000,
              mask: true,
            })

            setTimeout(() => {
              navigateTo('pay-success?type=1')
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
    <u-navbar :title-size="38" title="确认订单" :height="50"></u-navbar>
    <ViewStatus :loading="loading" :empty="!preview">
      <template v-if="!!preview">
        <view class="content flex-1">
          <Card>
            <view class="flex" @click="navigateTo('cert-center/add-address')">
              <view class="icon-area"> <Icon name="map-fill" :size="50" /></view>
              <view class="flex flex-1" v-if="!address">
                <view class="flex-1">请输入邮寄地址</view>
                <Icon name="arrow-right" :size="40" />
              </view>
              <view class="flex flex-1" v-else>
                <view class="flex-1">
                  <view class="flex">
                    <view class="user-name">{{ get(address, 'name', '--') }}</view>
                    <view class="phone">{{ get(address, 'mobile', '--') }}</view>
                  </view>
                  <view class="address mt-20"
                    >{{ get(address, 'area', '--') }} {{ get(address, 'address', '--') }}</view
                  >
                </view>
                <Icon name="arrow-right" :size="40" />
              </view>
            </view>
          </Card>

          <SignUpInforCard :title="get(preview, 'cdata.name', '--')" :tags="[]">
            <template v-slot:infor-bar>{{ null }}</template>
            <u-tag :text="get(preview, 'cdata.sub_title', '--') || '--'" mode="plain" shape="circle" />
            <view class="desc mt-30">
              <u-parse :html="get(preview, 'cdata.content', '--')" />
            </view>
            <Price :value="get(preview, 'order_data.total_price', '--')" />
            <!-- <view v-for="idx in 2" :key="idx" class="train-item">某某课程培训 {{ idx }}</view> -->
            <u-cell-group>
              <u-cell-item
                title="办证费"
                :value="`¥ ${get(preview, 'cdata.price', '--')}`"
                :arrow="false"
              ></u-cell-item>
            </u-cell-group>
            <u-form ref="uForm" label-position="top">
              <u-form-item label="留言"><u-input type="textarea" v-model="msg" :clearable="false" /></u-form-item>
            </u-form>
            <view class="flex mt-30">
              <view class="flex-1"></view>
              <view> 合计：<Price :value="get(preview, 'order_data.total_price', '--')" /> </view>
            </view>
          </SignUpInforCard>
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
        </view>

        <view class="footer fixed footer-area">
          <view class="check flex" @click="agree = !agree">
            <Icon name="checkmark-circle-fill" class="active" :size="40" v-if="agree" />
            <view class="disagree" v-else />
            <view
              >我已阅读并同意<text class="terms-entry" @click="navigateTo('train-terms')">《调取办证协议》</text></view
            >
          </view>

          <u-row class="footer-content" justify="between">
            <u-row class="main"> 需支付 <Price :value="preview.order_data.total_price" /> </u-row>
            <u-button shape="square" type="primary" @click="confirmPay">立即支付</u-button>
          </u-row>
        </view>
      </template>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.disagree {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgb(233, 242, 255);
  margin-right: 10rpx;
}

.terms-entry {
  color: $color-warning;
}

.u-tag {
  border: none !important;

  &.u-mode-plain-primary {
    background-color: rgba($color-primary, 0.1) !important;
  }
}
.terms {
  color: $color-warning;
}
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 250rpx;
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

.check {
  .icon {
    color: #999;
    margin-right: 10rpx;
  }
  .active {
    color: $color-primary !important;
  }

  // margin-bottom: 30rpx;
}

.train-item {
  border-radius: $card-border-radius;
  padding: 20rpx 26rpx;
  background-color: #f7f7f7;
  color: #333;
  font-size: 26rpx;
  margin-top: 20rpx;
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
  // height: 184rpx;
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

  .check {
    margin-bottom: 30rpx;
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

.icon-area {
  display: flex;
  justify-content: center;
  align-items: center;
  background: $color-primary;
  border-radius: 50%;
  overflow: hidden;
  color: #fff;
  padding: 16rpx;

  margin-right: 30rpx;
}

.loading {
  padding-top: 200rpx;
  justify-content: center;
}

.user-name {
  font-size: 38rpx;
  font-weight: 700;
  margin-right: 12rpx;
}

.phone {
  font-size: 26rpx;
  color: #999;
}
</style>
