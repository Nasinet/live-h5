<template>
  <div class="hot-link">
    <router-link class="link" to="/rank/1">
      <img src="./bangdan@2x.png" alt="">
      <p>热门榜单</p>
    </router-link>
    <router-link class="link" to="/rank/2">
      <img src="./fufei@2x.png" alt="">
      <p>付费精选</p>
    </router-link>
    <router-link class="link" to="/user-rank">
      <img src="./redian@2x.png" alt="">
      <p>用户榜单</p>
    </router-link>
    <div class="link" @click="$download()">
      <img src="./qiandao@2x.png" alt="">
      <p>任务中心</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hot-link'
}
</script>

<style scoped lang="stylus">
  .hot-link
    display flex
    padding 0 30px
    justify-content space-between
    margin-bottom 52px
    .link
      text-align center
      width 160px
      height 198px
      border-radius 5px
      &>img
        width 87px
        height 87px
        padding-bottom 17px
        padding-top 37px
      &>p
        font-size 22px
        color #6E7286
      &:nth-child(1)
        background #E3ECFF
      &:nth-child(2)
        background #FFFDE2
      &:nth-child(3)
        background #FEE4EA
      &:nth-child(4)
        background #F2E2FE
</style>
