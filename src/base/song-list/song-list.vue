<template>
  <div class="song-list">
      <ul>
          <li @click="selectItem(song,index)" v-for="(song,index) in songs" class="item" :key="index">
              <div class="rank" v-show="rank">
                <span :class="getRankCls(index)">{{getRankText(index)}}</span>
              </div>
              <div class="content">
                  <h2 class="name">{{song.name}}</h2>
                  <p class="desc">{{getDesc(song)}}</p>
              </div>
          </li>
      </ul>
  </div>
</template>

<script>

export default {
    props: {
        songs: {
            type: Array,
            default: []
        },
        rank:{
          type:Boolean,
          default:false
        }
    },
    methods: {
        getDesc(song) {
            return `${song.singer}。${song.album}`
        },
        selectItem(item,index) {
          this.$emit('select',item,index)
        },
        getRankCls(index) {
          if(index <=2) {
            return `icon icon${index}`
          }
        },
        getRankText(index) {
          if(index > 2) {
            return index + 1
          }
        }
    }
}
</script>

<style  scoped lang='stylus' rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"
  .song-list
    .item
      display :flex
      align-items :center
      box-sizing :border-box
      height :64px
      font-size :$font-size-medium
      .rank
        flex: 0 0 25px
        widows 25px
        margin-right 30px
        text-align center
        .icon
          display inline-block
          width 25px
          height 24px
          background-size 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
          .text
            color $color-theme
            font-size $font-size-large
      .content
        flex: 1
        .name
          font-size :14px
          margin-bottom :8px
        .desc
          font-size :12px
          color :rgba(255,255,255,0.3)
      
</style>