<template>
    <div>
      <button @click="shuffleItems">随机排序</button>
      <transition-group tag="ul" class="list" move-class="move">
        <li v-for="item in items" :key="item" class="list-item">
          {{ item }}
        </li>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const items = ref([1, 2, 3, 4, 5])
  
  const shuffleItems = () => {
    items.value = items.value.sort(() => Math.random() - 0.5)
  }
  </script>
  
  <style scoped>
  .list {
    padding: 0;
  }
  
  .list-item {
    list-style: none;
    padding: 10px;
    margin: 5px;
    background: lightblue;
    border-radius: 5px;
    text-align: center;
  }
  
  .move {
    transition: transform 0.5s;
  }
  </style>
  