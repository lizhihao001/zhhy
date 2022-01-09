<script>
import { defineComponent, onMounted, reactive } from '@vue/composition-api'
import Card from '@/components/Card'
import ViewStatus from '@/components/ViewStatus'

import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Card, ViewStatus },
  setup() {
    const courseListService = useService(services['课程管理列表'], {
      initialData: [],
      // presistKey: 'courseListService',
      needErrorToast: false,
    })

    courseListService.fetch()
    // courseListService.data = []

    const toCourseDetails = (item) => {
      uni.navigateTo({
        url: `/pages/course-manage/course-details?id=${item.id}`,
      })
    }
    function navigateTo(url) {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }
    // onMounted
    return {
      navigateTo,
      loading: courseListService.loading,
      courseList: courseListService.data,
      msg: courseListService.msg,
      toCourseDetails,
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="课程管理" :height="50">
      <template v-slot:right>
        <view class="flex" @click="navigateTo('course-manage/curriculum')">
          <image src="@/static/calendar.png" class="calendar-icon" mode="aspectFix" />
          课程表
        </view>
      </template>
    </u-navbar>
    <ViewStatus :empty="(courseList || []).length === 0" :loading="loading">
      <view class="list">
        <Card v-for="(item, idx) in courseList" :key="idx" @click="toCourseDetails(item)">
          <view class="head">
            <view class="title">{{ item.course_name }}</view>
            <view class="status">{{ item.status_text }}</view>
          </view>
          <view class="gap desc">{{ item.code }} | {{ item.start_time }} {{ item.cycle_num }}</view>
          <view class="info">
            <view class="info-item">
              <text class="item-name">班级名称</text>
              <text class="item-value">{{ item.classes_name }}</text>
            </view>
            <view class="info-item">
              <text class="item-name">培训地址</text>
              <text class="item-value">{{ item.plan_address }}</text>
            </view>
            <!-- <view class="info-item">
              <text class="item-name">住宿地址</text>
              <text class="item-value">{{ item.drom_detail }}</text>
            </view> -->
          </view>
        </Card>
      </view>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.wrapper {
  padding-bottom: 30rpx;
}
.calendar-icon {
  width: 40rpx;
  height: 50rpx;
  position: relative;
  top: 6rpx;
}

.list {
  padding: 20rpx $wing-gap;
  margin-top: 10rpx;
}

.card {
  .gap {
    margin-top: 26rpx;
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      position: relative;
      font-size: 40rpx;
      font-weight: 700;
      position: relative;
      color: #333;

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
    .status {
      color: #ff6a27;
      font-size: 28rpx;
      min-width: 100rpx;
    }
  }

  .desc {
    color: #666;
    font-size: 28rpx;
  }

  .mini-card {
    margin-top: 32rpx;
    display: inline-block;
    padding: 16rpx 22rpx;
    border-radius: $card-border-radius;
    background: $color-primary;
    color: #fff;
  }

  .info {
    padding: 46rpx 0;
    .info-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 46rpx;

      &:last-child {
        margin-bottom: 0;
      }

      .item-name {
        color: #666;
        font-size: 28rpx;
      }

      .item-value {
        color: #333;
        font-size: 28rpx;
      }
    }
  }
}

.empty {
  padding-top: 150rpx;
}
</style>
