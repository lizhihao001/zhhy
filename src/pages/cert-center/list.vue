<script>
import { defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import Price from '@/components/Price'
import SignUpInforCard from '@/components/SignUpInforCard'
import Empty from '@/components/Empty'
import Timeline from '@/components/Timeline'
import services from '@/services'

import { useLocalStorage, useService } from '@/hooks'

const vm = defineComponent({
  components: { Empty, Icon, Card, SignUpInforCard, Timeline, Price },
  onLoad(option) {
    //option为object类型，会序列化上个页面传递的参数
    // console.log(option.id) //打印出上个页面传递的参数

    if (typeof option.tabIdx !== 'undefined') {
      this.currentTab = Number(option.tabIdx) || 0
    }
  },
  setup() {
    const currentTab = ref(0)
    const handleTabChange = (index) => {
      currentTab.value = index
    }

    const myCertFetcher = useService(services['我的证书'], {
      initialData: [],
      presistKey: 'myCertList',
      needErrorToast: false,
    })
    const otherFetcher = useService(services['未办理证书'], {
      initialData: [],
      presistKey: 'otherList',
      needErrorToast: false,
    })
    const ongoingFetcher = useService(services['办理中证书列表'], {
      initialData: [],
      presistKey: 'ongoingList',
      needErrorToast: false,
    })

    const fetch = ref(myCertFetcher.fetch)
    fetch.value()

    watch(currentTab, () => {
      fetch.value = [myCertFetcher.fetch, otherFetcher.fetch, ongoingFetcher.fetch][currentTab.value]
      fetch.value()
    })

    return {
      myCertMsg: myCertFetcher.msg,
      otherMsg: otherFetcher.msg,
      ongoingMsg: ongoingFetcher.msg,
      fetch,
      currentTab,
      handleTabChange,
      myCertList: myCertFetcher.data,
      otherList: otherFetcher.data,
      ongoingList: ongoingFetcher.data,
      tabList: [
        {
          name: '已有证书',
        },
        {
          name: '证书管理',
        },
        {
          name: '办理中',
        },
      ],
      tags: ['副标题显示位置'],
      navigateTo(url) {
        uni.navigateTo({
          url: `/pages/${url}`,
        })
      },
      toDetails() {
        uni.navigateTo({
          url: '/pages/learn-online/details',
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="证书中心" :height="50"> </u-navbar>
    <view class="subsection-bar w-full">
      <view class="subsection w-full">
        <u-subsection
          bg-color="#f7f7f7"
          :height="94"
          :list="tabList"
          :current="currentTab"
          @change="handleTabChange"
          active-color="#4da0ed"
        ></u-subsection>
      </view>
    </view>
    <view class="list" v-if="currentTab === 0">
      <template v-if="(myCertList || []).length > 0">
        <Card v-for="(item, idx) in myCertList" :key="idx">
          <view class="item flex">
            <view class="flex-1 flex">
              <Icon name="file-text-fill" class="item-icon" :size="70" />
              <view class="item-title">{{ item.name }}</view>
            </view>
            <u-button
              class="view-btn"
              type="primary"
              plain
              size="medium"
              @click="navigateTo(`cert-center/type-details?name=${item.name}`)"
            >
              查看
            </u-button>
          </view>
        </Card>
      </template>
      <view class="empty" v-else>
        <Empty :text="myCertMsg"></Empty>
      </view>
    </view>
    <view class="list" v-else-if="currentTab === 1">
      <template v-if="(otherList || []).length > 0">
        <Card v-for="(item, idx) in otherList" :key="idx">
          <view class="title">{{ item.name }}</view>
          <view class="mt-30">
            <u-tag v-if="item.sub_title" :text="item.sub_title" mode="plain" shape="circle" />
          </view>
          <view class="mt-20 flex price-bar">
            <view class="flex-1"><Price :value="Number(item.price)"></Price></view>
            <u-button
              class="handle-btn"
              type="primary"
              size="medium"
              @click="navigateTo(`cert-center/not-handle-details?id=${item.id}`)"
            >
              办证
            </u-button>
          </view>
        </Card>
      </template>
      <view class="empty" v-else>
        <Empty :text="otherMsg"></Empty>
      </view>
    </view>
    <view class="list" v-else-if="currentTab === 2">
      <template v-if="(ongoingList || []).length > 0">
        <Card
          v-for="(item, idx) in ongoingList"
          :key="idx"
          @click="navigateTo(`cert-center/processing-details?id=${item.id}`)"
        >
          <view class="title flex">
            <view class="flex-1">{{ item.name }}</view>
            <view class="status">{{ item.status_text }}</view>
          </view>
          <view class="mt-20">
            <u-tag v-if="item.sub_title" :text="item.sub_title" mode="plain" shape="circle" />
          </view>
          <view class="mt-20 flex price-bar">
            <Price :value="item.pay_price"></Price>
          </view>
        </Card>
      </template>
      <view class="empty" v-else>
        <Empty :text="ongoingMsg"></Empty>
      </view>
    </view>
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
  // padding: 50rpx 0;

  .item {
    align-items: flex-start;
  }

  .item-icon {
    margin-right: 20rpx;
    color: $color-primary;
  }

  .item-title {
    font-size: 36rpx;
    // font-weight: 700;
  }

  .desc {
    color: #999;
    font-size: 28rpx;
  }

  .learn-count {
    .icon {
      color: $color-primary;
      margin-right: 10rpx;
    }
  }
}

.card {
  .title {
    font-size: 36rpx;
    font-weight: 700;
    position: relative;

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

  .status {
    font-size: 28rpx;
    color: $color-warning;
  }

  .handle-btn {
    box-shadow: 0rpx 0rpx 16rpx rgba($color-primary, 0.6);
  }

  .price-bar {
    height: 60rpx;
  }
}

.view-btn {
  border: none;
  padding: 0 50rpx;

  &:after {
    opacity: 0;
  }
}

.empty {
  padding-top: 150rpx;
}
</style>
