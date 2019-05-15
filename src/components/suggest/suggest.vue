<template>
  <scroll class="suggest" 
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item,index) in result" 
      :key="index" @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show='hasMore' title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import Singer from 'common/js/singer'
  import NoResult from 'base/no-result/no-result'
  import {getSong} from 'api/singer'
  import {mapMutations,mapActions} from 'vuex'


  const TYPE_SINGER = 'singer'
  const perpage = 20

  export default {
    props: {
      query: {
        type: String,
        default: ''
      },
      showSinger: {
        type: Boolean,
        default: true
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    },
    data() {
      return {
        page: 1,
        result: [],
        pullup: true,
        beforeScroll: true,
        hasMore: true
      }
    },
    methods: {
      search() {
        this.page = 1
        this.$refs.suggest.scrollTo(0,0)
        this.hasMore = true
          search(this.query,this.page,this.showSinger,perpage).then((res) => {
            if(res.code === ERR_OK) {
              this._getResult(res.data).then((rets) => {
                this.result = rets
                console.log(this.result)
              })
              this._checkMore(res.data)
            }
          })   
      },
      searchMore() {
        if(!this.hasMore) {
          return
        }
        this.page++
        search(this.query,this.page,this.showSinger,perpage).then((res) => {
            if(res.code === ERR_OK) {
              this._getResult(res.data).then((rets) => {
                rets.splice(0,1)
                this.result = this.result.concat(rets)
              })
              this._checkMore(res.data)
            }
          })
      },
      getIconCls(item) {
        if(item.type === TYPE_SINGER) {
          return 'icon-mine'
        }else {
          return 'icon-music'
        }
      },
      getDisplayName(item) {
        if(item.type === TYPE_SINGER) {
          return item.singername
        }else{
          return `${item.name}-${item.singer}`
        }
      },
      selectItem(item) {
        if(item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        }else {
          this.insertSong(item)
        }
        this.$emit('select')
      },
      listScroll() {
        this.$emit('listScroll')
      },
      refresh() {
        this.$refs.suggest.refresh()
      },
      _checkMore(data) {
        const song = data.song
        if(!song.list.length || (song.curnum + song.curoage * perpage) >= song.totalnum) {
          this.hasMore = false
        }
      },
      _getResult(data) {
        let rets = []
        if (data.zhida && data.zhida.singerid) {
          rets.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
          // ret = ret.concat(this._normalizeSongs(data.song.list))
          return new Promise((resolve,reject) => {
            this._normalizeSongs(data.song.list).then((ret) => {
            rets = rets.concat(ret)
            resolve(rets)
          })
          })
        }
        return ret
      },
      _normalizeSongs(list) {
        let ret = []
        return new Promise((resolve,reject) => {
          for(let i = 0;i < list.length; i++) {
            if (list[i].songid && list[i].albummid) {
              getSong(list[i].songmid).then((res) => {
                let purl = res.req_0.data.midurlinfo[0].purl
                let sip = res.req_0.data.sip[0]
                let url = sip+purl
                ret.push(createSong(list[i],url))
                if(list.length === ret.length) {
                  resolve(ret)
                }
              })
            }
          }
        })
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ]) 
    },
    watch: {
      query() {
        this.search()
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>