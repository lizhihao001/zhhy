<script>
import { defineComponent, reactive, ref, onMounted, watch, computed } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import Empty from '@/components/Empty'
import ViewStatus from '@/components/ViewStatus'
import services from '@/services'
import { useLocalStorage, useService } from '@/hooks'
import get from 'lodash/get'

const vm = defineComponent({
  components: { ViewStatus, Empty, Icon, Card, SignUpInforCard, Timeline },
  setup() {
    const typeList = useLocalStorage('typeList', [])
    const tabList = computed(() => {
      return [
        {
          name: '全部',
          id: undefined,
        },
        ...(typeList.value || []),
      ]
    })

    onMounted(async () => {
      const res = await services['获取培训计划分类']()

      console.log('获取培训计划分类', res)

      typeList.value = res?.data || []
    })

    const currentTab = ref(0)
    const handleTabChange = (index) => {
      currentTab.value = index // tabList[index]?.id
    }

    const currentNav = ref(0)
    const handleNavChange = (index) => {
      currentNav.value = index
    }

    const learnOnlineService = useService(services['获取在线学习列表'])
    const learnOnlineList = learnOnlineService.data
    // useService

    const fetchList = async (params) => {
      const res = await learnOnlineService.fetch({
        type: tabList?.value?.[currentTab.value]?.id,
        course: undefined,
        // platypet_time: selectedTime.value || '',
      })

      console.log('获取在线学习列表', res)

      // learnOnlineList.value = res?.data || []
    }

    onMounted(fetchList)

    watch(currentNav, fetchList)
    watch(currentTab, fetchList)

    const fileListRenderKey = ref(Math.random())

    function navigateTo(url) {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    function downloadFile(src) {
      uni.downloadFile({
        //通过uniapp的api下载下来
        url: `http://zhschool.qixiuu.com${src}`,
        success: function (res) {
          const filePath = res.tempFilePath

          console.log(res)

          uni.setStorageSync(`download_file_${src}`, filePath)
          fileListRenderKey.value = Math.random()
          uni.showToast({
            icon: 'none',
            title: '下载成功',
          })
        },
      })
    }

    function isDownloadedFile(src) {
      const filePath = uni.getStorageSync(`download_file_${src}`)

      return !!filePath
    }

    function viewFile(src) {
      const filePath = uni.getStorageSync(`download_file_${src}`)
      uni.openDocument({
        filePath: filePath,
        success: function (FileRes) {
          console.log('打开文档成功')
        },
      })
    }

    return {
      fileListRenderKey,
      isDownloadedFile,
      downloadFile,
      viewFile,
      navigateTo,
      get,
      currentNav,
      handleNavChange,
      loading: learnOnlineList.loading,
      learnOnlineList,
      navigationList: [
        {
          name: '视频资料',
        },
        {
          name: '资料下载',
        },
        {
          name: '我的足迹',
        },
      ],
      currentTab,
      handleTabChange,
      tabList,
      tags: ['标签名称'],
      toDetails(itemId) {
        uni.navigateTo({
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
    <u-navbar :title-size="38" title="" :height="50">
      <view class="navbar-title">
        <view class="card">
          <u-subsection
            :list="navigationList"
            :current="currentNav"
            :font-size="32"
            @change="handleNavChange"
            active-color="#4da0ed"
          ></u-subsection>
        </view>
      </view>
      <template v-slot:right>
        <view class="transparent">在线学习</view>
      </template>
    </u-navbar>
    <u-tabs
      :list="tabList"
      :is-scroll="get(tabList, 'length', 0) > 4"
      :current="currentTab"
      @change="handleTabChange"
      active-color="#4da0ed"
      class="tabs-list"
      bar-width="16"
    ></u-tabs>
    <ViewStatus :loading="!learnOnlineList || loading" :empty="(learnOnlineList || []).length === 0">
      <template v-if="!!learnOnlineList">
        <view class="list" v-if="currentNav === 0">
          <Card
            v-for="(item, idx) in learnOnlineList.filter((item) => !!item.video_url)"
            :key="idx"
            @click="toDetails(item.id)"
          >
            <view class="item flex">
              <image src="@/static/video-file-icon.png" mode="aspectFix" class="video-file-icon mr-50" />
              <view class="flex-1">
                <view class="item-title">{{ item.title }}</view>
                <view class="mt-20 desc">{{ item.sub_title }}</view>
                <view class="topping">资料置顶</view>
                <view class="mt-20 flex">
                  <view class="flex-1">
                    <u-tag
                      v-for="(tag, idx) in item.label.split(',').slice(0, 1)"
                      :key="idx"
                      :text="tag"
                      mode="plain"
                      shape="circle"
                    />
                  </view>
                  <text class="learn-count">
                    <Icon name="account-fill" :size="36" />
                    {{ item.study_num }}人学过
                  </text>
                </view>
              </view>
            </view>
          </Card>
        </view>
        <view class="list" v-else :key="fileListRenderKey">
          <Card v-for="(item, idx) in learnOnlineList.filter((item) => !!item.download_url)" :key="idx">
            <view class="item flex">
              <!-- <Icon name="order" class="item-icon" :size="80" /> -->
              <image src="@/static/pdf-icon.png" mode="aspectFix" class="file-icon mr-50" />
              <view class="flex-1">
                <view class="item-title">{{ item.title }}</view>
                <view class="mt-20 desc">{{ item.sub_title }}</view>
                <view class="mt-30 btn">
                  
                  <u-button
                    size="medium"
                    v-if="!isDownloadedFile(item.download_url)"
                    type="primary"
                    class="flex download"
                    @click="downloadFile(item.download_url)"
                  >
                    <image src="@/static/icons/download.png" class="downloads" />下载
                    <!-- <Icon name="download" :size="40" />下载 -->
                  </u-button>
                  <u-button
                    v-else
                    size="medium"
                    type="success"
                    class="flex downloaded"
                    @click="viewFile(item.download_url)"
                  >
                  <image src="@/static/icons/see.png" class="see" />查看
                    <!-- <Icon name="eye" :size="40" />查看 -->
                  </u-button>
                </view>
              </view>
            </view>
          </Card>
        </view>
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
  padding-top: 70rpx;
  // padding: 50rpx $wing-gap;
}

.title {
  .icon {
    margin-right: 16rpx;
    position: relative;
    left: -10rpx;
    color: $color-primary;
  }
  margin-bottom: 50rpx;

  color: #333;
  font-size: 40rpx;
  font-weight: 700;
}

.video-file-icon {
  width: 80rpx;
  height: 90rpx;
}

.file-icon {
  width: 70rpx;
  height: 70rpx;
}

.navbar-title {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  /deep/ {
    .u-subsection {
      padding: 16rpx 24rpx !important;
      border-radius: $card-border-radius;
      box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
      background-color: #fff !important;
    }

    .u-item {
      padding: 0 16rpx;
    }
  }
}

.transparent {
  opacity: 0;
}

.tabs-list {
  position: fixed;
  top: calc(50px + var(--status-bar-height));
  z-index: 2;
  width: 750rpx;
  height: 80rpx;
  background: #fff;
}
/deep/ .u-tab-bar {
  position: absolute;
  bottom: 16rpx;
  left: 0rpx;
}
/deep/ .u-subsection{
  margin-left: 40rpx;
  border-radius: 20rpx !important;
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

.list {
  width: 100%;
  padding: 50rpx $wing-gap;
  position: relative;
  // padding: 50rpx 0;
  .topping {
    width: 120rpx;
    height: 42rpx;
    border: 2rpx solid #4da0ed;
    border-radius: 10rpx;
    color: #4da0ed;
    font-size: 24rpx;
    font-weight: 500;
    padding-top: 2rpx;
    text-align: center;
    position: absolute;
    top: 56rpx;
    right: 20rpx;
  }

  .item {
    align-items: flex-start;
  }

  .item-icon {
    margin-right: 32rpx;
    color: $color-primary;
  }

  .item-title {
    font-size: 40rpx;
    font-weight: 700;
    // max-width: 300rpx;
    padding-right: 50rpx;
  }

  .desc {
    color: #999;
    font-size: 28rpx;
  }

  .learn-count {
    .icon {
      color: $color-primary;
      margin-right: 10rpx;
    }
  }
}

.btn {
  width: 160rpx;
  position: relative;
}

.u-btn {
  display: flex;
  align-items: center;

  .icon {
    line-height: initial;
  }
}

.download {
  box-shadow: 0rpx 0rpx 16rpx rgba($color-primary, 0.6);
  padding-left: 120rpx;
}

.downloaded {
  box-shadow: 0rpx 0rpx 16rpx rgba($color-success, 0.6);
  padding-left: 120rpx;
}
.downloads{
  width: 40rpx;
  height: 40rpx;
  position: absolute;
  top: 12rpx;
  left: 46rpx;
}
.see{
  width: 40rpx;
  height: 24rpx;
  position: absolute;
  top: 22rpx;
  left: 46rpx;
}
.empty {
  padding-top: 150rpx;
}
</style>
