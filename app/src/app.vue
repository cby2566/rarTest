<template>
  <div class="apx">
    <h1>{{ msg }}</h1>

    <input type="text" v-model="msg">
    <input type="button" value="bux" @click="func()">
  </div>
</template>

<script>

import getData from './util';

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js'
    }
  },
  created() {
    this.fetchData();
    setTimeout(()=>{
      ipcRenderer.on('fileDirName', function(event, message){
        console.log(message)
      });
    })
    //ipcRenderer.removeListener
  },
  mounted(){
    
  },
  methods: {
     async fetchData() {
      const data = await getData();
      this.msg = data;
    },
    func(){
      console.log(9);
      ipcRenderer.send('getFileDirName', 'openWindos');
    }
  }
}
</script>

<style lang="scss">
.apx {
  font-family: "Avenir", Helvetica, Arial, sans-serif;

  h1 {
    color: green;
  }
}
</style>