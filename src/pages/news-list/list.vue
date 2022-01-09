<script>
import { defineComponent, reactive } from '@vue/composition-api'
import Item from './item.vue'
import get from 'lodash/get'
import ViewStatus from '@/components/ViewStatus'

import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Item, ViewStatus },
  props: {
    list: Array,
  },
  setup(props) {
    const newsService = useService(services['获取资讯列表（发现）'])

    if (!props.list) {
      newsService.fetch()
    }

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
  <ViewStatus
    class="list"
    :loading="loading"
    :empty="get(news, 'list.length', 0) === 0 && get(list, 'length', 0) === 0"
  >
    <template v-if="!!news || !!list">
      <Item v-for="(item, idx) in list || get(news, 'list', [])" :key="idx" :item="item" />
    </template>
  </ViewStatus>
</template>

<style lang="scss" scoped>
.list {
  // margin-top: 24rpx;
  min-height: 250rpx;

  :last-child {
    border-bottom: none;
  }
}

.empty {
  padding-top: 150rpx;
  padding-bottom: 100rpx;
}
</style>
