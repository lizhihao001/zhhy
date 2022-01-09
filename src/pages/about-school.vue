<script>
import { defineComponent, reactive, ref } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import ViewStatus from '@/components/ViewStatus'
import Timeline from '@/components/Timeline'
import ContactUs from '@/components/ContactUs'
import services from '@/services'
import { pick, get } from 'lodash'

import dayjs from 'dayjs'

import { useLocalStorage, useService } from '@/hooks'

const vm = defineComponent({
  components: { ContactUs, Icon, Card, ViewStatus, Timeline },
  setup() {
    const infoService = useService(services['学校简介'])

    infoService.fetch()

    return {
      get,
      info: infoService.data,
      loading: infoService.loading,
      navigateTo(url) {
        uni.navigateTo({
          url: `/pages/${url}`,
        })
      },
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
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" :title="get(info, 'title', '学校介绍')" :height="50"></u-navbar>
    <ViewStatus :loading="loading || !info" :empty="!info">
      <template v-if="!!info">
        <u-parse :html="get(info, 'content', '--')"></u-parse>
        <!-- <view class="text">
          武汉海事职业学院始于1984年，经湖北省政府批准，由原来的武汉海事中等职业技术学校升级为武汉海事职业学院，是独立设置的公办高等职业院校，隶属长江通信管理局和湖北省教育厅。学院是经交通运输部海事局认可的优质船员培训机构，办学资源丰富，是“湖北省产业工人培训示范基地”、“湖北水上应急训练基地”、“船员考试评估基地”、“长航系统干部培训基地”、“武汉市定点培训机构”。
        </view>
        <image src="@/static/school.png" class="image"></image>
        <view class="text">
          学院占地近700亩，位于武汉市黄陂区滠口经济开发区，西邻武汉天河国际机场，北毗木兰山旅游风景区，交通便利，院内环境优美，碧草如茵，绿化覆盖率高，建筑风格独特，被称为“欧洲式大学”。现已建成教学楼、实训楼、培训楼、实训车间、宿舍楼、运动场馆等，整体建筑面积近5万平方米，校内各项公共服务设施方便齐全。
        </view> -->

        <view class="contact-us mt-30">
          <ContactUs class="title">联系我们</ContactUs>
          <view class="info-line">武汉海事职业学院</view>
          <view class="info-line">武汉市汉口北经济开发区十里棚特1号； 邮政编码：430311</view>
        </view>

        <u-button type="primary mt-30" @click="mapTo">导航</u-button>
      </template>
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
  padding: 50rpx $wing-gap;
}

.text {
  font-size: 32rpx;
  color: #666;
  text-indent: 40rpx;
}

.image {
  width: 100%;
  margin: 20rpx 0;
}

.contact-us {
  width: 100%;
  padding: 26rpx 40rpx;
  background: #f4faff;
  border-radius: $card-border-radius;

  .title {
    font-size: 32rpx;
    font-weight: 500;
    color: #2781eb;
    margin-bottom: 10rpx;
  }

  .info-line {
    margin-top: 18rpx;
    font-size: 32rpx;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
  }
}

.u-btn {
  width: 100%;
  height: 100rpx;
  border-radius: $card-border-radius;
  box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6);
}
</style>
