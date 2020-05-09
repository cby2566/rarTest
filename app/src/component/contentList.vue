<template>
  <div class="cList">
    <div class="dirName">
      {{dirUrl}}
    </div>
    <!-- <div v-for="(v,i) in dirList" :key="i">
      {{v}}
    </div> -->
    <div>
      删除所选目录
      <input type="button" value="批量删除" @click="anyDelete">
    </div>
    <div>
      <p>
        待遍历文件夹:
      </p>
      <input type="button" value="添加目录" @click="addOriginUrl">
      <input type="button" value="重置目录" @click="OriginUrlDelete">
      <input type="button" value="遍历目录" @click="OriginUrlMap">
      <div v-for="(v,i) in originUrlArr" :key="i">
        {{v}}
      </div>
    </div>

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
        dirUrl:'',
        dirList:[],
        originUrlArr:[],
        fileTo: require('../uilt/ftlToRAR')
      };
    },
  created() {
    ipcRenderer.on('fileDirName', (event, message) =>{
        console.log(message)
        this.dirUrl = message.dir
        this.dirList = message.list
    });
  },
  mounted(){
    event.$on('reset-list',this.reset)
    event.$on('getUrl',(ev)=>{
        if(!this.dirUrl) return;
        ev(this.dirUrl);
    })
  },
  destroyed(){
    // ipcRenderer.removeListener('fileDirName');
    event.$off('reset-list',this.reset)
  },
  methods: {
      reset(){
          this.dirUrl = ''
          this.dirList= ''
      },
      anyDelete(){
        if(this.dirList.length){
          ipcRenderer.send('anyDelete', this.dirList);
        }
      },
      addOriginUrl(){
        if(this.dirUrl.length){
            this.originUrlArr.push(...this.dirUrl)
            this.dirUrl = ''
        }
      },
      OriginUrlDelete(){
        if(this.originUrlArr.length){
          this.originUrlArr = [];
          this.originUrlArr.sort()
        }
      },
      async OriginUrlMap(){
        var fileTo = this.fileTo;
        if(!this.originUrlArr.length) return;
        let values = []
        for(let i of this.originUrlArr){
            for(let j of await this.acc(i)){
                let {authorName, authorArr, bizName, originName, tagNameArr, noMosaic,translatedGroup, url ,pages} = j;
                let valuesArr = [authorName, authorArr, bizName, originName, tagNameArr, noMosaic,translatedGroup, url, pages];
                valuesArr = valuesArr.map((item) => {
                    return item&&item.toString();
                });
                values.push(valuesArr)
            }
        }
        let keys = ['author','author_arr','biz_name','origin_name','other','mosaic','translated_group','url','pages']

        fileTo.insertSql(keys,values,'src_table')
      },
      async acc(url){
        var fsPromise = fs.promises;
        var fileTo = this.fileTo;
        let arr = []
        let i = await fileTo.readAllFileName2(fsPromise,url,true,arr,function(dirUrl,list){
            return {...fileTo.longName(dirUrl), pages : list.length}
          })
        console.log(arr.length)
        return arr;
      }
  }
}
</script>

<style lang="scss">
.cList{
    overflow: scroll;
    height: 100%;
}
.dirName{
  font-size: 20px;
  font-weight: 600;
}
</style>