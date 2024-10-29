<template>
    <!-- dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="标题"
      width="800"
      style="max-height: 80%"
    >
      <tree-transfer
        :dataAll="dataAll"
        :checkedIds="checkedIds"
        :titles="titles"
        @changeChecked="changeChecked"
      />
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogVisible = false">
            保存
          </el-button>
        </div>
      </template>
    </el-dialog>
  </template>
  <script setup>
  import { ref, defineExpose, onMounted } from "vue";
  import TreeTransfer from "./TreeTransfer.vue";
  
  const checkedIds = ref([]);
  const titles = ref(["左标题", "右标题"]);
  const dataAll = ref([
    { id: 100, label: "Level one 100" },
    {
      id: 1,
      label: "Level one 1",
      children: [
        {
          id: 4,
          label: "Level two 1-1",
          children: [
            {
              id: 14,
              label: "Level three 1-1-1",
            },
            {
              id: 10,
              label: "Level three 1-1-2",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      label: "Level one 2",
      children: [
        {
          id: 5,
          label: "Level two 2-1",
        },
        {
          id: 6,
          label: "Level two 2-2",
        },
      ],
    },
    {
      id: 3,
      label: "Level one 3",
      children: [
        {
          id: 7,
          label: "Level two 3-1",
        },
        {
          id: 8,
          label: "Level two 3-2",
        },
      ],
    },
    {
      id: 9,
      label: "Level one 4",
      children: [
        {
          id: 12,
          label: "Level two 4-1",
        },
        {
          id: 13,
          label: "Level two 4-2",
        },
      ],
    },
  ]);
  
  const dialogVisible = ref(true);
  const openDia = () => {
    dialogVisible.value = true;
  };
  
  //改变选中项
  const changeChecked = (val) => {
    console.log("选中项：", val);
  };
  
  onMounted(() => {
    checkedIds.value = [5, 6];
  });
  defineExpose({
    openDia,
  });
  </script>
  <style></style>
  