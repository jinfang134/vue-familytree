<template>
  <div id="app">
    <FamilyTree :data="data"/>
  </div>
</template>

<script>
import FamilyTree from '../src/FamilyTree.vue'
import data from './data'

export default {
  name: 'App',
  data(){
    return {
      data: data
    }
  },
  components: {
    FamilyTree
  }
}
</script>

<style>
#app {
  color: #2c3e50;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
  text-align: center;
}
</style>
