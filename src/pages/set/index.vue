<script>
import Card from '@/components/Card'
import Footer from '@/components/Footer'
import { useService } from '@/hooks'
import services from '@/services'
import { defineComponent, computed, ref } from '@vue/composition-api'

import { useStore } from '@/hooks'

const vm = defineComponent({
  components: { Card, Footer },
  setup() {
    const store = useStore()
    // const userInfo = computed(() => store.state?.user?.userInfo ?? {})
    const userInfoService = useService(services['获取会员个人信息'], {
      initialData: {},
    })
    userInfoService.fetch({})
    const fileSizeString = ref('')
    function formatSize() {
      if (typeof plus === 'undefined') {
        return
      }
      plus.cache.calculate(function (size) {
        let sizeCache = parseInt(size)
        if (sizeCache == 0) {
          fileSizeString.value = '0B'
        } else if (sizeCache < 1024) {
          fileSizeString.value = sizeCache + 'B'
        } else if (sizeCache < 1048576) {
          fileSizeString.value = (sizeCache / 1024).toFixed(2) + 'KB'
        } else if (sizeCache < 1073741824) {
          fileSizeString.value = (sizeCache / 1048576).toFixed(2) + 'MB'
        } else {
          fileSizeString.value = (sizeCache / 1073741824).toFixed(2) + 'GB'
        }
      })
    }
    formatSize()
    function clearCache() {
      if (typeof plus === 'undefined') {
        uni.showToast({
          icon: 'none',
          title: '缓存清理完成',
          duration: 2000,
        })
        return
      }

      let os = plus.os.name
      if (os == 'Android') {
        let main = plus.android.runtimeMainActivity()
        let sdRoot = main.getCacheDir()
        let files = plus.android.invoke(sdRoot, 'listFiles')
        let len = files.length
        for (let i = 0; i < len; i++) {
          let filePath = '' + files[i] // 没有找到合适的方法获取路径，这样写可以转成文件路径
          plus.io.resolveLocalFileSystemURL(
            filePath,
            function (entry) {
              if (entry.isDirectory) {
                entry.removeRecursively(
                  function (entry) {
                    //递归删除其下的所有文件及子目录
                    uni.showToast({
                      icon: 'none',
                      title: '缓存清理完成',
                      duration: 2000,
                    })
                    formatSize() // 重新计算缓存
                  },
                  function (e) {
                    console.log(e.message)
                  },
                )
              } else {
                entry.remove()
              }
            },
            function (e) {
              console.log('文件路径读取失败')
            },
          )
        }
      } else {
        // ios
        plus.cache.clear(function () {
          uni.showToast({
            icon: 'none',
            title: '缓存清理完成',
            duration: 2000,
          })
          formatSize()
        })
      }
    }

    const showPopup = ref(false)
    function logout() {
    
      store.commit('user/userInfo', {})
      store.commit('user/token', '')

      uni.reLaunch({
        url: '/pages/auth/login-type',
      })
    }
    return {
      showPopup,
      info: userInfoService.data,
      logout() {
        console.log('logout')
        store.commit('user/userInfo', {})
        store.commit('user/token', '')

        uni.reLaunch({
          url: '/pages/auth/login-type',
        })
      },
      navigateTo(url) {
        uni.navigateTo({
          url: `/pages/${url}`,
        })
      },
      notReady() {
        uni.showToast({ icon: 'none', title: '未就绪' })
      },
      async deleteUser() {
        console.log(store?.state?.user?.profile?.id)
        const res = await services['用户注销']({
          uid: store?.state?.user?.profile?.id,
        })

        uni.showToast({
          icon: 'none',
          msg: res?.msg,
        })

        if (res?.success) {
          setTimeout(() => {
            logout()
          }, 2000)
        }
      },
      test() {
        console.log
      },
      list: [
        {
          name: '小',
          disabled: false,
        },
        {
          name: '中',
          disabled: false,
        },
        {
          name: '大',
          disabled: false,
        },
      ],
      show: false,
      fileSizeString,
      formatSize,
      clearCache,
      open: false,
      fontSize: 1,
    }
  },
})

export default vm
</script>

<template>
  <view class="warpper">
    <u-navbar :title-size="38" title="设置" :height="50"> </u-navbar>
    <view class="content">
      <view class="info" @click="navigateTo('set/set-base-info')">
        <view class="avatar-view">
          <image class="avatar" :src="info.avatar || require('@/static/detault-avatar.png')"></image>
          <!-- <image class="set-avatar" :src="require('@/static/camera.png')"></image> -->
        </view>
        <text class="name">{{ info.name }}</text>
        <view class="edit">
          <image class="edit-img" src="@/static/icons/edit-icon.png"></image>
          <text>点击修改基本信息</text>
        </view>
      </view>
      <Card>
        <view class="set-list">
          <view class="set-item" @click="navigateTo('set/set-address')">
            <text class="label">我的收货地址</text>
            <view class="value">
              <image class="arrow" src="@/static/icons/set-arrow.png"></image>
            </view>
          </view>
          <view class="set-item" @click="navigateTo('set/set-mobile')">
            <text class="label">手机号</text>
            <view class="value">
              <text>{{ info.mobile || '暂无' }}</text>
              <image class="arrow" src="@/static/icons/set-arrow.png"></image>
            </view>
          </view>
          <view class="set-item" @click="navigateTo('set/set-password')">
            <text class="label">修改密码</text>
            <view class="value">
              <image class="arrow" src="@/static/icons/set-arrow.png"></image>
            </view>
          </view>
          <view class="set-item" @click="show = true">
            <text class="label">字体大小</text>
            <view class="value">
              <image class="arrow" src="@/static/icons/set-arrow.png"></image>
            </view>
          </view>
          <view>
            <u-popup v-model="show" mode="bottom" border-radius="30" :safe-area-inset-bottom="true">
              <text class="size">字体大小</text>
              <u-radio-group
                v-model="fontSize"
                @change="radioGroupChange"
                style="display: flex; justify-content: space-around"
              >
                <u-radio
                  @change="radioChange"
                  v-for="(item, index) in list"
                  :key="index"
                  :name="item.name"
                  :disabled="item.disabled"
                  active-color="#3995EA"
                >
                  {{ item.name }}
                </u-radio>
              </u-radio-group>
              <view class="fix">
                <text class="fix-tit">确定</text>
              </view>
              <view class="popup-footer"></view>
            </u-popup>
          </view>
        </view>
      </Card>

      <Card>
        <view class="set-list">
          <view class="set-item" @click="navigateTo('set/about-us')">
            <text class="label">关于我们</text>
            <view class="value">
              <image class="arrow" src="@/static/icons/set-arrow.png"></image>
            </view>
          </view>
          <view class="set-item" @click="clearCache">
            <text class="label">清除缓存</text>
            <view class="value">
              {{ fileSizeString }}
              <image class="arrow" src="@/static/icons/set-arrow.png"></image>
            </view>
          </view>
          <view class="set-item" @click="showPopup = true">
            <text class="label">账户注销</text>
            <view class="value">
              <text class="tips">注销后无法恢复，请谨慎操作</text>
              <image class="arrow" src="@/static/icons/set-arrow.png"></image>
            </view>
          </view>
        </view>
      </Card>
    </view>
    <u-modal
      v-model="showPopup"
      title="确定要注销吗？"
      confirm-text="取消"
      cancel-text="确认"
      :show-cancel-button="true"
      @cancel="deleteUser"
    >
      <view class="popup mt-50 mb-50"> 注销后无法恢复，请谨慎操作！ </view>
    </u-modal>
    <Footer>
      <view class="action-btn">
        <u-button class="btn" type="primary" @click="open = true">退出登录</u-button>
      </view>
    </Footer>
    <u-modal
      v-model="open"
      title=""
      confirm-text="取消"
      cancel-text="确认"
      cancel-color="#999999"
      confirm-color="#F86A27"
      :show-cancel-button="true"
      @cancel="logout"
    >
      <view class="popup mt-50 mb-50"> 是否确认退出 </view>
    </u-modal>
  </view>
</template>

<style lang="scss" scoped>
.warpper {
  position: relative;
}

.popup {
  text-align: center;
}
.content {
  padding: 0 56rpx;
  padding-bottom: 200rpx;
}
.info {
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 48rpx 0;

  .edit {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #999;

    .edit-img {
      border-radius: 50%;
      width: 51rpx;
      height: 51rpx;
      margin-right: 5rpx;
    }
  }
}

.avatar {
  border-radius: 50%;
  width: 162rpx;
  height: 162rpx;
}

.avatar-view {
  position: relative;
}

.set-avatar {
  width: 64rpx;
  height: 64rpx;
  position: absolute;
  right: 0;
  bottom: 0;
}

.name {
  margin-top: 14rpx;
  font-size: 36rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::after {
    // content: '';
    width: 20rpx;
    height: 15rpx;
    background: #4da0ed;
    display: block;
    border-radius: 20rpx;
    margin-top: 10rpx;
  }
}

.title-name {
  margin-top: 18rpx;
  /* width: 154rpx; */
  /* height: 58rpx; */
  padding: 10rpx 20rpx;
  font-size: 28rpx;
  background: #f0f8ff;
  opacity: 1;
  border-radius: 40rpx;
  display: flex;
  align-content: center;
  justify-content: center;
  color: #429aeb;
}

.set-list {
  :first-child {
    padding-top: 0 !important;
  }
  :last-child {
    border-bottom: none !important;
    // padding-bottom: 0 !important;
  }
  .set-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 38rpx 0;
    border-bottom: 2rpx solid #f5f6fa;
    color: #333;
    font-size: 32rpx;

    .value {
      color: #999;
      display: flex;
      align-items: center;

      .tips {
        font-size: 24rpx;
        color: #4da0ed;
      }

      .arrow {
        width: 14rpx;
        height: 27rpx;
        margin-left: 32rpx;
      }
    }
  }
  .size {
    font-size: 32rpx;
    font-weight: 500;
    color: #333333;
    display: block;
    text-align: center;
    margin: 60rpx 0 100rpx 0;
    position: relative;
  }
  .fix {
    padding-top: 138rpx;
    .fix-tit {
      font-size: 32rpx;
      font-weight: 500;
      color: #333333;
      // padding-right: 10rpx;
      // padding: 20rpx 0;
    }
  }
  .popup-footer {
    width: 100%;
    height: 50rpx;
  }
}

.action-btn {
  // position: fixed;
  // bottom: 0rpx;
  // left: 56rpx;
  // right: 56rpx;
  // // width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background: #f7f7f7;
  padding: 14rpx;
  border-radius: 12rpx;
  // height: 100rpx;

  .btn {
    flex: 1;
    height: 68rpx;
    color: #4da0ed;
    background-color: #ffffff;
    border-radius: 12rpx;
  }
}
/deep/ .uicon-checkbox-mark::before {
  content: '';
  background-color: #f2f6f6;
}
/deep/ .u-radio__icon-wrap--circle {
  background-color: #f2f6f6;
}
/deep/ .u-radio {
  display: flex;
  flex-direction: column;
}
/deep/ .u-radio-group {
  padding-left: 128rpx;
}
/deep/ .uni-scroll-view-content {
  text-align: center;
  // padding-bottom: 54rpx;
}
/deep/ .u-radio__icon-wrap {
  margin-right: 10rpx;
  margin-bottom: 40rpx;
  border: none;
}
/deep/ .u-model__footer__button {
  font-size: 30rpx;
}
/deep/ .hairline-left {
  font-size: 30rpx;
}
/deep/ .mb-50 {
  margin-bottom: 90rpx;
}
</style>
