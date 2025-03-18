<script setup>
import dayjs from "dayjs";
import { ref, computed, nextTick, watch } from "vue";
import { ClickOutside as vClickoutside } from "element-plus";
import antv from "./components/antvx6/index.vue";
import treeTransfer from "./components/treeTransfer/index.vue";
// import tableDraggable from './components/vueDraggable/table.vue'
// import tableDraggable from './components/vueDraggable/table2.vue'
// import tableDraggable from './components/vueDraggable/table3.vue'
// import tableDraggable from './components/vueDraggable/table4.vue'
import calendars from "./components/calendars/SdpDefaultTabPane.vue";
const visible = ref(false);
const calendarsRef = ref(null);

const confirm = (val) => {
  for (let key in val) {
    val[key].forEach((timestamp) => {
      console.log(dayjs(timestamp).format("YYYY-MM-DD"));
    });
  }
  visible.value = false;
};

const close = (val) => {
  calendarsRef.value?.clearTransformData("currentPeriod");
  visible.value = false;
};

const data = [
  "2025-06-10",
  "2025-06-15",
  "2025-04-10",
  "2025-04-11",
  "2025-04-12",
  "2025-04-13",
];

watch(visible, (val) => {
  if (val) {
    setTimeout(() => {
      let startYear = dayjs().year();
      data.forEach((item) => {
        let Year = item.split("-")[0];
        calendarsRef.value?.changeSubsidiaryData(
          [dayjs(item).valueOf()],
          true,
          "currentPeriod",
          Year
        );
      });
      calendarsRef.value?.setDateData(startYear);
    }, 100);
  }
});
</script>

<template>
  <el-popover
    ref="popoverRef"
    placement="top-start"
    :visible="visible"
    :width="1075"
    trigger="click"
    popper-class="calendars-popover"
  >
    <template #reference>
      <el-button class="m-2" @click="visible = !visible"
        >Open Calendars</el-button
      >
    </template>
    <template #default>
      <calendars ref="calendarsRef" @confirm="confirm" @close="close" />
    </template>
  </el-popover>
</template>

<style>
.calendars-popover {
  padding: 0 !important;
}
</style>
