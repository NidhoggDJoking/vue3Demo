<template>
  <div class="sdp-calender-subsidiary-box">
    <div class="sdp-calender-subsidiary-switch">
      <div class="sdp-calender-subsidiary-switch-left">
        <span
          :class="{
            disabledDate:
              DATE_YEAR >= curYear ||
              minShowYear >= curYear ||
              curYear - 1 <= Number(nowYearValue) - recentYears,
          }"
          @click="switchYear('minus', DATE_YEAR >= curYear)"
          class="el-icon-d-arrow-left"
        >
          <el-icon><DArrowLeft /></el-icon>
        </span>
        <el-tooltip
          effect="dark"
          :content="$t('sdp.views.PressonShfitTips')"
          placement="top-start"
        >
          <i class="icon icon-sdp-tishi tips-icon"></i>
        </el-tooltip>
      </div>
      <div class="sdp-calender-subsidiary-switch-right">
        <span
          :class="{ disabledDate: lastYear <= curYear }"
          @click="switchYear('add', lastYear <= curYear)"
          class="el-icon-d-arrow-right"
        >
          <el-icon><DArrowRight /></el-icon>
        </span>
      </div>
    </div>
    <div class="month-subsidiary-box">
      <month-subsidiary
        v-for="(monthData, index) of dateData"
        :key="index"
        :dayNames="dayNames"
        :curYear="curYear"
        :currentDate="currentDate"
        :index="index"
        :isCurrent="isCurrent"
        :isSingle="isSingle"
        :monthData="monthData"
        :offsetDay="offsetDay"
        v-model:shiftSignEnd="shiftSignEnd"
        v-model:shiftSignStart="shiftSignStart"
        v-model:shiftSignStartSaveCallStack="shiftSignStartSaveCallStack"
        :curSelTileQuick="$attrs.curSelTileQuick"
        @setSaveSelectData="setSaveSelectData"
        @shiftClickDay="shiftClickDay"
      />
    </div>
  </div>
</template>

<script>
import monthSubsidiary from "./monthSubsidiary.vue";
import { DATE_YEAR, DAY_NAMES, DayTime, PERIOD } from "../constants";
import SdpElScrollbar from "../v-el-scrollbar.js";
import { dateFormatter } from "../utils";
import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
export default {
  name: "calenderSubsidiary",
  inject: ["nowStr", "recentYears"],
  directives: {
    SdpElScrollbar,
  },
  props: {
    themeParameters: {
      type: Object,
    },
    userSetting: {
      type: Object,
    },
    curYear: {
      type: Number,
    },
    // 是否为本期还是上期
    isCurrent: {
      type: Boolean,
      default: true,
    },
    dateData: {
      type: Array,
      default: () => [],
    },
    isSingle: {
      type: Boolean,
      default: false,
    },
    currentDate: {
      type: Boolean,
      default: false,
    },
    lastYear: {
      type: Number,
    },
    minYear: {
      type: Number,
    },
    offsetDay: {
      type: Number,
      default: 0,
    },
  },
  components: {
    monthSubsidiary,
    DArrowLeft,
    DArrowRight,
  },
  computed: {
    minShowYear() {
      return this.minYear || DATE_YEAR;
    },
    nowYearValue() {
      return dateFormatter(this.nowStr).currentYear || new Date().getFullYear();
    },
  },
  data() {
    return {
      DATE_YEAR,
      shiftSignStart: 0,
      shiftSignEnd: 0,
      shiftSignStartSaveCallStack: [],
      dayNames: [...DAY_NAMES],
    };
  },
  watch: {
    offsetDay: {
      handler(val) {
        const cloneData = [...DAY_NAMES];

        cloneData.unshift(...cloneData.splice(val));

        this.dayNames = cloneData;
      },
      immediate: true,
    },
    isCurrent() {
      this.shiftSignStart = 0;
      this.shiftSignEnd = 0;
      this.shiftSignStartSaveCallStack = [];
    },
  },
  methods: {
    setCurYear(year) {
      this.$emit("update:curYear", year);
    },
    switchYear(type, isClick) {
      console.log(
        "switchYear",
        type,
        isClick,
        this.nowYearValue,
        this.recentYears
      );
      if (isClick) return false;
      const year = Number(this.curYear);
      const curYear = type === "add" ? year + 1 : year - 1;
      if (curYear <= Number(this.nowYearValue) - this.recentYears) return false;
      if (curYear < this.minShowYear) return false;
      this.setCurYear(curYear);
    },
    setSaveSelectData(data, isAdd, key, year) {
      if (this.isSingle) {
        this.dateData.forEach((month) => {
          month.forEach((day) => {
            day.isSelected = data.includes(day.timestamp) && !!day.isSelected;
          });
        });
      }
      this.$emit("change", data, isAdd, key, year);
    },
    shiftClickDay(timestamp) {
      let shiftSignEnd = this.shiftSignEnd;
      let shiftSignStart = this.shiftSignStart;
      const selectTime = {};
      if (shiftSignStart < shiftSignEnd) {
        while (shiftSignEnd > shiftSignStart) {
          const year = new Date(shiftSignEnd).getFullYear();
          if (!selectTime[year]) selectTime[year] = [];
          selectTime[year].push(shiftSignEnd);
          shiftSignEnd = shiftSignEnd - DayTime;
        }
      } else {
        while (shiftSignEnd < shiftSignStart) {
          shiftSignStart = shiftSignStart - DayTime;
          const year = new Date(shiftSignStart).getFullYear();
          if (!selectTime[year]) selectTime[year] = [];
          selectTime[year].push(shiftSignStart);
        }
      }
      const selectTimeCur = selectTime[this.curYear] || [];
      const tabKey = this.isCurrent ? PERIOD.currentPeriod : PERIOD.priorPeriod;
      this.dateData.forEach((month) => {
        month.forEach((day) => {
          if (!day.isSelected && selectTimeCur.includes(day.timestamp)) {
            day.isSelected = true;
          }
        });
      });
      Object.entries(selectTime).forEach(([key, value]) => {
        this.setSaveSelectData(value, true, tabKey, key);
      });
      this.shiftSignStart = timestamp;
    },
  },
};
</script>
<style lang="scss" scoped>
@use "../variable.scss";
@media screen and (min-width: 1450px) {
  .sdp-calender-subsidiary-box {
    width: 1078px !important;
  }
}
@media screen and (max-width: 1450px) {
  .sdp-calender-subsidiary-box {
    width: 820px !important;
    height: 580px;
    overflow-y: scroll !important;
  }
  .month-subsidiary-box {
    min-height: 580px;
  }
}

@-moz-document url-prefix() {
  @media screen and (max-width: 1450px) {
    .sdp-calender-subsidiary-box {
      min-width: 840px !important;
      height: 580px;
      overflow-y: scroll;
    }
  }
}

.sdp-calender-subsidiary-box {
  display: flex;
  display: -webkit-box;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 12px;
  position: relative;
  max-width: 1076px;
  margin-right: 10px;
  flex: 1;
  overflow: auto;
  .sdp-calender-subsidiary-switch {
    position: absolute;
    top: 0;
    right: 16px;
    left: 16px;
    font-size: 22px;
    z-index: 2;
    .disabledDate {
      //pointer-events: none;
      cursor: not-allowed !important;
    }
    .sdp-calender-subsidiary-switch-right {
      position: absolute;
      right: 0;
      top: 0;
      display: flex;
      .el-icon-d-arrow-right {
        cursor: pointer;
        color: var(--sdp-cszjsz-wzs1);
      }
    }
    .sdp-calender-subsidiary-switch-left {
      position: absolute;
      left: 0;
      top: 0;
      display: flex;
      flex-direction: row;
      .el-icon-d-arrow-left {
        margin-right: 4px;
        cursor: pointer;
        color: var(--sdp-cszjsz-wzs1);
      }
      .icon-sdp-tishi {
        font-size: 12px;
        line-height: 22px;
      }
    }
  }
  .month-subsidiary-box {
    //margin-top: -14px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-bottom: 10px;
  }
}
</style>
