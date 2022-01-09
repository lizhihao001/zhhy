<script>
import { defineComponent, onMounted, reactive, ref, watch, computed } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Card from '@/components/Card'
import Timeline from '@/components/Timeline'
import Icon from '@/components/Icon'
import Price from '@/components/Price'
import SignUpInforBar from '@/components/SignUpInforBar'
import SignUpInforCard from '@/components/SignUpInforCard'
import TrainTypeList from '@/components/TrainTypeList'
import ViewStatus from '@/components/ViewStatus'
import Empty from '@/components/Empty'
import services from '@/services'
import dayjs from 'dayjs'
import get from 'lodash/get'

import { useLocalStorage, useService } from '@/hooks'

const vm = defineComponent({
  components: { ViewStatus, Empty, Card, Timeline, Icon, Price, SignUpInforBar, SignUpInforCard, TrainTypeList },
  setup() {
    const typeList = useLocalStorage('typeList', [])
    const cateList = computed(() => {
      return [
        {
          name: '全部',
          id: undefined,
        },
        ...typeList.value,
      ]
    })

    onMounted(async () => {
      const res = await services['推荐就业分类']()

      console.log('推荐就业分类', res)

      typeList.value = res?.data || []
    })

    const currentTab = ref(0)
    const handleTabChange = (index) => {
      currentTab.value = index // tabList[index]?.id
    }

    const jobService = useService(services['推荐职位列表'])
    const jobData = jobService.data
    // const cateList = ref([
    //   {
    //     id: '0',
    //     name: '全部',
    //   },
    // ])
    // const currentTab = ref(0)
    // const handleTabChange = (index) => {
    //   currentTab.value = index // tabList[index]?.id
    // }

    // watch(jobData, () => {

    // })
    watch(currentTab, () => {
      jobService.fetch({
        cate_id: get(cateList.value, [currentTab.value, 'id'], 0),
      })
    })

    jobService
      .fetch({
        cate_id: 0,
      })
      .then((res) => {
        cateList.value = get(res?.data, 'cate', [
          {
            id: '0',
            name: '全部',
          },
        ])
      })

    return {
      get,
      jobData,
      cateList,
      currentTab,
      handleTabChange,
      loading: jobService.loading,
      // dayjs,
      format(date, formatType) {
        return dayjs(date).format(formatType)
      },
      toDetails(item) {
        uni.navigateTo({
          url: `/pages/recommend/details?id=${item.id ?? 1}`,
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="推荐就业" :height="50"></u-navbar>
    <view class="p-30 w-full"><image class="w-full" src="@/static/jobs-bg.png" mode="widthFix" /></view>
    <u-tabs
      :list="cateList"
      :is-scroll="get(cateList, 'length', 0) > 4"
      :current="currentTab"
      @change="handleTabChange"
      active-color="#4da0ed"
      class="tabs-list w-full"
      bar-width="10"
    ></u-tabs>
    <ViewStatus :loading="!jobData || loading" :empty="get(jobData, 'job.list.length', 0) === 0">
      <view class="list mt-50" v-if="!!jobData">
        <SignUpInforCard
          v-for="(item, idx) in get(jobData, 'job.list', 0)"
          :key="idx"
          :title="item.name"
          :tags="[]"
          @click="toDetails(item)"
        >
          <template v-slot:title>
            <view class="flex">
              <view class="flex-1">{{ item.name }}</view>
              <view class="salary">{{ item.compensation }}</view>
            </view>
          </template>
          <view>
            <view>{{ item.introductory }}</view>

            <view class="mt-30"
              ><u-tag
                v-for="(tag, idx) in (item.lables || []).map((item) => item.name)"
                :key="idx"
                :text="tag"
                mode="plain"
                shape="circle"
            /></view>
            <view class="flex mt-30 company">
              <image :src="item.image" class="company-icon mr-20" />
              <view class="right">
                <view class="name">{{ item.company_name || '--' }}</view>
                <view class="time">2021-12-12</view>
              </view>
            </view>
          </view>

          <template v-slot:infor-bar>
            {{ null }}
          </template>
        </SignUpInforCard>
      </view>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.p-30 {
  padding: 10rpx 30rpx;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20rpx 0 50rpx;
}

.company {
  .company-icon {
    background: #f2f2f2;
    width: 88rpx;
    height: 88rpx;
    border-radius: 50%;
    .right {
      display: flex;
      flex-direction: column;
    }
  }
}
.name{
font-size: 30rpx;
color: #333333;
      }
.time {
  font-size: 26rpx;
  color: #666666;
  padding-top: 6rpx;
}
/deep/ .u-scroll-box {
  padding-left: 20rpx;
}
/deep/ .u-tab-bar {
  position: absolute;
  bottom: 20rpx;
  left: 0;
}
/deep/ .u-tag {
  margin-right: 20rpx;
}
/deep/ .u-tag + .u-tag {
  margin: 20rpx 20rpx 0 0;
}
.list {
  width: 100%;
  padding: 0 $wing-gap 50rpx;
  // padding: 50rpx 0;

  .card {
    padding-bottom: 30rpx;
  }
}

.salary {
  font-size: 30rpx;
  font-weight: 500;
  color: $color-primary;
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

.u-tag {
  border: none !important;

  &.u-mode-plain-primary {
    background-color: rgba($color-primary, 0.1) !important;
  }
}
</style>
