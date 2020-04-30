<template>
  <div class="cList">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
  </div>
</template>

<script>
import event from '../uilt/event.js';

export default {
   data() {
      return {
        // data: [{
        //   label: '一级 1',
        //   children: [{ label: '二级 1-1'},{ label: '二级 1-1'},{ label: '二级 1-1'}]
        // }],
        data:[],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dirUrl:''
      };
    },
  created() {
    ipcRenderer.on('fileDirName', (event, message) =>{
        console.log(message)
        this.dirUrl = message.dir
        this.updataTree(message.dir,message.list);
    });
  },
  mounted(){
    event.$on('reset-list',this.reset)
    event.$on('getUrl',(ev)=>{
        if(!this.dirUrl) return;
        ev(this.dirUrl[0]);
    })
  },
  destroyed(){
    // ipcRenderer.removeListener('fileDirName');
    event.$off('reset-list',this.reset)
  },
  methods: {
      handleNodeClick(data) {
        console.log(data);
      },
      updataTree(dir,list){
        this.data = [];
        let arr = []
        for(let i = 0; i < list.length; i++){
            arr.push({label:list[i]})
        }
        if(dir){
            this.data.push({label:dir,children:arr}); 
        }else{
            this.data.sort();
        }
      },
      reset(){
          this.updataTree('',[]);
      }
  }
}
</script>

<style lang="scss">
.cList{
    overflow: scroll;
    height: 100%;
}
</style>