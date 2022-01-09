<script>
import { defineComponent, reactive, onMounted } from '@vue/composition-api'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import Timeline from '@/components/Timeline'
import ViewStatus from '@/components/ViewStatus'

import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Icon, Card, Timeline, ViewStatus },
  onLoad: function (option) {
    this.option.id = option.id
  },
  setup() {
    const option = reactive({
      id: null,
    })
    const courseDetailsService = useService(services['课程管理详情'], {
      // initialData: [],
      // presistKey: 'courseDetailsService',
    })

    onMounted(() => {
      courseDetailsService.fetch({
        plan_id: option.id,
      })
    })

    const toTextbook = () => {
      uni.navigateTo({
        url: `/pages/course-manage/textbook?id=${option.id}`,
      })
    }

    return {
      details: courseDetailsService.data,
      option,
      toTextbook,
      mapTo() {
        uni.openLocation({
          latitude: 30.752449, //要去的纬度-地址
          longitude: 114.336914, //要去的经度-地址
          name: '武汉海事职业学院', //地址名称
          address: '武汉海事职业学院', //详细地址名称
          success: function () {
            console.log('导航成功')
          },
          fail: function (error) {
            console.log(error)
          },
        })
      },
      timelineList: [
        {
          name: '课前准备',
          time: '2021-06-06',
          active: true,
        },
        {
          name: '第1讲 世界航海起源（上）',
          time: '2021-06-06',
          active: true,
        },
        {
          name: '第2讲 世界航海起源（下）',
          time: '2021-06-06',
          active: true,
        },
        {
          name: '海船船员基本安全培训',
          time: '2021-06-06',
          active: false,
        },
      ],
      course: [
        {
          name:''
        },
        {
          name:''
        },
        {
          name:''
        }
      ]
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="课程管理" :height="50"></u-navbar>
    <ViewStatus :loading="!details">
      <view class="list" v-if="!!details">
        <Card class="status-car">
          <view class="status-info">
            <view class="status-label">{{ details.status_text }}</view>
            <view class="status-tips">{{ details.sub_title }}</view>
          </view>
          <image class="status-icon" src="@/static/icons/to-be-train.png"></image>
        </Card>

        <Card class="details-car">
          <view class="info">
            <view class="title">title</view>
            <view class="info">
              <text>|批次</text>
              <text>开课</text>
            </view>
            <view class="course-name" v-for="(item, idx) in details.project_name || []" :key="idx">{{ item }}</view>
            <view class="info-item">
              <text class="item-name">班级名称</text>
              <text class="item-value">{{ details.classes_name }}</text>
            </view>
            <view class="info-item">
              <text class="item-name">培训地址</text>
              <text class="item-value">{{ details.plan_address }}</text>
            </view>
            <view class="info-item">
              <text class="item-name">住宿地址</text>
              <text class="item-value">{{ details.drom_detail }}</text>
            </view>
          </view>
          <view class="action-btn">
            <view class="navigation btn" @click="mapTo">
              <image class="status-icon" src="@/static/icons/navigation.png"></image>
              <text>导航</text>
            </view>
            <view class="textbook btn">
              <image class="status-icon" src="@/static/icons/textbook-icon.png"></image>
              <text @click="toTextbook">查看教材</text>
            </view>
          </view>
        </Card>

        <Card>
          <view class="course-arrange">课程内容</view>
          <text class="tips">(如有临时调课，具体以学校安排为准）</text>
          <view class="course-content" v-for="(item, index) in course" :key="index">
            <view class="content">
              <image class="content-img" src="@/static/icons/Time1.png"></image>
              <view class="content-time">2021-05-20 08:30-10:30 </view>
            </view>
            <view class="content-title"> 第1讲 世界航海起源（上） </view>
            <view class="content-address">上课地址 : 教学楼3号楼201教室</view>
            <view class="content-footer">
              <text class="content-footer-left">实操</text>
              <text class="content-footer-right">分组以科目老师实际安排为准</text>
            </view>
            <view class="content-left">
              <view class="speed"></view>
              <u-line
                class="collapse-line"
                length="232rpx"
                color="#BEC2CB"
                direction="col"
                margin="0rpx 0 0 18rpx"
                border-style="dashed"
                :hair-line="false"
              ></u-line>
            </view>
          </view>
        </Card>
        <!-- <view class="course-arrange">课程具体安排</view>
          <Timeline
            :data="
              (details.course_list || []).map((item) => ({
                name: item.name,
                time: item.time_text,
                active: true,
              }))
            "
            class="gap"
          >
          </Timeline> -->
        <Card>
          <text class="grade">考试成绩</text>
          <view class="course">
            <text class="course-left">精通救生艇筏和救助艇(理论)</text>
            <text class="course-right">及格</text>
          </view>
          <view class="course">
            <text class="course-left">精通救生艇筏和救助艇(理论)</text>
            <text class="course-right active">不及格</text>
          </view>
          <view class="course">
            <text class="course-left">精通救生艇筏和救助艇(理论)</text>
            <text class="course-right active">不及格</text>
          </view>
        </Card>
      </view>
      <!-- <view class="mt-30 w-full action fixed-bottom" v-if="details.status_text === '待领证'">
        <u-button type="primary" class="mt-30" @click="navigateTo('cert-center/list?tabIdx=1')">我要领证</u-button>
      </view> -->
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.list {
  padding: 20rpx $wing-gap 200rpx;
  margin-top: 10rpx;
}

.status-car {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 640rpx;
  height: 220rpx;
  background: linear-gradient(318deg, #77b7f2 0%, #3794ea 100%);

  .status-info {
    color: #fff;

    .status-label {
      margin-bottom: 5rpx;
      font-size: 40rpx;
    }

    .status-tips {
      font-size: 28rpx;
    }
  }
  .status-icon {
    width: 83rpx;
    height: 68rpx;
  }
}

.details-car {
  .gap {
    margin-top: 26rpx;
    margin-bottom: 38rpx;
  }

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
    padding: 32rpx 0;
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

  .action-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 228rpx;
      height: 64rpx;
      border-radius: 10rpx;
      font-size: 28rpx;
      margin: 0 20rpx;

      .status-icon {
        width: 30rpx;
        height: 30rpx;
        margin-right: 5rpx;
      }
    }

    .navigation {
      background: #edf5ff;
      color: #4da0ed;
    }

    .textbook {
      color: #fff;
      background: #4da0ed;
    }
  }

  .course-name {
    width: 100%;
    height: 76rpx;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: #f4f9ff;
    color: #4da0ed;
    font-size: 26rpx;
    padding-left: 26rpx;
    margin-bottom: 20rpx;
  }
}

.course-arrange {
  position: relative;
  color: #333;
  font-size: 36rpx;
  padding-bottom: 20rpx;
  // margin-bottom: 20rpx;

  // &::after {
  //   // position: absolute;
  //   margin-top: 20rpx;
  //   content: '';
  //   bottom: -20rpx;
  //   left: 0;
  //   width: 15rpx;
  //   height: 10rpx;
  //   display: block;
  //   border-radius: 10rpx;
  //   background: #4da0ed;
  // }
}
.tips {
  font-size: 28rpx;
  font-weight: 400;
  color: #999999;
}
.content-left {
  position: absolute;
  top: 34rpx;
  left: 0rpx;
  .speed {
    width: 40rpx;
    height: 40rpx;
    background: rgba(200, 215, 245, 0.39);
    border-radius: 50%;
    opacity: 0.73;
  }
}

.course-content {
  padding-left: 60rpx;
  padding-top: 30rpx;
  position: relative;
}
.content {
  display: flex;
  .content-img {
    width: 61rpx;
    height: 61rpx;
  }
  .content-time {
    font-size: 28rpx;
    font-weight: 400;
    color: #999999;
    padding-top: 6rpx;
  }
}
.content-title {
  font-size: 36rpx;
  font-weight: 400;
  color: #333333;
  padding-left: 16rpx;
  padding-bottom: 20rpx;
}
.content-address {
  width: 100%;
  background: #edf5ff;
  border-radius: 20rpx;
  color: #4da0ed;
  padding: 12rpx 26rpx;
  margin-left: 14rpx;
}
.content-footer {
  display: flex;
  padding-top: 14rpx;
  padding-left: 14rpx;
  .content-footer-left {
    background: rgba(77, 160, 237, 0.39);
    border-radius: 8rpx;
    color: #fff;
    padding: 2rpx 12rpx;
  }
  .content-footer-right {
    font-size: 26rpx;
    color: #999999;
    padding-left: 10rpx;
  }
}
.loading {
  padding-top: 200rpx;
  justify-content: center;
}

.fixed-bottom {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  height: 184rpx;
  padding: 28rpx $wing-gap;
  background: #fff;
}

.grade {
  // padding: 30rpx 44rpx 20rpx 44rpx;
  font-size: 36rpx;
  font-weight: 500;
  color: #333333;
  position: relative;
  &::before {
    content: '';
    position: absolute;
    bottom: -18rpx;
    width: 20rpx;
    height: 10rpx;
    border-radius: 25rpx;
    background: $color-primary;
  }
}
.course {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx 0rpx 0rpx 0rpx;
  .course-left {
    font-size: 30rpx;
    font-weight: bold;
    color: #333333;
  }
  .course-right {
    padding: 6rpx 20rpx;
    background: #4da0ed;
    color: #ffffff;
    border-radius: 10rpx;
    &.active {
      background: #f8662f;
    }
  }
}
</style>
