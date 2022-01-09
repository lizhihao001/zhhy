<script>
import { computed, defineComponent, onMounted, reactive, ref } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import { random } from 'lodash'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'
import ViewStatus from '@/components/ViewStatus'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline, ViewStatus },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    console.log(option.name) //打印出上个页面传递的参数

    this.option.name = option.name
  },
  setup(...args) {
    const option = reactive({
      name: null,
    })

    const myCertDetails = useService(services['我的证书详情'], {
      // initialData: {},
      // presistKey: 'myCertDetails',
    })
    // const list = ref(myCertDetails.data.value)

    onMounted(async () => {
      const res = await myCertDetails.fetch({
        name: option.name,
      })

      // list.value = myCertDetails.data.value

      console.log(res)
    })

    return {
      list: myCertDetails.data,
      option,
      random,
      fetch: myCertDetails.fetch,
      loading: myCertDetails.loading,
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="详情" :height="50"></u-navbar>
    <Card class="cert-type-card">
      <view class="flex cert-type">
        <view class="info-content flex-1">
          <view class="name">{{ option.name }}</view>
          <!-- <view class="cert-status">有效</view> -->
        </view>
        <Icon name="photo-fill" :size="70" />
      </view>
    </Card>
    <ViewStatus class="mt-50" :loading="!list || loading" :empty="(list || []).length === 0">
      <template v-if="list">
        <Card v-for="(item, idx) in list" :key="idx" class="info-card">
          <u-form :border-bottom="false">
            <u-form-item :label-width="200" label="证书名称" :border-bottom="false">
              {{ item.name || '--' }}
            </u-form-item>
            <u-form-item :label-width="200" label="证书号码" :border-bottom="false">
              {{ item.content.zshm || '--' }}
            </u-form-item>
            <u-form-item :label-width="200" label="身份证号码" :border-bottom="false">
              {{ item.content.sfzhm || '--' }}
            </u-form-item>
            <u-form-item :label-width="200" label="姓名" :border-bottom="false">
              {{ item.content.xm || '--' }}
            </u-form-item>
            <u-form-item :label-width="200" label="签发机关" :border-bottom="false">
              {{ item.content.qfjg || '--' }}
            </u-form-item>
            <u-form-item :label-width="200" label="签发日期" :border-bottom="false">
              {{ item.content.qfrq || '--' }}
            </u-form-item>
            <u-form-item :label-width="200" label="有效日期" :border-bottom="false">
              {{ item.content.yxrq || '--' }}
            </u-form-item>
            <u-form-item :label-width="200" label="证书状态" :border-bottom="false">
              {{ item.content.zszt || '--' }}
            </u-form-item>
          </u-form>
        </Card>
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

.cert-type-card {
  background: #429aeb;
  height: 270rpx;
  box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6) !important;
}

.cert-type {
  height: 100%;
  color: #fff;
}

.name {
  font-size: 42rpx;
  font-weight: 500;
  color: #ffffff;
  margin-bottom: 16rpx;
}

.cert-status {
  font-size: 30rpx;
}

.info-card {
  /deep/ {
    .u-form-item {
      // height: 90rpx;
      padding: 0;
    }

    .u-form-item--left__content__label {
      color: #999;
    }
  }

  .info-status {
    font-size: 28rpx;
    font-weight: 500;
    color: $color-primary;
  }
}

.title {
  font-size: 36rpx;
  font-weight: 700;
  position: relative;
  margin-bottom: 30rpx;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: -50rpx;
    width: 10rpx;
    border-radius: 25rpx;
    background: $color-primary;
  }
}

.loading {
  padding-top: 200rpx;
  justify-content: center;
}
</style>
