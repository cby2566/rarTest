<template>
  <div>
      <div>
          模糊查询
        <input type="text" v-model="data">
        <select v-model="selected">
            <option disabled value="">请选择</option>
            <option v-for="(v,i) in initList" :key="v" :value="i">
                {{v}}
            </option>
        </select>
        <span>{{ selected }}</span>
      </div>
      <div>
          <input type="button" value="搜索" @click="search">
      </div>
  </div>
</template>

<script>
import event from '../uilt/event.js';

export default {
   data() {
      return {
          data:'',
          selected:'',
          initList:{
              author_arr:'作者其他名称',
              origin_name:'原生名称',
              url:'绝对路径'
          }
      };
    },
  created() {

  },
  mounted(){
      ipcRenderer.on('likeSelectResult', (event, message) =>{
        console.log(message)
    });
  },
  destroyed(){

  },
  methods: {
    search(){
        console.log(this.data,this.selected) 
        ipcRenderer.send('likeSelect', {value:this.data,factor:this.selected});
    }
  }
}
</script>

<style lang="scss">

</style>