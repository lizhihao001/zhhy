<script>
import Card from '@/components/Card'
import { useForm, useService, useTest } from '@/hooks'
import services from '@/services'
import { upLoadImage, realToast } from '@/utils/utils'
import { defineComponent } from '@vue/composition-api'
const vm = defineComponent({
  components: { Card },
  setup() {
    const test = useTest()
    const formData = {
      name: '',
      gender: '',
      id_card: '',
      census_register: '',
      mobile: '',
      avatar: '',
      work_unit: '',
      urgent_name: '',
      urgent_mobile: '',
      is_dorm: '',
    }
    const form = useForm({
      data: { ...formData },
      rules: {
        name: [
          {
            required: true,
            message: '请完善资料',
            trigger: ['change', 'blur'],
          },
        ],
        mobile: [
          {
            required: true,
            message: '请完善资料',
            trigger: ['change', 'blur'],
          },
          {
            validator: (rule, value, callback) => {
              return test.mobile(value)
            },
            message: '请完善资料',
          },
        ],
        id_card: [
          {
            required: true,
            message: '请完善资料',
            trigger: ['change', 'blur'],
          },
          {
            validator: (rule, value, callback) => {
              return test.idCard(value)
            },
            message: '请完善资料',
          },
        ],
      },
      errorType: ['toast'],
    })

    const userInfo = useService(services['获取会员个人信息'], {
      initialData: {},
    })
    userInfo.fetch({}).then((v) => {
      Object.assign(form.data, { ...v.data, is_dorm: v?.data?.is_dorm ? '是' : '否' })
    })

    const chooseArea = (data) => {
      form.data.census_register = `${data.province.label}${data.city.label}`
    }
    const chooseDorm = (data) => {
      console.log(data[0])
      form.data.is_dorm = ['是', '否'][data[0]]
    }
    const onAvatraClick = async () => {
      form.data.avatar = await upLoadImage()
    }
    const onSave = async () => {
      const valid = await form.validate()
      if (!valid) return
      if(!form.data.gender){
        uni.showToast({
          title:'请完善资料',
          icon:'none'
        })
        return;
      }
      const res = await services['修改会员个人信息']({
        ...Object.fromEntries(Object.entries(form.data).filter(([key, value]) => !!value && typeof value !== 'object')),
        is_dorm: form.data.is_dorm === '是' ? 1 : 0,
      })

      if (res?.success) {
        uni.showToast({
          icon: 'none',
          title: res?.msg ?? '修改成功！',
        })

        setTimeout(() => {
          uni.reLaunch({ url: '/pages/tab/index?tabIdx=3' })
        }, 1500)
      } else {
        uni.showToast({
          icon: 'none',
          title: res?.msg ?? '请求错误，请稍后再试',
        })
      }
    }
    return {
      form,
      onSave,
      chooseArea,
      chooseDorm,
      onAvatraClick,
      show: false,
      showDorm: false,
      list: [
        {
          name: '女',
          value: 1,
        },
        {
          name: '男',
          value: 2,
        },
      ],
    }
  },
})

export default vm
</script>

<template>
  <view class="warpper">
    <u-navbar :title-size="38" title="设置" :height="50">
      <u-button class="btn" type="primary" @click="onSave">保存</u-button>
    </u-navbar>
    <view class="content">
      <u-form v-bind="form.config" :ref="form.name">
        <u-form-item prop="avatar" :border-bottom="false">
          <view class="info" @click="onAvatraClick">
            <view class="avatar-view">
              <image class="avatar" :src="form.data.avatar || '../../static/detault-avatar.png'"></image>
              <image class="set-avatar" :src="require('@/static/camera.png')"></image>
            </view>
            <text class="name">点击修改头像</text>
          </view>
        </u-form-item>
        <u-form-item prop="name" :border-bottom="false" :label-width="'auto'">
          <view class="info-content">
            <view class="info-item">
              <text class="info-label">名 字</text>
              <view class="info-value input-value">
                <u-input type="text" v-model="form.data.name" height="44" />
              </view>
            </view>
          </view>
        </u-form-item>
        <u-form-item prop="gender" :border-bottom="false">
          <view class="info-content">
            <view class="info-item">
              <text class="info-label">性 别</text>
              <view class="info-value radio-value">
                <u-radio-group v-model="form.data.gender">
                  <u-radio v-for="(item, index) in list" :key="index" :name="item.value">
                    {{ item.name }}
                  </u-radio>
                </u-radio-group>
              </view>
            </view>
          </view>
        </u-form-item>
        <u-form-item prop="id_card" :border-bottom="false">
          <view class="info-content">
            <view class="info-item">
              <text class="info-label">身份证</text>
              <view class="info-value input-value">
                <u-input type="text" v-model="form.data.id_card" height="44" />
              </view>
            </view>
          </view>
        </u-form-item>
        <u-form-item prop="census_register" :border-bottom="false">
          <view class="info-content">
            <view class="info-item">
              <text class="info-label">出生地</text>

              <u-picker
                mode="region"
                v-model="show"
                @confirm="chooseArea"
                :params="{
                  province: true,
                  city: true,
                  area: false,
                }"
              >
              </u-picker>
              <view class="info-value input-value">
                <u-input
                  height="44"
                  disabled
                  placeholder="请选择所在地区"
                  v-model="form.data.census_register"
                  type="select"
                  @click="show = true"
                ></u-input>
              </view>
            </view>
          </view>
        </u-form-item>
        <u-form-item prop="mobile" :border-bottom="false">
          <view class="info-content">
            <view class="info-item">
              <text class="info-label">联系电话</text>
              <view class="info-value input-value">
                <u-input type="text" v-model="form.data.mobile" height="44" disabled />
              </view>
            </view>
          </view>
        </u-form-item>
        <u-form-item prop="work_unit" :border-bottom="false">
          <view class="info-content">
            <view class="info-item">
              <text class="info-label">服务单位</text>
              <view class="info-value input-value">
                <u-input type="text" v-model="form.data.work_unit" height="44" />
              </view>
            </view>
          </view>
        </u-form-item>
        <u-form-item prop="is_dorm" :border-bottom="false">
          <view class="info-content">
            <view class="info-item">
              <text class="info-label">是否住宿</text>
              <view class="info-value input-value select-value">
                <u-picker mode="selector" v-model="showDorm" @confirm="chooseDorm" :range="['是', '否']"> </u-picker>
                <view class="info-value">
                  <u-input
                    height="44"
                    disabled
                    placeholder="请选择师傅住宿"
                    v-model="form.data.is_dorm"
                    type="select"
                    @click="showDorm = true"
                  ></u-input>
                </view>
              </view>
            </view>
          </view>
        </u-form-item>
        <u-form-item prop="urgent_name" :border-bottom="false">
          <view class="info-content">
            <view class="info-item">
              <text class="info-label">紧急联系人姓名</text>
              <view class="info-value input-value">
                <u-input type="text" v-model="form.data.urgent_name" height="44" />
              </view>
            </view>
          </view>
        </u-form-item>
        <u-form-item prop="urgent_mobile" :border-bottom="false">
          <view class="info-content">
            <view class="info-item">
              <text class="info-label">紧急联系人电话</text>
              <view class="info-value input-value">
                <u-input type="text" v-model="form.data.urgent_mobile" height="44" />
              </view>
            </view>
          </view>
        </u-form-item>
      </u-form>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.u-form-item {
  padding: 0rpx;
  line-height: inherit;
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
.warpper {
  position: relative;
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
  width: 100%;

  .edit {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    color: #999;

    .edit-img {
      width: 51rpx;
      height: 51rpx;
      margin-right: 5rpx;
    }
  }
}

.avatar {
  width: 162rpx;
  height: 162rpx;
  box-sizing: border-box;
  border-radius: 50%;
}

.name {
  margin-top: 14rpx;
  font-size: 36rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
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

.info-content {
  flex: 1;
  .info-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40rpx;

    .info-label {
      font-size: 32rpx;
      color: #666;
      width: 128rpx;
      margin-right: 16rpx;
      line-height: 40rpx !important;
    }

    .info-value {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .input-value {
      background: #f7f8fa;
      border-radius: 12rpx;
      padding: 18rpx 24rpx;
      font-size: 28rpx;
      color: #333;
    }

    .select-value {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .select-content {
        height: 44rpx;
      }

      .select-arrow {
        width: 24rpx;
        height: 16rpx;
      }
    }

    .radio-value {
      padding: 0 24rpx;
    }
  }
}

.btn {
  position: absolute;
  right: 26rpx;
  top: 20rpx;
  height: 65rpx;
  width: 120rpx;
  border-radius: 12rpx;
  font-size: 28rpx;
}
</style>
