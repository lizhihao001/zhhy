<script>
import { computed, defineComponent, reactive, ref, watch } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import { get } from 'lodash'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import Price from '@/components/Price'
import ViewStatus from '@/components/ViewStatus'
import Timeline from '@/components/Timeline'
import { useService } from '@/hooks'
import services from '@/services'
import CustomService from '@/components/CustomService'
import ContactUs from '@/components/ContactUs'

const vm = defineComponent({
  components: { ContactUs, Icon, Card, Price, Timeline, ViewStatus },
  onLoad: function (option) {
    //option为object类型，会序列化上个页面传递的参数
    console.log(option.id) //打印出上个页面传递的参数

    this.option.id = option.id
    this.fetch({
      job_id: option.id,
    }).then((res) => {
      this.stared = Boolean(res.data?.is_collect)
    })
  },
  setup(...args) {
    const option = reactive({
      id: null,
    })
    const collectId = ref(0)

    const jobDetailService = useService(services['推荐职位详情'], {})

    const navigateTo = (url) => {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    const details = jobDetailService.data
    watch(details, () => {
      collectId.value = details.value?.is_collect
    })

    const stared = ref(false)
    const starToggle = async () => {
      const res = await services[stared.value ? '取消职位收藏' : '添加职位收藏'](
        stared.value
          ? {
              collect_id: collectId.value,
            }
          : {
              job_id: option.id,
            },
      )

      if (res?.success) {
        const detailsRes = await services['推荐职位详情']({
          job_id: option.id,
        })
        stared.value = Boolean(detailsRes.data?.is_collect)
        collectId.value = detailsRes.data?.is_collect
      }
      uni.showToast({
        icon: 'none',
        title: res?.msg,
      })
    }

    return {
      stared,
      starToggle,
      option,
      get,
      loading: jobDetailService.loading,
      fetch: jobDetailService.fetch,
      details,
      tags: ['副标题显示位置'],
      navigateTo,
    }
  },
})

export default vm
</script>

<template>
  <view class="content">
    <u-navbar :title-size="38" title="就业详情" :height="50">
      <template v-slot:right>
        <view class="navbar-right">
          <!-- <Icon name="share-fill" /> -->
          <Icon :name="stared ? 'star-fill' : 'star'" @click="starToggle" :class="{ active: stared }" />
        </view>
      </template>
    </u-navbar>
    <ViewStatus :loading="loading" :empty="!details">
      <template v-if="!!details">
        <Card @click="toDetails(details)">
          <view class="title flex">
            <view class="flex-1">{{ details.name }}</view>
            <view class="salary">{{ details.compensation }}</view>
          </view>
          <view>
            <view>{{ details.introductory }}</view>

            <view class="mt-30">
              <u-tag
                v-for="(tag, idx) in (details.lables || []).map((details) => details.name)"
                :key="idx"
                :text="tag"
                mode="plain"
                shape="circle"
              />
            </view>
          </view>
        </Card>

        <Card class="info-card">
          <view class="sub-title">详情</view>
          <view class="section">
            <view class="section-title">岗位职责</view>
            <view class="desc">
              <u-parse :html="get(details, 'obligation', '--')"></u-parse>
            </view>
          </view>
          <view class="section">
            <view class="section-title">任职要求</view>
            <view class="desc">
              <u-parse :html="get(details, 'job_requirements', '--')"></u-parse>
            </view>
          </view>
        </Card>

        <Card class="info-card">
          <view class="sub-title">招聘企业</view>
          <view class="flex mt-30 company">
            <image :src="details.image" class="company-icon mr-20" />
            <view>{{ get(details, 'company_name', '--') || '--' }}</view>
          </view>
          <view class="section">
            <view class="desc mt-30">
              <u-parse :html="get(details, 'company_introductory', '--') || '--'"></u-parse>
            </view>
          </view>
        </Card>

        <view class="footer fixed">
          <ContactUs class="w-full flex contact-us contact-btn mt-30">
            <image src="@/static/phone-icon.png" class="contact-icon" />
            联系我们
          </ContactUs>
        </view>
      </template>
    </ViewStatus>
  </view>
</template>

<style lang="scss" scoped>
.contact-btn {
  background: #4da0ed;
  height: 100rpx;
  border-radius: $card-border-radius;
  color: #fff;
  justify-content: center;
  transition: background 0.2s;

  &:active {
    background: darken(#4da0ed, 10%);
  }
}
.contact-icon {
  width: 44rpx;
  height: 44rpx;
  margin-right: 10rpx;
}
.company {
  font-size: 32rpx;

  .company-icon {
    background: #f2f2f2;
    width: 60rpx;
    height: 60rpx;
    border-radius: 50%;
  }
}

.content {
  width: 100%;
  min-height: 100vh;
  padding: 50rpx $wing-gap 200rpx;
}

.navbar-right {
  .active {
    color: $color-primary;
  }
}

.list {
  width: 100%;
  padding: 0 $wing-gap 50rpx;
  // padding: 50rpx 0;

  .card {
    padding-bottom: 30rpx;
  }
}

.salary {
  font-size: 30rpx;
  font-weight: 500;
  color: $color-primary;
}

.cert-type-card {
  background: #429aeb;
  height: 270rpx;
  box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6) !important;
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

.sub-title {
  font-size: 36rpx;
  font-weight: 700;
  position: relative;
  margin-bottom: 60rpx;

  &::before {
    content: '';
    position: absolute;
    bottom: -18rpx;
    width: 20rpx;
    height: 10rpx;
    border-radius: 25rpx;
    background: $color-primary;
  }
}

.section-title {
  font-size: 32rpx;
  color: $color-primary;
  margin-bottom: 50rpx;
}

.section + .section {
  margin-top: 60rpx;
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

.info-card {
  /deep/ {
    .u-cell {
      padding: 16rpx 0;
    }
  }
}

.desc {
  color: #666;
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

.empty {
  padding-top: 150rpx;
}

.loading {
  padding-top: 200rpx;
  justify-content: center;
}
/deep/ .u-tag {
  margin-right: 20rpx;
}
/deep/ .u-tag + .u-tag {
  margin: 20rpx 20rpx 0 0;
}
</style>
