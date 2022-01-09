<script>
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'

export default defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  setup() {
    function navigateTo(url) {
      uni.navigateTo({
        url: `/pages/${url}`,
      })
    }

    const showDialog = ref(false)

    onMounted(() => {
      setTimeout(() => {
        showDialog.value = true
      }, 1000)
    })

    return {
      showDialog,
      backToIndex() {
        uni.reLaunch({ url: '/pages/tab/index' })
      },
      navigateTo,
      confirm() {
        console.log('confirm')
        showDialog.value = false
      },
      cancel() {
        console.log('cancel')
        navigateTo(`webview?title=海事一网通办&src=${encodeURIComponent('https://zwfw.msa.gov.cn/')}`)
        showDialog.value = false
      },
      download() {
        // window.location.href = 'http://zhschool.qixiuu.com/'
        const a = document.createElement('a')
        a.href = '/static/smart-school.apk'
        a.download = `smart-school.apk`
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          document.body.removeChild(a)
        }, 2000)
      },
    }
  },
})
</script>

<template>
  <view class="content">
    <!-- <u-navbar :title-size="38" title="支付成功" :height="50"></u-navbar> -->
    <image src="@/static/share-bg.png" class="background" mode="widthFix" />
    <image src="@/static/share-img.png" class="img" mode="widthFix" />
    <u-button type="primary" class="btn" @click="download">下载智慧海院APP</u-button>
  </view>
</template>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  // align-items: center;
  // justify-content: center;
  width: 100%;
  min-height: 100vh;
  background: rgb(249, 249, 249);
  padding: 0 20rpx;

  .img {
    // position: fixed;
    display: block;
    margin: 0 auto;
    width: 100%;
    margin-top: 60%;
    margin-bottom: 40rpx;
    // left: 50%;
    // transform: translateX(-50%);
  }

  .btn {
    width: 60%;
    height: 100rpx;
    font-size: 36rpx;
  }
}

.background {
  position: fixed;
  top: 0;
  left: -16rpx;
  right: -16rpx;
  width: 110%;
}
</style>
