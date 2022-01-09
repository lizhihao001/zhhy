<script>
import {
  defineComponent,
  reactive,
  computed,
  onMounted,
  onActivated,
  watch,
  ref,
  onUnmounted,
  onDeactivated,
} from '@vue/composition-api'
import { useMouse } from '@vueuse/core'
import Empty from '@/components/Empty'
import Card from '@/components/Card'
import Timeline from '@/components/Timeline'
import Icon from '@/components/Icon'
import Price from '@/components/Price'
import SignUpInforBar from '@/components/SignUpInforBar'
import SignUpInforCard from '@/components/SignUpInforCard'
import TrainTypeList from '@/components/TrainTypeList'
import CustomService from '@/components/CustomService'
import ContactUs from '@/components/ContactUs'
import { useStore, useService } from '@/hooks'
import services from '@/services'
import get from 'lodash/get'
import dayjs from 'dayjs'

const vm = defineComponent({
  components: {
    Empty,
    Card,
    Timeline,
    Icon,
    Price,
    SignUpInforBar,
    SignUpInforCard,
    TrainTypeList,
    CustomService,
    ContactUs,
  },
  // onLoad() {
  //   console.log('main onLoad')
  //   this.loadData()
  // },
  // onShow() {
  //   console.log('main Show')
  //   this.loadData()
  // },
  setup() {
    const store = useStore()
    const userInfo = computed(() => store.state?.user?.userInfo ?? {})
    const userProfile = computed(() => store.state?.user?.profile ?? {})
    const state = reactive({
      count: 0,
    })
    const indexService = useService(services['首页'], {
      initialData: [],
      presistKey: 'indexService',
    }) 

    const loadData = async () => {
      await indexService.fetch({
        type: 1,
      })
      if (!uni.getStorageSync('userInfo')) {
        uni.reLaunch({
          url: '/pages/auth/login-type',
        })
      }
    }

    onMounted(loadData)
    onActivated(loadData)
    onMounted(() => store.dispatch('user/fetchProfile'))
    onActivated(() => store.dispatch('user/fetchProfile'))

    const add = () => {
      state.count++
    }

    const toLogin = () => {
      uni.navigateTo({
        url: '/pages/login',
      })
    }

    const toMessage = () => {
     
      uni.navigateTo({
        url: '/pages/message/index',
      })
    }

    const list = ref([])
    const currentListType = ref(0)

    watch(indexService.data, () => {
      if (indexService.data.value?.length) {
        list.value = indexService.data.value
        return
      }
    })
   
    const messageListService = useService(services['客服接口'], {
      needErrorToast: false,
    })

    const fetchMessage = async () => {
      const res = await messageListService.fetch({})
      console.log(res)
    }

    const startMsgInterval = () => {
      fetchMessage()
      clearInterval(inter)
      // inter = setInterval(fetchMessage, 5000)
    }

    let inter

    onMounted(startMsgInterval)
    onUnmounted(() => {
      clearInterval(inter)
    })
    onActivated(startMsgInterval)
    onDeactivated(() => {
      clearInterval(inter)
    })

    const hasExamData = computed(() => {
      return list.value?.length > 0
    })

    return {
      get,
      loading: indexService.loading,
      messageInfo: messageListService.data,
      list:indexService.data,
      currentListType,
      hasExamData,
      loadData,
      userInfo,
      userProfile,
      state,
      add,
      toLogin,
      toMessage,
      title: '首页',
      fetchMessage,
      navigateTo(url) {
        uni.navigateTo({
          url: `/pages/${url}`,
        })
      },
      format(date, formatType) {
        return dayjs(date).format(formatType)
      },
      toTrainProgressDetail(item) { 
        uni.navigateTo({
          url: `/pages/train/details-progress?id=${item.id}`,
        })
      },
      toDetail(item) {
        uni.navigateTo({
          url: `/pages/train/details?id=${item.id}`,
        })
      },
      async clickTab(type) {
        console.log('type', type)
        currentListType.value = type
        const ret = await indexService.fetch({
          type: type + 1,
        })

      },
      navList: [
        {
          icon: require('@/static/train.png'),
          text: '培训科目',
          onClick() {
            uni.reLaunch({
              url: '/pages/train/list',
            })
          },
        },
        {
          icon: require('@/static/learn.png'),
          text: '在线学习',
          onClick() {
            uni.navigateTo({
              url: '/pages/learn-online/list',
            })
          },
        },
        {
          icon: require('@/static/query.png'),
          text: '考试查询',
          onClick() {
            uni.navigateTo({
              url: '/pages/exam-query/form',
            })
          },
        },
        // {
        //   icon: require('@/static/about-school.png'),
        //   text: '学校简介',
        //   onClick() {
        //     uni.navigateTo({
        //       url: '/pages/about-school',
        //     })
        //   },
        // },
      ],

      getTimeline(item) {
        const now = Date.now()
        const getTimeNode = (title, key) =>
          !item[key]
            ? null
            : {
                name: title,
                time: item[key],
                active: new Date(item[key]).getTime() <= now,
              }
        return [
          getTimeNode('报名时间', 'sign_up_time'),
          getTimeNode('报道时间', 'report_time'),
          getTimeNode('开课时间', 'start_time'),
          getTimeNode('考试时间', 'exam_time'),
        ]
          .filter(Boolean)
          .reverse()
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <!-- {{ userInfo }} -->
    <view class="header-bar">
      <u-row justify="between">
        <u-row class="user-info">
          <u-avatar
            size="mini"
            :src="get($store, 'state.user.profile.avatar')"
            v-if="get($store, 'state.user.profile.avatar')"
          ></u-avatar>
          <u-avatar size="mini" src="@/static/detault-avatar.png" v-else></u-avatar>
          <text class="user-name">{{ get($store, 'state.user.profile.name', '--') || '--' }}</text>
        </u-row>
        <view class="actions flex">
          <CustomService class="mr-20">
            <Icon name="kefu-ermai" />
          </CustomService>
          <ContactUs class="mr-20">
            <Icon name="phone" />
          </ContactUs>
          <!-- {{get(messageInfo, 'is_read', 0)}} -->
          <Icon name="bell" :count="get(messageInfo, 'is_read', 0)" @click="toMessage" />
          <view class="search-icon-section" @click="navigateTo('search')">
            <Icon :size="50" name="search" />
          </view>
        </view>
      </u-row>
    </view>
    <Card class="nav-card" :padding="false" :shadow="false">
      <view class="nav-content">
        <view class="nav-item" v-for="(item, idx) in navList" :key="idx" @click="item.onClick">
          <!-- <Icon :size="60" :name="item.icon"></Icon> -->
          <image class="nav-item-icon" :src="item.icon" mode="aspectFit" />
          <text>{{ item.text }}</text>
        </view>
      </view>
      <template>
        <Card class="list-type" :block="false" :padding="false" :shadow="false">
          <text class="type-option" :class="{ active: currentListType === 0 }" @click="clickTab(0)">当期</text>
          <text class="type-option" :class="{ active: currentListType === 1 }" @click="clickTab(1)">往期</text>
          <text class="type-option" :class="{ active: currentListType === 2 }" @click="clickTab(2)">推荐</text>
        </Card>
        <!-- <view class="list-type-shadow"></view> -->
      </template>
    </Card>

    <template v-if="(list || []).length > 0 && currentListType === 2">
      <!-- <view class="w-full mt-20 flex recommend-title">
        <view class="flex-1 flex"
          ><image src="@/static/recommend.png" class="recommend-icon" mode="aspectFit" />为您推荐</view
        >
        <view class="flex more" @click="navigateTo('train/list')">
          查看更多 <Icon name="arrow-right" class="" :size="30" />
        </view>
      </view> -->
      <view class="w-full mt-30">
        <SignUpInforCard
          v-for="(item, idx) in list"
          :key="idx||new Date().getTime()"
          :title="item.title"
          :tags="item.label&&item.label.split('，')"
          :price="[item.min_price, item.max_price]"
          :count="item.surplus_quota"
          @click="toDetail(item)"
        >
          {{ item.code }}批次 | {{ !item.start_time ? '--' : format(item.start_time, 'MM月DD日') }}开课 共{{
            item.cycle_num
          }}
        </SignUpInforCard>
      </view>
    </template>

    <view
      class="w-full mt-50"
      v-if="hasExamData && get(list, 'length', 0) > 0 && currentListType === 0"
    >
      <Card @click="toTrainProgressDetail(item)" v-for="(item, idx) in list" :key="idx">
        <view class="title">{{ item.title }}</view>
        <view class="gap desc"
          >{{ !item.start_time ? '--' : !item.start_time ? '--' : format(item.start_time, 'MM月DD日') }}开课 共{{
            item.cycle_num
          }}</view
        >
        <view class="gap mini-card">{{ item.code }} | {{ item.qcode }}</view>
        <!-- <Timeline v-if="getTimeline(item).length > 0" :data="getTimeline(item)" class="gap"> </Timeline> -->
      </Card>
    </view>
    <view
      class="w-full mt-50"
      v-if="hasExamData && get(list, 'length', 0) > 0 && currentListType === 1"
    >
      <Card @click="toTrainProgressDetail(item)" v-for="(item, idx) in list" :key="idx">
        <view class="title">{{ item.title }}</view>
        <view class="gap desc"
          >{{ !item.start_time ? '--' : !item.start_time ? '--' : format(item.start_time, 'MM月DD日') }}开课 共{{
            item.cycle_num
          }}</view
        >
        <view class="gap mini-card">{{ item.code }} | {{ item.qcode }}</view>
        <!-- <Timeline v-if="getTimeline(item).length > 0" :data="getTimeline(item)" class="gap"> </Timeline> -->
      </Card>
    </view>
    <Card class="mt-50 empty-section" v-if="!hasExamData">
      <Empty :src="require('@/static/empty-3.png')" title="您目前暂无正在进行的培训" text="立即开启您的培训计划">
        <!-- <image class="empty-icon" src="@/static/empty-3.png" mode="heightFix" /> -->
      </Empty>
      <u-button class="empty-btn mt-50" type="primary" @click="navigateTo('train/list')">培训报名</u-button>
    </Card>

    <!-- <Card @click="toTrainProgressDetail">
      <view class="title">2021年9月培训（假数据）</view>
      <view class="gap desc">7月16日开课 共3个月</view>
      <view class="gap mini-card">A98302 | A301</view>
    </Card>
    <Card @click="toTrainProgressDetail">
      <view class="title">2021年9月培训（假数据）</view>
      <view class="gap desc">7月16日开课 共3个月</view>
      <view class="gap mini-card">A98302 | A301</view>
      <Timeline :data="timelineList" class="gap"> </Timeline>
    </Card>
    <SignUpInforCard
      title="2021年9月培训（假数据）"
      :tags="['小证初培', '关键词']"
      :price="[500, 4880]"
      :count="10"
      @click="toDetail"
    >
      A29K30批次 | 7月16日开课 共3个月
    </SignUpInforCard> -->
  </view>
</template>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 0 $wing-gap;
  padding-bottom: 30rpx;
}

.empty-section {
  text-align: center;
}

.empty-btn {
  display: inline-block;
}

.nav-item-icon {
  width: 65rpx;
  height: 65rpx;
  margin-bottom: 20rpx;
}

.recommend-title {
  .flex-1 {
    font-size: 34rpx;
    font-weight: 700;
  }
  .recommend-icon {
    width: 80rpx;
    height: 80rpx;
    margin-right: 10rpx;
    position: relative;
    top: 8rpx;
  }

  .more {
    font-size: 26rpx;
    color: #a8bccd;
  }
}

.header-bar {
  width: 100%;
}

.nav-card {
  width: calc(100% + 40rpx) !important;
}

.header-bar {
  border-radius: $card-border-radius;
  padding: 36rpx 0;

  .u-avatar {
    position: relative;
    z-index: 2;
  }

  .user-name {
    background: #f7f6f9;
    color: #999;
    border-top-right-radius: 100rpx;
    border-bottom-right-radius: 100rpx;
    padding: 10rpx 36rpx;
    position: relative;
    z-index: 1;
    left: -20rpx;
  }

  .actions {
    color: #999;
  }

  .search-icon-section {
    display: inline-block;
    position: relative;
  }

  .search-icon-section {
    margin-left: 22rpx;
    padding: 16rpx;
    background: #f7f6f9;
    border-radius: 50%;
  }
}

.nav-card {
  position: relative;
  z-index: 2;
  margin-bottom: 20rpx;
}

.nav-content {
  border-radius: $card-border-radius;
  // background: $color-primary;
  background-image: url(~@/static/home-card-bg.png);
  background-size: 100% 100%;
  height: 300rpx;
  display: flex;
  padding: 0 30rpx;
  position: relative;
  z-index: 2;
  // box-shadow: 0 6rpx 30rpx #e6e6e6;
  margin-bottom: 4rpx;
}

.nav-item {
  height: 260rpx;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 26rpx;

  .icon {
    margin-bottom: 10rpx;
  }
}

.list-type {
  width: 390rpx;
  height: 82rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  bottom: 30rpx;
  transform: translate(-50%, 50%);
  background: #fff;
  // border-radius: $card-border-radius;
  z-index: 3;
  color: #999999;
  box-shadow: 0rpx 4rpx 18rpx rgba(111, 111, 111, 0.16);
  font-weight: 400;

  .type-option {
    display: inline-block;

    &.active {
      color: $color-primary;
      font-weight: 400;
    }

    + .type-option {
      margin-left: 50rpx;
    }
  }
}

.list-type-shadow {
  width: 300rpx;
  height: 82rpx;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 50%);
  border-radius: $card-border-radius;
  z-index: 1;
  box-shadow: 0 6rpx 30rpx #e6e6e6;
}

.card {
  border-radius: 13px;
  .gap {
    margin-top: 36rpx;
    margin-bottom: 0;
  }

  .title {
    font-size: 40rpx;
    font-weight: 700;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 10rpx;
      height: 36rpx;
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

.empty {
  padding-top: 150rpx;
}
</style>
