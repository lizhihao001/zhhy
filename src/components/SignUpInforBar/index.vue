<script>
import { computed, defineComponent, toRefs } from '@vue/composition-api'
import { isArray, get } from 'lodash'

import Price from '../Price'
import Icon from '../Icon'

const vm = defineComponent({
  components: { Price, Icon },
  props: {
    price: [Array, String, Number],
    filterPrice: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { attrs }) {
    const { ...rest } = toRefs(attrs)

    // const computedPrice = computed(() => {
    //   if (isArray(price.value)) {
    //     return []
    //   }
    // })

    return {
      get,
      isArray,
      ...rest,
    }
  },
})

// get(details, 'min_price') === get(details, 'max_price') ||
//           [get(details, 'min_price'), get(details, 'max_price')].filter(Boolean).length <= 1
//             ? get(details, 'max_price', '--')
//             : [get(details, 'min_price', '--'), get(details, 'max_price', '--')]

export default vm
</script>

<template>
  <u-row class="sign-up-infor-bar" justify="between">
    <text class="price">
      <text v-if="isArray(price) && (!filterPrice || (filterPrice && price.filter(Boolean).length > 1))">
        <template v-if="!filterPrice || (filterPrice && price.filter(Boolean).length > 0)">
          <Price :value="price[0]"></Price>
          <text class="divider">-</text>
          <Price :value="price[1]"></Price>
        </template>
      </text>
      <text v-else>
        <Price :value="get(price, 1, price)"></Price>
      </text>
    </text>

    <text v-if="typeof count !== 'undefined'" class="rest-count">
      <Icon name="account-fill" :size="36" />
      剩
      <text class="count">{{ count }}个</text>
      名额
    </text>
  </u-row>
</template>

<style lang="scss" scoped>
.divider {
  color: $color-primary;
  margin: 0 6rpx;
}

.rest-count {
  display: flex;
  align-items: center;

  .icon {
    color: $color-primary;
    margin-right: 10rpx;
  }
}

.count {
  color: $color-primary;
  // font-size: 32rpx;
  font-weight: 700;
  margin: 0 6rpx;
}

.price {
  color: $color-primary;
  font-size: 34rpx;
}
</style>
