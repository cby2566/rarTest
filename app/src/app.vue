<template>
  <div class="apx">
    <div class="right">
      <buttonList />
    </div>
    
    <div class="left">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import buttonList from './component/buttonList.vue';
import contentList from './component/contentList.vue';
export default {
  name: 'app',
  components: {
    buttonList,
    contentList
  },
  data () {
    return {
      msg: 'Welcome'
    }
  },
  created() {
    // ipcRenderer.send('getFileDirName', 'openWindos');
      // ipcRenderer.on('fileDirName', function(event, message){
      //   console.log(message,'123')
      // });
    //ipcRenderer.removeListener
    console.log(fs);
    var fsPromise = fs.promises;
    var fileTo = require('../src/uilt/ftlToRAR');
    let originUrl = `G:\\菊姬plus\\ftl\\04-30`
    console.log(fileTo)
    fileTo.readAllFileName(fsPromise,originUrl).then((data)=>{
        console.log(data)
    })
  },
  mounted(){
    
  },
  methods: {
      
  }
}
</script>

<style lang="scss">
.apx {
  height: 100%;
  .right{
    float: left;
    width: 200px;
    // background: red;
    height: 100%;
  }
  .left{
    margin-left: 200px;
    background: rosybrown;
    height: 100%;
  }
}
</style>