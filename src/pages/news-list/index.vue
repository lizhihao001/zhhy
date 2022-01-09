<script>
import { defineComponent, reactive } from '@vue/composition-api'
import Card from '@/components/Card'
import ViewStatus from '@/components/ViewStatus'
import List from '../news-list/list.vue'
import get from 'lodash/get'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Card, List, ViewStatus },
  setup() {
    const newsService = useService(services['获取资讯列表（发现）'])

    newsService.fetch()

    return {
      get,
      news: newsService.data,
      loading: newsService.loading,
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="动态列表" :height="50"></u-navbar>
    <view class="list">
      <Card :padding="false">
        <List />
      </Card>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.list {
  padding: 0 36rpx;
  margin-top: 10rpx;
  // padding-bottom: 100rpx;
}
</style>
