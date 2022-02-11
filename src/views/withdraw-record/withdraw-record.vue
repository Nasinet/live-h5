<template>
  <div class="withdraw-record" style="padding-top: 44px;">
    <back-header title="提现记录" />
    <scroll clickable ref="scroll" :is-finished="isFinished" @scrollToEnd="scrollToEnd">
      <div class="record" v-for="item in list" :key="item.id">
        <h4>{{ item.create_time }} <img :src="statusIcon[item.status]" alt=""></h4>
        <p>申请提现：¥{{ item.cash }}</p>
        <p>收款支付宝：{{ item.alipay_account }}</p>
        <p>转账单号：{{ item.trade_no }}</p>
      </div>
    </scroll>
  </div>
</template>

<script>
import BackHeader from '../../components/back-header/back-header'
import Scroll from '../../components/scroll/scroll'
import { post } from '../../common/js/http'

export default {
  name: 'withdraw-record',
  components: {
    BackHeader,
    Scroll
  },
  data() {
    return {
      page: 1,
      list: [],
      statusIcon: [
        require('./dengdaichuli@2x.png'),
        require('./yiwancheng@2x.png'),
        require('./yibohui@2x.png'),
        require('./yichang@2x.png')
      ],
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
    getList() {
      post('/api/withdraw/withdrawlog', { page: this.page, size: 20, hideLoading: this.page > 1 })
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
.withdraw-record
  height 100%
  background #F4F4F4
  box-sizing border-box
  .record
    margin 17px 30px
    padding 0 26px
    padding-bottom 20px
    background #fff
    overflow hidden
    &>h4
      display flex
      justify-content space-between
      align-items center
      margin-top 16px
      margin-bottom 24px
      font-size 24px
      color #969696
      &>img
        width 97px
        height 46px
    &>p
      line-height 60px
      font-size 28px
      color #333333
</style>
