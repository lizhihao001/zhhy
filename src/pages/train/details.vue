<script>
import { defineComponent, onMounted, reactive, ref, computed, watch } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Card from '@/components/Card'
import Timeline from '@/components/Timeline'
import Icon from '@/components/Icon'
import Price from '@/components/Price'
import SignUpInforBar from '@/components/SignUpInforBar'
import SignUpInforCard from '@/components/SignUpInforCard'
import TrainTypeList from '@/components/TrainTypeList'
import CustomService from '@/components/CustomService'
import ContactUs from '@/components/ContactUs'
import { useService } from '@/hooks'
import services from '@/services'
import dayjs from 'dayjs'
import get from 'lodash/get'

const vm = defineComponent({
  components: { CustomService, ContactUs, Card, Timeline, Icon, Price, SignUpInforBar, SignUpInforCard, TrainTypeList },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    console.log(option.id) //打印出上个页面传递的参数

    this.option.id = option.id
  },
  setup() {
    const option = reactive({
      id: null,
    })
    const showTime = ref(false)
    const showTypes = ref(false)
    const selectedType = ref(null)
    const stared = ref(false)
    const showSignUpPopup = ref(false)
    const detailsService = useService(services['获取培训计划详情'], {
      initialData: null,
      // presistKey: 'detailsService',
    })
    const details = detailsService.data
    // const courseListService = useService(services['课程管理详情'], {
    //   initialData: {},
    //   presistKey: 'courseListService',
    // })

    onMounted(async () => {
      await detailsService.fetch({
        plan_id: option.id,
      })

      stared.value = details.value?.is_collection_plan
      // courseListService.fetch({
      //   plan_id: option.id,
      // })
    })

    const starToggle = async () => {
      const res = await services[stared.value ? '取消收藏培训计划' : '收藏培训计划']({
        plan_id: option.id,
      })

      if (res?.success) {
        stared.value = !stared.value
        uni.showToast({
          icon: 'none',
          title: res?.msg,
        })
      }
    }
    const selectedCourse = reactive([])
    const totalPrice = ref(0)
    watch(selectedCourse, () => {
      totalPrice.value = selectedCourse.reduce((count, item) => Number(item.price) + count, 0)
    })

    const currentNav = ref(0)
    const showConnectPopup = ref(false)

    function navigateTo(url) {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    const showSharePanel = ref(false)

    function format(date, formatType) {
      return dayjs(date).format(formatType)
    }

    return {
      navigateTo,
      get,
      showConnectPopup,
      showSharePanel,
      // dayjs,
      selectedCourse,
      totalPrice,
      currentNav,
      handleNavChange(idx) {
        currentNav.value = idx
      },
      navigationList: [
        {
          name: '培训内容',
        },
        {
          name: '报名须知',
        },
        {
          name: '报名流程',
        },
      ],
      selectCourse(item) {
        // count.value = count.value + 1
        // details.plan_price_arr.plan_price = []
        if (selectedCourse.includes(item)) {
          const idx = selectedCourse.indexOf(item)
          selectedCourse.splice(idx, 1)
        } else {
          selectedCourse.push(item)
        }
      },
      details,
      starToggle,
      // courseList: courseListService.data,
      option,
      stared,
      showSignUpPopup,
      // dayjs,
      format,
      images: [
        require('static/banner-demo.png'),
        require('static/banner-demo.png'),
        require('static/banner-demo.png'),
        require('static/banner-demo.png'),
        require('static/banner-demo.png'),
      ],
      isSharePage: false,
      toSignUp() {
        if (selectedCourse.length === 0) {
          uni.showToast({
            icon: 'none',
            title: '请选择培训项目',
          })
          return
        }

        uni.setStorageSync('orderInfoParams', {
          plan_id: option?.id, // integer	是	计划id
          project_ids: [
            ...new Set(selectedCourse.filter((item) => item.type === 'course').map((item) => item.id)),
          ].join(','), // string	是	课程i串
          pack_project_ids: [
            ...new Set(selectedCourse.filter((item) => item.type === 'pack_course').map((item) => item.id)),
          ].join(','), // string	是	套餐i串
          // pay_price: totalPrice.value, // integer	是	支付金额
        })

        showSignUpPopup.value = false

        uni.navigateTo({
          url: '/pages/sign-up/form',
        })
      },
      share({ provider = 'qq', scene } = {}) {
        uni.share({
          provider,
          scene,
          type: 0,
          title: `智慧海院 - ${get(details.value, 'title', '--')}`,
          summary: `${!details.value?.start_time ? '--' : format(details.value?.start_time, 'MM月DD日')}开课，共${get(
            details.value,
            'cycle_num',
            '--',
          )}，还有${get(details.value, 'surplus_quota', '--')}个名额`,
          href: 'http://zhschool.qixiuu.com/',
          imageUrl: 'http://zhschool.qixiuu.com/assets/img/favicon.ico',
          success(res) {
            console.log('success:' + JSON.stringify(res))
            uni.showToast({
              icon: 'success',
              title: '分享成功',
            })
          },
          fail(err) {
            console.log('fail:' + JSON.stringify(err))
            uni.showToast({
              icon: 'none',
              title: '分享失败',
            })
          },
        })
      },
      picture() {
        uni.navigateTo({
          url: '/pages/train/share',
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="详情" :height="50" v-if="!isSharePage">
      <template v-slot:right>
        <view class="navbar-right">
          <Icon name="share-fill" @click="showSharePanel = true" />
          <Icon :name="stared ? 'star-fill' : 'star'" @click="starToggle" :class="{ active: stared }" />
        </view>
      </template>
    </u-navbar>
    <template v-if="!!details">
      <u-swiper
        :list="get(details, 'images', []).map((item) => `${item}`)"
        :height="642"
        mode="number"
        indicator-pos="bottomRight"
      ></u-swiper>
      <view class="gap title">{{ get(details, 'title', '--') }}</view>
      <view class="gap desc">
        {{ get(details, 'batch_number', '--') }}批次 |
        {{ !details.start_time ? '--' : format(details.start_time, 'MM月DD日') }}开课 共{{
          get(details, 'cycle_num', '--')
        }}
      </view>

      <SignUpInforBar
        class="gap"
        :price="
          get(details, 'plan_price_arr.length', 0) > 1
            ? [get(details, 'min_price', 0), get(details, 'max_price', 0)]
            : get(details, 'max_price', 0)
        "
        :count="get(details, 'surplus_quota', '--')"
      />

      <view class="subsection w-full mb-50 mt-50">
        <u-subsection
          bg-color="#f7f7f7"
          :height="94"
          :list="navigationList"
          :current="currentNav"
          @change="handleNavChange"
          active-color="#4da0ed"
        ></u-subsection>
      </view>

      <template v-if="currentNav === 0">
        <Card>
          <view class="content-title flex">
            <view class="dot-small"></view>
            <view class="dot-large"></view>
            <text class="content-title-text">培训时间</text>
            <view class="dot-large"></view>
            <view class="dot-small"></view>
          </view>
          <view>
            <view class="flex">
              <view class="flex-1 train-time-box">
                <view class="desc">上课时间</view>
                <view class="value">{{ details.start_time || '--' }}</view>
              </view>
              <view class="flex-1 train-time-box ml-30">
                <view class="desc">考试时间</view>
                <view class="value">{{ details.exam_time || '--' }}</view>
              </view>
            </view>
            <view class="flex mt-30">
              <view class="flex-1 train-time-box">
                <view class="desc">培训时长</view>
                <view class="value">{{ details.cycle_num || '--' }}</view>
              </view>
              <view class="flex-1 train-time-box ml-30">
                <view class="desc">报到时间</view>
                <view class="value">{{ details.reporting_time || '--' }}</view>
              </view>
            </view>
            <view class="flex mt-30">
              <view class="flex-1 train-time-box location">
                <view class="flex">
                  <Icon name="map-fill" class="mr-30" />
                  <view class="flex-1">
                    <view class="desc">报到地点</view>
                    <view class="value">武汉海事职业学院</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </Card>

        <Card>
          <view class="content-title flex">
            <view class="dot-small"></view>
            <view class="dot-large"></view>
            <text class="content-title-text">培训内容</text>
            <view class="dot-large"></view>
            <view class="dot-small"></view>
          </view>
          <view v-for="(item, idx) in details.plan_price_arr" :key="idx" class="flex active mb-20" v-show="!!item.name">
            <Icon name="checkmark-circle-fill" :size="40" class="mr-20 active-icon" />
            {{ item.name || '--' }}
          </view>
        </Card>

        <Card v-if="get(details, 'money_detail_images')">
         <view class="content-title flex">
            <view class="dot-small"></view>
            <view class="dot-large"></view>
            <text class="content-title-text">费用说明</text>
            <view class="dot-large"></view>
            <view class="dot-small"></view>
          </view> 
          <image
            class="w-full"
            :src="`${get(details, 'money_detail_images')}`"
            mode="widthFix"
          />
        </Card>

        <Card v-if="get(details, 'plan_condition.length', 0) > 0">
          <view class="content-title flex">
            <view class="dot-small"></view>
            <view class="dot-large"></view>
            <text class="content-title-text">报名条件</text>
            <view class="dot-large"></view>
            <view class="dot-small"></view>
          </view>
          <u-parse
            :html="item"
            v-for="(item, idx) in get(details, 'plan_condition', [])"
            :key="idx"
            class="mt-30"
          ></u-parse>
        </Card>
      </template>
      <template v-if="currentNav === 1">
        <!-- <Card v-for="(item, idx) in details.plan_notice_images" :key="idx"> -->
        <image
          v-for="(item, idx) in get(details, 'plan_notice_images', [])"
          :key="idx"
          mode="widthFix"
          class="w-full"
          :src="`${item}`"
        />
        <!-- </Card> -->
      </template>
      <template v-if="currentNav === 2">
        <!-- <Card v-for="(item, idx) in details.process_images" :key="idx"> -->
        <image
          v-for="(item, idx) in get(details, 'process_images', [])"
          :key="idx"
          mode="widthFix"
          class="w-full"
          :src="`${item}`"
        />
        <!-- </Card> -->
      </template>

      <view class="footer fixed flex" v-if="isSharePage">
        <u-button shape="square" class="w-full" type="primary" @click="navigateTo('share-download')"
          >下载智慧海院APP</u-button
        >
      </view>

      <view class="footer fixed" v-if="!isSharePage">
        <u-row class="footer-content" justify="between">
          <u-row class="main">
            <CustomService class="action">
              <Icon name="kefu-ermai" :size="50" />
              <text>咨询</text>
            </CustomService>
            <ContactUs class="action">
              <Icon name="phone" :size="50" />
              <text>联系</text>
            </ContactUs>
          </u-row>
          <u-button
            shape="square"
            type="primary"
            :disabled="get(details, 'surplus_quota', 0) === 0"
            @click="showSignUpPopup = true"
            >立即报名</u-button
          >
        </u-row>
      </view>

      <u-modal v-model="showConnectPopup" title="">
        <view class="connect-popup mt-30 mb-50">
          <view class="mt-20 phone-value">{{ get(details, 'online_mobile', '--') }}</view>
          <view class="mt-20">工作日09:00-18:00</view>
        </view>
      </u-modal>

      <u-popup v-model="showSharePanel" title="选择分享方式" mode="bottom" class="popup-wrapper">
        <view class="mb-50"></view>
        <view class="mb-50 mt-50">
          <view class="title flex flex-col">选择分享方式</view>
        </view>
        <view class="mb-50"></view>
        <view class="flex share-type">
          <view class="flex flex-col share" @click="share({ provider: 'weixin', scene: 'WXSceneSession' })">
            <image class="image" src="@/static/icons/wx-share.png" />
            <text>微信</text>
          </view>
          <view class="flex flex-col share" @click="share({ provider: 'qq' })">
            <image class="image" src="@/static/icons/qq-share.png" />
            <text>QQ</text>
          </view>
          <view class="flex flex-col share" @click="share({ provider: 'weixin', scene: 'WXSenceTimeline' })">
            <image class="image" src="@/static/icons/pyq-share.png" />
            <text>朋友圈</text>
          </view>
          <view class="flex flex-col share" @click="picture()">
            <image class="image" src="@/static/icons/fenxiangtu.png" />
            <text>分享图</text>
          </view>
        </view>
        <view class="mt-50"></view>
        <view class="flex w-full">
          <view class="flex-1 flex flex-col" @click="showSharePanel = false">取消</view>
        </view>
        <view class="mt-50"></view>
      </u-popup>

      <u-popup v-model="showSignUpPopup" mode="bottom" class="popup-wrapper">
        <u-row class="popup-container">
          <view class="popup-content flex-1 flex flex-col">
            <u-row class="title flex">
              <image src="@/static/book.png" class="title-image" />
              请选择培训项目
            </u-row>
            <scroll-view scroll-y="true" class="popup-scroll-view flex-1">
              <view class="scroll-content">
                <Card
                  v-for="(item, idx) in details.plan_price_arr"
                  :key="idx"
                  @click="selectCourse(item)"
                  class="select-item"
                  v-show="!!item.name"
                >
                  <u-row class="option" :class="{ active: selectedCourse.includes(item) }">
                    <u-row class="flex-1">
                      <Icon name="checkmark" :size="26" />
                      {{ item.name || '--' }}
                    </u-row>
                    <Price :value="item.price" />
                  </u-row>
                  <view class="time">
                    {{ !details.start_time ? '--' : format(details.start_time, 'MM月DD日') }}开课 共{{
                      get(details, 'cycle_num', '--')
                    }}
                  </view>
                </Card>
              </view>
            </scroll-view>
          </view>
          <view class="footer">
            <u-row class="footer-content" justify="between">
              <u-row class="main"> 需支付 <Price :value="totalPrice" /> </u-row>
              <u-button shape="square" type="primary" @click="toSignUp">立即报名</u-button>
            </u-row>
          </view>
        </u-row>
      </u-popup>
    </template>
    <view class="loading w-full flex" v-else>
      <u-loading mode="flower" :size="60"></u-loading>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.share-type {
  padding: 20rpx 0 70rpx;
}
.share {
  flex: 1;
  .image {
    width: 100rpx;
    height: 100rpx;
  }
}
.select-item {
  padding-left: 16rpx !important;
  padding-right: 16rpx !important;
}
.title-image {
  width: 70rpx;
  height: 70rpx;
  position: relative;
  top: 6rpx;
  margin-right: 10rpx;
}
.train-time-box {
  height: 150rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #eff7ff;
  border: solid 6rpx #eff7ff;
  border-radius: 18rpx;
  overflow: hidden;
  position: relative;

  &:after {
    background-color: #e4f0fc;
    position: absolute;
    content: '';
    display: block;
    width: 100rpx;
    height: 70rpx;
    border-radius: 18rpx;
    left: 0;
    top: 0;
    transform: translate(-50%, -50%);
  }

  &.location {
    .icon {
      color: $color-primary;
    }

    .desc,
    .value {
      text-align: left;
    }
  }

  .desc {
    text-align: center;
    font-size: 28rpx;
    font-weight: 500;
    color: #8a9aa8;
  }

  .value {
    margin-top: 10rpx;
    text-align: center;
    font-size: 28rpx;
    font-weight: 500;
    color: #4da0ed;
  }
}
.connect-popup {
  text-align: center;
  .phone-value {
    font-weight: 700;
  }
}

.active-icon {
  color: $color-primary;
}

.content-title {
  justify-content: center;
  color: $color-primary;
  margin-bottom: 50rpx;

  .content-title-text {
    margin: 0 10rpx;
    font-size: 34rpx;
  }

  .dot-large {
    width: 22rpx;
    height: 22rpx;
    border-radius: 50%;
    background: #95c6f7;
    margin: 0 8rpx;
  }

  .dot-small {
    width: 10rpx;
    height: 10rpx;
    border-radius: 50%;
    background: #95c6f7;
    margin: 0 8rpx;
  }
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 20rpx $wing-gap 200rpx;

  .icon.active {
    color: $color-primary;
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
  font-size: 44rpx;
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
  height: 184rpx;
  padding: 28rpx $wing-gap;
  background: #fff;

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

.loading {
  padding-top: 200rpx;
  justify-content: center;
}

.subsection {
  padding: 20rpx 30rpx;
  background: #f7f7f7;

  /deep/ .u-item-bg {
    box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
  }
}
</style>

<style lang="scss" scoped>
.popup-wrapper {
  /deep/ .u-drawer-content {
    border-top-left-radius: $card-border-radius;
    border-top-right-radius: $card-border-radius;
    // max-height: 90%;
  }

  .popup-container {
    height: 100%;
    flex-direction: column;
  }

  .popup-content {
    padding: 42rpx 0;
    width: 100%;
  }

  .popup-scroll-view {
    flex: 1;
    overflow-y: scroll;
    max-height: 600rpx;

    .scroll-content {
      padding: 10rpx 56rpx;
    }

    // /deep/ {
    //   .uni-scroll-view-content {

    //   }
    // }
    .time {
      font-size: 24rpx;
      font-weight: 400;
      color: #999999;
      padding: 4rpx 0 0 48rpx;
    }
  }

  .main {
    .price {
      margin-left: 16rpx;
    }
  }

  .title {
    padding: 0 $wing-gap;
    font-size: 36rpx;
    margin-bottom: 50rpx;

    .icon {
      margin-right: 16rpx;
      color: $color-primary;
    }
  }

  .option {
    &.active {
      .icon {
        background: $color-primary;
      }
    }
    .icon {
      margin-right: 16rpx;
      color: #fff;
      background: #dce5f0;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32rpx;
      height: 32rpx;
    }
  }
}
/deep/ .u-indicator-item-number {
  width: 88rpx;
  height: 52rpx;
  background: linear-gradient(318deg, #77b7f2 0%, #3794ea 100%);
  opacity: 1;
  border-radius: 60rpx;
  font-size: 24rpx;
  color: #ffffff;
  text-align: center;
  padding-top: 14rpx;
}
</style>
