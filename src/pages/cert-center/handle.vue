<script>
import { defineComponent, reactive, ref, computed } from '@vue/composition-api'
import { templateRef, useMouse } from '@vueuse/core'
import Icon from '@/components/Icon'
import Card from '@/components/Card'
import SignUpInforCard from '@/components/SignUpInforCard'
import Timeline from '@/components/Timeline'

import { useForm, useTest, useStore } from '@/hooks'

const vm = defineComponent({
  components: { Icon, Card, SignUpInforCard, Timeline },
  setup() {
    const store = useStore()
    const userInfo = computed(() => store.state?.user?.userInfo ?? {})
    const userProfile = computed(() => store.state?.user?.profile ?? {})
    const { details, params: orderInfoParams } = uni.getStorageSync('certHandleInfo')
    const test = useTest()
    const form = useForm({
      data: {
        name: userProfile?.value?.name, // '王小虎',
        mobile: userProfile?.value?.mobile, // '18012345678',
        icNo: userProfile?.value?.id_card, // '412928198805281912',
        platformPwd: '', // '12345678',
        msg: '',
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入姓名',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
          },
        ],
        mobile: [
          {
            required: true,
            message: '请输入手机号',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
          },
          {
            validator: (rule, value, callback) => {
              return test.mobile(value)
            },
            message: '手机号格式不正确',
          },
        ],
        icNo: [
          {
            required: true,
            message: '请输入身份证号',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
          },
          {
            validator: (rule, value, callback) => {
              return test.idCard(value)
            },
            message: '身份证号格式不正确',
          },
        ],
        platformPwd: [
          {
            required: true,
            message: '请输入平台密码',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
          },
        ],
        msg: [],
      },
      // errorType: ['toast'],
    })

    const agree = ref(false)

    return {
      agree,
      form,
      navigateTo(url) {
        uni.navigateTo({
          url: `/pages/${url}`,
        })
      },
      async toSubmit() {
        const valid = await form.validate()
        if (!valid) return

        if (!agree.value) {
          uni.showToast({
            icon: 'none',
            title: '请同意协议',
          })
          return
        }

        uni.setStorageSync('certHandleInfo', {
          details,
          params: {
            ...orderInfoParams,
            // cid: '', //	string	是	证书ID
            name: form.data.name, //	string	是	姓名
            mobile: form.data.mobile, //	string	是	手机号
            id_card: form.data.icNo, //	string	是	身份证号码
            pwd: form.data.platformPwd, //	string	是	平台密码
            remark: form.data.msg, //	string	是	备注
            // address_id: '', //	string	是	收货地址ID
            // pay_type: '', //	string	是	支付方式
          },
        })

        // 452123199308133322

        uni.navigateTo({
          url: '/pages/cert-center/handle-confirm',
        })
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="wrapper">
    <u-navbar :title-size="38" title="证书办理" :height="50"></u-navbar>
    <view class="content flex-col">
      <Card class="flex-1">
        <u-form v-bind="form.config" :ref="form.name" label-position="top">
          <Timeline
            class="course-table"
            :data="[
              { active: true, prop: 'name', label: '姓名', placeholder: '请输入姓名' },
              { active: true, prop: 'mobile', label: '手机号码', placeholder: '请输入手机号码', type: 'number' },
              { active: true, prop: 'icNo', label: '身份证号码', placeholder: '请输入身份证号码', type: 'number' },
              { active: true, prop: 'icNo', label: '准考证', placeholder: '请输入'},
              {
                active: true,
                prop: 'platformPwd',
                label: '海事局综合服务平台登录密码',
                placeholder: '请输入平台密码',
                type: 'password',
              },
              { active: true, label: '拿证方式' },
              { active: true, prop: 'msg', label: '备注留言', placeholder: '请输入留言' },
            ]"
          >
            <template v-slot:default="slotProps">
              <u-form-item
                :prop="slotProps.item.prop"
                :label="slotProps.item.label"
                v-if="slotProps.item.label !== '拿证方式'"
              >
                <u-input
                  v-model="form.data[slotProps.item.prop]"
                  :placeholder="slotProps.item.placeholder"
                  :type="slotProps.item.type"
                />
              </u-form-item>
              <u-form-item label="拿证方式" :border-bottom="false" v-else>
                <view class="label-tag">邮寄到付</view>
              </u-form-item>
            </template>
          </Timeline>
        </u-form>
        <view class="tips">
          <Icon name="error-circle-fill" class="mr-10" :size="36" />
          温馨提示：本证书由海事局直接邮寄至您本人进行签收，邮寄费用统一采用“到付”方式。
        </view>
      </Card>
      <view class="footer-area">
        <view class="check flex" @click="agree = !agree">
          <Icon name="checkmark-circle-fill" class="active" :size="40" v-if="agree" />
          <view class="disagree" v-else />
          <view>我已阅读并同意<text class="terms-entry" @click="navigateTo('train-terms')">《调取办证协议》</text></view>
        </view>
        <u-button type="primary" @click="toSubmit">下一步</u-button>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.tips {
  line-height: 46rpx;
  font-size: 26rpx;
  .icon {
    color: $color-warning;
  }
}

.disagree {
  width: 40rpx;
  height: 40rpx;
  border-radius: 50%;
  background: rgb(233, 242, 255);
  margin-right: 10rpx;
}

.terms-entry {
  color: $color-warning;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding-bottom: 260rpx;

  .flex-col {
    width: 100%;
  }
}

.content {
  width: 100%;
  padding: 10rpx $wing-gap;

  /deep/ {
    .timeline {
      margin-bottom: -52rpx;
    }

    .u-input__input {
      min-height: 50rpx !important;
    }

    .u-form-item {
      position: relative;
      top: -52rpx;
      line-height: 50rpx !important;
      margin-left: 20rpx;
    }
  }
}

.active {
  color: $color-primary !important;
}

.label-tag {
  // width: 208px;
  // height: 64px;
  padding: 10rpx 40rpx;
  border-radius: 20rpx;
  color: $color-primary;
  background: #e8f4ff;
  opacity: 1;
}

.footer-area {
  background: #fff;
  .check {
    .icon {
      color: #999;
      margin-right: 10rpx;
    }

    margin-bottom: 30rpx;
  }

  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.u-btn {
  height: 100rpx;
  border-radius: $card-border-radius;
  box-shadow: 0rpx 0rpx 16rpx rgba(#4da0ed, 0.6);
}
</style>
