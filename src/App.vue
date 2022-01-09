<script>
// import { defineComponent, reactive, ref, watch, getCurrentInstance, computed, provide } from '@vue/composition-api'

export default {
  onLaunch() {
    console.log('App Launch')
  },
  onShow() {
    console.log('App Show')
  },
  onHide() {
    console.log('App Hide')
  },
  // setup() {},
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
@import 'uview-ui/index.scss';

.uni-body {
  padding-top: var(--status-bar-height) !important;
}

.u-navbar-inner {
  padding: 0 $wing-gap;
  margin-left: -10rpx;

  .u-back-wrap {
    padding-left: 0 !important;
  }
}

.u-navbar {
  &:after {
    border-bottom-width: 0 !important;
  }
}
</style>

<style lang="scss">
div[data-eruda] {
  display: none;

  ::after,
  ::before {
    color: inherit;
  }
}

.u-model__title {
  color: $color-primary !important;
}

.footer-area {
  width: 100%;
  padding: 28rpx $wing-gap;
  background: #fff;
}

.flex {
  display: flex;
  align-items: center;
}

.flex-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.flex-1 {
  flex: 1;
  width: 100%;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100vh;
}

.text-align-center {
  text-align: center;
}

.mt-10 {
  margin-top: 10rpx;
}

.mt-20 {
  margin-top: 20rpx;
}

.mt-30 {
  margin-top: 30rpx;
}

.mt-50 {
  margin-top: 50rpx;
}

.mb-10 {
  margin-bottom: 10rpx;
}

.mb-20 {
  margin-bottom: 20rpx;
}

.mb-30 {
  margin-bottom: 30rpx;
}

.mb-50 {
  margin-bottom: 50rpx;
}

.mr-10 {
  margin-right: 10rpx;
}

.mr-20 {
  margin-right: 20rpx;
}

.mr-30 {
  margin-right: 30rpx;
}

.mr-50 {
  margin-right: 50rpx;
}

.ml-10 {
  margin-left: 10rpx;
}

.ml-20 {
  margin-left: 20rpx;
}

.ml-30 {
  margin-left: 30rpx;
}

.ml-50 {
  margin-left: 50rpx;
}
</style>
