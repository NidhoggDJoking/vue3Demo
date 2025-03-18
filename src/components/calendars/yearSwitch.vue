<template>
  <div class="sdp-year-switch-box">
    <el-select v-model="selectYear" :popper-class="`belongto-paramsarea `">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        v-show="
          item.value > Number(nowYearValue) - recentYears &&
          item.value >= minShowYear
        "
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { dateFormats, dateFormatter } from "./utils";
import { DATE_YEAR } from "./constants";

export default {
  name: "yearSwitch",
  inject: ["nowStr", "recentYears", "getCurrentThemeClass"],
  props: {
    userSetting: {
      type: Object,
    },
    curYear: {
      type: Number,
    },
    lastYear: {
      type: Number,
    },
    minYear: {
      type: Number,
    },
    showAccordingYear: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      options: [],
      nowYear: new Date().getFullYear(),
      toYear: new Date().getFullYear(),
    };
  },
  watch: {
    accordingToYear(val) {
      if (val) {
        this.toYear = this.year;
      }
    },
    year: {
      handler(val) {
        this.options = dateFormats(this.lastYear || val);
      },
      immediate: true,
    },
  },
  computed: {
    minShowYear() {
      return this.minYear || DATE_YEAR;
    },
    selectYear: {
      get() {
        return this.accordingToYear ? this.toYear : this.curYear;
      },
      set(val) {
        val = Number(val);
        this.$emit("update:curYear", val);
        if (this.accordingToYear) {
          this.toYear = val;
          this.$emit("change", val);
        }
      },
    },
    // 明细未来日期
    futureCalendar() {
      return this.userSetting.particularData.futureCalendar;
    },
    accordingToYear() {
      return this.userSetting.accordingToYear;
    },
    nowYearValue() {
      return new Date().getFullYear();
    },
    year() {
      const nowYear = Number(this.nowYear);
      if (this.futureCalendar) {
        return nowYear + 1;
      }
      return nowYear;
    },
  },
};
</script>

<style lang="scss" scoped>
@use "./variable.scss";
.sdp-year-switch-box {
  display: flex;
  flex-direction: column;
  .checkbox-style {
    width: 50px;
    height: 22px;
    line-height: 22px;
    color: #333333;
    font-family: NotoSansHans-Regular;
    margin-bottom: 4px;
    ::v-deep .el-checkbox__label {
      font-size: 12px;
      color: var(--sdp-cszjsz-wzs1) !important;
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
}
</style>
