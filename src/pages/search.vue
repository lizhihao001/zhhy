<script>
import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import { random } from 'lodash'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import dayjs from 'dayjs'
import { useLocalStorage, useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  setup() {
    const searchContent = ref('')
    const hasResult = ref(false)
    const searchHistory = useLocalStorage('searchHistory', [])

    const searchService = useService(services['获取培训计划列表'], {
      initialData: [],
      // presistKey: 'searchService',
    })
    // const result = reactive([])

    // const hasResult = computed(() => result?.length > 0)
    const search = async () => {
      if (searchContent?.value?.length > 0) {
        // hasResult.value = true

        await searchService.fetch({
          name: searchContent.value,
        })

        hasResult.value = searchService.data?.value?.length > 0
        console.log(JSON.parse(JSON.stringify(searchHistory.value)))
        searchHistory.value = [...new Set([...(searchHistory.value || []), searchContent.value])]
      }
    }

    watch(searchContent, () => {
      if (searchContent.value === '') {
        hasResult.value = false
      }
    })

    return {
      format(date, formatType) {
        return dayjs(date).format(formatType)
      },
      random,
      searchContent,
      searchHistory,
      clearHistory() {
        searchHistory.value = []
      },
      hasResult,
      search,
      list: searchService.data,
      navigateTo(url) {
        uni.navigateTo({
          url: `/pages/${url}`,
        })
      },
      toDetails(item) {
        uni.navigateTo({
          url: `/pages/train/details?id=${item.id}`,
        })
      },
      handleTagClick(content) {
        searchContent.value = content
        search()
      },
      // result,
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="" :height="50">
      <view class="navbar-title">
        <u-input v-model="searchContent" />
      </view>
      <template v-slot:right>
        <text class="search-text" @click="search">搜索</text>
      </template>
    </u-navbar>
    <template v-if="hasResult">
      <view class="w-full">
        <SignUpInforCard
          v-for="(item, idx) in list"
          :key="idx"
          :title="item.title"
          :tags="item.label.split(',')"
          :price="[item.min_price, item.max_price]"
          :count="item.surplus_quota"
          @click="toDetails(item)"
        >
          {{ item.batch_number }}批次 | {{ !item.start_time ? '--' : format(item.start_time, 'MM月DD日') }}开课 共{{
            item.cycle_num
          }}
        </SignUpInforCard>
      </view>
    </template>
    <template v-else>
      <view class="w-full">
        <view class="flex history-title">
          <view class="flex-1 history-text">历史搜索</view>
          <Icon name="trash" :size="40" @click="clearHistory" />
        </view>
        <view class="mt-20" v-if="(searchHistory || []).length > 0">
          <u-tag
            v-for="(item, idx) in searchHistory"
            :key="idx"
            :text="item"
            type="info"
            class="mr-20 mt-20"
            @click="handleTagClick(item)"
          ></u-tag>
        </view>
        <view class="empty" v-else>
          <u-empty mode="history"></u-empty>
        </view>
      </view>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 50rpx $wing-gap;
}

.navbar-title {
  width: 100%;
  padding: 0 10rpx;
  .u-input {
    padding: 0 26rpx !important;
    border-radius: 50rpx;
    background: #f2f2f2;
  }
}

.search-text {
  margin-left: 20rpx;
}

.history-title {
  .icon {
    color: #999;
  }
}

.history-text {
  font-size: 30rpx;
  font-weight: 700;
}

.empty {
  padding-top: 150rpx;
}
</style>
