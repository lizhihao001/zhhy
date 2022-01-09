<template>
  <view class="m-calendar w-full" ref="calendar">
    <view class="m-toolbar">
      <view class="m-year-selector flex">
        <view class="current-month flex-1">
          {{ showDate.year }}.{{ showDate.month }}
          <!-- <text>{{ showDate.year }} {{ yearName }}</text>
          <text>{{ monthNames[showDate.month - 1] }}</text> -->
        </view>
        <text class="m-pre-btn mL-10" @click="changeMonth('prev')"></text>
        <text class="m-next-btn mR-10" @click="changeMonth('next')"></text>
      </view>

      <!-- <view class="m-year-selector">
        <text class="m-pre-year" @click="changeYear('prev')"></text>
        <text class="m-pre-btn mL-10" @click="changeMonth('prev')"></text>
        <view class="text_v">
          <text>{{ showDate.year }} {{ yearName }}</text>
          <text>{{ monthNames[showDate.month - 1] }}</text>
        </view>
        <text class="m-next-btn mR-10" @click="changeMonth('next')"></text>
        <text class="m-next-year" @click="changeYear('next')"></text>
      </view> -->
    </view>
    <view class="m-week-header">
      <view class="m-week-day" v-for="item in weekNames" :key="item">
        {{ item }}
      </view>
    </view>
    <view class="m-months-container" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend">
      <view class="m-months-wrapper" :style="{ transform: `translate3d(${-translateX * 100}%, 0, 0)` }">
        <view
          class="m-months"
          v-for="(month, monthIndex) in fullDate"
          :key="monthIndex"
          :style="{
            transform: `translate3d(${(monthIndex - 1 + translateX + (isTouching ? touch.x : 0)) * 100}%, 0, 0)`,
            transitionDuration: isTouching ? '0s' : '.3s',
          }"
        >
          <view class="m-row" v-for="(week, weekIndex) in month" :key="weekIndex">
            <view class="m-day" v-for="(day, dayIndex) in week" :key="dayIndex" @click="onDayClick(day)">
              <text
                :class="{
                  'm-day-num': true,
                  'm-grey': day.isGrey,
                  'm-active': day.isToday,
                  'm-disable': day.isDisable,
                  'm-select': day.isSelect,
                  'm-during': day.isDuring,
                  // 'm-active': day.isActive,
                }"
              >
                {{ day.value }}
              </text>
              <slot name="day" :date="day" />
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
// import './inlineCalendar.scss'
import dayjs from 'dayjs'
let touchStartPosition
let touchEndPosition
let timeStamp

export default {
  name: 'inlineCalendar',
  props: {
    defaultDate: {
      type: [Date, Number, Array, String, dayjs],
    },
    disabledDate: {
      type: Array,
      default() {
        return []
      },
    },
    activeDate: {
      type: Array,
      default() {
        return []
      },
    },
    minDate: {
      type: [Date, Number, Array, String, dayjs],
    },
    maxDate: {
      type: [Date, Number, Array, String, dayjs],
    },
    mode: {
      type: String,
      default: 'single',
    },
    dayClick: {
      type: Function,
      default() {
        return function () {
          return true
        }
      },
    },
    enableTouch: {
      type: Boolean,
      default: true,
    },
    monthNames: {
      type: Array,
      default() {
        return ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
      },
    },
    weekNames: {
      type: Array,
      default() {
        return ['一', '二', '三', '四', '五', '六', '日']
      },
    },
    yearName: {
      type: String,
      default: '年',
    },
    restrictCurrentMonth: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    mode() {
      this.init()
    },
  },
  data() {
    return {
      fullDate: [[], [], []],
      translateX: 0,
      showDate: {
        year: undefined,
        month: undefined,
      },
      dateNow: {
        year: dayjs().year(),
        month: dayjs().month() + 1,
        date: dayjs().date(),
      },
      selectDate: [],
      touch: {
        x: 0,
        y: 0,
      },
      isTouching: false,
    }
  },
  created() {
    this.init()
  },
  methods: {
    init(date) {
      this.selectDate = []
      let { defaultDate, mode } = this
      if (date) {
        defaultDate = date
      }
      let dateToShow = dayjs().startOf('month')
      if (mode === 'single' && defaultDate) {
        this.selectDate = dayjs(defaultDate).startOf('day')
        dateToShow = this.selectDate.startOf('month')
      }
      if (mode === 'multiple' && Array.isArray(defaultDate)) {
        if (defaultDate.length > 0) {
          this.selectDate = defaultDate.map((item) => dayjs(item).startOf('day'))
        }
      }
      if (mode === 'during' && Array.isArray(defaultDate)) {
        if (defaultDate.length === 2) {
          const startDate = dayjs(defaultDate[0]).startOf('day')
          const endDate = dayjs(defaultDate[1]).startOf('day')
          if (startDate.isBefore(endDate) || startDate.isSame(endDate)) {
            this.selectDate = [startDate, endDate]
          }
        }
      }
      this.showDate = {
        year: dateToShow.year(),
        month: dateToShow.month() + 1,
      }
      this.getFullDate(this.showDate)
    },
    touchstart(event) {
      if (this.enableTouch) {
        touchStartPosition = event.touches[0].clientX
        touchEndPosition = event.touches[0].clientY
        timeStamp = event.timeStamp
        this.touch = {
          x: 0,
          y: 0,
        }
        this.isTouching = true
      }
    },
    touchmove(event) {
      if (this.enableTouch) {
        this.touch = {
          x: (event.touches[0].clientX - touchStartPosition) / this.$refs.calendar.offsetWidth,
          y: (event.touches[0].clientY - touchEndPosition) / this.$refs.calendar.offsetHeight,
        }
      }
    },
    touchend(event) {
      if (this.enableTouch) {
        this.isTouching = false
        const during = dayjs(event.timeStamp).diff(timeStamp)
        if (
          Math.abs(this.touch.x) > Math.abs(this.touch.y) &&
          Math.abs(this.touch.x * this.$refs.calendar.offsetWidth) > 20
        ) {
          if (this.touch.x > 0) {
            this.changeMonth('prev')
          } else if (this.touch.x < 0) {
            this.changeMonth('next')
          }
        } else {
          this.touch = {
            x: 0,
            y: 0,
          }
        }
      }
    },
    // 触发change事件
    emitChange() {
      this.$emit('change', this.selectDate)
    },
    // 触发切换年月事件
    emitSwitch(showDate) {
      if (this.restrictCurrentMonth) {
        this.selectDate = []
      }
      this.$emit('switch', showDate)
    },
    // 日期点击事件
    onDayClick(day) {
      if (!this.dayClick(day.dateTime)) {
        return
      }
      switch (this.$props.mode) {
        case 'single':
          if (!day.isSelect && !day.isDisable) {
            this.selectDate = day.dateTime
            this.getFullDate(this.showDate)
            this.emitChange()
          }
          break
        case 'multiple':
          if (!day.isSelect && !day.isDisable) {
            this.selectDate.push(day.dateTime)
            this.getFullDate(this.showDate)
            this.emitChange()
          } else {
            if (this.selectDate.length > 1) {
              this.selectDate = this.selectDate.filter((item) => !item.isSame(day.dateTime))
              this.getFullDate(this.showDate)
              this.emitChange()
            }
          }
          break
        case 'during':
          if (day.isDisable) return
          if (this.restrictCurrentMonth && day.isGrey) return
          if (this.selectDate.length === 0) {
            this.selectDate = [day.dateTime]
          } else if (this.selectDate.length === 1) {
            this.selectDate.push(day.dateTime)
            if (this.selectDate[1].isBefore(this.selectDate[0])) {
              this.selectDate.reverse()
            }
          } else if (this.selectDate.length === 2) {
            this.selectDate = [day.dateTime]
          }
          this.getFullDate(this.showDate)
          this.emitChange()
          break
      }
    },
    // 切换年份
    changeYear(action) {
      const date = dayjs(`${this.showDate.year}-${this.showDate.month}`)
      let computedDate
      switch (action) {
        case 'prev':
          this.translateX += 1
          computedDate = date.subtract(1, 'year')
          break
        case 'next':
          this.translateX -= 1
          computedDate = date.add(1, 'year')
          break
      }
      this.showDate = {
        year: computedDate.year(),
        month: computedDate.month() + 1,
      }
      this.emitSwitch(this.showDate)
      this.getFullDate(this.showDate)
    },
    // 切换月份
    changeMonth(action) {
      const date = dayjs(`${this.showDate.year}-${this.showDate.month}`)
      let computedDate
      switch (action) {
        case 'prev':
          this.translateX += 1
          computedDate = date.subtract(1, 'month')
          break
        case 'next':
          this.translateX -= 1
          computedDate = date.add(1, 'month')
          break
      }
      this.showDate = {
        year: computedDate.year(),
        month: computedDate.month() + 1,
      }
      this.emitSwitch(this.showDate)
      this.getFullDate(this.showDate)
    },
    // 暴露出去的方法：切换已选的时间
    changeDate(date) {
      if (dayjs(date).isValid() || Array.isArray(date)) {
        this.init(date)
      } else {
        console.error('Type of parameter is invalid!')
      }
    },
    // 暴露出去的方法：切换当前显示的时间
    changeDateView(date = dayjs()) {
      const changeDate = dayjs(date)
      this.showDate = {
        year: changeDate.year(),
        month: changeDate.month() + 1,
      }
      this.getFullDate(this.showDate)
    },
    getFullDate() {
      const date = dayjs(`${this.showDate.year}-${this.showDate.month}`)
      const thisDate = this.getDate(date)
      const prevDate = this.getDate(date.subtract(1, 'month'))
      const nextDate = this.getDate(date.add(1, 'month'))
      this.fullDate = [prevDate.fullDate, thisDate.fullDate, nextDate.fullDate]
    },
    // 当前日期是否被选中
    isSelect(date) {
      let select = false
      switch (this.$props.mode) {
        case 'single':
          if (this.selectDate && date.isSame(this.selectDate)) {
            select = true
          }
          break
        case 'multiple':
          if (this.selectDate.length > 0 && this.selectDate.some((item) => date.isSame(item))) {
            select = true
          }
          break
      }
      return select
    },
    // 当前时间是否在selectDate之间
    isBetting(date) {
      if (this.mode === 'during') {
        const startDate = this.selectDate[0]
        const endDate = this.selectDate[1]
        if (this.selectDate.length === 1) {
          return date.isSame(startDate)
        } else if (this.selectDate.length === 2) {
          return (date.isAfter(startDate) && date.isBefore(endDate)) || date.isSame(startDate) || date.isSame(endDate)
        }
      }
      return false
    },
    getIsDisable(dateTime) {
      let isDisable = false
      const disabledDate = this.disabledDate.map((item) => dayjs(item).startOf('day'))
      if (this.minDate || this.maxDate) {
        if (this.minDate) {
          const minDate = dayjs(this.minDate).startOf('day')
          isDisable = dateTime.isBefore(minDate)
        }
        if (!isDisable && this.maxDate) {
          const maxDate = dayjs(this.maxDate).endOf('day')
          isDisable = dateTime.isAfter(maxDate)
        }
      } else if (disabledDate.length > 0) {
        if (this.mode !== 'during') {
          isDisable = disabledDate.some((item) => item.isSame(dateTime))
        }
      }
      return isDisable
    },
    getIsActive(dateTime) {
      let isActive = false
      const activeDate = this.activeDate.map((item) => dayjs(item).startOf('day'))
      if (activeDate.length > 0) {
        isActive = activeDate.some((item) => item.isSame(dateTime))
      }
      return isActive
    },
    getDate(thisDate) {
      let date = []
      const prevDate = thisDate.subtract(1, 'month')
      const nextDate = thisDate.add(1, 'month')
      const firstDayOfWeek = thisDate.day() || 7
      const dayCountOfThisMonth = thisDate.daysInMonth()
      const dayCountOfPrevMonth = prevDate.daysInMonth()
      const prevIndexOfThisMonth = firstDayOfWeek - 1
      const NextIndexOfThisMonth = firstDayOfWeek + dayCountOfThisMonth - 2
      const disabledDate = this.disabledDate.map((item) => dayjs(item).startOf('day'))
      for (let i = 0; i < 7 * 6; i++) {
        // 上月
        if (i < prevIndexOfThisMonth) {
          const value = dayCountOfPrevMonth - (firstDayOfWeek - i - 2)
          const dateTime = prevDate.date(value)
          date[i] = {
            value,
            dateTime,
            isGrey: true,
            isToday: dateTime.isSame(dayjs().startOf('day')),
            isSelect: this.isSelect(dateTime),
            isDisable: this.getIsDisable(dateTime),
            isActive: this.getIsActive(dateTime),
            isDuring: this.isBetting(dateTime),
          }
        }
        // 当月
        if (i >= prevIndexOfThisMonth && i <= NextIndexOfThisMonth) {
          const value = i - firstDayOfWeek + 2
          const dateTime = thisDate.date(value)
          date[i] = {
            value,
            dateTime,
            isGrey: false,
            isToday: dateTime.isSame(dayjs().startOf('day')),
            isSelect: this.isSelect(dateTime),
            isDisable: this.getIsDisable(dateTime),
            isActive: this.getIsActive(dateTime),
            isDuring: this.isBetting(dateTime),
          }
        }
        // 下月
        if (i > NextIndexOfThisMonth) {
          const value = i - firstDayOfWeek - dayCountOfThisMonth + 2
          const dateTime = nextDate.date(value)
          date[i] = {
            value,
            dateTime,
            isGrey: true,
            isToday: dateTime.isSame(dayjs().startOf('day')),
            isSelect: this.isSelect(dateTime),
            isDisable: this.getIsDisable(dateTime),
            isActive: this.getIsActive(dateTime),
            isDuring: this.isBetting(dateTime),
          }
        }
      }
      const fullDate = []
      for (let i = 0; i < 6; i++) {
        fullDate.push(date.slice(i * 7, (i + 1) * 7))
      }
      return {
        fullDate,
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.m-calendar {
  background: #fff;
  padding: 10rpx 20rpx;
  .m-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // border-bottom: 2rpx #eee solid;
    height: 88rpx;
    font-size: 34rpx;
    .m-month-selector,
    .m-year-selector {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0 40rpx;
      margin-bottom: 16rpx;
      .text_v {
        flex: 1;
        text-align: center;
        font-weight: 500;
      }
      .m-pre-year,
      .m-next-year {
        position: relative;
        color: rgba(0, 0, 0, 0.25);
        width: 40rpx;
        height: 40rpx;
        &::before {
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          width: 14rpx;
          height: 14rpx;
          border: 0 solid;
          border-width: 3rpx 0 0 3rpx;
          content: '';
        }
        &::after {
          position: absolute;
          top: 8rpx;
          left: 8rpx;
          display: inline-block;
          width: 14rpx;
          height: 14rpx;
          border: 0 solid;
          border-width: 3rpx 0 0 3rpx;
          content: '';
        }
      }
      .m-pre-year {
        transform: rotate(-45deg);
      }
      .m-next-year {
        transform: rotate(135deg);
      }
      .m-pre-btn,
      .m-next-btn {
        cursor: pointer;
        width: 40rpx;
        height: 40rpx;
        position: relative;
        color: #333;
        &::before {
          position: absolute;
          top: 0;
          left: 0;
          display: inline-block;
          width: 14rpx;
          height: 14rpx;
          border: 0 solid;
          border-width: 3rpx 0 0 3rpx;
          content: '';
        }
      }
      .m-pre-btn {
        transform: rotate(-45deg);
      }
      .m-next-btn {
        transform: rotate(135deg);
      }
    }
  }
  .m-week-header {
    position: relative;
    display: flex;
    box-sizing: border-box;
    font-size: 28rpx;
    .m-week-day {
      flex: 1;
      text-align: center;
      line-height: 60rpx;
      color: #999;
    }
  }
  .m-months-container {
    position: relative;
    box-sizing: border-box;
    height: 480rpx;
    overflow: hidden;
    .m-months-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      .m-months {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        will-change: transform;
        .m-row {
          position: relative;
          display: flex;
          height: 80rpx;
          // &::before {
          //   content: '';
          //   position: absolute;
          //   background-color: #ccc;
          //   display: block;
          //   right: 0;
          //   bottom: 0;
          //   left: 0;
          //   height: 1rpx;
          //   width: 100%;
          //   transform-origin: 50% 0;
          // }
          .m-day {
            position: relative;
            line-height: 80rpx;
            font-size: 28rpx;
            width: calc(100% / 7);
            text-align: center;
            cursor: pointer;
            -webkit-tap-highlight-color: transparent;
            .m-day-num {
              width: 52rpx;
              height: 52rpx;
              line-height: 52rpx;
              display: inline-block;
              border-radius: 4rpx;
            }
            .m-grey {
              color: #b8b8b8;
            }
            .m-today {
              border: 2rpx solid #1890ff;
              border-radius: 4rpx;
              box-sizing: border-box;
              border-radius: 50%;
            }
            .m-disable {
              color: #b8b8b8;
              text-decoration: line-through;
            }
            .m-select {
              background: #4da0ed;
              color: #fff;
              border-radius: 50%;
            }
            .m-during {
              background: #4da0ed;
              color: #fff;
              width: 100%;
              height: 100%;
              line-height: 80rpx;
              border-radius: initial;
            }
            .m-active {
              position: relative;
              &.m-select {
                &::after {
                  display: none;
                }
              }
              &::after {
                content: '';
                border-radius: 50%;
                width: 12rpx;
                height: 12rpx;
                background: $color-warning;
                position: absolute;
                bottom: -10rpx;
                left: 50%;
                transform: translateX(-50%);
              }
            }
          }
        }
      }
    }
  }

  .current-month {
    font-size: 40rpx;
    font-weight: 700;
  }
}
</style>
