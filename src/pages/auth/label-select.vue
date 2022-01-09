<script>
import { defineComponent, reactive, ref, computed } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import ViewStatus from '@/components/ViewStatus'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import services from '@/services'
import { useStore, useLocalStorage, useService } from '@/hooks'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline, ViewStatus },
  setup() {
    const store = useStore()
    const userInfo = computed(() => store.state?.user?.userInfo ?? {})
    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }
    const selectedIdx = ref({})

    const labelService = useService(services['标签列表'])

    labelService.fetch()

    return {
      list: labelService.data,
      loading: labelService.loading,
      navigateTo,
      selectedIdx,
      toggle(item) {
        selectedIdx.value = {
          ...selectedIdx.value,
          [item.id]: !selectedIdx.value[item.id],
        }
      },
      async onConfirm() {
        const selectedKeys = Object.keys(selectedIdx.value)

        if (selectedKeys.length === 0) {
          uni.showToast({
            icon: 'none',
            title: '请选择标签',
          })
          return
        }
        const res = await services['设置用户标签']({
          user_id: userInfo.value?.user_id,
          label_ids: selectedKeys.join(','),
        })

        if (res?.success) {
          setTimeout(() => {
            uni.reLaunch({ url: '/pages/tab/index' })
          }, 500)
          return
        }

        uni.showToast({
          icon: 'none',
          title: res?.msg ?? '请求错误，请稍后再试',
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="content-wrapper">
    <u-navbar :title-size="38" title="选择标签" :height="50"></u-navbar>
    <view class="mt-20"></view>

    <view class="title w-full">
      <view>选择标签</view>
      <view class="desc mt-20">选择标签根据自身实际情况进行选择</view>
    </view>
    <div class="list-content flex-1 mt-50">
      <ViewStatus :loading="!list || loading" :empty="(list || []).length === 0">
        <view
          class="item flex"
          v-for="(item, idx) in list"
          :key="idx"
          :class="{ active: selectedIdx[item.id] === true }"
          @click="toggle(item)"
        >
          <view class="flex-1">{{ item.name }}</view>
          <view class="checked"><Icon name="checkmark" class="active" :size="26" /></view>
        </view>
      </ViewStatus>
    </div>
    <view class="mt-30 w-full action fixed-bottom">
      <u-button type="primary" class="mt-30" @click="onConfirm">确定</u-button>
      <!-- <u-button type="primary" class="mt-30" plain @click="navigateTo('auth/pwd-login')">密码登录</u-button> -->
    </view>
  </view>
</template>

<style lang="scss" scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 50rpx $wing-gap 200rpx;
}
.title {
  font-size: 48rpx;

  .desc {
    font-size: 28rpx;
  }
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

.active {
  .checked {
    background: $color-primary;
  }
}

.checked {
  padding: 4rpx;
  background: #fff;
  border-radius: 8rpx;
  .icon {
    // margin-right: 16rpx;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32rpx;
    height: 32rpx;
  }
}

.list-content {
  .item {
    width: 100%;
    height: 120rpx;
    padding: 0 30rpx;
    background: #f5f5f5;
    border: solid 1px transparent;
    border-radius: 20rpx;
    display: flex;
    align-items: center;

    & + .item {
      margin-top: 30rpx;
    }

    &.active {
      border: solid 1px $color-primary;
      background: transparent;
    }
  }
}
</style>
