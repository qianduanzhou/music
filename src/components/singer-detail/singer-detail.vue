<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'
  import MusicList from 'components/music-list/music-list'
  import {getSong} from 'api/singer'


  export default {
    computed: {
      title() {
        return this.singer.name
      },
      bgImage() {
        return this.singer.avatar
      },
      //取state中的数据
      ...mapGetters([
        //通过getters中的singer方法取得数据,并添加到this中
        'singer'
      ])
    },
    data() {
      return {
        songs:[]
      }
    },
    created() {
      this._getDetail()
    },
    methods: {
      _getDetail() {
        if(!this.singer.id) {
          this.$router.push({
            path:'/singer'
          })
        }
        getSingerDetail(this.singer.id).then((res) => {
          if(res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if(musicData.songid && musicData.albummid) {
            getSong(musicData.songmid).then((res) => {
            let purl = res.req_0.data.midurlinfo[0].purl
            let sip = res.req_0.data.sip[0]
            let url = sip+purl
            ret.push(createSong(musicData,url))
          })
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slide-enter-active, .slide-leave-active
    transition: all .3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>