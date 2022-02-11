<template>
  <div class="income" style="padding-top: 44px;">
    <back-header title="收益记录" />
    <ul>
      <li @click="changeTba(0)" :class="{active: active === 0}">礼物收益</li>
      <li @click="changeTba(1)" :class="{active: active === 1}">动态收益</li>
    </ul>
    <scroll class="scroll" ref="scroll" :is-finished="isFinished" @scrollToEnd="scrollToEnd">
      <template v-if="active===0">
        <div class="gift" v-for="item in list" :key="item.id">
          <div class="desc">
            <h6>{{ item.gift.title }}</h6>
            <p>{{ item.create_time }}</p>
          </div>
          <p>{{ item.coin_count }} <img src="./zuanshi@2x.png" alt=""></p>
        </div>
      </template>
      <template v-else>
        <div class="gift" v-for="item in list" :key="item.id">
          <div class="desc">
            <h6>{{ item.content }}</h6>
            <p>{{ item.create_time }}</p>
          </div>
          <p>{{ item.coin_count }} <img src="./zuanshi@2x.png" alt=""></p>
        </div>
      </template>
    </scroll>
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'
import Scroll from '../../components/scroll/scroll'
import { post } from '../../common/js/http'

export default {
  name: 'income',
  components: {
    BackHeader,
    Scroll
  },
  data() {
    return {
      active: 0,
      page: 1,
      list: [],
      isFinished: true
    }
  },
  created() {
    this.getList()
  },
  methods: {
    scrollToEnd() {
      if (this.loading) return
      this.loading = true
      this.page++
      this.getList(true)
    },
    changeTba(tab) {
      if (this.active === tab || this.loading) return
      this.active = tab
      this.page = 1
      this.$refs.scroll.scrollTo([0, 0])
      this.list = []
      this.isFinished = true
      this.getList()
    },
    getList() {
      const url = this.active === 0 ? '/api/User/giftProfit' : '/api/User/momentProfit'
      post(url, { page: this.page, size: 20, hideLoading: this.page > 1 })
        .then(({ data: { data } }) => {
          this.list = this.list.concat(data)
          this.isFinished = data.length < 20
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
  @import "../../common/style/variable.styl"
.income
  height 100%
  box-sizing border-box
  &>ul
    height 79px
    box-sizing border-box
    border-bottom 1px solid #F4F4F4
    display flex
    &>li
      flex 1
      line-height 76px
      font-size 30px
      color #888888
      text-align center
      position relative
      &:after
        position absolute
        left 50%
        transform translateX(-50%)
        bottom 0
        content ' '
        display block
        width 27px
        height 4px
        border-radius 4px
        background transparent
      &.active
        color $theme-color
        &:after
          background $theme-color
  .scroll
    height calc(100% - 76px)
  .gift
    display flex
    padding 0 30px
    height 149px
    align-items center
    border-bottom 1px solid #F4F4F4
    &>p
      display flex
      align-items center
      font-size 30px
      color #000000
      &>img
        margin-left 12px
        width 33px
        height 28px
    .desc
      flex 1
      &>h6
        margin-bottom 23px
        font-size 30px
        color #000000
      &>p
        font-size 24px
        color #969696
</style>
