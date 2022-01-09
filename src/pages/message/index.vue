<script>
import { computed, defineComponent, reactive, ref } from '@vue/composition-api'
import ViewStatus from '@/components/ViewStatus'
import SwipeAction from '@/components/SwipeAction'
import MessageItem from './component/message-item.vue'
import NoticeItem from './component/notice-item.vue'

import get from 'lodash/get'
import { useService } from '@/hooks'
import services from '@/services'

export default defineComponent({
  components: { SwipeAction, ViewStatus, MessageItem, NoticeItem },
  onShow() {
    console.log('onShow fetch')
    this.fetch()
  },
  setup() {
    const data = reactive({})
    const messageListService = useService(services['消息首页'], {
      // initialData: {},
      // presistKey: 'messageMainListService',
      // dataFilter: (data) => data?.data,
    })

    const fetch = () => {
      messageListService.fetch({
        // category: 2,
        page: 1,
        pageSize: 20,
      })
    }

    fetch()

    const toNotice = () => {
      uni.navigateTo({
        url: '/pages/message/notice',
      })
    }

    const toMessage = () => {
      uni.navigateTo({
        url: '/pages/message/message',
      })
    }

    // const list = computed(() => )

    return {
      get,
      ...data,
      toNotice,
      toMessage,
      loading: messageListService.loading,
      data: messageListService.data,
      async handleRemove(item) {
        const res = await services['删除消息']({
          msg_ids: item?.id,
        })

        uni.showToast({
          icon: 'none',
          title: res?.msg,
        })

        fetch()
      },
      fetch,
    }
  },
})
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="我的消息" :height="50"></u-navbar>
    <view class="tab" v-if="!!data">
      <view class="tab-item" @click="toNotice">
        <image class="tab-icon" src="@/static/icons/notice.png"></image>
        <view class="tab-text">
          <view class="tab-name">通知</view>
          <view class="unread-number" v-if="get(data, 'noticeNum', 0) > 0">{{ get(data, 'noticeNum', 0) }}</view>
          <view class="tab-tips">系统公告</view>
        </view>
      </view>
      <view class="tab-item" @click="toMessage">
        <image class="tab-icon" src="@/static/icons/message.png"></image>
        <view class="tab-text">
          <view class="tab-name">消息</view>
          <view class="unread-number" v-if="get(data, 'remindNum', 0) > 0">{{ get(data, 'remindNum', 0) }}</view>
          <view class="tab-tips">提醒消息</view>
        </view>
      </view>
    </view>
    <ViewStatus
      :loading="loading || !data"
      :empty="get(data, 'message.list.length', 0) === 0 && get(data, 'notice.list.length', 0) === 0"
    >
      <template v-if="!!data">
        <view class="list w-full">
          <SwipeAction
            class="swipe-action"
            v-for="(item, idx) in get(data, 'message.list', [])"
            :key="idx"
            :index="idx"
            @remove="handleRemove(item)"
          >
            <MessageItem :item="item" />
          </SwipeAction>
          <SwipeAction
            class="swipe-action"
            v-for="(item, idx) in get(data, 'notice.list', [])"
            :key="idx"
            :index="idx"
            @remove="handleRemove(item)"
          >
            <NoticeItem :item="item" />
          </SwipeAction>
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
  height: 100%;
}

.swipe-action {
  /deep/ {
    .u-swipe-content {
      max-width: 100vw;
      padding: 6rpx $wing-gap;
      // padding-right: 0;
    }
    .u-swipe-del {
      // padding-left: $wing-gap;
      position: relative;
      left: -1 * $wing-gap / 2;
      // padding-right: 0;
    }
  }
}

.tab {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 640rpx;
  height: 174rpx;
  background: #fff;
  box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
  opacity: 1;
  border-radius: 24rpx;
  padding: 22rpx 30rpx;
}

.tab-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.tab-icon {
  width: 116rpx;
  height: 116rpx;
}

.tab-text {
  position: relative;
}

.tab-name {
  font-size: 32rpx;
  color: #333;
}

.tab-tips {
  margin-top: 4rpx;
  font-size: 24rpx;
  color: #999;
}

.unread-number {
  position: absolute;
  padding: 0 10rpx;
  background: #ef3124;
  opacity: 1;
  border-radius: 200rpx;
  font-size: 18rpx;
  color: #fff;
  top: 0;
  right: -20rpx;
}

.list {
  // width: 640rpx;
  margin: 0 auto;
}
</style>
