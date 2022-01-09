<script>
import { defineComponent, reactive } from '@vue/composition-api'
import Card from '@/components/Card'
import ViewStatus from '@/components/ViewStatus'
import NewsList from '../news-list/list.vue'
import { useMouse } from '@vueuse/core'
import get from 'lodash/get'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Card, NewsList, ViewStatus },
  onLoad() {
    console.log('main onLoad')
  },
  setup() {
    const state = reactive({
      count: 0,
    })
    const toList = () => {
      uni.navigateTo({
        url: '/pages/news-list/index',
      })
    }

    const newsService = useService(services['获取资讯列表（发现）'])

    newsService.fetch()

    return {
      get,
      toList,
      news: newsService.data,
      loading: newsService.loading,
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="动态" :height="50" :is-back="false"></u-navbar>
    <u-swiper
      :list="get(news, 'banner_images', []).map((item) => `http://zhschool.qixiuu.com${item}`)"
      :height="400"
      mode="dot"
      class="news-swiper"
    ></u-swiper>
    <!-- <image class="logo" src="@/static/logo.png"></image> -->
    <Card :padding="false" class="home-content">
      <view class="head">
        <text class="new-title">新闻动态</text>
        <view class="more-btn" @click="toList">
          <text class="">更多</text>
          <image class="arrow" src="@/static/arrow-min.png"></image>
        </view>
      </view>
      <ViewStatus :loading="loading">
        <NewsList v-if="!loading" :list="get(news, 'list')" />
      </ViewStatus>
    </Card>
  </view>
</template>

<style lang="scss" scoped>
.content {
  padding: 0rpx 56rpx 50rpx;
  // padding-bottom: 50rpx;
}

.news-swiper {
  border-radius: $card-border-radius !important;
  box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
}

.home-content {
  margin-top: 28rpx;
  padding: 32rpx 36rpx;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.new-title {
  color: #333;
  font-size: 36rpx;
  position: relative;
  padding-left: 20rpx;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0px;
    width: 5px;
    margin: 8rpx 0;
    border-radius: 13px;
    background: #4da0ed;
    // height: 40rpx;
  }
}

.more-btn {
  padding: 8rpx 26rpx;
  // width: 120rpx;
  // height: 54rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3995ea;
  color: #fff;
  border-radius: 10rpx;
  font-size: 24rpx;

  .arrow {
    margin-left: 14rpx;
    width: 9rpx;
    height: 14rpx;
  }
}
</style>
