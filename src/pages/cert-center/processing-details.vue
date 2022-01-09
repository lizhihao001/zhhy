<script>
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import { random } from 'lodash'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import Price from '@/components/Price'
import Timeline from '@/components/Timeline'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Icon, Card, Price, Timeline },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    console.log(option.id) //打印出上个页面传递的参数

    this.option.id = option.id
    this.fetch({
      order_id: option.id,
    })
  },
  setup(...args) {
    const option = reactive({
      id: null,
    })

    const processingCertDetails = useService(services['办理中证书详情'], {
      initialData: {},
      presistKey: 'processingCertDetails',
    })
    // const details = computed(() => {
    //   return processingCertDetails.data.value?.[0] || {}
    // })

    return {
      details: processingCertDetails.data,
      option,
      random,
      tags: ['副标题显示位置'],
      fetch: processingCertDetails.fetch,
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="详情" :height="50"></u-navbar>
    <template>
      <Card class="cert-type-card">
        <view class="flex cert-type">
          <view class="info-content flex-1">
            <view class="name">{{ details.status_text }}</view>
            <view class="cert-status">您的考试成绩及格</view>
          </view>
          <Icon name="photo-fill" :size="70" />
        </view>
      </Card>

      <Card class="mail-info" v-if="!!details.address">
        <view class="flex">
          <view class="icon-area flex">
            <Icon name="map-fill" :size="40" />
          </view>
          <view class="flex-1">
            
            <view class="flex">
              <view class="user-name">{{ details.address.name }}</view>
              <view class="phone">{{ details.address.mobile }}</view>
            </view>
            <view class="address mt-20">{{ details.address.address }}</view>
          </view>
        </view>
      </Card>

      <Card>
        <view class="title">{{ details.certificate_name }}</view>
        <view class="mt-20">
          <u-tag v-if="details.sub_title" :text="details.sub_title" mode="plain" shape="circle" />
        </view>
        <view class="mt-20 flex price-bar">
          <Price :value="details.pay_price"></Price>
        </view>
      </Card>

      <Card class="info-card">
        <view class="sub-title">{{ details.certificate_name }}</view>
        <u-cell-group :border="false">
          <u-cell-item
            :border-bottom="false"
            :arrow="false"
            title="订单编号"
            :value="details.out_trade_no || '--'"
          ></u-cell-item>
          <u-cell-item
            :border-bottom="false"
            :arrow="false"
            title="支付时间"
            :value="details.pay_time || '--'"
          ></u-cell-item>
          <u-cell-item
            :border-bottom="false"
            :arrow="false"
            title="取证方式"
            :value="details.get_type || '--'"
          ></u-cell-item>
        </u-cell-group>
      </Card>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  min-height: 100vh;
  padding: 50rpx $wing-gap;
}

.cert-type-card {
  background: #429aeb;
  height: 270rpx;
  box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6) !important;
}

.cert-type {
  height: 100%;
  color: #fff;
}

.name {
  font-size: 42rpx;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 16rpx;
}

.cert-status {
  font-size: 30rpx;
}
.title {
  font-size: 36rpx;
  font-weight: 700;
  position: relative;
  margin-bottom: 30rpx;

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

.sub-title {
  font-size: 32rpx;
  font-weight: 700;
  position: relative;
  margin-bottom: 50rpx;

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

.u-tag {
  border: none !important;

  &.u-mode-plain-primary {
    background-color: rgba($color-primary, 0.1) !important;
  }
}

.u-tag + .u-tag {
  margin-left: 20rpx;
}

.info-card {
  /deep/ {
    .u-cell {
      padding: 16rpx 0;
    }
  }
}

.mail-info {
  .icon-area {
    background: $color-primary;
    width: 72rpx;
    height: 72rpx;
    border-radius: 50%;
    justify-content: center;
    color: #fff;
    margin-right: 28rpx;
    box-shadow: 0rpx 0rpx 16rpx rgba($color-primary, 0.6);
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
}
</style>
