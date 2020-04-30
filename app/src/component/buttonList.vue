<template>
  <div class="btnList">
      <el-button @click="selectFile">选择文件夹</el-button>
      <span></span>
      <el-button @click="reset">重置</el-button>
      <span></span>
      <el-button @click="openNew">提取链接</el-button>
      <el-button @click="rename">重命名压缩包</el-button>
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
          ipcRenderer.send('rename', url);
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