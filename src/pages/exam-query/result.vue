<script>
import { computed, defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import ViewStatus from '@/components/ViewStatus'
import Timeline from '@/components/Timeline'

import get from 'lodash/get'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Icon, Card, ViewStatus, Timeline },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    console.log(option.id) //打印出上个页面传递的参数

    this.option.id = option.id
  },
  setup(...args) {
    const examQueryResultService = useService(services['查询成绩接口'], {
      initialData: {},
      presistKey: 'examQueryResultService',
    })

    const option = reactive({
      id: null,
    })

    onMounted(() => {
      examQueryResultService.fetch({
        id_card: option.id,
      })
    })

    const results = examQueryResultService.data

    return {
      get,
      loading: examQueryResultService.loading,
      option,
      results,
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="查询结果" :height="50"></u-navbar>
    <ViewStatus :loading="loading">
      <template v-if="get(results, 'result.length', 0) > 0">
        <Card class="user-info-card">
          <view class="flex user-info">
            <view class="info-content flex-1">
              <view class="name">身份证号</view>
              <view class="id-card"
                ><text class="id-code">{{ get(option, 'id') }}</text></view
              >
            </view>
            <Icon name="photo-fill" :size="70" />
          </view>
        </Card>

        <Card v-for="(item, idx) in get(results, 'result', [])" :key="idx">
          <view class="flex">
            <view class="item-info flex flex-1">
              <view class="tag">科目</view>
              <text class="item-name">{{ item.subject_type }}</text>
            </view>
            <text v-if="item.status === '不及格'" class="fail">{{ item.status }}</text>
            <text v-else class="pass">{{ item.status }}</text>
          </view>
          <view class="item-desc flex">
            <Icon name="bookmark-fill" :size="50" />
            <text>{{ item.subject }}</text>
          </view>
        </Card>
      </template>
      <template v-else>
        <view class="empty-result flex flex-col">
          <view class="tips flex">
            <view class="icon-view flex"><Icon name="search" :size="36" /></view>
            {{ get(option, 'id') }}
          </view>
          <view class="empty flex-1 flex flex-col">
            <image class="empty-icon" src="@/static/no-result.png"></image>
            <view class="main">暂无查询结果</view>
            <view class="desc">请重新输入关键词进行查询或稍后再查</view>
          </view>
        </view>
      </template>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.content {
  width: 100%;
  min-height: 100vh;
  padding: 50rpx $wing-gap;
}

.user-info-card {
  background: #429aeb;
  height: 270rpx;
  box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6) !important;
}

.user-info {
  height: 100%;
  color: #fff;
}

.name {
  font-size: 42rpx;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 16rpx;
}

.id-card {
  font-size: 30rpx;
}

.id-code {
  // margin-left: 20rpx;
}

.tag {
  background: #e5f2ff;
  padding: 14rpx 20rpx;
  color: $color-primary;
  font-size: 22rpx;
  margin-right: 20rpx;
  border-radius: 10rpx;
}

.item-info {
  margin-bottom: 30rpx;
}

.item-name {
  font-size: 36rpx;
  font-weight: 700;
}

.fail,
.pass {
  font-size: 30rpx;
}

.fail {
  color: $color-warning;
}

.pass {
  color: $color-primary;
}

.item-desc {
  font-size: 28rpx;
  color: #999;

  .icon {
    color: $color-primary;
    margin-right: 16rpx;
  }
}
</style>

<style lang="scss" scoped>
.empty-result {
  min-height: 70vh;
  width: 100%;
}

.tips {
  width: 100%;
  font-size: 30rpx;
  // font-weight: 700;
  color: #666;

  .icon-view {
    background: $color-primary;
    border-radius: 50%;
    width: 56rpx;
    height: 56rpx;
    justify-content: center;
    margin-right: 16rpx;
  }

  .icon {
    color: #fff;
  }

  margin-bottom: 36rpx;
}

.empty {
  justify-content: center;

  .empty-icon {
    width: 412rpx;
    height: 346rpx;
    margin-bottom: 16rpx;
  }
  .main {
    font-size: 32rpx;
    font-weight: 500;
    color: #8d909a;
  }

  .desc {
    margin-top: 16rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #afb4c1;
  }
}
</style>
