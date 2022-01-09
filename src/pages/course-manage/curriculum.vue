<script>
import { defineComponent ,ref,onMounted} from '@vue/composition-api'
import { useService } from '@/hooks'
import services from '@/services'
import dayjs from 'dayjs'

export default defineComponent({
  setup() {

    const queryType = ref(0)

    const courseTableService = useService(services['获取课程表'], {
      time: '',
      time_type: queryType,
    })
    const dataSource = courseTableService.data
    console.log(dataSource);
    const list = ref(dataSource.value)
 

     onMounted(async () => {
      await courseTableService.fetch()  
      console.log(dataSource.value) 

      
    })

     
    
    const toCourseDetails = (item) => {
      uni.navigateTo({
        url: `/pages/course-manage/curriculum?id=${item.id}`,
      })
    }


    return {
      value: '',
      type: 'text',
      toCourseDetails,
      border: true, 
      collapseList: dataSource,
      format(date, formatType) {
        return dayjs(date).format(formatType)
      },
    }
  },
})
</script>
<template>
  <view class="content">
        <u-navbar :title-size="38" title="课程管理" :height="50"></u-navbar>
    <view class="top">
        <!-- <image class="inp-img" src="@/static/icons/shaixuan.png"> -->
        <u-input v-model="value" :type="type" :border="false" placeholder="日期筛选" placeholder-style="color: #666666;"/>
    </view>
    
    <view class="tips">
      <text class="left">温馨提示：</text>
      <view class="right">
        <text>如有临时调课，以学校安排为准！</text>
        <text>实操课分组，以当天科目老师安排为准！</text>
      </view>
    </view>
    <u-collapse class="collapse" v-for="(collapse, index) in collapseList" :key="index" @click="toCourseDetails(item)">
      <view class="collapse-left">
        <image class="collapse-img" src="@/static/icons/time.png">
        <!-- <u-line class="collapse-line" length="560rpx" color="#BEC2CB" direction="col" margin="0rpx"  border-style="dashed" :hair-line="false"></u-line> -->
      </view>  
      <u-collapse-item :title="format(collapse[0].date, 'YYYY年MM月DD日')"  :key="index">
        
        <view v-for="(a, i) in collapse" :key="i">
          <view class="item">
            <text v-if="a.course_type_text" class="item-tit">{{a.course_type_text}}</text> 
            <text class="item-time">{{a.time_text}}</text>
            <view class="item-course">{{a.name}}</view>
          </view>
          <view class="address">
            上课地址:{{a.address}}
          </view>
          <u-line class="collapse-line" length="100%" color="#BEC2CB" direction="col" margin="0rpx"  border-style="dashed" :hair-line="false"></u-line>
        </view>
      </u-collapse-item>
	</u-collapse>
  <view class="footer">回到今日</view>
  </view>
</template>
<style lang="scss" scoped>
.content {
  background-color: #ffffff;
  .top {
    padding: 0 46rpx;
    position: relative;
    .inp-img {
      width: 34rpx;
      height: 34rpx;
      position: absolute;
      top: 40rpx;
      left: 70rpx;
    }
  }
  .tips {
    display: flex;
    padding: 44rpx 46rpx;
    .left {
      font-size: 28rpx;
      color: #ff6a27;
    }
    .right {
      font-size: 28rpx;
      color: #666666;
      display: flex;
      flex-direction: column;
    }
  }
  .collapse {
    padding: 0 46rpx;
    // display: flex;
    position: relative;

    .collapse-left {
      display: flex;
      flex-direction: column;
      position: absolute;
      .collapse-img {
        width: 64rpx;
        height: 64rpx;
        padding-top: 12rpx;
      }
      .collapse-line {
        position: absolute;
        top: 64rpx;
        left: 32rpx;
      }
    }
    .item {
      padding-left: 110rpx;
      display: flex;
      .item-tit {
        background: rgba(77, 160, 237, 0.712);
        opacity: 0.5;
        border-radius: 8rpx;
        padding: 6rpx 12rpx;
        border-radius: 14rpx;
        color: #ffffff;
      }
      .item-time {
        padding-left: 10rpx;
        padding-top: 6rpx;
      }
      .item-course {
        padding-left: 30rpx;
        padding-top: 6rpx;
        // width: 300rpx;
      }
    }
    .address {
      background: rgba(242, 249, 255, 0.842);
      padding: 14rpx 16rpx 14rpx 26rpx;
      margin: 16rpx 0 24rpx 110rpx;
      color: #4da0ed;
      border-radius: 10rpx;
      // position: relative;
    }
    .collapse-line{
      position: absolute;
      left: 77rpx;
      top: 60rpx;
    }
  }
  .footer {
    padding: 12rpx;
    background: #4DA0ED;
    box-shadow: 0rpx 6rpx 12rpx #cbe4fc;
    border-radius: 8rpx;
    color: #ffffff;
    position: fixed;
    right: 46rpx;
    bottom: 400rpx;
  }
}
/deep/ {
  .u-input__input {
    background: #f7f7f7;
    margin-top: 26rpx;
    border-radius: 12rpx;
    background-image: url(@/static/icons/shaixuan.png);
    background-size: 34rpx;
    background-repeat: no-repeat;
    background-position: 24rpx 20rpx;
  }
  .uni-input-placeholder {
    padding-left: 80rpx;
    font-size: 26rpx;
  }
  .u-collapse-title {
    font-size: 30rpx;
    color: #3995ea;
  }
  .u-collapse-head {
    padding: 26rpx 0rpx 40rpx 76rpx;
  }
}
</style>