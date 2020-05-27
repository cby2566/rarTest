<template>
  <div class="btnList">
      <button @click="selectFile">选择文件夹</button>
      <button @click="reset">重置</button>
      <span></span>
      <button @click="openNew">提取链接</button>
      <button @click="rename">重命名压缩包</button>
      <router-link to="/foo">文件列表</router-link>
      <router-link to="/bar">搜索</router-link>
  </div>
</template>

<script>

import event from '../uilt/event.js';

export default {
  data () {
    return {
      
    }
  },
  created() {

  },
  mounted(){
    
  },
  methods: {
    selectFile(){
        ipcRenderer.send('getFileDirName', 'openWindos');
    },
    openNew(){
        event.$emit('getUrl',function(url){
            ipcRenderer.send('openNewWin', url);
        })
    },
    rename(){
      event.$emit('getUrl',function(url){
          console.log('重命名文件',url)
          ipcRenderer.send('rename', url[0]);
          
      })
    },
    reset(){
        event.$emit('reset-list','')
    }
  }
}
</script>

<style lang="scss">
.btnList{
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;;
    /deep/ .el-button{
        min-width: 100px;
    }
    /deep/ .el-button+.el-button{
      margin: 0;
    }
}
</style>