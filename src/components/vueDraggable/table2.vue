<template>
    <div>
        <VueDraggable target="tbody" v-model="tableData" :animation="150" @start="onStart" @end="onEnd">
            <el-table :data="tableData" style="width: 100%; margin-bottom: 20px" row-key="id" border default-expand-all>
                <el-table-column prop="date" label="Date" sortable />
                <el-table-column prop="name" label="Name" sortable />
                <el-table-column prop="address" label="Address" sortable />
            </el-table>
        </VueDraggable>

        {{ tableData }}
    </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { VueDraggable, DraggableEvent } from "vue-draggable-plus";
interface User {
    id: number
    date: string
    name: string
    address: string
    hasChildren?: boolean
    children?: User[]
}

const list = computed({
    get: () => tableData,
    set: value => tableData = value
})

let tableData: User[] = [
    {
        id: 1,
        date: '2016-05-02',
        name: 'kasey',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        id: 2,
        date: '2016-05-04',
        name: 'lender',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        id: 3,
        date: '2016-05-01',
        name: 'wangxiaohu',
        address: 'No. 189, Grove St, Los Angeles',
        children: [
            {
                id: 31,
                date: '2016-05-01',
                name: 'jochen',
                address: 'No. 189, Grove St, Los Angeles',
            },
            {
                id: 32,
                date: '2016-05-01',
                name: 'joking',
                address: 'No. 189, Grove St, Los Angeles',
            },
        ],
    },
    {
        id: 4,
        date: '2016-05-03',
        name: 'jori',
        address: 'No. 189, Grove St, Los Angeles',
    },
]

function onStart(event: DraggableEvent) {
    console.log('开始拖拽', event)
}

function onEnd(event: DraggableEvent) {
    console.log('拖拽结束', event)
}
</script>