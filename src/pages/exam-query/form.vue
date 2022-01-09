<script>
import { defineComponent, reactive, ref, computed } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'

import { useTest, useStore } from '@/hooks'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  setup() {
    const store = useStore()
    const userInfo = computed(() => store.state?.user?.userInfo ?? {})
    const userProfile = computed(() => store.state?.user?.profile ?? {})
    const test = useTest()
    const id = ref(userProfile?.value?.id_card ?? '')
    return {
      id,
      toResult() {
        if (!test.idCard(id.value)) {
          uni.showToast({
            icon: 'none',
            title: '身份证号格式错误',
          })
          return
        }
        uni.navigateTo({
          url: `/pages/exam-query/result?id=${id.value}`,
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="考试查询" :height="50"></u-navbar>
    <view class="tips flex">
      <image src="@/static/exam-query.png" class="query-image" />
      请输入身份证信息进行成绩查询
    </view>
    <u-input v-model="id" placeholder="请输入身份证" clearable />
    <u-button type="primary" @click="toResult">确定查询</u-button>
  </view>
</template>

<style lang="scss" scoped>
.query-image {
  width: 40rpx;
  height: 35rpx;
  margin-right: 20rpx;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 30rpx $wing-gap;
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

.tips {
  width: 100%;
  font-size: 28rpx;
  font-weight: 700;
  color: #333;

  .icon {
    color: $color-primary;
    margin-right: 16rpx;
  }

  margin-bottom: 36rpx;
}

.u-input {
  width: 100%;
  padding: 10rpx 30rpx !important;
  border-radius: $card-border-radius;
  box-shadow: 0rpx 0rpx 16rpx rgba(128, 128, 128, 0.16);
}

.u-btn {
  margin-top: 180rpx;
  width: 100%;
  height: 100rpx;
  border-radius: $card-border-radius;
  box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6);
}
</style>
