<template>
  <div
    :class="{ [`sdp-month-subsidiary-box-${isMobile ? 'app' : 'pc'}`]: true }"
    :style="monthStyle"
  >
    <slot name="header" :clickMonth="clickMonth">
      <div
        @click="clickMonth"
        class="sdp-month-subsidiary-title"
        :class="{
          [isCurrent ? 'isSelectCurrent' : 'isSelectPriorPeriod']:
            isSelectMonth(),
          'left-arrow-fix': index === 0,
          'right-arrow-fix': index === 3,
        }"
      >
        <span>{{
          $t("sdp.views.CalendarTitleTemplate", {
            year: curYear,
            monthNum: index + 1,
            month: MONTH_LANG_NAMES[index],
          })
        }}</span>
      </div>
    </slot>
    <component
      :is="isTablet ? 'div' : 'cube-scroll'"
      :class="{ 'cube-scroll-wrapper': true }"
      ref="subsidiaryScroll"
      style="width: 100%"
      :style="{ height: autoHeight + 'px' }"
    >
      <div
        :class="{ 'horizontal-border': horizontalPre }"
        class="sdp-month-subsidiary-date"
      >
        <div
          class="sdp-month-subsidiary-wk"
          v-if="
            isBusiness ||
            (!isBusiness && isShowWeekly && weeklyType === 'leftAlign')
          "
        >
          <span class="wk">{{ $t("sdp.views.Wk") }}</span>
          <div
            v-for="(item, weekIndex) of weekData"
            :key="weekIndex"
            class="week-item-wrap"
            :class="{ 'week-item-wrap-mobile': isMobile }"
          >
            <div v-if="item" :class="{ wkCenter: isMobile }">
              <div
                :class="{
                  [isCurrent ? 'isSelectCurrent' : 'isSelectPriorPeriod']:
                    isSelectWk(item),
                }"
                class="wk-item"
                @click="clickWk(item)"
              >
                {{ item }}
              </div>
            </div>
            <div v-else></div>
          </div>
        </div>
        <div class="sdp-month-subsidiary-day">
          <div class="sdp-month-subsidiary-day-name">
            <span
              @click="clickDayNames(item)"
              v-for="(item, index) of dayNames"
              :key="index"
              >{{ DAY_LANG_NAMES.find((i) => i.value === item).text }}</span
            >
          </div>
          <div
            class="sdp-month-subsidiary-days"
            v-for="(data, index) of buildMonthData"
            :key="index"
          >
            <!--  日历数据处理   -->
            <template v-for="item in data">
              <div
                v-if="item"
                :class="{
                  [isMobile
                    ? 'param-calendar-wkstyle-app'
                    : 'param-calendar-wkstyle-pc']:
                    !isBusiness && !item.monthStyle,
                  isStyle: item.isStyle,
                  borderLB:
                    (isMobile && item.isFirstWeekCount) ||
                    (!disableShowSelected &&
                      item.isStyle &&
                      getIsAbove(item, 'isStyle')),
                  borderRB:
                    (isMobile && item.isEndWeekCount) ||
                    (!disableShowSelected &&
                      item.isStyle &&
                      getIsAfter(item, 'isStyle')),
                  isDisabled: item.isDisabled,
                  clearMarginBottoisStylem:
                    Math.max(...weekData) === item.weekCount,
                }"
                class="sdp-month-subsidiary-days-box"
                :key="item.timestamp"
                @click="clickDay($event, item)"
                @mouseover="
                  mouseoverDay($event, item.timestamp, item.isDisabled)
                "
                @mouseout="mouseoutDay($event, item.timestamp)"
                style="flex: 1"
              >
                <div v-if="item"></div>
                <div
                  class="firstWeekCount"
                  v-if="isOpenSite && item.isFirstWeekCount"
                  @click.stop="clickWk(item.weekCount)"
                  :class="{
                    'not-disabled-wk':
                      isDisabledWk(item.weekCount) && !isMobile,
                    'param-calendar-wkstyle-app': isMobile,
                    [isCurrent ? 'isSelectCurrent' : 'isSelectPriorPeriod']:
                      isSelectWk(item.weekCount),
                  }"
                  :style="{
                    left: isSafari ? '-5px' : '-15px',
                    transform: isMobile ? '' : 'scale(0.6)',
                  }"
                >
                  Wk{{ item.weekCount }}
                </div>
                <div
                  :class="{
                    [!getIsAbove(item, 'isSelected') ||
                    !getIsAfter(item, 'isSelected')
                      ? 'appSelectDays'
                      : 'sdp-month-subsidiary-single']:
                      item.isSelected && !disableShowSelected,
                    [isCurrent ? 'isSelectCurrent' : 'isSelectPriorPeriod']:
                      item.isSelected && !disableShowSelected,
                    borderLB:
                      getIsAbove(item, 'isSelected') && !disableShowSelected,
                    borderRB:
                      getIsAfter(item, 'isSelected') && !disableShowSelected,
                  }"
                ></div>
                <span
                  style="position: relative; z-index: 10"
                  :class="{
                    [isCurrent
                      ? 'isSelectCurrentText'
                      : 'isSelectPriorPeriodText']:
                      item.isSelected && !disableShowSelected,
                    isCurrent:
                      currentDate && item.isCurrent && !item.isSelected,
                  }"
                  >{{ item.date }}</span
                >
              </div>
              <div v-else style="flex: 1" :key="item.timestamp"></div>
            </template>
          </div>
        </div>
      </div>
    </component>
    <div class="sdp-quick-checkbox" v-if="showIncludeToday">
      <el-checkbox
        :value="isIncludeToday"
        @change="(e) => $emit('includeTodayChange', e)"
        >{{ $t("sdp.views.includeTodayMobile") }}</el-checkbox
      >
    </div>
  </div>
</template>

<script>
import {
  MONTH_LANG_NAMES,
  DAY_LANG_NAMES,
  PERIOD,
  UNIQUE_SELECT_KEY,
  CREATE_TOAST_TIME,
} from "../constants";
import { DAY_NAMES, DAY_NAMES_Obj } from "../constants";
import { classifyYear, getBrowserInfo } from "../utils";

const WEEK_NUM = 7;
export default {
  name: "monthSubsidiary",
  inject: {
    tenantData: { default: {} },
    tabletConfig: {
      default: () => () => ({
        tabletScale: 1,
        isMobileTablet: false,
      }),
    }, // 是否平板
  },
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
    monthStyle: {
      type: Object,
      default: () => ({
        width: "255px",
        marginBottom: "8px",
        marginLeft: "4px",
        marginRight: "4px",
      }),
    },
    monthData: {
      type: Array,
      default: () => [],
    },
    offsetDay: {
      type: Number,
      default: 0,
    },
    curYear: {
      type: Number,
    },
    index: {
      type: Number,
    },
    shiftSignStart: {
      type: Number,
    },
    shiftSignEnd: {
      type: Number,
    },
    shiftSignStartSaveCallStack: {
      type: Array,
      default: () => [],
    },
    isSingle: {
      type: Boolean,
    },
    // 是否为本期还是上期
    isCurrent: {
      type: Boolean,
      default: true,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
    horizontalPre: {
      type: Boolean,
      default: false,
    },
    disableShowSelected: {
      type: Boolean,
      default: false,
    },
    accordingToYear: {
      type: Boolean,
      default: false,
    },
    dayNames: {
      type: Array,
      default: () => [],
    },
    isBusiness: {
      type: Boolean,
      default: true,
    },
    isShowWeekly: {
      type: Boolean,
      default: false,
    },
    weeklyType: {
      type: String,
      default: "",
    },
    // 当前日期 默认不开启
    currentDate: {
      type: Boolean,
      default: false,
    },
    isTileShow: {
      // 面板控制快选是否平铺展示
      type: Boolean,
      default: false,
    },
    curSelTileQuick: {
      // 明细快选的快选项
      type: String,
      default: "",
    },
    includeToday: {
      type: Boolean,
      default: false,
    },
    showIncludeToday: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      weekData: [],
      buildMonthData: [],
      WEEK_NUM,
      shiftKeyActive: false,
      // disableShowSelected: false, // 按年
    };
  },
  watch: {
    monthData() {
      this.initData();
    },
    isOpenSite() {
      this.initData();
    },
    buildMonthData() {
      this.updateHeight();
    },
    isShow(v) {
      if (v) {
        this.updateHeight();
      }
    },
    shiftSignEnd(val, old) {
      const shiftSignEnd = val;
      const shiftSignStart = this.shiftSignStart;
      if (shiftSignStart && shiftSignEnd && shiftSignStart !== shiftSignEnd) {
        this.operationMonthData.forEach((item) => {
          if (shiftSignStart < shiftSignEnd) {
            item.isStyle =
              shiftSignStart <= item.timestamp &&
              item.timestamp <= shiftSignEnd;
          } else {
            item.isStyle =
              shiftSignStart >= item.timestamp &&
              item.timestamp >= shiftSignEnd;
          }
        });
      }
      if (!val && val !== old) {
        this.operationMonthData.forEach((item) => {
          item.isStyle = false;
        });
      }
    },
  },
  computed: {
    DAY_LANG_NAMES() {
      return DAY_LANG_NAMES.call(this);
    },
    MONTH_LANG_NAMES() {
      return MONTH_LANG_NAMES.call(this).map((item) => item.text);
    },
    isTablet() {
      if (this.tabletConfig) {
        const tabletConfig = this.tabletConfig();
        return tabletConfig.isMobileTablet && !this.isMobile;
      }
      return false;
    },
    isSafari() {
      const browserInfo = getBrowserInfo();
      return browserInfo.browser === "Safari" && !this.isMobile;
    },
    operationMonthData() {
      return this.monthData.filter((item) => !item.isDisabled);
    },
    dayNums() {
      return this.dayNames.map((item) => DAY_NAMES_Obj[item]);
    },
    // 用来处理新需求的数据结构
    isOpenSite() {
      return this.isShowWeekly && this.weeklyType === "leftMark";
    },
    autoHeight() {
      let height = this.buildMonthData.length * 40 + 64;
      if (this.isBusiness || !this.isMobile) return "";
      // const MAX_HEIGHT = 264
      const MAX_HEIGHT = 200;
      if (!this.horizontalPre && height > MAX_HEIGHT) {
        height = MAX_HEIGHT;
      } else if (this.horizontalPre) {
        if (height > MAX_HEIGHT || height < MAX_HEIGHT) height = 200; // 大于四行取四行的数据
      }
      return height;
    },
    financialWeekBegin() {
      return Number(this.tenantData?.tenant?.financialWeekBegin) || 0;
    },
    quickCalenderConfig() {
      return this.tenantData?.quickCalenderConfig || [];
    },
    isIncludeToday() {
      return this.includeToday;
    },
  },
  mounted() {
    this.initData();
    this.shiftClickListeners("addEventListener");
  },
  destroyed() {
    this.shiftClickListeners("removeEventListener");
  },
  methods: {
    shiftClickListeners(type) {
      document[type]("keydown", () => {
        this.shiftKeyActive = type === "addEventListener";
      });
      document[type]("keyup", () => {
        this.shiftKeyActive = false;
      });
    },
    scrollRefresh() {
      if (this.isTablet) return;
      this.$refs.subsidiaryScroll.refresh();
    },
    initData() {
      const dayNums = this.dayNums;
      const data = this.monthData.reduce((weeks, day) => {
        const arr = weeks.get(day.weekCount) || [];
        weeks.set(day.weekCount, [...arr, day]);
        return weeks;
      }, new Map());
      let weekData = [...data.keys()];
      let buildMonthData = [...data.values()];

      const addSite = (data, nums, type = "unshift") => {
        const site = new Array(nums).fill(false);
        data[type](...site);
      };

      // 财务日历特殊处理
      if (this.isBusiness) {
        const beforeItem = buildMonthData[0];
        const beforeOffsetDay = beforeItem
          ? WEEK_NUM - beforeItem.length
          : undefined;
        if (beforeOffsetDay && beforeItem) {
          addSite(beforeItem, beforeOffsetDay);
        }

        const afterItem = buildMonthData[buildMonthData.length - 1];
        const afterOffsetDay = afterItem
          ? WEEK_NUM - afterItem.length
          : undefined;
        if (afterOffsetDay && afterItem) {
          addSite(afterItem, afterOffsetDay, "push");
        }
      } else {
        const setBuildMonthDataRow = (item, index) => {
          buildMonthData.splice(index, 0, item.splice(WEEK_NUM, WEEK_NUM));
          weekData.splice(index, 0, false);
        };
        const switchSite = (item, nextItem, afterOffsetDay) => {
          if (!this.isOpenSite) {
            addSite(item, afterOffsetDay, "push");
          } else {
            if (nextItem) {
              const nextData = nextItem.splice(0, afterOffsetDay);
              item.push(...nextData);
            } else {
              addSite(item, afterOffsetDay, "push");
            }
          }
        };

        for (let index = 0; index < buildMonthData.length; index++) {
          const item = buildMonthData[index];
          const nextItem = buildMonthData[index + 1];
          const beforeOffsetDay = dayNums.indexOf(item[0].offsetDay);
          // const len = item.length
          // if (len > WEEK_NUM || len < WEEK_NUM) {
          beforeOffsetDay && addSite(item, beforeOffsetDay);
          const afterOffsetDay =
            WEEK_NUM - (dayNums.indexOf(item[item.length - 1].offsetDay) + 1);
          afterOffsetDay && switchSite(item, nextItem, afterOffsetDay);
          const nums = Math.ceil(item.length / WEEK_NUM);
          for (let k = 1; k < nums; k++) {
            ++index;
            setBuildMonthDataRow(item, index);
          }
          // } else if (len === WEEK_NUM && beforeOffsetDay) {
          //   addSite(item, beforeOffsetDay)
          //   const afterOffsetDay = WEEK_NUM * 2 - item.length
          //   if (afterOffsetDay) {
          //     switchSite(item, nextItem, afterOffsetDay)
          //   }
          //   ++index
          //   setBuildMonthDataRow(item, index)
          // }
        }
      }
      this.weekData = weekData;
      this.buildMonthData = buildMonthData;
      this.updateHeight();
    },
    getIsAbove(item, attr) {
      return this.getIsSelect(item, attr, true);
    },
    getIsAfter(item, attr) {
      return this.getIsSelect(item, attr, false);
    },
    getIsSelect(item, attr, bool) {
      const index = this.monthData.findIndex(
        (day) => day.timestamp === item.timestamp
      );
      if (index !== -1) {
        const item = this.monthData[bool ? index - 1 : index + 1];
        return !item?.[attr];
      }
      return false;
    },
    setMessage(type = "info", content) {
      // this.$message[type](this.$t(content))
      if (this.isMobile) {
        // let mobileElementPanel = data.data.quickType ? document.getElementById('mobileElementPanel') : document.getElementById('mobileParamsPanel')
        let mobileElementPanel = document.getElementById("mobileParamsPanel");
        let confrimToast = this.$createToast({
          type: "warn",
          time: CREATE_TOAST_TIME,
          txt: this.$t(content),
        });
        this.$_insertElement(mobileElementPanel, confrimToast.$el);
        confrimToast.show();
      } else {
        this.$message[type](this.$t(content));
      }
    },
    isSelectMonth() {
      const operationMonthData = this.operationMonthData;
      return (
        operationMonthData.length &&
        operationMonthData.every((item) => item.isSelected)
      );
    },
    updateHeight() {
      if (this.isMobile && this.isShow) {
        if (this.buildMonthData.length === 5) {
          this.$emit("heightChange", 310, this.buildMonthData.length);
        }
        if (this.buildMonthData.length === 6) {
          this.$emit("heightChange", 350, this.buildMonthData.length);
        }
        this.$emit("rowNumChange", this.buildMonthData.length);
        // this.$emit('heightChange', this.$el.clientHeight)
      }
    },
    setSaveSelectData(data, bool) {
      const mapData = classifyYear(data);
      for (let [year, data] of mapData) {
        const tabKey = this.isMobile
          ? this.isCurrent
            ? UNIQUE_SELECT_KEY.CURRENT
            : UNIQUE_SELECT_KEY.PERIOD
          : this.isCurrent
          ? PERIOD.currentPeriod
          : PERIOD.priorPeriod;
          console.log('setSaveSelectData',data,!bool,tabKey, year)
        this.$emit("setSaveSelectData", data, !bool, tabKey, year);
      }
    },
    clickMonth() {
      if (this.isSingle)
        return this.setMessage("warning", "sdp.message.calendarSelection");

      this.setShiftSignStart();
      const bool = this.operationMonthData.every((item) => item.isSelected);
      const weekSelect = this.operationMonthData.every((item) =>
        this.isSelectWk(item.weekCount)
      );
      // 如果是取消则取消范围内所有，防止快选选择到的数据无法清除
      const list = !bool
        ? this.operationMonthData
        : this.monthData.filter((e) => e.isSelected);
      const data = list.map((item) => {
        item.isSelected = !bool;
        return item.timestamp;
      });
      this.setSaveSelectData(data, bool);
    },
    isSelectWk(weeks) {
      const weeksData = this.operationMonthData.filter(
        (item) => item.weekCount === parseInt(weeks)
      );
      return weeksData.length && weeksData.every((item) => item.isSelected);
    },
    isDisabledWk(weeks) {
      const weeksData = this.operationMonthData.filter(
        (item) => item.weekCount === parseInt(weeks)
      );
      return weeksData.length && weeksData.some((item) => !item.isDisabled);
    },
    clickWk(weeks) {
      if (this.isSingle)
        return this.setMessage("warning", "sdp.message.calendarSelection");

      this.setShiftSignStart();
      const weeksData = this.operationMonthData.filter(
        (item) => item.weekCount === parseInt(weeks)
      );
      const bool = weeksData.every((item) => item.isSelected);
      const data = weeksData.map((item) => {
        item.isSelected = !bool;
        return item.timestamp;
      });
      this.setSaveSelectData(data, bool);
    },
    clickDayNames(wk) {
      // 日历中的星期顺序会变化，通过值来匹配数据
      //   let dayNames = [...DAY_NAMES]
      let dayNames = this.isBusiness ? this.dayNames : [...DAY_NAMES];
      let offsetDay = dayNames.findIndex((num) => {
        return num === wk;
      });
      if (this.isSingle)
        return this.setMessage("warning", "sdp.message.calendarSelection");

      this.setShiftSignStart();
      const dayNamesData = this.operationMonthData.filter(
        (item) => item.offsetDay === offsetDay
      );
      const bool = dayNamesData.every((item) => item.isSelected);
      const data = dayNamesData.map((item) => {
        item.isSelected = !bool;
        return item.timestamp;
      });
      this.setSaveSelectData(data, bool);
    },
    setShiftSignStart(timestamp = 0) {
      if (!this.accordingToYear) {
        this.$emit("clearQuickSelect", true);
      }
      this.$emit("update:shiftSignStart", timestamp);
    },
    setShiftSignEnd(timestamp = 0) {
      this.$emit("update:shiftSignEnd", timestamp);
    },
    clickDay(event, { isDisabled, timestamp }) {
      if (isDisabled) return false;

      if (this.shiftKeyActive && this.shiftSignStart && this.shiftSignEnd) {
        if (this.isSingle)
          return this.setMessage("warning", "sdp.message.calendarSelection");

        this.setShiftSignEnd(timestamp);
        this.$emit("shiftClickDay", timestamp);
      } else {
        let curSelMonthData =
          this.operationMonthData.filter((item) => {
            return item.isSelected;
          }) || [];
        let isSelect = this.isSingle && curSelMonthData.length > 1;
        this.operationMonthData.forEach((item) => {
          if (item.timestamp === timestamp) {
            item.isSelected = !item.isSelected;
            let value = timestamp;
            if (item.isSelected) {
              this.shiftSignStartSaveCallStack.push(timestamp);
            } else {
              const shiftSignStartSaveCallStack = [
                ...new Set(
                  this.shiftSignStartSaveCallStack.filter(
                    (value) => timestamp !== value
                  )
                ),
              ];
              this.$emit(
                "update:shiftSignStartSaveCallStack",
                shiftSignStartSaveCallStack
              );

              const len = shiftSignStartSaveCallStack.length;
              value = len && shiftSignStartSaveCallStack[len - 1];
            }
            this.setShiftSignStart(value);
            if (isSelect) {
              item.isSelected = isSelect;
            }
            this.setSaveSelectData([item.timestamp], !item.isSelected);
          }
        });
      }
    },
    mouseoverDay(event, timestamp, isDisabled) {
      if (event.shiftKey && !isDisabled) {
        this.setShiftSignEnd(timestamp);
      }
    },
    mouseoutDay() {
      this.setShiftSignEnd();
    },
  },
};
</script>

<style lang="scss" scoped>
@mixin isCurrent($w, $h) {
  content: "";
  position: absolute;
  border: 1px solid #455964;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  left: 50%;
  top: 50%;
  height: $h;
  line-height: $h;
  width: $w;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.sdp-month-subsidiary-box-app,
.sdp-month-subsidiary-box-pc {
  display: flex;
  flex-direction: column;
  .sdp-month-subsidiary-title {
    margin: 0 auto 4px;
    padding: 0 8px;
    border-radius: 2px;
    border: 1px solid #dadada;
    cursor: pointer;
    border-color: var(--sdp-srk-bks);
    color: var(--sdp-cszjsz-wzs1);
  }
  .firstWeekCount {
    height: 18px;
    line-height: 16px;
    text-align: center;
    padding: 2px;
    white-space: nowrap;
    font-size: 8px;
    font-weight: 400;
    border-radius: 2px;
    position: absolute;
    top: -11px;
    left: -15px;
    z-index: 9999;
  }
}

.sdp-month-subsidiary-box-app {
  .sdp-month-subsidiary-date {
    display: flex;
    flex-direction: row;
    padding: 16px;

    .sdp-month-subsidiary-wk {
      display: flex;
      flex-direction: column;
      font-size: 12px;
      width: 30px;

      .wk {
        width: 21px;
        height: 24px;
        line-height: 24px;
        margin-bottom: 8px;
        /*font-weight: 700;*/
        text-align: center;
        color: #333;

        font-family: Source Han Sans;
        font-size: 12px;
        font-weight: 500;
        letter-spacing: 0em;
      }

      .week-item-wrap {
        /*flex: 1;*/
        display: flex;
        align-content: center;
        min-height: 22px;
      }
      .week-item-wrap-mobile {
        min-height: 40px;
      }

      .wk-item {
        width: 22px;
        height: 22px;
        line-height: 22px;
        cursor: pointer;
        margin-bottom: 8px;
        border-radius: 11px;
        text-align: center;
        font-size: 12px;

        font-family: Source Han Sans, PingFangSC-Medium;
        font-weight: 500;

        color: #555 !important;
        background: #f1f2f4 !important;
      }

      //.wk-item:last-child {
      //  margin-bottom: 0;
      //}
    }

    .sdp-month-subsidiary-day {
      display: flex;
      flex: 1;
      flex-direction: column;

      .sdp-month-subsidiary-day-name {
        display: flex;
        flex-direction: row;
        margin-bottom: 8px;
        white-space: nowrap;

        span {
          flex: 1;
          height: 22px;
          line-height: 22px;
          width: 22px;
          margin-bottom: 2px;
          /*font-weight: 700;*/
          text-align: center;
          padding: 0 5px;
          cursor: pointer;
          color: #333;

          font-family: Source Han Sans;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0em;
        }
      }

      .sdp-month-subsidiary-days {
        display: flex;
        flex: 1;
        flex-direction: row;

        .sdp-month-subsidiary-days-box.isDisabled {
          cursor: not-allowed !important;
          color: var(--sdp-rl-wzjys) !important;
        }
        .sdp-month-subsidiary-single {
          content: "";
          position: absolute;
          display: inline-block;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 9;
        }
        .isStyle {
          background-color: var(--sdp-zs) !important;
          color: var(--sdp-nngl) !important;
        }

        .borderLB {
          border-top-left-radius: 16px;
          border-bottom-left-radius: 16px;
        }

        .borderRB {
          border-top-right-radius: 16px;
          border-bottom-right-radius: 16px;
        }
        .appSelectDays {
          position: absolute;
          top: 0;
          left: 0;
          width: calc(100% + 1px);
          height: 100%;
        }

        .sdp-month-subsidiary-days-box {
          width: 30px;
          height: 30px;
          line-height: 30px;
          margin-bottom: 6px;
          cursor: pointer;
          text-align: center;
          position: relative;
          color: #333;

          font-family: Source Han Sans;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0em;

          &.clearMarginBottom {
            margin-bottom: 0;
          }

          span {
            user-select: none;
          }

          .isCurrent {
            color: #455964;
          }

          .isCurrent:before {
            @include isCurrent(30px, 30px);
          }
        }
      }
    }
  }
  .horizontal-border {
    position: relative;
    height: 100%;
  }
  .horizontal-border::before {
    content: " ";
    position: absolute;
    width: 1px;
    right: 0;
    top: 0;
    border-top: 1px solid #d8d8d8;
    color: #d8d8d8;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    border-color: #d8d8d8 !important;
    z-index: 99;
  }
  .tile-show-style::before,
  .tile-hidden-style::after {
    content: " ";
    position: absolute;
    height: 1px;
    left: -16px;
    top: 0;
    right: 0;
    border-top: 1px solid #d8d8d8;
    color: #d8d8d8;
    transform-origin: 0 0;
    transform: scaleY(0.5);
    border-color: #ffffff;
    z-index: 99;
  }
  .tile-show-style::before {
    left: 0;
    right: 16px;
    bottom: 0;
  }
  .tile-hidden-style::after {
    top: 0;
  }
  .isSelectCurrent {
    color: var(--sdp-nngl) !important;
    background: var(--sdp-bg-rl-current) !important;
  }
  .isSelectPriorPeriod {
    color: var(--sdp-nngl) !important;
    background: var(--sdp-bg-rl-period) !important;
  }
}
.sdp-month-subsidiary-box-pc {
  .sdp-month-subsidiary-date {
    display: flex;
    flex-direction: row;
    padding: 8px;
    max-height: 400px;
    overflow-y: overlay;
    font-size: 12px;
    .sdp-month-subsidiary-wk {
      display: flex;
      flex-direction: column;
      font-size: 12px;

      .wk {
        width: 21px;
        height: 20px;
        line-height: 20px;
        margin-bottom: 2px;
        font-weight: 700;
        text-align: center;
        color: var(--sdp-rl-wzjys);
      }

      .week-item-wrap {
        display: flex;
        align-content: center;
        min-height: 22px;
      }

      .week-item-wrap-mobile {
        min-height: 40px;
      }

      .wk-item {
        width: 18px;
        height: 18px;
        line-height: 18px;
        cursor: pointer;
        margin-bottom: 4px;
        border-radius: 50%;
        text-align: center;
        /*font-family: Source Han Sans, PingFangSC-Medium;*/
        font-family: PingFangSC-Medium;
        font-size: 12px;
        color: var(--sdp-cszjsz-wzs1);
        background-color: var(--sdp-zxz-nns);

        /*font-weight: 500;*/
        /*letter-spacing: 0em;*/
      }

      .wk-item:last-child {
        margin-bottom: 0;
      }
    }

    .sdp-month-subsidiary-day {
      display: block;
      /*display: flex;*/
      flex: 1;
      flex-direction: column;
      justify-content: space-around;

      .sdp-month-subsidiary-day-name {
        display: flex;
        flex: 1;
        flex-direction: row;
        white-space: nowrap;

        span {
          flex: 1;
          height: 20px;
          line-height: 20px;
          margin-bottom: 2px;
          font-weight: 700;
          text-align: center;
          padding: 0 5px;
          cursor: pointer;
          color: var(--sdp-cszjsz-wzs1);
        }
      }

      .sdp-month-subsidiary-days {
        display: flex;
        flex: 1;
        flex-direction: row;

        .sdp-month-subsidiary-days-box.isDisabled {
          cursor: not-allowed !important;
          color: var(--sdp-rl-wzjys) !important;
        }

        .sdp-month-subsidiary-single {
          content: "";
          position: absolute;
          display: inline-block;
          width: 100%;
          height: 18px;
          left: 50%;
          top: 50%;
          border-radius: 4px;
          transform: translate(-50%, -50%);
          z-index: 9;
        }

        .isStyle {
          background-color: var(--sdp-zs) !important;
          color: var(--sdp-nngl) !important;
        }

        .borderLB {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }

        .borderRB {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        .appSelectDays {
          position: absolute;
          top: 0;
          left: 0;
          width: calc(100% + 1px);
          height: 100%;
        }
        .sdp-month-subsidiary-days-box {
          line-height: 18px;
          margin-bottom: 4px;
          cursor: pointer;
          text-align: center;
          position: relative;
          color: var(--sdp-cszjsz-wzs1);

          &.clearMarginBottom {
            margin-bottom: 0;
          }

          span {
            user-select: none;
          }

          .isCurrent:before {
            @include isCurrent(20px, 20px);
          }
        }
      }
    }
  }
  .isSelectCurrent {
    color: var(--sdp-nngl) !important;
    background-color: var(--sdp-bg-rl-current) !important;
  }

  .isSelectPriorPeriod {
    color: var(--sdp-nngl) !important;
    background-color: var(--sdp-bg-rl-period) !important;
  }
  ::v-deep .cube-scroll-wrapper {
    box-shadow: -1px -1px 2px 1px rgba(18, 46, 85, 0.02),
      1px 1px 1px 1px rgba(18, 46, 85, 0.06);
    border-radius: 4px;
    background-color: var(--sdp-fs1);
  }
}

.isSelectCurrentText {
  color: var(--sdp-nngl);
}

.isSelectPriorPeriodText {
  color: var(--sdp-nngl);
}
.wkCenter {
  display: flex;
  align-items: center;
}

.sdp-quick-checkbox {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0px;
  width: calc(100% - 32px);
  margin: 0 auto;
  position: relative;
  color: #333333;
  font-family: NotoSansHans-Regular;
  &:after {
    content: " ";
    position: absolute;
    height: 1px;
    top: 0;
    left: 0;
    right: 0;
    border-top: 1px solid #d8d8d8;
    color: #d8d8d8;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    border-color: var(--sdp-color-CSZJFGX);
    z-index: 99;
  }
  ::v-deep .el-checkbox {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    .el-checkbox__label {
      padding-right: 10px;
    }
  }
  ::v-deep .el-checkbox__label {
    font-size: 12px;
    color: var(--sdp-cszjsz-wzs1) !important;
  }
  ::v-deep .el-checkbox__inner:not(.is-checked) {
    // background-color: var(--sdp-cszjdx0) !important;
    // border: 1px solid var(--sdp-cszjdxbk) !important;
  }
  ::v-deep .is-checked .el-checkbox__inner {
    background-color: var(--sdp-cszjdxtc) !important;
    border-color: var(--sdp-cszjdxtc) !important;
  }
  ::v-deep .is-checked .el-checkbox__inner::after {
    border-color: var(--sdp-cszjdxg) !important;
  }
  ::v-deep .el-checkbox__input .el-checkbox__inner:hover {
    border-color: #606266;
  }
  ::v-deep .el-checkbox__input .el-checkbox__inner:focus {
    border-color: #606266;
  }
}

::v-deep .cube-scroll-wrapper {
  position: relative;
  height: 100%;
  overflow: hidden
} 
</style>
