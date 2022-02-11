<template>
  <div class="post-select" @click="$emit('close')">
    <img @click="$emit('close')" class="close" src="./ic_send_pre@2x.png" alt="">
    <div class="box">
      <div class="item" @click="$router.push('/send/1')" to="/send/1">
        <img src="./ic_dongtai@2x.png" alt="">
        <span>写动态</span>
      </div>
      <div class="item" @click="$router.push('/send/2')" to="/send/2">
        <img src="./ic_pic@2x.png" alt="">
        <span>图片</span>
      </div>
      <div class="item" @click="$router.push('/send/3')" to="/send/3">
        <img src="./ic_vedio1@2x.png" alt="">
        <span>视频</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'post-select'
}
</script>

<style scoped lang="stylus">
.post-select
  position fixed
  left 0
  top 0
  width 100%
  height 100%
  background rgba(0, 0, 0, 0.2)
  z-index 100
  .close
    width 43px
    height 43px
    position absolute
    right 31px
    top 22px
  .box
    position absolute
    right 27px
    top 103px
    width 224px
    height 318px
    text-align center
    background #fff
    border-radius 25px
    .item
      display flex
      justify-content center
      align-items center
      line-height 106px
      font-size 30px
      color #343434
      &>img
        margin-right 16px
        width 44px
        height 44px
</style>
