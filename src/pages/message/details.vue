<script>
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'

import ViewStatus from '@/components/ViewStatus'
import get from 'lodash/get'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { ViewStatus },
  setup() {
    const option = reactive({
      id: '',
    })
    const detailsService = useService(services['消息详情'])

    // onMounted(() => {
    //   detailsService.fetch({
    //     msg_id: option.id,
    //   })
    // })

    return {
      get,
      option,
      fetch: detailsService.fetch,
      details: detailsService.data,
      loading: detailsService.loading,
    }
  },
  onLoad: function (option) {
    this.option.id = option.id
    this.fetch({
      msg_id: Number(option.id),
    }).then((res) => {
      console.log(
        {
          msg_id: option.id,
        },
        res,
      )
    })
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="详情" :height="50"></u-navbar>
    <ViewStatus class="w-full" :loading="loading" :empty="!details">
      <template v-if="!!details">
        <view class="receive-time">{{ get(details, 'create_time', '--') }}</view>
        <view class="details">
          <view class="title">{{ get(details, 'title', '--') }}</view>
          <view class="content">
            <view class="image" v-if="!!get(details, 'image')">
              <image class="content-img" :src="get(details, 'image', '--')" mode="aspectFill"></image>
            </view>
            <u-parse class="notice-info" :html="get(details, 'content', '--')"></u-parse>
          </view>
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
  padding: 0 $wing-gap 60rpx;
}

.content-img {
  width: 100%;
  background: #f2f2f2;
}

.image + .notice-info {
  margin-top: 20rpx;
}

.receive-time {
  color: #bec2cb;
  font-size: 24rpx;
  width: 100%;
  text-align: center;
  margin-bottom: 20rpx;
  margin-top: 40rpx;
}

.details {
  padding: 36rpx 30rpx;
  width: 100%;
  background: #ffffff;
  box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
  opacity: 1;
}

.title {
  color: #333;
  font-size: 32rpx;
}

.content {
  color: #999;
  font-size: 24rpx;
  overflow: hidden;
  // margin-top: 24rpx;
}
</style>
