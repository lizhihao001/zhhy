<script>
import { defineComponent, onMounted, reactive, ref, watch, onActivated } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Card from '@/components/Card'
import Timeline from '@/components/Timeline'
import Icon from '@/components/Icon'
import Price from '@/components/Price'
import SignUpInforBar from '@/components/SignUpInforBar'
import SignUpInforCard from '@/components/SignUpInforCard'
import ViewStatus from '@/components/ViewStatus'
import Empty from '@/components/Empty'
import services from '@/services'
import dayjs from 'dayjs'

import { useLocalStorage, useService } from '@/hooks'

const vm = defineComponent({
  components: { Empty, Card, Timeline, Icon, Price, SignUpInforBar, SignUpInforCard, ViewStatus },
  setup() {
    const trainList = useLocalStorage('trainList', [])

    const trainCollectionListService = useService(services['培训计划收藏列表'], {
      initialData: [],
      // presistKey: trainCollectionListService,
    })

    trainCollectionListService.fetch()

    const jobCollectionListService = useService(services['职位收藏列表'], {
      initialData: [],
      dataFilter: (data) => data?.job?.list,
      // presistKey: jobCollectionListService,
    })

    const currentNav = ref(0)
    const handleNavChange = (index) => {
      currentNav.value = index
    }
    const navigationList = [
      {
        name: '培训收藏',
      },
      {
        name: '职位收藏',
      },
    ]

    watch(currentNav, () => {
      const fetch = [trainCollectionListService.fetch, jobCollectionListService.fetch][currentNav.value]
      fetch()
    })

    onActivated(() => {
      const fetch = [trainCollectionListService.fetch, jobCollectionListService.fetch][currentNav.value]
      fetch()
    })

    function navigateTo(url) {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    return {
      navigateTo,
      currentNav,
      handleNavChange,
      navigationList,
      trainCollectionList: trainCollectionListService.data,
      trainCollectionListLoading: trainCollectionListService.loading,
      jobCollectionList: jobCollectionListService.data,
      jobCollectionListLoading: jobCollectionListService.loading,
      // dayjs,
      format(date, formatType) {
        return dayjs(date).format(formatType)
      },
      trainList,
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="" :height="50">
      <view class="navbar-title">
        <view class="card">
          <u-subsection
            :list="navigationList"
            :current="currentNav"
            :font-size="32"
            @change="handleNavChange"
            active-color="#4da0ed"
          ></u-subsection>
        </view>
      </view>
    </u-navbar>
    <ViewStatus
      v-if="currentNav === 0"
      :loading="!trainCollectionList || trainCollectionListLoading"
      :empty="(trainCollectionList || []).length === 0"
    >
      <view class="list" v-if="!!trainCollectionList">
        <SignUpInforCard
          v-for="(item, idx) in trainCollectionList"
          :key="idx"
          :title="item.title"
          :tags="item.label.split(',')"
          :price="[item.min_price, item.max_price]"
          :count="item.surplus_quota"
          @click="navigateTo(`train/details?id=${item.plan_id}`)"
        >
          {{ item.batch_number }}批次 | {{ !item.start_time ? '--' : format(item.start_time, 'MM月DD日') }}开课 共{{
            item.cycle_num
          }}
        </SignUpInforCard>
      </view>
    </ViewStatus>
    <ViewStatus
      v-else
      :loading="!jobCollectionList || jobCollectionListLoading"
      :empty="(jobCollectionList || []).length === 0"
      title="暂无相关收藏"
      text=""
    >
      <view class="list" v-if="!!jobCollectionList">
        <Card
          v-for="(item, idx) in jobCollectionList"
          :key="idx"
          @click="navigateTo(`recommend/details?id=${item.job_id}`)"
        >
          <view class="title flex">
            <view class="flex-1">{{ item.name }}</view>
            <view class="salary">{{ item.compensation }}</view>
          </view>
          <view>
            <view>{{ item.introductory }}</view>

            <view class="mt-30">
              <u-tag
                v-for="(tag, idx) in (item.lables || []).map((item) => item.name)"
                :key="idx"
                :text="tag"
                mode="plain"
                shape="circle"
              />
            </view>
          </view>
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
  padding: 20rpx 0 50rpx;
}

.list {
  width: 100%;
  padding: 0 $wing-gap 50rpx;
  // padding: 50rpx 0;
}

.filter-bar {
  position: fixed;
  top: calc(50px + var(--status-bar-height));
  z-index: 2;
  width: 750rpx;
  height: 80rpx;
  background: #fff;

  > * {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      margin-left: 10rpx;
      color: #ccc;
    }
  }
  // width: 100%;
}

.empty {
  padding-top: 150rpx;
}

.selected {
  color: $color-primary;
}

.navbar-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  /deep/ {
    .u-subsection {
      padding: 16rpx 24rpx !important;
      border-radius: $card-border-radius;
      box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
      background-color: #fff !important;
    }

    .u-item {
      padding: 0 16rpx;
    }
  }
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  position: relative;
  margin-bottom: 30rpx;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -50rpx;
    width: 10rpx;
    border-radius: 25rpx;
    background: $color-primary;
  }
}

.u-tag {
  border: none !important;

  &.u-mode-plain-primary {
    background-color: rgba($color-primary, 0.1) !important;
  }
}

.u-tag + .u-tag {
  margin-left: 20rpx;
}
</style>
