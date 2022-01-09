<script>
import { defineComponent, reactive, ref ,watch,onMounted,onActivated,computed} from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import {  useService } from '@/hooks'
import services from '@/services'
import Timeline from '@/components/Timeline'
import dayjs from 'dayjs'
import get from 'lodash/get'
const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    console.log(option.id) //打印出上个页面传递的参数 
    this.option.id = option.id
  },
  setup() {
    // const details = uni.getStorageSync('train-details-progress') 
    // uni.getStorageSync('train-details-progress')
    const details = reactive({}) 
    // const timelineList = reactive({}) 
    
    console.log(1,details); 
    const option = reactive({
      id: null,
    })  
    const detailService = useService(services['进度详情'])  
    const loadData = async () => {
      await detailService.fetch({
        user_plan_id:option.id
      })  
    }  
    onMounted(loadData)
    onActivated(loadData)

    // const process_detail = computed(() => {
    //   console.log(details,111);
    //   return getTimeline(details)
    // })

    const getTimeline = (item) => {
      console.log(12344,item); 
      let o = item
      const now = Date.now() 
      const getTimeNode = (title, key) =>
        !o[key]
          ? null
          : {
              name: title,
              time: o[key]['time'],
              active: o[key]['status'] === 1,
            }

      return [
        getTimeNode('报名时间', 'sign_up'),
        getTimeNode('报到时间', 'report'),
        getTimeNode('开课时间', 'course_start'),
        getTimeNode('待考试', 'exam_start'),
      ]
        .filter(Boolean)
        .reverse()
    }
    
    return {
      get,
      option,
      details:detailService.data,  
      format(date, formatType) {
        return dayjs(date).format(formatType)
      },
      getTimeline
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="详情进度" :height="50"></u-navbar>
    <SignUpInforCard :title="details.title" :tags="details.label&&details.label.split('，')||[]" :price="[500, 4880]" :count="10">
      {{ details.code }}批次 | {{ details.start_time?details.start_time.split('年')[1]:``}}开课 共{{ details.cycle_num }}个月
      <!-- format(details.start_time, 'MM月DD日') -->
      <template v-slot:infor-bar>{{ null }}</template>
    </SignUpInforCard>
     
    <Card>
      <view class="item">
        <image class="img" src="@/static/icons/jindu.png">
        <u-row class="title"><Icon name="" :size="60" />项目进度</u-row><!-- rewind-right-fill -->
        <view class="right">{{details.code}} | {{details.qcode}}</view>
      </view>
      
      <Timeline :data="getTimeline(details.process_detail)" class="gap"> </Timeline>
    </Card>
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
.item {
  display: flex;
  flex-wrap: wrap;
  .img {
    width: 82rpx;
    height: 86rpx;
  }
  .title {
    margin-bottom: 20rpx;
    color: #333;
    font-size: 40rpx;
    font-weight: 700;
    padding-top: 10rpx;
    .icon {
      margin-right: 16rpx;
      position: relative;
      left: -10rpx;
      color: $color-primary;
    }
  }
  .right{
    background-color: #4DA0ED;
    // height: 70rpx;
    border-radius: 20rpx;
    margin: 0 auto;
    padding: 22rpx;
    color: #ffffff;
    font-size: 28rpx;
    font-weight: 500;
  }
}
.gap{
  padding-left: 20rpx;
}
</style>
