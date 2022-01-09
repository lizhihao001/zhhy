<script>
import { defineComponent, onMounted, reactive, ref, watch } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Card from '@/components/Card'
import Timeline from '@/components/Timeline'
import Icon from '@/components/Icon'
import Price from '@/components/Price'
import SignUpInforBar from '@/components/SignUpInforBar'
import SignUpInforCard from '@/components/SignUpInforCard'
import TrainTypeList from '@/components/TrainTypeList'
import ViewStatus from '@/components/ViewStatus'
import services from '@/services'
import dayjs from 'dayjs'

import { useLocalStorage, useService } from '@/hooks'

const vm = defineComponent({
  components: { Card, Timeline, Icon, Price, SignUpInforBar, SignUpInforCard, TrainTypeList, ViewStatus },
  setup() {
    const showTime = ref(false)
    const showTypes = ref(true)
    const selectedType = ref(uni.getStorageSync('train-list-type') || null)
    uni.removeStorageSync('train-list-type')
    const selectedTime = ref(null)
    // const trainList = useLocalStorage('trainList', [])

    const trainListSevice = useService(services['获取培训计划列表'])
    const trainList = trainListSevice.data
    const showAboutMe = ref(false)
    const aboutMe = ref('全部')

    const fetchTrainList = async () => {
      const res = await trainListSevice.fetch({
        plan_type: selectedType.value?.id,
        start_time: selectedTime.value || '',
        about_me: {
          全部: 0,
          与我相关: 1,
        }[aboutMe.value],
      })

      console.log('获取培训计划列表', res)

      // trainList.value = res?.data || []
    }

    onMounted(fetchTrainList)

    watch(selectedType, fetchTrainList)
    watch(selectedTime, fetchTrainList)
    watch(aboutMe, fetchTrainList)

    return {
      showAboutMe,
      aboutMe,
      chooseAboutMe(data) {
        aboutMe.value = ['全部', '与我相关'][data[0]]
      },
      loading: trainListSevice.loading,
      // dayjs,
      format(date, formatType) {
        return dayjs(date).format(formatType)
      },
      trainList,
      showTime,
      showTypes,
      selectedType,
      selectedTime,
      handleTypeSelected(type) {
        console.log(type)
        selectedType.value = type
        showTypes.value = false
      },
      onTimeClear() {
        // console.log(time)
        selectedTime.value = null
      },
      onTimeChange({ year, month }) {
        // console.log(time)
        selectedTime.value = `${year}-${month}`
      },
      toDetails(item) {
        uni.navigateTo({
          url: `/pages/train/details?id=${item.id}`,
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="全部培训"></u-navbar>
    <u-row class="filter-bar">
      <view @click="showTypes = !showTypes" class="select-tag">
        <text v-if="!!selectedType" class="select-tag-item selected">
          {{ selectedType.name }}
        </text>
        <text v-else class="select-tag-item">培训分类</text>
        <Icon name="arrow-down-fill" :size="18" />
      </view>
      <view @click="showAboutMe = true" class="select-tag">
        <text class="select-tag-item">{{ aboutMe }}</text>
        <Icon name="arrow-down-fill" :size="18" />
      </view>
      <view @click="showTime = !showTime" class="select-tag">
        <text v-if="!!selectedTime" class="select-tag-item selected">
          {{ format(selectedTime, 'YYYY年M月份') }}
        </text>
        <text v-else class="select-tag-item">开课时间</text>

        <Icon name="arrow-down-fill" :size="18" />
      </view>
    </u-row>
    <template v-if="showTypes">
      <!-- <view @click="handleTypeSelected(undefined)">全部</view> -->
      <view class="type-info-card-container w-full">
        <Card class="type-info-card" :shadow="false">
          <u-row @click="handleTypeSelected(undefined)">
            <u-row class="type-info">
              <image :src="require('@/static/type-train.png')" class="type-icon" mode="aspectFit"></image>
              全部
            </u-row>
            <!-- <view class="fold-button">
            <Icon :name="showTypeIdx === idx ? 'arrow-down' : 'arrow-up'" :size="36" />
          </view> -->
          </u-row>
        </Card>
      </view>
      <TrainTypeList @change="handleTypeSelected" :isBack="true"> </TrainTypeList>
    </template>
    <ViewStatus :loading="!trainList || loading" :empty="(trainList || []).length === 0" v-else>
      <template v-if="!!trainList">
        <view class="list" v-if="trainList.length > 0">
          <SignUpInforCard
            v-for="(item, idx) in trainList"
            :key="idx"
            :title="item.title"
            :tags="item.label ? item.label.split(',') : ''"
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
    </ViewStatus>
    <u-picker
      v-model="showTime"
      mode="time"
      cancel-text="全部"
      title="请选择"
      :params="{
        year: true,
        month: true,
        day: false,
        hour: false,
        minute: false,
        second: false,
      }"
      @confirm="onTimeChange"
      @cancel="onTimeClear"
    ></u-picker>
    <u-picker mode="selector" v-model="showAboutMe" @confirm="chooseAboutMe" :range="['全部', '与我相关']"> </u-picker>
  </view>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 110rpx 0 50rpx;
}

.list {
  width: 100%;
  padding: 0 $wing-gap 50rpx;
  // padding: 50rpx 0;
}

.type-info-card-container {
  padding: 0 $wing-gap;
}

.type-icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 30rpx;
}

.type-info-card {
  background: #f0f6fa;
  color: #a2b7c9;

  .fold-button {
    box-shadow: 0px 3px 6px #dfe7eb;
  }

  &.active {
    background: linear-gradient(318deg, #77b7f2 0%, #3794ea 100%);
    color: #fff;

    .fold-button {
      color: $color-primary;
      box-shadow: 0px 3px 6px #73abde;
    }
  }
}

.type-info {
  flex: 1;
  .icon {
    margin-right: 10rpx;
  }

  font-size: 36rpx;
}
.filter-bar {
  position: fixed;
  top: calc(50px + var(--status-bar-height));
  z-index: 2;
  width: 750rpx;
  height: 80rpx;
  background: #fff;
  font-size: 30rpx;

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
.select-tag {
  overflow: hidden;
}
.select-tag-item {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
