<template>
  <view class="w-full flex flex-1">
    <u-input
      :value="value"
      :placeholder="placeholder"
      :type="showPwd ? 'text' : 'password'"
      :password-icon="false"
      @input="onChange"
    />
    <image v-if="showPwd" class="input-icon" src="@/static/icons/hide-pwd-icon.png" @click="showPwd = !showPwd"></image>
    <image
      v-if="!showPwd"
      class="input-icon"
      src="@/static/icons/show-pwd-icon.png"
      @click="showPwd = !showPwd"
    ></image>
  </view>
</template>

<script>
import Icon from '../Icon'
export default {
  components: { Icon },
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    placeholder: String,
    value: String,
  },
  data() {
    return {
      showPwd: false,
    }
  },
  methods: {
    onChange(value) {
      this.$emit('change', value)
    },
  },
}
</script>

<style lang="scss" scoped>
.input-icon {
  margin-left: 10rpx;
  height: 44rpx;
  width: 44rpx;
  margin-right: 40rpx;
}
</style>