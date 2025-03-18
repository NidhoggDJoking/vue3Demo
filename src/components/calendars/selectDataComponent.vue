<template>
  <div class="sdp-select-data-box" :style="{ height: height + 'px' }">
    <div
      :class="{
        'period-container': true,
        active: isCurrent && isShowPriorPeriod,
      }"
      @click="$emit('update:isCurrent', true)"
      :style="{ height: contentHeight + 'px' }"
    >
      <div class="title">
        <span class="txt">{{ $t("sdp.views.presentPeriod") }}</span>
        <span class="clear" @click="handleClear(types[0], true)">{{
          $t("sdp.views.clear")
        }}</span>
      </div>
      <el-scrollbar v-sdp-el-scrollbar="themeParameters" ref="scrollbar">
        <div class="content">
          <span
            class="el-tag el-tag--small el-tag--light"
            v-for="item in currentPeriodData"
            :key="item.label"
            :title="item.label"
            @click="handleClick(types[0], item)"
            :style="{ width: tagWidth }"
            closable
          >
            {{ item.label }}
            
            <el-icon @click.stop="handleClose(types[0], item)"><Close /></el-icon>
          </span>
        </div>
      </el-scrollbar>
    </div>

    <div
      :class="{ 'period-container': true, active: !isCurrent }"
      v-if="isShowPriorPeriod"
      @click="$emit('update:isCurrent', false)"
      :style="{ marginTop: interval + 'px', height: contentHeight + 'px' }"
    >
      <div class="title">
        <span class="txt">{{ $t("sdp.views.priorPeriod") }}</span>
        <span class="clear" @click="handleClear(types[1], true)">{{
          $t("sdp.views.clear")
        }}</span>
      </div>
      <el-scrollbar v-sdp-el-scrollbar="themeParameters">
        <div class="content">
          <span
            class="el-tag el-tag--small el-tag--light"
            v-for="item in priorPeriodData"
            :key="item.label"
            :title="item.label"
            @click="handleClick(types[0], item)"
            :style="{ width: tagWidth }"
            closable
          >
            {{ item.label }}
            <i
              class="el-tag__close"
              @click.stop="handleClose(types[1], item)"
            >
            <Close /></i>
          </span>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import SdpElScrollbar from "./v-el-scrollbar.js";
import recentYearMixin from "./recentYearMixin.js";
import { Close } from "@element-plus/icons-vue";
import { COMPARE_TYPE } from "./constants.js";

export default {
  name: "selectDataComponent",
  directives: {
    SdpElScrollbar,
  },
  components: {
    Close
  },
  mixins: [recentYearMixin],
  props: {
    userSetting: {
      type: Object,
    },
    themeParameters: {
      type: Object,
      default: () => ({}),
    },
    activeTabsData: {
      type: Object,
    },
    height: {
      type: [Number, String],
      default: 406,
    },
    interval: {
      type: [Number, String],
      default: 6,
    },
    isCurrent: {
      type: Boolean,
      default: true,
    },
    isEvent: {
      type: Boolean,
      default: false,
    },
    isShowPriorPeriod: {
      type: Boolean,
      default: false,
    },
    selectData: {
      type: Object,
      default: () => ({}),
    },
    types: {
      type: Array,
    },
    tagWidth: {
      type: String,
      default: "",
    },
    compareType: {
      type: String,
      default: "",
    },
    compareYear: {
      type: Number,
      default: 2,
    },
    calendarSelectList: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    isCustomCompareShow() {
      return (
        this.userSetting?.isCustomCompare &&
        this.isShowPriorPeriod &&
        !this.isEvent
      );
    },
    isEventCompareShow() {
      if (this.userSetting?.eventData && this.isEvent) {
        const eventData = this.userSetting.eventData;
        return (
          this.isShowPriorPeriod &&
          eventData.isCustom &&
          eventData.comparePriType.length > 1
        );
      }
      return false;
    },
    compareTypeAlias: {
      get() {
        return this.compareType || "";
      },
      set(val) {
        this.$emit("update:compareType", val);
      },
    },
    compareYearAlias: {
      get() {
        return this.compareYear || 2;
      },
      set(val) {
        this.$emit("update:compareYear", val);
      },
    },
    contentHeight() {
      let height = this.height - this.interval;
      if (this.isShowPriorPeriod) {
        if (this.isCustomCompareShow) {
          return (height - 48) / 2;
        }
        if (this.isEventCompareShow) {
          return (height - 32) / 2;
        }
        return height / 2;
      }
      return height;
    },
    currentPeriodData() {
      return this.selectData.currentPeriod;
    },
    priorPeriodData() {
      return this.selectData.priorPeriod;
    },
  },
  watch: {
    contentHeight() {
      this.$nextTick(() => {
        this.$refs.scrollbar.update();
      });
    },
  },
  data() {
    return {};
  },
  methods: {
    handleClear(type, isChangeCompareType = false) {
      this.$emit("clear", type);
      if (isChangeCompareType) {
        if (
          this.activeTabsData.selComparePriType === COMPARE_TYPE.customOnYear
        ) {
          this.activeTabsData['selCustomYear'] = []
          return;
        }
        this.$emit("changeCompareType", type);
      }
    },
    handleClose(type, data) {
      this.$emit("change", type, data);
    },
    handleClick(type, data) {
      this.$emit("tabClick", type, data);
    },
  },
};
</script>

<style lang="scss" scoped>
$titleH: 38px;
.sdp-select-data-box {
  display: flex;
  flex-direction: column;
  .period-container {
    border: 1px solid var(--sdp-cszj-bkfgx);
    &.active {
      border-color: var(--sdp-cszj-onns);
      .title {
        border-color: var(--sdp-cszj-onns);
        color: var(--sdp-cszj-onns);
      }
    }
  }
  > div:not(.compare-content) {
    flex: 1;
    border: 1px solid var(--sdp-cszj-bkfgx);
    .title {
      height: $titleH;
      padding: 0 12px;
      border-bottom: 1px solid var(--sdp-cszj-bkfgx);
      color: var(--sdp-xxbt2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      .txt {
        font-size: 14px;
      }
      .clear {
        font-size: 12px;
        cursor: pointer;
        color: var(--sdp-cszj-tswzs);
      }
    }
    ::v-deep .el-scrollbar {
      height: calc(100% - #{$titleH});
    }
    .content {
      padding: 8px 0 8px 8px;
      ::v-deep .el-tag {
        transition: none;
        cursor: pointer;
        background-color: var(--sdp-fs2);
        color: var(--sdp-cszjsz-wzs1);
        border: none;
        height: 20px;
        line-height: 20px;
        margin-bottom: 4px;
        margin-right: 2px;
        padding: 0 6px;
        font-size: 12px;
        border-radius: 0;

        .el-tag__close {
          right: -1px;
          transform: scale(0.75);
          color: var(--sdp-cszjisc);
          font-size: 12px;
          &:hover {
            color: var(--sdp-cszjisc-hover);
            background-color: transparent;
          }
        }
      }
      ::v-deep .el-tag:last-child {
        margin-right: 0;
      }
    }
  }
}
</style>
