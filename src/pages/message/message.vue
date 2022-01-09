<script>
import { defineComponent, reactive, ref } from '@vue/composition-api'
import MessageItem from './component/message-item.vue'
import Empty from '@/components/Empty'
import { useService } from '@/hooks'
import services from '@/services'

// <Empty></Empty>
const vm = defineComponent({
  components: { Empty, MessageItem },
  setup() {
    const data = reactive({})
    const messageListService = useService(services['消息列表'], {
      initialData: {},
      presistKey: 'messageListService',
      dataFilter: (data) => data?.data?.list,
    })

    messageListService.fetch({
      category: 1,
      page: 1,
      pageSize: 20,
    })
    return {
      ...data,
      list: messageListService.data,
      loading: messageListService.loading,
      async readAll() {
        const res = await services['全部已读']({
          type: 1,
        })

        uni.showToast({
          icon: 'none',
          title: res?.msg,
        })

        messageListService.fetch({
          category: 1,
          page: 1,
          pageSize: 20,
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="消息" :height="50">
      <template v-slot:right>
        <view class="flex" @click="readAll"> 全部已读 </view>
      </template>
    </u-navbar>
    <view class="list" v-if="(list || []).length > 0">
      <MessageItem v-for="(item, idx) in list" :key="idx" :item="item" />
    </view>
    <view class="empty" v-else>
      <Empty></Empty>
    </view>
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
  padding-bottom: 40rpx;
}

.list {
  width: 100%;
  padding: 0 40rpx;
}

.empty {
  padding-top: 150rpx;
}
</style>
