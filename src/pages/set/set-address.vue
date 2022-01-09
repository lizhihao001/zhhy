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
      area: '',
      address: '',
      mobile: '',
    }
    const form = useForm({
      data: { ...formData },
      rules: {
        ...Object.keys(formData).reduce((accumulator, currentValue, index) => {
          accumulator[currentValue] = [
            {
              required: true,
              message: `${['名字', '地区', '地址', '手机号'][index]}不能为空`,
            },
          ]
          return accumulator
        }, {}),
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            trigger: ['change', 'blur'],
          },
          {
            validator: (rule, value, callback) => {
              return test.mobile(value)
            },
            message: '手机号格式不正确',
          },
        ],
      },
      errorType: ['toast'],
    })

    const userInfo = useService(services['收货地址'], {
      initialData: {},
    })
    userInfo.fetch({}).then((v) => {
      Object.assign(form.data, v.data)
    })

    const chooseArea = (data) => {
      form.data.area = `${data.province.label}-${data.city.label}`
    }
    const onSave = async () => {
      const valid = await form.validate()
      if (!valid) return
      await useService(services['修改收货地址']).fetch(form.data)
      realToast('修改成功', () => {
        uni.navigateBack({})
      })
    }

    return {
      form,
      show: false,
      onSave,
      chooseArea,
    }
  },
})

export default vm
</script>

<template>
  <view class="warpper">
    <u-navbar :title-size="38" title="我的地址" :height="50">
      <u-button class="btn" type="primary" @click="onSave">保存</u-button>
    </u-navbar>
    <view class="content">
      <Card>
        <view>
          <view class="info-content">
            <u-form v-bind="form.config" :ref="form.name">
              <u-form-item prop="name" :border-bottom="false">
                <view class="info-item">
                  <text class="info-label">收货人</text>
                  <view class="info-value input-value">
                    <u-input type="text" placeholder="请输入您的姓名" height="40" v-model="form.data.name" />
                  </view>
                </view>
              </u-form-item>
              <u-form-item prop="mobile" :border-bottom="false">
                <view class="info-item">
                  <text class="info-label">手机号码</text>
                  <view class="info-value input-value">
                    <u-input type="text" placeholder="请输入手机号码" height="40" v-model="form.data.mobile" />
                  </view>
                </view>
              </u-form-item>
              <u-form-item prop="area" :border-bottom="false">
                <view class="info-item">
                  <text class="info-label">选择地区</text>
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
                      placeholder="请选择省/市区"
                      v-model="form.data.area"
                      type="select"
                      @click="show = true"
                    ></u-input>
                  </view>
                </view>
              </u-form-item>
              <u-form-item prop="address" :border-bottom="false">
                <view class="info-item">
                  <text class="info-label">详细地址</text>
                  <view class="info-value input-value">
                    <u-input type="text" placeholder="请输入" height="40" v-model="form.data.address" />
                  </view>
                </view>
              </u-form-item>
            </u-form>
          </view>
        </view>
      </Card>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.u-form-item {
  padding: 0rpx;
  line-height: inherit;
}
.warpper {
  position: relative;
}
.content {
  padding: 0 56rpx;
  padding-top: 30rpx;
}

.info-content {
  .info-item {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    margin-bottom: 40rpx;
    width: 100%;

    .info-label {
      display: flex;
      align-items: center;
      font-size: 32rpx;
      color: #999;
      // width: 128rpx;
      margin-right: 16rpx;
      margin-bottom: 22rpx;

      &::before {
        content: '';
        display: block;
        width: 8rpx;
        height: 20rpx;
        background: #4da0ed;
        border-radius: 20rpx;
        margin-right: 10rpx;
      }
    }

    .info-value {
      display: flex;
      align-items: center;
      flex: 1;
      width: 100%;
      color: #666;
    }

    .input-value {
      background: #f7f8fa;
      border-radius: 12rpx;
      padding: 18rpx 22rpx;
      font-size: 28rpx;
    }

    .select-value {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .select-content {
        height: 44rpx;
      }

      .select-arrow {
        width: 36rpx;
        height: 36rpx;
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
