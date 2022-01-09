<script>
import { computed, defineComponent, ref, watch } from '@vue/composition-api'
import Card from '@/components/Card'
import Timeline from '@/components/Timeline'
import ViewStatus from '@/components/ViewStatus'
import Icon from '@/components/Icon'
import Price from '@/components/Price'
import SignUpInforBar from '@/components/SignUpInforBar'
import SignUpInforCard from '@/components/SignUpInforCard'
import TrainTypeList from '@/components/TrainTypeList'
import dayjs from 'dayjs'

import Home from './Home'
import SignUp from './SignUp'
import News from './News'
import My from './My'

const vm = defineComponent({
  components: {
    ViewStatus,
    Card,
    Timeline,
    Icon,
    Price,
    SignUpInforBar,
    SignUpInforCard,
    TrainTypeList,
    Home,
    SignUp,
    News,
    My,
  },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    // console.log(option.id) //打印出上个页面传递的参数

    if (typeof option.tabIdx !== 'undefined') {
      this.currentTabIdx = Number(option.tabIdx) || 0
    }
  },
  onShow() {
    if (this.currentTabIdx === 0) {
      console.log('onShow fetchMessage')
      setTimeout(() => {
        this.$refs.home.fetchMessage()
      }, 100)
    }
  },
  onPullDownRefresh(){
    console.log('111')
  },
  setup() {
    const currentTabIdx = ref(0)

    return {
      currentTabIdx,
      list: [
        {
          iconPath: require('@/static/tab-home.png'),
          selectedIconPath: require('@/static/tab-home-active.png'),
          text: '首页',
        },
        {
          iconPath: require('@/static/tab-sign-up.png'),
          selectedIconPath: require('@/static/tab-sign-up-active.png'),
          text: '报名',
        },
        {
          iconPath: require('@/static/tab-find.png'),
          selectedIconPath: require('@/static/tab-find-active.png'),
          text: '发现',
        },
        {
          iconPath: require('@/static/tab-my.png'),
          selectedIconPath: require('@/static/tab-my-active.png'),
          text: '我的',
        },
      ],
      disabled: false,
    }
  },
})

export default vm
</script>

<template>
  <view class="tab-wrapper">
    <view class="status-bar">
      <!-- 这里是状态栏 -->
    </view>
    <ViewStatus loading v-if="disabled" />
    <template v-else>
      <Home v-if="currentTabIdx === 0" ref="home" />
      <SignUp v-if="currentTabIdx === 1" />
      <News v-if="currentTabIdx === 2" />
      <My v-if="currentTabIdx === 3" />
      <u-tabbar
        v-model="currentTabIdx"
        :list="list"
        class="tabbar"
        :height="184"
        :icon-size="50"
        active-color="#4DA0ED"
        inactive-color="#AFB4C1"
        :active-item-style="{
          width: '50px',
          width: '50px',
        }"
      ></u-tabbar>
    </template>
  </view>
</template>

<style lang="scss" scoped>
.status-bar {
  height: var(--status-bar-height);
  width: 100%;
}

.tab-wrapper {
  /deep/ {
    .u-tabbar__content {
      box-sizing: border-box !important;
      padding: 28rpx $wing-gap 0;
      padding-bottom: 28rpx !important;
      border-radius: $card-border-radius;
      background-color: #fff !important;

      &:after {
        border-top-width: 0 !important;
      }

      &__item {
        padding: 12rpx 0;
        background-color: #f8f6f9 !important;

        &:first-child {
          border-top-left-radius: $card-border-radius;
          border-bottom-left-radius: $card-border-radius;
        }

        &:last-child {
          border-top-right-radius: $card-border-radius;
          border-bottom-right-radius: $card-border-radius;
        }
      }
    }

    .u-tabbar__content__item__button {
      top: 20rpx !important;
    }
    .u-tabbar__content__item__text {
      bottom: 20rpx !important;
    }

    // .u-icon__img {
    //   width: 50rpx !important;
    //   height: 50rpx !important;
    // }
  }
}
</style>
