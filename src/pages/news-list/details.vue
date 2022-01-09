<script>
import { defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import Card from '@/components/Card'
import ViewStatus from '@/components/ViewStatus'

import get from 'lodash/get'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { ViewStatus, Card },
  onLoad: function (option) {
    this.option.id = option.id
  },
  setup() {
    const option = reactive({
      id: null,
    })
    const newsDetailsService = useService(services['获取资讯详情'])

    onMounted(() => {
      newsDetailsService.fetch({
        news_id: option.id,
      })
    })

    return {
      get,
      details: newsDetailsService.data,
      loading: newsDetailsService.loading,
      option,
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="详情" :height="50"></u-navbar>
    <ViewStatus :loading="loading || !details">
      <view class="details" v-if="!!details">
        <Card :padding="false" class="details-car">
          <view class="title">{{ get(details, 'title', '--') }}</view>
          <view class="fx">
            <view class="date">{{ get(details, 'create_time', '--') }}</view>
            <image class="fx-img" src="@/static/icons/fx.png">
          </view>
          <image class="img" :src="`http://zhschool.qixiuu.com${get(details, 'images', '')}`" mode="aspectFill"></image>
          <view class="content">
            <u-parse :html="get(details, 'content', '--')"></u-parse>
          </view>
        </Card>
      </view>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.details {
  margin-top: 20rpx;
  padding: 0 56rpx;
  .fx{
    display: flex;
    justify-content: space-between;
  }
  .fx-img {
    width: 32rpx;
    height: 32rpx;
    padding-top: 30rpx;
  }
}

.details-car {
  padding: 32rpx 38rpx;
}

.title {
  color: #333;
  font-size: 36rpx;
}
.date {
  margin-top: 20rpx;
  width: 180rpx;
  text-align: left;
  height: 52rpx;
  background: #F7F8FA;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  color: #666;
  text-align: center;
  padding-top: 10rpx;
  border-radius: 20rpx;
  font-weight: 500;
  font-size: 24rpx;
  // background: #f7f8fa;
  opacity: 1;
}
.img {
  width: 100%;
  height: 418rpx;
  margin-top: 24rpx;
  margin-bottom: 34rpx;
  border-radius: 12rpx;
}
.content {
  color: #333;
  font-size: 28rpx;
}
</style>
