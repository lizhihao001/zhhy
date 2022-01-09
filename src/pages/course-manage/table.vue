<script>
import { computed, defineComponent, onMounted, reactive, ref, watch } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import Calendar from '@/components/Calendar'
import ViewStatus from '@/components/ViewStatus'

import { useService } from '@/hooks'
import services from '@/services'
import dayjs from 'dayjs'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline, Calendar, ViewStatus },
  setup() {
    const today = dayjs()
    const selectedDate = ref(today.format('YYYY-MM-DD'))
    function navigateTo(url) {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    const courseTableService = useService(services['获取课程表'], {
      initialData: [],
      needErrorToast: false,
    })
    const dataSource = courseTableService.data
    const list = ref(dataSource.value)

    const filterList = () => {
      list.value = [...(dataSource.value || [])].filter((item) => item.time_text.indexOf(selectedDate.value) > -1)
    }

    onMounted(async () => {
      await courseTableService.fetch()
      activeDate.value = [...new Set([...(dataSource.value || []).map((item) => item.time_text.split(' ')[0])])]
      console.log(activeDate.value)
      filterList()
    })

    const activeDate = ref([])
    watch(selectedDate, () => filterList())
    watch(dataSource, () => {
      activeDate.value = [...new Set([...(dataSource.value || []).map((item) => item.time_text.split(' ')[0])])]
      console.log(activeDate.value)
      filterList()
    })

    return {
      value: '',
      selectedDate,
      selectDate(date) {
        selectedDate.value = date.format('YYYY-MM-DD')
      },
      list,
      activeDate,
      loading: courseTableService.loading,
      navigateTo,
      today,
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="我的课程表" :height="50"></u-navbar>
    <Calendar :key="loading" class="calendar" :activeDate="activeDate" :defaultDate="today" @change="selectDate" />
    <ViewStatus
      :loading="!list || loading"
      :empty="(list || []).length === 0"
      :src="require('@/static/empty-3.png')"
      title="当天暂无课程安排"
      text="开启你的培训旅途"
    >
      <view class="wrapper">
        <Card v-for="(item, idx) in list" :key="idx">
          <view class="time flex"><Icon name="clock-fill" :size="36" /> {{ item.time_text }}</view>
          <view class="name mt-30">{{ item.name }}</view>
          <view class="address mt-30">{{ item.address }}</view>
        </Card>
      </view>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10rpx 0 50rpx;

  /deep/ {
    .empty {
      padding-top: 50rpx;
    }
  }

  .time {
    .icon {
      color: $color-primary;
      margin-right: 20rpx;
    }
  }

  .name {
    font-size: 32rpx;
  }

  .address {
    color: $color-primary;
    padding: 16rpx 20rpx;
    background: rgb(242, 249, 255);
  }
}

.wrapper {
  padding: 50rpx $wing-gap;
}
</style>
