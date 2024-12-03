<template>
    <el-button @click="start">start</el-button>
    <el-button @click="pause">pause</el-button>
    <el-button @click="disabled = true">disabled</el-button>
    <div class="flex">
      <VueDraggable
        ref="el"
        v-model="list"
        :disabled="disabled"
        :animation="150"
        ghostClass="ghost"
        class="flex flex-col gap-2 p-4 w-300px h-300px m-auto bg-gray-500/5 rounded"
        @start="onStart"
        @update="onUpdate"
        @end="onEnd"
      >
        <div
          v-for="item in list"
          :key="item.id"
          class="cursor-move h-30 bg-gray-500/5 rounded p-3"
        >
          {{ item.name }}
        </div>
      </VueDraggable>
      <preview-list :list="list" />
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import {
    VueDraggable
  } from 'vue-draggable-plus'
  const list = ref([
    {
      name: 'Joao',
      id: 1
    },
    {
      name: 'Jean',
      id: 2
    },
    {
      name: 'Johanna',
      id: 3
    },
    {
      name: 'Juan',
      id: 4
    }
  ])
  
  const el = ref()
  const disabled = ref(false)
  function pause() {
    el.value?.pause()
  }
  
  function start() {
    el.value?.start()
  }
  
  const onStart = (e) => {
    console.log('start', e)
  }
  
  const onEnd = (e) => {
    console.log('onEnd', e)
  }
  
  const onUpdate = () => {
    console.log('update')
  }
  </script>
  
  <style scoped>
  .ghost {
    opacity: 0.5;
    background: #c8ebfb;
  }
  </style>
  