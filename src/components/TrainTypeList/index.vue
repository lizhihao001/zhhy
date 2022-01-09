<script>
import { defineComponent, reactive, ref, onMounted } from '@vue/composition-api'
import Card from '../Card'
import Icon from '../Icon'

import services from '@/services'
import { useLocalStorage } from '@/hooks'

const vm = defineComponent({
  components: { Card, Icon },
  props:{
    isBack:{
      type:Boolean,
      default:false
    },
  },
  setup() {
    const showTime = ref(false)
    const showTypes = ref(false)
    const showTypeIdx = ref(0)
    const typeList = useLocalStorage('typeList', [])
    const selectedType = ref(uni.getStorageSync('train-list-type') || null)
    uni.removeStorageSync('train-list-type')
    const selectedTime = ref(null)
    onMounted(async () => {
      const res = await services['获取培训计划分类']()

      console.log('获取培训计划分类', res)

      
     let arr = res?.data || []
     let o = {}
      arr.forEach((v,i)=>{
        if(v.id===31){
          o=v
          arr.splice(i,1)
          return
        }
      })
      arr.push(o)
      typeList.value  = arr 
    })

    return {
      showTime,
      showTypes,
      showTypeIdx,
       selectedType,
      selectedTime,
      typeList,
      value1: 1,
      value2: 2,
      value3: 3,
      options1: [
        {
          label: '默认排序',
          value: 1,
        },
        {
          label: '距离优先',
          value: 2,
        },
        {
          label: '价格优先',
          value: 3,
        },
      ],
      options2: [
        {
          label: '默认排序',
          value: 1,
        },
        {
          label: '距离优先',
          value: 2,
        },
        {
          label: '价格优先',
          value: 3,
        },
      ],
      options3: [
        {
          label: '默认排序',
          value: 1,
        },
        {
          label: '距离优先',
          value: 2,
        },
        {
          label: '价格优先',
          value: 3,
        },
      ],
      getImageSrc(type, active = false) {
        const name = type?.name
        const icon = type?.type_icon
        return icon
          ? `http://zhschool.qixiuu.com${icon}`
          : {
              证书初培: active
                ? require('@/static/type-first-train-active.png')
                : require('@/static/type-first-train.png'),
              晋升培训: active ? require('@/static/type-train-active.png') : require('@/static/type-train.png'),
              证书更新: active ? require('@/static/type-cert-active.png') : require('@/static/type-cert.png'),
              海员入门培训: active
                ? require('@/static/type-member-train-active.png')
                : require('@/static/type-member-train.png'),
              // '其他类型': active ? require('@/static/type-first-train-active.png') : require('@/static/type-first-train.png'),
              渔转海: active ? require('@/static/type-board-active.png') : require('@/static/type-board.png'),
              海转内: active ? require('@/static/type-water-active.png') : require('@/static/type-water.png'),
            }[name] ?? (active ? require('@/static/type-other-active.png') : require('@/static/type-other.png'))
      },
    }
  },
  methods: {
    isFlodCard(idx){ 
      console.log('idx===',idx)
      this.showTypeIdx = this.showTypeIdx === idx ? new Date().getTime():idx  
    }
  },
})

export default vm
</script>

<template>
  <view style="width:100%">
    <u-navbar :title-size="38" title="报名"  :is-back="isBack" style="height:0"></u-navbar>
    <!-- <view class="top">
      <u-dropdown inactive-color="#666666">
        <u-dropdown-item v-model="value1" title="培训分类" :options="options1" ></u-dropdown-item>
        <u-dropdown-item v-model="value2" title="与我相关" :options="options2"></u-dropdown-item>
        <u-dropdown-item v-model="value3" title="开课时间" :options="options3"></u-dropdown-item>
      </u-dropdown>
    </view> -->
    <u-row class="filter-bar">
      <view @click="showTypes = !showTypes" class="select-tag">
        <text v-if="!!selectedType" class="select-tag-item selected">
          {{ selectedType.name }}
        </text>
        <text v-else class="select-tag-item">培训分类</text>
        <Icon name="arrow-down-fill" :size="18" />
      </view>
      <view @click="showAboutMe = true" class="select-tag">
        <text class="select-tag-item">与我相关</text>
        <Icon name="arrow-down-fill" :size="18" />
      </view>
      <view @click="showTime = !showTime" class="select-tag">
        <text v-if="!!selectedTime" class="select-tag-item selected">
          {{ format(selectedTime, 'YYYY年M月份') }}
        </text>
        <text v-else class="select-tag-item">开课时间</text>
        <Icon name="arrow-down-fill" :size="18" />
      </view>
    </u-row>
    <u-picker
      v-model="showTime"
      mode="time"
      cancel-text="全部"
      title="请选择"
      :params="{
        year: true,
        month: true,
        day: false,
        hour: false,
        minute: false,
        second: false,
      }"
      @confirm="onTimeChange"
      @cancel="onTimeClear"
    ></u-picker>
    <view class="train-type-list">
      <template v-if="typeList.length > 0">
        <template v-for="(type, idx) in typeList">
          <Card class="type-info-card" :class="{ active: showTypeIdx === idx }" :key="`card${idx}`" :shadow="false">
            <u-row >
              <u-row class="type-info">
                <image :src="getImageSrc(type, showTypeIdx === idx)" class="type-icon" mode="aspectFit"></image>
                {{ type.name }}
              </u-row>
              <view class="fold-button" @click="isFlodCard(idx)">
                <Icon :name="showTypeIdx === idx ? 'arrow-up' : 'arrow-down'" :size="36" />
              </view>
            </u-row>
          </Card>
          <Card class="tags" v-show="showTypeIdx === idx" :key="`tags${idx}`" :padding="false">
            <u-tag
              v-for="(tag, idx) in type.two_type"
              :key="idx"
              :text="tag.name"
              mode="plain"
              shape="circle"
              @click="$emit('change', tag)"
            />
          </Card>
        </template>
      </template>
      <view class="empty" v-else>
        <u-empty mode="data"></u-empty>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
// .top{
//   margin: -30rpx 0 -40rpx 0;
// }
.filter-bar {
  position: fixed;
  top: calc(44px + var(--status-bar-height));
  z-index: 2;
  width: 750rpx;
  height: 80rpx;
  background: #fff;
  font-size: 30rpx;

  > * {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    .icon {
      margin-left: 10rpx;
      color: #ccc;
    }
  }
  // width: 100%;
}

.empty {
  padding-top: 150rpx;
}

.selected {
  color: $color-primary;
}
.select-tag {
  overflow: hidden;
}
.select-tag-item {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.train-type-list {
  width: 100%;
  padding: 50rpx $wing-gap;
}

.type-icon {
  width: 60rpx;
  height: 60rpx;
  margin-right: 30rpx;
}

.type-info-card {
  background: #9ad6ff;
  color: #ffffff;

  .fold-button {
    box-shadow: 0px 3px 6px #dfe7eb;
  }

  &.active {
    background: linear-gradient(318deg, #77b7f2 0%, #3794ea 100%);
    color: #fff;

    .fold-button {
      color: $color-primary;
      box-shadow: 0px 3px 6px #73abde;
    }
  }
}

.type-info {
  flex: 1;
  .icon {
    margin-right: 10rpx;
  }

  font-size: 36rpx;
}

.fold-button {
  background: #fff;
  width: 62rpx;
  height: 62rpx;
  padding: 8rpx;
  border-radius: 50%;
  color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tags {
  padding: 42rpx 36rpx 50rpx;
  // padding-top: 36rpx !important;
}

.u-tag {
  border: none !important;
  font-size: 29rpx;

  &.u-mode-plain-primary {
    background-color: rgba($color-primary, 0.1) !important;
  }
}

.u-tag {
  margin-top: 20rpx;
  margin-right: 20rpx;
}

.empty {
  padding-top: 150rpx;
}

/deep/ .u-icon__icon{
  top: 2rpx;
}
</style>
