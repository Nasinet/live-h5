<template>
  <div class="task">
    <div class="head">
      <h1><i @click="$router.back()" class="iconfont icon-back"></i>任务中心</h1>
      <div class="user">
        <img src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3157008819,1956455186&fm=26&gp=0.jpg" alt="">
        <div class="info">
          <h4>大宁宁321</h4>
          <div class="percent">
            <span>LV14</span>
            <div class="progress">
              <div class="active" :style="{width: '50%'}"></div>
            </div>
            <span>LV15</span>
          </div>
          <div class="data-num">
            <span>经验值236</span>
            <img src="./ic_shengji@2x.png" alt="">
            <span>距离升级236</span>
          </div>
        </div>
      </div>
    </div>

    <scroll class="scroll" clickable>
      <div class="task-item" style="background: #F5EDFF;">
        <img src="./login@2x.png" alt="">
        <p>每日登录 <span>+100</span></p>
      </div>
      <div class="task-item" style="background: #EDFFEE;">
        <img src="./bangding@2x.png" alt="">
        <p>绑定手机号 <span>+500</span></p>
      </div>
      <div class="task-item" style="background: #FFF9ED;">
        <img src="./fabu@2x.png" alt="">
        <p>发布动态 <span>+100</span></p>
      </div>
      <div class="task-item" style="background: #EDF9FF">
        <img src="./video@2x.png" alt="">
        <p>发布短视频 <span>+100</span></p>
      </div>
      <div class="task-item" style="background: #FFF2FA">
        <img src="./liwu@2x.png" alt="">
        <p>赠送礼物+消耗金币 <span>*10</span></p>
      </div>
      <div class="task-item" style="background: #FFF6EF">
        <img src="./dongtai@2x.png" alt="">
        <p>解锁动态+消耗金币 <span>*10</span></p>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from '../../components/scroll/scroll'

export default {
  name: 'task',
  components: {
    Scroll
  }
}
</script>

<style scoped lang="stylus">
.task
  height 100%
  .head
    padding-bottom 53px
    background url(./bg@2x.png) center center no-repeat
    background-size cover
    h1
      margin-bottom 76px
      padding-top 30px
      font-size 34px
      color #070707
      text-align center
      position relative
      .iconfont
        position absolute
        left 30px
        font-size 33px
    .user
      padding 0 30px
      display flex
      &>img
        margin-right 30px
        width 104px
        height 104px
        border-radius 50%
      .info
        &>h4
          margin-bottom 26px
          font-size 34px
          color #343434
        .percent
          display flex
          align-items center
          margin-bottom 25px
          &>span
            font-size 20px
            color #9F876C
          .progress
            margin 0 17px
            width 331px
            height 9px
            border-radius 9px
            background #fff
            overflow hidden
            .active
              height 100%
              background #FF9751
        .data-num
          display flex
          align-items center
          &>span
            font-size 22px
            color #9F876C
          &>img
            width 45px
            height 26px
            margin 0 20px
  .scroll
    height calc(100% - 300px)
    margin-top -24px
    background #fff
    border-top-left-radius 20px
    border-top-right-radius 20px
    .task-item
      margin 0 30px
      margin-bottom 25px
      display flex
      height 124px
      align-items center
      box-sizing border-box
      padding-left 30px
      &:first-child
        margin-top 50px
      &>img
        margin-right 30px
        width 74px
        height 74px
      &>p
        font-size 28px
        color #000
        &>span
          color #FF6629
</style>
