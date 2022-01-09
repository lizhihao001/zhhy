<script>
import { defineComponent, onMounted, reactive, ref, getCurrentInstance } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Card from '@/components/Card'
import Timeline from '@/components/Timeline'
import Icon from '@/components/Icon'
import Price from '@/components/Price'
import SignUpInforBar from '@/components/SignUpInforBar'
import SignUpInforCard from '@/components/SignUpInforCard'
import TrainTypeList from '@/components/TrainTypeList'
import ViewStatus from '@/components/ViewStatus'
import VideoTime from './components/VideoTime'
import get from 'lodash/get'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { VideoTime, ViewStatus, Card, Timeline, Icon, Price, SignUpInforBar, SignUpInforCard, TrainTypeList },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    console.log(option.id) //打印出上个页面传递的参数

    this.option.id = option.id
  },
  setup() {
    const { proxy: self } = getCurrentInstance()
    const option = reactive({
      id: null,
    })
    const videoUrl = reactive({
      value: '',
    })
    const showTime = ref(false)
    const showTypes = ref(false)
    const selectedType = ref(null)
    const stared = ref(false)
    const showSignUpPopup = ref(false)

    const learnOnlineDetailService = useService(services['学习资料详情'])
    const details = learnOnlineDetailService.data
    const getDetail = async () => {
      const res = await learnOnlineDetailService.fetch({
        video_id: option.id,
      })
      videoUrl.value = res.data.video_url
      console.log('videoUrl', videoUrl)
    }
    onMounted(async () => {
      getDetail()
    })

    const videoRef = ref(null)

    onMounted(() => {
      videoRef.value = uni.createVideoContext('myVideo')
    })

    const currentNav = ref(0)
    return {
      videoUrl,
      async play(id) {
        console.log('id===', id)
        if (id) {
          const res = await services['学习资料详情']({
            video_id: id,
          })
          videoUrl.value = `${res?.data?.video_url}`
        }

        uni.pageScrollTo({
          duration: 0, //过渡时间必须为0，否则运行到手机会报错
          scrollTop: 0, //滚动到实际距离是元素距离顶部的距离减去最外层盒子的滚动距离（如res.top - data.top）
        })
        try {
          videoRef.value.play()
        } catch (err) {
          console.error(err)
          uni.showToast({
            icon: 'none',
            title: '播放失败',
          })
        }
      },
      get,
      loading: learnOnlineDetailService.loading,
      option,
      currentNav,
      handleNavChange(idx) {
        currentNav.value = idx
      },
      stared,
      details,
      images: [
        require('static/banner-demo.png'),
        require('static/banner-demo.png'),
        require('static/banner-demo.png'),
        require('static/banner-demo.png'),
        require('static/banner-demo.png'),
      ],
      tags: ['标签名称', '标签名称'],
      navigationList: [
        {
          name: '课程详情',
        },
        {
          name: '课程目录',
        },
      ],
      toSignUp() {
        uni.navigateTo({
          url: '/pages/sign-up/form',
        })
      },
      toDetails(itemId) {
        uni.redirectTo({
          url: `/pages/learn-online/details?id=${itemId}`,
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <!-- <u-navbar :title-size="38" title="学习详情" :height="50"> </u-navbar> -->
    <!-- <cover-view class="controls-title">简单的自定义 controls</cover-view> -->
    <ViewStatus :loading="!details || loading">
      <template v-if="!!details">
        <!-- <u-swiper :list="images" :height="642" mode="number" indicator-pos="bottomRight"></u-swiper> -->
        <view class="video-content w-full">
          <video :src="`http://zhschool.qixiuu.com${videoUrl.value}`" id="myVideo" class="w-full video" autoplay>
            <!-- <cover-view class="w-full video-scroll-cover" :style="`height: ${scrollTop}px;`"></cover-view> -->
            <cover-image class="cover-radius lt" src="@/static/corner-lt.png"></cover-image>
            <cover-view class="cover-radius-view-hor lt"></cover-view>
            <cover-view class="cover-radius-view-ver lt"></cover-view>
            <cover-image class="cover-radius rt" src="@/static/corner-rt.png"></cover-image>
            <cover-view class="cover-radius-view-hor rt"></cover-view>
            <cover-view class="cover-radius-view-ver rt"></cover-view>
            <cover-image class="cover-radius lb" src="@/static/corner-lb.png"></cover-image>
            <cover-view class="cover-radius-view-hor lb"></cover-view>
            <cover-view class="cover-radius-view-ver lb"></cover-view>
            <cover-image class="cover-radius rb" src="@/static/corner-rb.png"></cover-image>
            <cover-view class="cover-radius-view-hor rb"></cover-view>
            <cover-view class="cover-radius-view-ver rb"></cover-view>
          </video>
          <!-- <JVideo :url="`http://zhschool.qixiuu.com${get(details, 'video_url')}`" class="w-full">

          </JVideo> -->
        </view>
        <view>
          <Card>
            <view class="title">{{ get(details, 'title', '--') }}</view>
            <view class="mt-20 desc">{{ get(details, 'sub_title', '--') }}</view>

            <view class="mt-30 w-full flex">
              <view class="flex-1">
                <u-tag
                  v-for="(tag, idx) in get(details, 'label', '').split(',')"
                  :key="idx"
                  :text="tag"
                  mode="plain"
                  shape="circle"
                />
              </view>
              <text class="learn-count">
                <Icon name="account-fill" :size="36" />
                {{ get(details, 'study_num', '--') }}人学过
              </text>
            </view>
          </Card>

          <view class="subsection w-full mt-30 mb-30">
            <u-subsection
              bg-color="#f7f7f7"
              :height="94"
              :list="navigationList"
              :current="currentNav"
              active-color="#4da0ed"
              @change="handleNavChange"
            ></u-subsection>
          </view>

          <view class="introduction" v-if="currentNav === 0">
            <Card class="mt-30">
              <view class="intro-tag course-intro-tag">课程简介</view>
              <!-- <image mode="widthFix" class="w-full mt-30" src="@/static/details-7.png" /> -->
              <u-parse :html="get(details, 'content', '')"></u-parse>
            </Card>
            <Card class="mt-50">
              <view class="intro-tag teacher-intro-tag">教师简介</view>
              <!-- <image mode="widthFix" class="w-full mt-30" src="@/static/details-8.png" /> -->
              <u-parse :html="get(details, 'teacher_content', '')"></u-parse>
            </Card>
            <Card class="mt-50">
              <view class="intro-tag school-intro-tag">学校简介</view>
              <!-- <image mode="widthFix" class="w-full mt-30" src="@/static/details-9.png" /> -->
              <u-parse :html="get(details, 'school_content', '')"></u-parse>
            </Card>
          </view>
          <template v-if="currentNav === 1">
            <Card>
              <!-- <image mode="widthFix" class="w-full mt-30" src="@/static/details-10.png" /> -->
              <Timeline class="course-table" :data="get(details, 'video_list', [])">
                <template v-slot:default="slotProps">
                  <view class="timeline-content" @click="play(slotProps.item.id)">
                    <view class="timeline-title">{{ slotProps.item.title }}</view>
                    <view class="timeline-time flex mt-20">
                      <Icon name="clock-fill" :size="36" />
                      <VideoTime :id="slotProps.item.id"></VideoTime>
                    </view>
                  </view>
                </template>
              </Timeline>
            </Card>
          </template>
        </view>

        <view class="footer fixed">
          <u-button shape="square" type="primary" @click="play">开始学习</u-button>
        </view>
      </template>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.controls-title {
  color: red;
}

.video {
  width: 100%;
  height: 360rpx;
}

.video-content {
  // padding: 10rpx;border: solid 1px #333;
  // position: fixed;
  // top: calc(50px + var(--status-bar-height));
  // // width: calc(100% - $wing-gap * 2);
  // left: 0;
  // padding: 20rpx $wing-gap;
  // right: $wing-gap;
  z-index: 1;

  > * {
    display: block;
  }
}

.cover-radius {
  position: absolute;
  // background: #fff;
  width: 40rpx;
  height: 40rpx;
  z-index: 100;

  // color: #fff;
  //
  &.lt {
    left: -1px;
    top: -1px;
  }
  &.rt {
    right: -1px;
    top: -1px;
  }
  &.lb {
    left: -1px;
    bottom: -1px;
  }
  &.rb {
    right: -1px;
    bottom: -1px;
  }
}

.cover-radius-view-hor {
  position: absolute;
  background: #fff;
  width: 2px;
  height: 100%;
  z-index: 101;

  // color: #fff;
  //
  &.lt {
    left: -1px;
    top: -1px;
  }
  &.rt {
    right: -1px;
    top: -1px;
  }
  &.lb {
    left: -1px;
    bottom: -1px;
  }
  &.rb {
    right: -1px;
    bottom: -1px;
  }
}
.cover-radius-view-ver {
  position: absolute;
  background: #fff;
  width: 100%;
  height: 2px;
  z-index: 101;

  &.lt {
    left: -1px;
    top: -1px;
  }
  &.rt {
    right: -1px;
    top: -1px;
  }
  &.lb {
    left: -1px;
    bottom: -1px;
  }
  &.rb {
    right: -1px;
    bottom: -1px;
  }
}
.course-table {
  .timeline-content {
    position: relative;
    top: -6rpx;
  }
  /deep/ {
    .timeline-title {
      font-size: 32rpx;
    }

    .timeline-node {
      width: 2px;
      height: 20rpx;
      border: 2px solid $color-primary;
      border-radius: 50rpx;
    }

    .icon {
      margin-right: 10rpx;
    }

    .timeline-time {
      font-size: 26rpx;
      border-radius: 50rpx;
      padding: 10rpx 12rpx;
      display: inline-block;
      background: #f0f8ff;
      color: $color-primary;
    }
  }
}

.content {
  // display: flex;
  // flex-direction: column;
  // align-items: center;
  // justify-content: center;
  width: 100%;
  padding: 30rpx $wing-gap 150rpx;

  .icon.active {
    color: $color-primary;
  }

  .card {
    padding: 30rpx 36rpx;
    margin: 50rpx 0;
  }
}

.introduction {
  .card {
    position: relative;
    overflow: hidden;
    padding-top: 100rpx;
    padding-bottom: 50rpx;
  }

  .intro-tag {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    border-bottom-right-radius: 50rpx;
    border-top-right-radius: 50rpx;
    background: $color-primary;
    color: #fff;
    padding: 10rpx 20rpx;
  }

  .teacher-intro-tag {
    background: #33cfa8;
  }

  .school-intro-tag {
    background: #4ecdf9;
  }
}

.u-swiper-wrap {
  width: 100%;
  border-radius: $card-border-radius !important;
}

.navbar-right {
  color: #999;
}

.gap {
  margin-top: 26rpx;
  width: 100%;
}

.title {
  width: 100%;
  font-size: 40rpx;
  font-weight: 700;
  position: relative;
}

.desc {
  width: 100%;
  color: #666;
  font-size: 32rpx;
}

.footer {
  &.fixed {
    position: fixed;
    z-index: 100;
    bottom: 0;
    left: 0;
    right: 0;
  }

  width: 100%;
  // height: 184rpx;
  padding: 38rpx $wing-gap;
  background: #fff;

  .u-btn {
    height: 100rpx;
    border-radius: $card-border-radius;
    box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6);
  }

  .main {
    flex: 1;

    .action {
      display: flex;
      flex-direction: column;
      color: #aaa;

      + .action {
        margin-left: 40rpx;
      }
    }
  }

  .footer-content {
    padding: 20rpx 40rpx;
    background: #f8f6f9;
    border-radius: $card-border-radius;
  }
}
</style>

<style lang="scss" scoped>
.subsection {
  border-radius: 12rpx;
  padding: 20rpx 30rpx;
  background: #f7f7f7;

  /deep/ .u-item-bg {
    box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
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

.learn-count {
  .icon {
    color: $color-primary;
    margin-right: 10rpx;
  }
}
</style>
