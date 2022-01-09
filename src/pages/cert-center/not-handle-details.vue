<script>
import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import { random } from 'lodash'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import Price from '@/components/Price'
import Timeline from '@/components/Timeline'
import { useService } from '@/hooks'
import services from '@/services'
import CustomService from '@/components/CustomService'
import ContactUs from '@/components/ContactUs'

const vm = defineComponent({
  components: { CustomService, ContactUs, Icon, Card, Price, Timeline },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    console.log(option.id) //打印出上个页面传递的参数

    this.option.id = option.id
    this.fetch({
      cid: option.id,
    })
  },
  setup(...args) {
    const option = reactive({
      id: null,
    })

    const notHandleCertDetails = useService(services['证书详情'], {
      // initialData: {},
      // presistKey: 'notHandleCertDetails',
    })
    // notHandleCertDetails.fetch()
    // watch(option, () => {
    //   notHandleCertDetails.fetch({
    //     cid: option.id,
    //   })
    // })

    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    const details = notHandleCertDetails.data

    return {
      option,
      random,
      loading: notHandleCertDetails.loading,
      fetch: notHandleCertDetails.fetch,
      details,
      tags: ['副标题显示位置'],
      navigateTo,
      toHandle() {
        uni.setStorageSync('certHandleInfo', {
          details: details.value,
          params: {
            cid: details.value?.id, //	string	是	证书ID
            // name: '', //	string	是	姓名
            // mobile: '', //	string	是	手机号
            // id_card: '', //	string	是	身份证号码
            // pwd: '', //	string	是	平台密码
            // remark: '', //	string	是	备注
            // address_id: '', //	string	是	收货地址ID
            // pay_type: '', //	string	是	支付方式
          },
        })
        navigateTo('cert-center/handle')
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="详情" :height="50"></u-navbar>
    <template v-if="!!details || !loading">
      <Card>
        <view class="title">{{ details.name }}</view>
        <view class="mt-20">
          <u-tag v-if="details.sub_title" :text="details.sub_title" mode="plain" shape="circle" />
        </view>
        <view class="mt-20 flex price-bar">
          <Price :value="Number(details.price)"></Price>
        </view>
      </Card>

      <Card class="info-card">
        <view class="title">详情</view>
        <view v-for="idx in 1" :key="idx" class="section">
          <!-- <view class="sub-title">副标题副标题</view> -->
          <view class="desc">
            <view class="mt-20">
              <u-parse :html="details.content"></u-parse>
            </view>
            <!-- <view class="mt-20">1.按时参与培训和考试，携带好各类证件报名报到内容 显示处。</view>
            <view class="mt-20">2.可通过app查看学习进度及课程表安排，按时参加相 关培训和考试。</view>
            <view class="mt-20">3.在学校培训期间遵纪守法。</view> -->
          </view>
        </view>
      </Card>

      <view class="footer fixed">
        <u-row class="footer-content" justify="between">
          <u-row class="main">
            <CustomService class="action">
              <image class="img" src="@/static/icons/zx.png">
              <text>咨询</text>
            </CustomService>
            <ContactUs class="action">
              <image class="img" src="@/static/icons/lx.png">
              <text>联系</text>
            </ContactUs>
          </u-row>
          <u-button shape="square" type="primary" @click="toHandle">立即办理</u-button>
        </u-row>
      </view>
    </template>

    <view class="loading w-full flex" v-else>
      <u-loading mode="flower" :size="60"></u-loading>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  min-height: 100vh;
  padding: 50rpx $wing-gap 200rpx;
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

.section + .section {
  margin-top: 60rpx;
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

.desc {
  color: #666;
}

.footer {
  &.fixed {
    position: fixed;
    z-index: 100;
    bottom: 0;
    left: 0;
    right: 0;
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
      .img{
        width: 40rpx;
        height: 40rpx;
        padding-left: 8rpx;
      }
    }
  }

  .footer-content {
    padding: 20rpx 40rpx;
    background: #f8f6f9;
    border-radius: $card-border-radius;
  }
}

.empty {
  padding-top: 150rpx;
}

.loading {
  padding-top: 200rpx;
  justify-content: center;
}
</style>
