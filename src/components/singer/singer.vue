<template>
  <div class="singer" ref="singer">
   <list-view :data='singers' @select="selectSinger" ref="list"></list-view>
   <router-view/>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import ListView from 'base/listview/listview'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

  export default {
    data() {
      return {
        singers: []
      }
    },
    mixins:[playlistMixin],
    components:{
      ListView
    },
    created() {
      this._getSingerList()
    },
    methods:{
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.list.refresh()
      },
      _getSingerList() {
        getSingerList().then((res) => {   
          if(res.code === ERR_OK) {
            this.singers = this._normalizeSinger(res.data.list)
          }
        })
      },
      //筛选歌手列表，分成按热门和首字母的对象
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items:[]
          }
        }
        list.forEach((item,index) => {
          if(index < HOT_SINGER_LEN) {
            //对象可以使用map.hot  或者map['hot']获取，如果是变量，只能map[hot]获取里面的数据
            map['hot'].items.push(
              new Singer({
                id: item.Fsinger_mid,
                name: item.Fsinger_name
              })
            )
          }
          const key = item.Findex
          if(!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(
            new Singer({
                id: item.Fsinger_mid,
                name: item.Fsinger_name
              }))
        })
        //  为了得到有序列表，我们需要处理map
        let hot = []
        let ret = []
        for(let key in map) {
          let val = map[key]
          if(val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          }else if(val.title === HOT_NAME) {
            hot.push(val)
          }
        }
        ret.sort((a,b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
        console.log(map)
      },

      selectSinger(singer) {
        this.$router.push({
          path:`/singer/${singer.id}`
        })
        //传递参数，相当于this.$store.commit('SET_SINGER',singer)
        this.setSinger(singer)
      },
      ...mapMutations({
        //映射setSinger为this.$store.commit('SET_SINGER')
        setSinger:'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    .singer
      position: fixed
      top: 88px
      bottom: 0
      width: 100%
</style>
