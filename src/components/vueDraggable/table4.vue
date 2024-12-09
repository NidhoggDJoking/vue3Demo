<!-- https://blog.csdn.net/TZ1284063988/article/details/128201994 -->
<template>
    <el-table :data="menuList" row-key="menuId" :row-class-name="tableClassNmae" :expand-row-keys="expandRowKeys" v-if="showFlag"></el-table>

</template>

<script setup>
import Sortable from 'sortablejs';

import { reactive, ref, onMounted } from "vue";
function tableClassNmae(row){
   return 'id=' + row.row.id + ''
}

// 将树数据转化为平铺数据
function treeToTile(treeData, childKey = 'children') {
  const arr = []
  const expanded = data => {
    if (data && data.length > 0) {
      data.filter(d => d).forEach(e => {
        arr.push(e)
        expanded(e[childKey] || [])
      })
    }
  }
  expanded(treeData)
  return arr
}


let activeRows = reactive([]);
let flag = true;
let expandRowKeys=ref([]) //展开行的id,底下用的是拖拽行的parentId，其实就是应该展开的行
let showFlag=ref([true])
let menuList=ref([]) //表格数据
onMounted(()=>{
  //获取需要添加拖拽的组件
  const el = document.querySelector(".el-table__body-wrapper tbody");
  //设置拖拽的参数
  const ops = {
    animation: 200, //动画时长
    handle: ".el-table__row", //可拖拽区域class
    ghostClass: "ghost", //拖拽位置样式class
    dataIdAttr: "class", //配合row-class-name设置使用
    //拖拽中事件监听
    onMove: ({ dragged, related }) => {
      activeRows = treeToTile(props.tdata) // 把树形的结构转为列表再进行拖拽  
      const oldRow = activeRows[dragged.rowIndex] //旧位置数据
      const newRow = activeRows[related.rowIndex] //被拖拽的新数据
      if (oldRow.parentId !== newRow.parentId) {
        flag = false
      } else {
        flag = true
      }

      return flag
    }, 
   //拖拽后事件监听
    onEnd(evt) {
      activeRows = treeToTile(props.tdata) // 把树形的结构转为列表再进行拖拽  
      const oldRow = activeRows[evt.oldIndex] // 移动的那个元素
      var arr = sortable2.toArray(); //获取排序后的平铺数据顺序
      for (let index = 0; index < arr.length; index++) {
        arr[index] = arr[index].match(/(?<=\bid=)[\d]+/g)[0];
      }
      let aa = activeRows.filter(d => d.parentId != oldRow.parentId).map(d => d.id);
      let bb = (arr.filter(d => aa.indexOf(d) == -1))
    if (evt.oldIndex !== evt.newIndex) {
      if (flag) {
       //调用后台接口传出bb排好序的数组，让后端返回排好的数据，在请求成功的回调里执行如下操作
        showFlag.value=false;  //刷新拖拽后的结构
           nextTick(()=>{
           showFlag.value=true;   //刷新拖拽后的结构
           menuList.value=res.data;  //重新赋值
           expandRowKeys.value=[...e.parentId]  //拖拽后让原有的行展开
       }) 
           expandRowKeys=[...oldRow.parentId] //让选中行展示
       }
      }
    },
  };
  // //初始化拖拽表格
  var sortable2 = Sortable.create(el, ops);
})

</script>