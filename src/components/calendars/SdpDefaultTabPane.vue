<template>
  <div
    class="sdp-default-tab-pane-box"
    :class="{ 'not-particular-tab': !isParticular }"
  >
    <calendar-subsidiary
      v-model:curYear="curYear"
      :curSelTileQuick="curSelTileQuick"
      :userSetting="userSetting"
      :isCurrent="isCurrent"
      :currentDate="currentDate"
      :dateData="dateData"
      :saveSelectData="saveSelectData"
      :isSingle="calendarSelection"
      :lastYear="lastYear"
      :offsetDay="offsetDay"
      @change="changeSubsidiaryData"
    />
    <div class="sdp-default-tab-pane-select">
      <year-switch
        ref="yearSwitch"
        :userSetting="userSetting"
        v-model:curYear="curYear"
        @change="handleYearSwitch"
      />
      <select-data-component
        class="select-data-component"
        :userSetting="userSetting"
        v-model:isCurrent="isCurrent"
        :selectData="transformData"
        :isShowPriorPeriod="isShowPriorPeriod"
        :types="Object.keys(transformData)"
        :activeTabsData="userSetting.particularData"
        :calendarSelectList="calendarYearList"
        @tabClick="tabClick"
        @clear="clearTransformData"
        @change="changeTransformData"
        @handGetPriorDate="handGetPriorDate"
        @changeCompareType="(key) => changeCompareType('particularData', key)"
      />
      <!-- <calendarSwitchBtn
        v-if="userSetting.particularData.customDateComparison"
        :isShowPriorPeriod="isShowPriorPeriod"
        @change="
          (val) => {
            if (
              calendarSelection &&
              flatten(Object.values(saveSelectData)).length > 1
            ) {
              $message['warning']($t('sdp.message.calendarSelection'));
              return;
            }
            changeShowPriorPeriod(!val);
          }
        "
      /> -->
    </div>

    <div class="foot-btn">
      <el-button @click="handleConfirm"> 确定</el-button>
      <el-button @click="handleClose"> 取消</el-button>
    </div>
  </div>
</template>

<script>
import calendarSubsidiary from "./calendarSubsidiary/index.vue";
import yearSwitch from "./yearSwitch.vue";
import selectDataComponent from "./selectDataComponent.vue";
import calendarSwitchBtn from "./calendarSwitchBtn/index.vue";
import { deepClone, flatten } from "./globalTools";
import {
  computePrior,
  dateFormats,
  dateFormatter,
  getIsScatteredType,
  getTimestamp,
  getYearData,
  safariCompliant,
  timestampToTime,
  timeToTimestamps,
  transformShowData,
} from "./utils";
import {
  CALENDARTYPE,
  COMPARE_TYPE,
  DATE_CONST,
  DayTime,
  PERIOD,
  QUICK_CONST,
  quickBusinessType,
  RESTORE_TYPE,
  TYPE_LIST,
} from "./constants";
import tab_pane_mixins from "./tab_pane_mixins";

export default {
  name: "SdpDefaultTabPane",
  inject: ["utils"],
  provide() {
    return {
      recentYears: this.recentYears
    }
  },
  mixins: [tab_pane_mixins],
  componentName: TYPE_LIST.default,
  components: {
    calendarSubsidiary,
    yearSwitch,
    selectDataComponent,
    calendarSwitchBtn,
  },
  props: {
    paramElement: {
      type: Object,
      default: () => ({
        type: "bussinessCalendar",
        content: {
          injectConditionParameter: [],
          rule: "natural",
          default: true,
          userSetting: {
            accordingToYear: false,
            priorPeriod: true,
            compareAlisa: "Prior Period",
            compareType: ["month-on-month"],
            isQuickLabel: false,
            isQuick: false,
            comparePriType: ["Year-on-Year", "Custom"],
            comparePriYearSingle: true,
            isParticular: false,
            typeList: ["default", "Year", "Month", "Week", "Interval", "Event"],
            particularData: {
              range: ["all"],
              currentDate: false,
              calendarSelection: false,
              customDateComparison: true,
              futureCalendar: true,
              selComparePriType: "Year-on-Year",
              selCustomYear: [],
            },
            defaultData: {
              isDefault: false,
              isSelectDefaultHMS: false,
              lastNDays: 7,
              nextNDays: 15,
              futureCalendar: true,
              selComparePriType: "Year-on-Year",
              selCustomYear: [],
            },
            IS_ADD_NEXT_YEAR: true,
            IS_ADD_LOSS_YEAR: true,
          },
          currentDate: true,
          selectType: "default",
          quick: false,
          calendarshow: false,
          defaultValue: "Yesterday",
          comparetype: ["none"],
          range: "all",
          priorPeriod: true,
          customDateComparison: false,
          isSelectHMS: true,
          isSelectIntervalHMS: true,
          typeList: ["default", "Year", "Month", "Interval"],
          handSelect: "default",
          isYearSingle: true,
          isMonthSingle: true,
          isDefault: true,
          isYear: false,
          isMonth: false,
          isInterval: false,
        },
      }),
    },
    calendarType: {
      type: String,
      default: quickBusinessType,
    },
    nowStr: {
      type: String,
      default: "2025-01-10 10:24:00",
    },
  },
  computed: {
    userSetting() {
      return this.paramElement.content.userSetting;
    },

    saveSelectData() {
      return this.selectData[this.curKey];
    },
    curKey() {
      return this.isCurrent ? PERIOD.currentPeriod : PERIOD.priorPeriod;
    },
    futureCalendar() {
      return this.userSetting.particularData.futureCalendar;
    },
    range() {
      return this.userSetting.particularData.range;
    },
    currentDate() {
      return this.userSetting.particularData.currentDate;
    },
    calendarSelection() {
      return this.userSetting.particularData.calendarSelection;
    },
    accordingToYear: {
      get() {
        return this.userSetting.accordingToYear;
      },
      set(val) {
        this.userSetting.accordingToYear = val;
      },
    },
    dateFormat() {
      return "yyyy-MM-dd";
    },
    weekType() {
      return "0";
    },
    curSelTileQuick() {
      return this.isSelectQuick ? DATE_CONST.CustomDatePeriod : "";
    },
    lastYear() {
      const nowYear = Number(this.nowYear);
      // if (
      //   this.futureCalendar ||
      //   this.userSelectData.quickClauses === "Next Year"
      // ) {
      //   return nowYear + 1;
      // }
      return nowYear + 100;
    },
    offsetDay() {
      return 0;
    },
    selCustomYear() {
      return this.userSetting.particularData?.selCustomYear;
    },
    calendarYearList() {
      let list = dateFormats(this.lastYear);
      let nowYearValue = new Date().getFullYear();
      list.forEach(
        (item) =>
          (item["show"] = item.value > Number(nowYearValue) - this.recentYears)
      );
      return list;
    },
    selComparePriType() {
      return this.userSetting.particularData.selComparePriType;
    },
  },
  watch: {
    offsetDay() {
      this.setDateData(this.curYear);
    },
    curYear(val) {
      this.setDateData(val);
    },
    selCustomYear(val) {
      this.changeCurrent();
    },
    "userSetting.particularData.selComparePriType"() {
      if (this.isCurrent) return;
      this.changeCurrent();
    },
    isCurrent() {
      this.changeCurrent();
    },
  },
  data() {
    const initYear = new Date().getFullYear();
    return {
      PERIOD,
      defaultData: deepClone(this.paramElement.content.userSetting.defaultData),
      // 是否选择的是快选还是明细
      isSelectQuick: true,
      // 存储日历快选数据
      // clausesPeriodMap: null,
      userSelectData: {},

      curYear: initYear,
      nowYear: initYear,
      isCurrent: true,
      selectData: {
        [PERIOD.currentPeriod]: {},
        [PERIOD.priorPeriod]: {},
      },
      transformData: {
        [PERIOD.currentPeriod]: [],
        [PERIOD.priorPeriod]: [],
      },
      dateData: [],
      isShowPriorPeriod: false,
      maxCurrentYear: 0,
      compareDiffYear: 1,
      // curSelTileQuick: '',
      recentYears: Infinity
    };
  },
  created() {
    // this.setDateData(this.nowYear)
    this.changeCurrent();
  },
  methods: {
    // 确认前的校验
    valueCheck() {
      const isCustomYear = this.selComparePriType === COMPARE_TYPE.customOnYear;
      const isSelCustomYear =
        this.selCustomYear && this.selCustomYear.length > 1;
      const isExceedingYear =
        Object.keys(this.selectData[PERIOD.currentPeriod]).length > 1;

      if (isCustomYear && isSelCustomYear && isExceedingYear) {
        return {
          pass: false,
          message: this.$t("sdp.message.CustomDontOverYear"),
        };
      }

      return { pass: true };
    },
    emitUserSelectData() {
      let data = null;
      if (this.isSelectQuick) {
        // 是否快选
        data = this.userSelectData;
      } else {
        const transformData = (data) => {
          if (this.accordingToYear) {
            return flatten(Object.keys(data));
          }
          return flatten(Object.values(data)).map((timestamp) =>
            this.$_formatDate(new Date(timestamp))
          );
        };
        const currentList = transformData(
          this.selectData[PERIOD.currentPeriod]
        ).sort();
        const priorList = transformData(
          this.selectData[PERIOD.priorPeriod]
        ).sort();
        data = Object.assign(
          {
            currentList,
            priorList,
            comparePriType: this.selComparePriType,
            isShowPriorPeriod: this.isShowPriorPeriod,
            calendarCompType: this.accordingToYear
              ? CALENDARTYPE.Year
              : CALENDARTYPE.default,
            isSelectQuick: false,
          },
          this.getIsScatteredType(currentList, priorList),
          this.getMessage(currentList, priorList)
        );
      }

      return Object.assign(data, {
        activeYear: this.curYear,
        isCurrent: this.isCurrent,
      });
    },
    getIsScatteredType(currentList, priorList) {
      return getIsScatteredType(
        {
          currentList,
          priorList,
          selectData: this.selectData[PERIOD.currentPeriod],
        },
        this.accordingToYear ? TYPE_LIST.Year : TYPE_LIST.default
      );
    },
    // 点击快选
    changeQuick(
      res,
      quickClauses,
      message = "",
      includeToday = false,
      includeTodayHistory = []
    ) {
      this.accordingToYear = false;

      const callback = (curYear, data = []) => {
        this.clearSaveSelectData(PERIOD.currentPeriod);
        data.length &&
          this.setSaveSelectData(data, true, PERIOD.currentPeriod, curYear);
        this.changeShowPriorPeriod(false);
        this.setDateData(curYear);
        this.isSelectQuick = true;
        this.isCurrent = true;
        // 重置触发回调
        this.callbackInitDefault();
      };

      if (!quickClauses) {
        this.userSelectData = {
          clausesPeriodMap: res,
          quickClauses,
          calendarCompType: CALENDARTYPE.default,
          isSelectQuick: true,
          message,
          includeToday,
          includeTodayHistory,
        };
        callback(this.curYear);
        return;
      }
      const isCustomDatePeriod = quickClauses === DATE_CONST.CustomDatePeriod;
      this.userSelectData = isCustomDatePeriod
        ? Object.assign(
            {
              currentList: res.current,
              priorList: res.period,
              calendarCompType: CALENDARTYPE.Interval,
              isSelectQuick: true,
              quickClauses,
              includeToday,
              includeTodayHistory,
            },
            getIsScatteredType(
              {
                currentList: res.current,
                priorList: res.period,
              },
              TYPE_LIST.Interval
            )
          )
        : {
            clausesPeriodMap: res,
            quickClauses,
            includeToday,
            includeTodayHistory,
            calendarCompType: CALENDARTYPE.default,
            isSelectQuick: true,
            message,
          };

      // 没有res数据
      if (!isCustomDatePeriod && !res) {
        callback(this.curYear);
        return;
      }
      const { startDate, endDate } = isCustomDatePeriod
        ? {
            startDate: res.current[0].split(" ")[0],
            endDate: res.current[1].split(" ")[0],
          }
        : res[QUICK_CONST.this_period_key];
      const [startYear] = startDate.split("-");
      const [endYear] = endDate.split("-");
      let data = [];
      const yearData = {};
      if (startYear === endYear) {
        // 不跨年
        data = timeToTimestamps({ startDate, endDate });
      } else {
        // 跨年
        const diff = Number(endYear) - Number(startYear);
        for (let i = 0; i <= diff; i++) {
          const year = Number(startYear) + i;
          let start = i === 0 ? startDate : `${year}-01-01`;
          let end = i === diff ? endDate : `${year}-12-31`;

          yearData[year] = timeToTimestamps({ startDate: start, endDate: end });
        }
        data = yearData[endYear];
      }
      this.curYear = Number(endYear);
      callback(this.curYear, data);
      Object.entries(yearData).forEach(([key, val]) => {
        if (key !== endYear) {
          this.setSaveSelectData(val, true, PERIOD.currentPeriod, key);
          // 解决选中问题
          this.isSelectQuick = true;
        }
      });
    },
    changeShowPriorPeriod(bool) {
      this.isShowPriorPeriod = bool;
      const comparePriType =
        this.userSetting?.comparePriType?.[0] || COMPARE_TYPE.yearOnYear;
      // 点击显示自定义
      if (bool) {
        this.isSelectQuick = false;
        this.handGetPriorDate();
      } else {
        this.clearSaveSelectData(PERIOD.priorPeriod);
        this.isCurrent = true;
      }
    },
    changeCurrent() {
      let selComparePriType = this.selComparePriType;
      if (
        !this.isCurrent &&
        selComparePriType === COMPARE_TYPE.customOnYear &&
        Array.isArray(this.selCustomYear) &&
        this.selCustomYear.length
      ) {
        this.getCompareDiffYear();
        this.curYear = Math.max(...this.selCustomYear);
        this.setDateData(this.curYear);
        return;
      }
      const years = Object.keys(this.saveSelectData);
      if (this.accordingToYear) {
        this.$nextTick(() => {
          const yearSwitch = this.$refs.yearSwitch;
          const year = years[0];
          if (year) {
            this.curYear = Number(year);
            this.setDateData(year);
            yearSwitch.toYear = +year;
          }
        });
      } else {
        const len = years.length;
        if (len) this.curYear = Number(years[len - 1]);
        this.setDateData(this.curYear);
      }
    },
    getCompareDiffYear() {
      const currentList = this.selectData[PERIOD.currentPeriod];
      const yearList = Object.keys(currentList).sort((a, b) => b - a);
      this.maxCurrentYear = yearList?.[0] || 0;

      const selComparePriType = this.selComparePriType;
      let priYear =
        selComparePriType === COMPARE_TYPE.customOnYear && this.selCustomYear
          ? this.selCustomYear
          : 0;
      this.compareDiffYear =
        priYear && yearList.length ? Number(this.maxCurrentYear - priYear) : 1;
    },
    customOnYearFun(list) {
      const currentList = this.selectData[PERIOD.currentPeriod];
      const yearList = Object.keys(currentList).sort((a, b) => b - a);
      this.maxCurrentYear = yearList?.[0] || 0;

      list.forEach((year) => {
        const compareDiffYear =
          year && yearList.length ? Number(this.maxCurrentYear - year) : 1;
        Object.entries(this.selectData[PERIOD.currentPeriod]).forEach(
          ([curYear, data]) => {
            let priYear = Number(curYear - compareDiffYear);
            this.setPriorSelectData(data, true, curYear, priYear);
          }
        );
      });
    },
    handGetPriorDate(
      type = this.selComparePriType,
      yearList = this.selCustomYear
    ) {
      if (type === COMPARE_TYPE.custom) return;
      if (type === COMPARE_TYPE.customOnYear && yearList.length) {
        this.customOnYearFun(yearList);
      } else {
        this.getCompareDiffYear();
        Object.entries(this.selectData[PERIOD.currentPeriod]).forEach(
          ([curYear, data]) => {
            let priYear = Number(curYear - this.compareDiffYear);
            this.setPriorSelectData(data, true, curYear, priYear);
          }
        );
      }
    },
    // 设置明细选择的数据
    setDateData(year) {
      this.dateData = getYearData({
        year,
        offset: this.offsetDay,
        isOpenFuture: true,
        range: this.range,
        selectData: this.accordingToYear ? [] : this.saveSelectData[year] || [],
        currentDate: this.currentDate || this.futureCalendar,
        isAllDisabled: this.accordingToYear,
        weekType: this.weekType,
      });
    },

    handleYearSwitch(val, curKey = this.curKey, init = false) {
      if (
        !init &&
        this.accordingToYear &&
        this.selComparePriType !== COMPARE_TYPE.customOnYear
      ) {
        this.changeCompareType("particularData", PERIOD.priorPeriod);
      }
      this.clearSaveSelectData(curKey);
      this.setSaveSelectData([+new Date(val + "")], true, curKey, val);
    },
    handleCustomYearCompare(valList, curKey = this.curKey) {
      this.clearSaveSelectData(curKey);
      valList.forEach((year) => {
        this.setSaveSelectData([+new Date(year + "")], true, curKey, year);
      });
    },
    getPriorSelectData({ data, isAdd, curYear, priYear }) {
      // 解决本期2-28和2-29日（2-28和2-29都是影响上期3-1日）同时选择取消其中一个，不应该取消上期2-29日
      if (!isAdd) {
        const yearData = this.selectData[PERIOD.currentPeriod][curYear];
        const times = yearData.filter((item) => {
          const time = timestampToTime(item);
          return time === `${curYear}-02-28` || time === `${curYear}-02-29`;
        });
        if (
          times.length === 2 &&
          !times.every((item) => data.includes(item)) &&
          times.some((item) => data.includes(item))
        ) {
          data = data.filter((item) => !times.includes(item));
          if (!data.length) return;
        }
      }
      return computePrior(data, curYear, priYear);
    },
    // 计算上期
    setPriorSelectData(data, isAdd, curYear, priYear = curYear - 1) {
      const selComparePriType = this.selComparePriType;
      if (this.getFinanicalPriorSelectData) {
        this.getFinanicalPriorSelectData({ data, isAdd, curYear });
      } else {
        if (
          selComparePriType === COMPARE_TYPE.customOnYear &&
          !this.selCustomYear.length
        )
          return;
        const { priorData, preYear } = this.getPriorSelectData({
          data,
          isAdd,
          curYear,
          priYear,
        });
        this.setSaveSelectData(priorData, isAdd, PERIOD.priorPeriod, preYear);
      }
    },
    changeCompareType(type = "particularData", key) {
      if (
        (type === "particularData" &&
          this.isShowPriorPeriod &&
          key === PERIOD.priorPeriod) ||
        type === "defaultData"
      ) {
        this.$emit("changeCompareType", type);
      }
    },
    changeSubsidiaryData(
      data,
      isAdd,
      key = this.curKey,
      curYear = this.curYear
    ) {
      console.log('changeSubsidiaryData', data, isAdd, key, curYear)
      if (this.calendarSelection) {
        this.clearSaveSelectData(key);
      }
      this.changeCompareType("particularData", key);
      this.setSaveSelectData(data, isAdd, key, curYear);
    },
    getYearCompareDate(curYear = this.curYear) {
      if (this.calendarType === quickBusinessType) {
        this.clearTransformData(PERIOD.priorPeriod);
        this.handGetPriorDate();
      }
    },
    clearSaveSelectData(key) {
      const selectData = this.selectData[key];
      for (const year in selectData) {
        if (selectData[year].length) {
          this.setSaveSelectData(selectData[year], false, key, year);
        }
      }
    },
    setSaveSelectData(data, isAdd, key = this.curKey, curYear = this.curYear) {
      if (!data.length) return;
      this.isSelectQuick = false;

      const saveSelectYearData = this.selectData[key][curYear] || [];
      if (isAdd) {
        this.selectData[key][curYear] = [
          ...new Set([...saveSelectYearData, ...data]),
        ];
      } else {
        const arr = saveSelectYearData.filter((item) => !data.includes(item));
        if (arr.length) {
          this.selectData[key][curYear] = arr;
        } else {
          delete this.selectData[key][curYear];
        }
      }
      const flattenData = flatten(Object.values(this.selectData[key]));
      this.setTransformData(flattenData, key);
      if (
        key === PERIOD.currentPeriod &&
        this.isShowPriorPeriod &&
        !this.accordingToYear
      ) {
        this.getYearCompareDate(curYear);
      }
    },
    setTransformData(data, key = this.curKey) {
      this.transformData[key] = transformShowData(
        data,
        this.calendarType,
        this.accordingToYear ? "yyyy" : this.dateFormat
      );
    },
    tabClick(key, item) {
      const time = Math.max(...item.data);
      this.curYear = new Date(time).getFullYear();
    },
    changeTransformData(key, item) {
      this.changeCompareType("particularData", key);
      const years = [
        ...new Set(item.data.map((data) => new Date(data).getFullYear())),
      ];
      years.forEach((year) => {
        this.setSaveSelectData(item.data, false, key, year);
      });

      this.setDateData(this.curYear);
    },
    clearTransformData(key) {
      this.clearSaveSelectData(key);

      this.setDateData(this.curYear);

      if (
        this.selComparePriType === COMPARE_TYPE.customOnYear &&
        key === PERIOD.currentPeriod
      ) {
        this.clearTransformData(PERIOD.priorPeriod);
      }
    },
    // 还原零散数据
    reSetUserScattered(key, data = []) {
      this.accordingToYear = false;
      const transformTime = (list) => {
        return list.reduce((pre, time) => {
          const date = new Date(`${safariCompliant(time)} 00:00:00`);
          const year = date.getFullYear();
          const data = pre[year];
          if (data) {
            pre[year] = [...data, getTimestamp(date)];
            return pre;
          }
          pre[year] = [getTimestamp(date)];
          return pre;
        }, {});
      };
      this.selectData[key] = transformTime(data);
      const flattenData = flatten(Object.values(this.selectData[key]));
      this.setTransformData(flattenData, key);
    },
    // 还原区间数据
    reSetUserInterval(dateForm) {
      this.$nextTick(() => {
        const quick = this.$refs.quick;
        quick.dateForm = dateForm;
        quick.isShowPeriod = !!dateForm.period.length;
        quick.setQuickDataSelect(DATE_CONST.CustomDatePeriod);
      });
      this.changeQuick(dateForm, DATE_CONST.CustomDatePeriod);
    },
    setMaxYear(data) {
      const maxYear = Math.max(...Object.keys(data).map((e) => +e));
      this.curYear = maxYear === -Infinity ? this.nowYear : maxYear;
    },
    // 用户操作
    [RESTORE_TYPE.reSetUserHandle](data) {
      const {
        isSelectQuick,
        quickClauses = "",
        priorList = [],
        currentList = [],
        calendarCompType,
        activeYear = "",
        isCurrent = true,
      } = data;
      this.isCurrent = true;
      this.isSelectQuick = isSelectQuick;
      this.isShowPriorPeriod = !!priorList.length;

      if (isSelectQuick) {
        // 处理区间
        if (calendarCompType === CALENDARTYPE.Interval) {
          this.reSetUserInterval({
            current: currentList,
            period: priorList,
          });
          return void "没有异步处理函数";
        }
        // 快选
        return this[RESTORE_TYPE.reSetDefault]({ defaultValue: quickClauses });
      }

      const { currentPeriod, priorPeriod } = PERIOD;
      // this.isCurrent = isCurrent
      switch (calendarCompType) {
        // 零散
        case CALENDARTYPE.default:
          this.reSetUserScattered(currentPeriod, currentList);
          if (priorList.length) {
            this.isShowPriorPeriod = true;
            this.reSetUserScattered(priorPeriod, priorList);
          } else {
            this.clearSaveSelectData(priorPeriod);
          }
          if (activeYear) {
            this.curYear = activeYear;
          } else {
            this.setMaxYear(this.selectData[currentPeriod]);
          }
          break;
        // 按年
        case CALENDARTYPE.Year:
          const year = currentList[0] || "";
          this.accordingToYear = true;
          if (year) {
            this.handleYearSwitch(year, currentPeriod, true);
            if (priorList.length) {
              this.isShowPriorPeriod = true;
              priorList.length > 1
                ? this.handleCustomYearCompare(priorList, priorPeriod)
                : this.handleYearSwitch(priorList[0], priorPeriod, true);
            }
          }
          // 回写yearSwitch组件里的值
          this.$nextTick(() => {
            this.$refs.yearSwitch.toYear = year;
          });
          break;
      }
      // this.setDateData(this.curYear)
      this.changeCurrent();
      return void "没有异步处理函数";
    },
    // 恢复默认值
    [RESTORE_TYPE.reSetDefault](data) {
      this.isCurrent = true;

      // 零散
      const { currentPeriod } = PERIOD;
      // 财务日历没有默认值 不要设置默认值（判断数据）
      this.reSetUserScattered(currentPeriod, [
        this.$_formatDate(new Date(new Date().getTime() - DayTime)),
      ]);
      this.changeShowPriorPeriod(false);
      this.isSelectQuick = false;
      // this.setDateData(this.nowYear)
      this.changeCurrent();
    },

    handleConfirm() {
      this.$emit("confirm", this.saveSelectData, this.transformData.currentPeriod);
    },
    handleClose() {
      this.$emit("close", this.saveSelectData);
    }
  },
};
</script>

<style lang="scss" scoped>
@use "./variable.scss";
.sdp-default-tab-pane-box {
  min-width: 320px;
  display: flex;
  flex-direction: row;
  padding: 12px 16px 16px 8px;
  .sdp-line {
    width: 1px;
    background-color: var(--sdp-ycfgx);
  }
  .sdp-default-tab-pane-select {
    width: 210px;
    display: flex;
    flex-direction: column;
  }
  .select-data-component {
    margin-top: 8px;
  }
}
.not-particular-tab {
  max-height: 600px;
  padding-bottom: 75px !important;
}
.not-particular-tab::before {
  content: "";
  display: inline-block;
  border-bottom: 1px solid #d8d8d8;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 65px;
  transform-origin: 0 0;
  transform: scaleY(0.5);
}

.foot-btn{
  position: absolute;
  bottom: 16px;
  right: 32px;
}
</style>
