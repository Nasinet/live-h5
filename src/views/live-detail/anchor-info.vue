<template>
  <scroll clickable class="anchor-info" :is-finished="isFinished" @scrollToEnd="scrollToEnd" ref="scroll">
    <div class="anchor">
      <img :src="anchor.avatar || $store.state.defaultAvatar" alt="">
      <div class="info">
        <h6>{{ anchor.nick_name }} <img class="vip" :src="medals[anchor.vip_level]" alt=""> <img class="level" :src="anchorLevel[anchor.anchor_level]" alt=""></h6>
        <p>
<!--          <img v-if="anchor.profile.gender" src="./boy@2x.png" alt="">-->
<!--          <img v-else src="./girl@2x.png" alt="">-->
          <span>房间号:{{ anchor.id }}</span>
        </p>
      </div>
      <div @click="$emit('focus')" class="focus" v-if="false">{{ anchor.isattent ? '已关注' : '关注' }}</div>
    </div>
    <div class="sign">{{ anchor.profile.signature }}</div>

    <post-item v-for="item in list" :key="item.id" @liked="liked" :post="item" />
  </scroll>
</template>

<script>
import Scroll from '../../components/scroll/scroll'
import PostItem from '../../components/post-item/post-item'
import levelIcon, { anchorLevel } from '../../common/js/level-icon'
import { post } from '../../common/js/http'

export default {
  name: 'anchor-info',
  components: {
    Scroll,
    PostItem
  },
  props: {
    anchor: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      levelIcon,
      anchorLevel,
      medals: [require('../../components/message/youxia@2x.png'), require('../../components/message/qishi@2x.png'), require('../../components/message/gongjue@2x.png'), require('../../components/message/king@2x.png')],
      list: [],
      isFinished: true,
      page: 1
    }
  },
  created() {
    this.getList()
  },
  methods: {
    liked({ data, index }) {
      this.$set(this.list, index, {
        ...this.list[index],
        liked: true,
        ...data
      })
    },
    scrollToEnd() {
      if (this.loading) return
      this.loading = true
      this.page++
      this.getList(true)
    },
    getList() {
      post('/api/Moment/getListByUser', {
        authorid: this.anchor.id,
        page: this.page,
        size: 10,
        hideLoading: this.page > 1
      })
        .then(({ data: { data } }) => {
          this.list = this.list.concat(data)
          this.isFinished = data.length < 10
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
            this.loading = false
          })
        })
    }
  }
}
</script>

<style scoped lang="stylus">
.anchor-info
  height 100%
  box-sizing border-box
  background #fff
  .anchor
    padding 0 30px
    display flex
    align-items center
    margin-top 39px
    &>img
      margin-right 24px
      width 90px
      height 90px
      border-radius 50%
    .info
      flex 1
      &>h6
        margin-bottom 13px
        display flex
        align-items center
        font-size 32px
        color #000000
        .vip
          margin 0 13px
          width 45px
        .level
          width 42px
          height 26px
      &>p
        display flex
        align-items center
        font-size 26px
        color #A3A6AB
        &>img
          margin-right 14px
          width 27px
          height 27px
    .focus
      width 111px
      height 53px
      line-height 53px
      font-size 26px
      color #FFFFFF
      text-align center
      border-radius 27px
      background linear-gradient(61deg, #DA81FF, #AC74FF)
  .sign
    margin 0 30px
    margin-bottom 55px
    height 68px
    padding 0 27px
    margin-top 31px
    line-height 68px
    background #F4F5F7
    font-size 26px
    color #7E8595
</style>
