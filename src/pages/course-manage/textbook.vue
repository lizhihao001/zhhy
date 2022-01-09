<script>
import { defineComponent, reactive, onMounted, ref, watch, computed } from '@vue/composition-api'
import Card from '@/components/Card'
import ViewStatus from '@/components/ViewStatus'
import NewsList from '../news-list/list.vue'
import { useMouse } from '@vueuse/core'
import { useService } from '@/hooks'
import services from '@/services'

const vm = defineComponent({
  components: { Card, NewsList, ViewStatus },
  // onLoad: function (option) {
  //   this.option.id = option.id
  // },
  setup() {
    // const option = reactive({
    //   id: null,
    // })

    const typeList = ref([
      {
        label: '全部',
        value: undefined,
      },
    ])
    const selectedType = ref(undefined)

    const textbookListService = useService(services['教材列表'])

    watch(textbookListService.data, () => {
      typeList.value = [
        {
          label: '全部',
          value: undefined,
        },
        ...Object.entries(textbookListService.data.value?.course_list ?? {}).map(([value, label]) => ({
          value,
          label,
        })),
      ]
    })

    const fetch = () => {
      textbookListService.fetch({
        course_id: selectedType.value?.value,
      })
    }

    onMounted(fetch)

    watch(selectedType, fetch)

    const state = reactive({
      count: 0,
      show: false,
    })

    const toTextbookDetails = (item) => {
      uni.navigateTo({
        url: `/pages/course-manage/textbook-details?id=${item?.id}`,
      })
    }

    const list = computed(() => {
      return textbookListService.data.value?.list
    })

    return {
      toTextbookDetails,
      state,
      service: textbookListService.data,
      list,
      loading: textbookListService.loading,
      typeList: typeList,
      selectedType,
      selectType([item]) {
        selectedType.value = item
        console.log(item)
      },
    }
  },
})

export default vm
</script>

<template>
  <view class="warpper">
    <u-navbar :title-size="38" title="我的教材" :height="50"></u-navbar>
    <u-select v-model="state.show" :list="typeList" @confirm="selectType"></u-select>
    <view class="content">
      <Card :padding="false" class="type-select" @click="state.show = true">
        <view class="select-content">
          <image mode="aspectFill" class="book-icon" src="@/static/icons/book-icon.png"></image>
          <text>{{ selectedType ? selectedType.label : '全部教材' }}</text>
        </view>
        <image mode="aspectFill" class="select-arrow" src="@/static/icons/select-arrow.png"></image>
      </Card>

      <ViewStatus :loading="!service || loading" :empty="(list || []).length === 0">
        <view class="book-list">
          <view v-for="(item, idx) in list || []" :key="idx" class="book-item" @click="toTextbookDetails(item)">
            <view class="book-box">
              <image mode="aspectFill" class="book-icon" :src="`http://zhschool.qixiuu.com${item.images}`"></image>
            </view>
            <text>{{ item.name || '--' }}</text>
          </view>
        </view>
      </ViewStatus>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.content {
  margin-top: 10rpx;
  padding: 0 56rpx;
}

.type-select {
  height: 90rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;

  .select-content {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #333;
    font-size: 28rpx;

    .book-icon {
      width: 74rpx;
      height: 65rpx;
    }
  }

  .select-arrow {
    width: 24rpx;
    height: 16rpx;
  }
}

.book-list {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;

  .book-item {
    width: 48%;
    color: #333;
    font-size: 30rpx;
    margin-bottom: 72rpx;

    .book-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      border-radius: 12rpx;
      height: 272rpx;
      background: radial-gradient(circle, #fff 0%, #e8eaed 100%);
      margin-bottom: 18rpx;

      .book-icon {
        width: 142rpx;
        height: 200rpx;
      }
    }
  }
}
</style>
