<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {},
})
</script>

<template>
  <view class="content">
    <view class="box">
      <text class="box-tit">武汉海事职业学院</text>
      <image class="image" src="@/static/icons/fenxiangtu.jpg" />
      <view class="box-bottom">
          <image class="box-bottom-image" src="@/static/icons/erweima.jpg">
          <view class="right">
              <text class="px">海事职业技能培训</text>
              <text class="gd">扫码下载，查看更多</text>
          </view>
      </view>
    </view>
    <view class="album">
        <image class="album-img" src="@/static/icons/album.png">
        <text class="album-tit">保存相册</text>
    </view>
  </view>
</template>
<style scoped lang="scss">
.content {
  padding: 134rpx 52rpx 0rpx 56rpx;
  .box {
    background: #ffffff;
    box-shadow: 0rpx 0rpx 20rpx rgba(0, 0, 0, 0.1);
    border-radius: 20rpx;
    padding: 0 10rpx;
    .box-tit {
      font-size: 44rpx;
      font-weight: bold;
      color: #333333;
      display: flex;
      justify-content: center;
      padding-top: 120rpx;
    }
    .image {
      width: 622rpx;
      height: 416rpx;
      padding: 154rpx 0rpx;
    }
    .box-bottom {
      padding: 0rpx 0rpx 30rpx 20rpx;
      display: flex;
      .box-bottom-image {
        width: 172rpx;
        height: 172rpx;
      }
      .right {
        padding-left: 10rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .px {
          font-size: 28rpx;
          font-weight: bold;
          color: #333333;
        }
        .gd {
          font-size: 28rpx;
          font-weight: 400;
          color: #666666;
          padding-top: 32rpx;
        }
      }
    }
  }
  .album {
    position: relative;
    margin-top: 82rpx;
    .album-img {
      width: 260rpx;
      height: 100rpx;
      margin: 0 auto;
      display: block;
    }
    .album-tit{
        position: absolute;
        top: 22rpx;
        left: 41%;
        color: #ffffff;
        font-size: 32rpx;
    }
  }
}
</style>
