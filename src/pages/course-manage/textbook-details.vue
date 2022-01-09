<script>
import { defineComponent, onMounted, reactive } from '@vue/composition-api'
import Card from '@/components/Card'
import ViewStatus from '@/components/ViewStatus'
import NewsList from '../news-list/list.vue'
import { useMouse } from '@vueuse/core'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Card, NewsList, ViewStatus },
  onLoad: function (option) {
    this.option.id = option.id
  },
  setup() {
    const option = reactive({
      id: null,
    })
    const state = reactive({
      count: 0,
      show: false,
    })

    const textbookService = useService(services['获取教材详细信息'])

    onMounted(() => {
      textbookService.fetch({
        textbooks_id: option.id,
      })
    })

    const toTextbookDetails = () => {
      uni.navigateTo({
        url: '/pages/course-manage/textbook-details',
      })
    }

    return {
      option,
      toTextbookDetails,
      state,
      details: textbookService.data,
      loading: textbookService.loading,
      typeList: [
        {
          value: '1',
          label: '全部教材',
        },
        {
          value: '2',
          label: '培训项目',
        },
      ],
    }
  },
})

export default vm
</script>

<template>
  <view class="warpper">
    <u-navbar :title-size="38" title="我的教材" :height="50"></u-navbar>
    <ViewStatus :loading="!details || loading">
      <view class="content" v-if="!!details">
        <view class="book-box">
          <image class="book-icon" :src="`http://zhschool.qixiuu.com${details.images}`" mode="aspectFill"></image>
        </view>
        <text class="book-name">{{ details.name }}</text>
        <Card>
          <view class="title-label">教材介绍</view>
          <u-parse :html="details.content || '--'" />
        </Card>
      </view>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.content {
  padding: 0 56rpx;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.book-box {
  margin-top: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 12rpx;
  width: 392rpx;
  height: 354rpx;
  background: radial-gradient(circle, #fff 0%, #e8eaed 100%);
  margin-bottom: 50rpx;

  .book-icon {
    width: 142rpx;
    height: 200rpx;
  }
}

.book-name {
  color: #333;
  font-size: 36rpx;
  margin-bottom: 52rpx;
}

.title-label {
  position: relative;
  color: #333;
  font-size: 36rpx;

  &::after {
    margin-top: 20rpx;
    content: '';
    bottom: -20rpx;
    left: 0;
    width: 15rpx;
    height: 10rpx;
    display: block;
    border-radius: 10rpx;
    background: #4da0ed;
  }
}

.book-introduce {
  margin-top: 40rpx;
  color: #333;
  font-size: 28rpx;
}
</style>
