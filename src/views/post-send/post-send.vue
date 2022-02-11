<template>
  <div class="post-send">
    <div class="head border-bottom-1px">
      <i @click="$router.back()" class="iconfont icon-back"></i>
      <span>发布</span>
      <div class="send-btn" @click="submit">发布</div>
    </div>
    <!--      <div class="circle">-->
    <!--        <img src="./tittle@2x.png" alt="">-->
    <!--        <span>选择圈子</span>-->
    <!--        <div style="flex: 1;"></div>-->
    <!--        <i class="iconfont icon-right"></i>-->
    <!--      </div>-->
    <textarea @blur="inputBlur" v-model="text" :style="{height: type === 1 ? '60vh' : '4rem'}" rows="3" type="text" placeholder="记录生活，拥抱美好..." />

    <div class="img-list" v-if="type === 2">
      <div class="img" :style="{backgroundImage: `url(${img})`}" v-for="(img, index) in imgs" :key="img">
        <img @click="delImg(index)" src="./ic_delete@2x.png" alt="">
      </div>
      <img @click="clickFile('image')" src="./tianjia@2x.png" alt="">
    </div>

    <div class="video" v-if="type === 3">
      <h6>视频</h6>
      <img v-if="!videoUrl" @click="clickFile('video')" src="./tianjia@2x.png" alt="">
      <div id="video_player" v-else></div>
      <h6>封面</h6>
      <img v-if="!imgs.length" @click="clickFile('image')" src="./tianjia@2x.png" alt="">
      <template v-else>
        <img @click="clickFile('image')" v-for="img in imgs" :key="img" :src="img" alt="">
      </template>
    </div>

    <template v-if="type !== 1">
      <div class="lock" v-if="coin === 0" @click="showMoney=true">
        <img src="./nofufei@2x.png" alt="">
        <p>设置为付费观看动态</p>
      </div>
      <div class="lock-active" v-else @click="showMoney=true">
        <img class="one" src="./fufei@2x.png" alt="">
        <span>付费动态</span>
        <img class="two" src="./coin@2x.png" alt="">
        <span>{{ coin }}</span>
      </div>
    </template>

    <div class="tips">
      <img src="./ic_notice@2x.png" alt="">
      <p>尊敬的用户，您发布的内容须遵守相关法律法规和社区规则,请严格遵守相关规定，以免违规。</p>
    </div>
    <input @change="upFile" type="file" v-show="false" ref="file">
    <div v-if="showMoney" @click="showMoney=false" class="money-alert" @touchmove.prevent>
      <div class="box" @click.stop>
        <h4>设置付费金额</h4>
        <van-icon name="cross" class="close" @click="showMoney=false" />
        <input type="number" ref="money" placeholder="请输入付费金额">
        <div class="confirm" @click="confirmMoney">完成</div>
      </div>
    </div>
  </div>
</template>

<script>
import { blurInput } from '../../common/js/mixins'
import { post } from '../../common/js/http'
import cos from '../../common/js/cos'
import createVod from '../../common/js/vod'
import { mapState } from 'vuex'

export default {
  name: 'post-send',
  mixins: [blurInput],
  data() {
    return {
      imgs: [],
      coin: 0,
      type: 1,
      text: '',
      videoUrl: '',
      upType: 'image',
      showMoney: false
    }
  },
  created() {
    this.type = Number(this.$route.params.type)
  },
  computed: {
    ...mapState(['appConfig', 'userInfo'])
  },
  methods: {
    confirmMoney() {
      const money = this.$refs.money.value
      this.coin = Number(money)
      this.showMoney = false
    },
    clickFile(type) {
      this.$refs.file.click()
      this.upType = type
    },
    upFile() {
      const file = this.$refs.file.files[0]
      if (!file) return
      const upType = this.upType
      if (file.type.indexOf(upType) < 0) {
        this.$toast.fail(upType === 'image' ? '请选择图片文件' : '请选择视频文件')
        return
      }
      if (upType === 'video') {
        this.uploadMedia(file)
        return
      }
      const loading = this.$toast.loading()
      const cosObj = cos()
      cosObj.putObject({
        Bucket: this.appConfig.cos_bucket,
        Region: this.appConfig.cos_region,
        Key: this.appConfig.cos_folder_image + `/${file.name}`,
        Body: file,
        Headers: { 'Pic-Operations': '{"is_pic_info":1,"rules":[{"fileid":"/images_blur/' + cosObj.filename + file.name + '","rule":"imageMogr2/blur/50x25"}]}' }
      }, (err, data) => {
        loading.close()
        if (err) {
          this.$toast.fail('上传失败')
        } else {
          this.imgs.push('https://' + data.Location)
        }
        this.$refs.file.value = ''
      })
    },
    uploadMedia(file) {
      const loading = this.$toast.loading({
        duration: 0,
        overlay: true,
        forbidClick: true,
        message: '0%'
      })
      // van-toast__text
      const vod = createVod()
      const upLoader = vod.upload({
        mediaFile: file
      })
      upLoader.on('media_progress', function(info) {
        document.querySelector('.van-toast__text').innerHTML = info.percent.toFixed(2) * 100 + '%'
      })
      upLoader.done().then((res) => {
        loading.close()
        this.videoUrl = res.video.url
        this.$nextTick(() => {
          this.createPlayer()
        })
        this.$refs.file.value = ''
      }).catch(() => {
        loading.close()
        this.$toast.fail('上传失败')
        this.$refs.file.value = ''
      })
    },
    createPlayer() {
      if (this.player) {
        this.player.destroy()
      }
      this.player = new this.$DPlayer({
        container: document.getElementById('video_player'),
        video: {
          url: this.videoUrl
        }
      })
    },
    delImg(index) {
      this.imgs.splice(index, 1)
    },
    submit() {
      if (!this.text) {
        this.$toast.fail('请输入您的动态内容')
        return
      }
      if (this.videoUrl && !this.imgs.length) {
        this.$toast.fail('请上传视频封面')
        return
      }
      const data = {
        title: this.text,
        type: this.type,
        image_url: this.imgs.join(','),
        blur_image_url: this.imgs.join(',').replace(/\/images\//g, '/images_blur/'),
        video_url: this.videoUrl,
        unlock_price: this.coin,
        single_display_type: 1
      }
      this.loading = true
      post('/webapi/Moment/publish', data)
        .then(() => {
          this.$router.back()
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/style/variable.styl"
  .post-send
    padding-top 72px
    background #fff
    .head
      width 100%
      height 72px
      position fixed
      left 0
      top 0
      text-align center
      background #fff
      &>span
        line-height 72px
        font-size 34px
        color #070707
        font-weight bold
      .iconfont
        position absolute
        top 20px
        left 30px
        font-size 33px
      .send-btn
        position absolute
        right 30px
        top 7px
        width 128px
        height 58px
        line-height 58px
        border-radius 29px
        background $theme-color
        font-size 30px
        color #fff
        text-align center
    .circle
      padding 0 30px
      display flex
      align-items center
      margin-top 40px
      &>img
        width 40px
        height 40px
        margin-right 22px
      &>span
        font-size 28px
        color #343434
      &>i
        font-size 28px
        color #A6A6A6
    textarea
      margin-top 40px
      display block
      width 100%
      line-height 40px
      box-sizing border-box
      padding 0 30px
      border none
      outline none
      resize none
      font-size 30px
    .video
      padding 0 30px
      &>h6
        margin 20px 0
        font-size 28px
        color #333
      &>img
        width 225px
        height 225px
      #video_player
        height 225px
        width 401px
        background #000
    .img-list
      display flex
      flex-wrap wrap
      padding 0 30px
      &>img
        width 225px
        height 225px
      .img
        width 225px
        height 225px
        margin-right 7px
        background-size cover
        background-repeat no-repeat
        background-position center center
        margin-bottom 7px
        &>img
          width 30px
          height 30px
          float right
        &:nth-child(3n + 0)
          margin-right 0
    .lock
      margin-top 23px
      width 297px
      margin-left 30px
      display flex
      align-items center
      justify-content center
      height 53px
      border-radius 27px
      background #F2F2F2
      font-size 24px
      color #A6A6A6
      &>img
        margin-right 13px
        width 20px
        height 26px
    .lock-active
      margin-top 23px
      margin-left 30px
      padding 0 22px
      display inline-block
      height 53px
      line-height 53px
      border-radius 27px
      background #F7EFFF
      font-size 24px
      color #B378FE
      .one
        width 20px
        height 26px
        padding-right 15px
        margin-top 13px
        vertical-align top
      .two
        padding 0 13px
        width 20px
        height 20px
    .tips
      margin 0 30px
      margin-top 85px
      margin-bottom 19px
      display flex
      padding 22px 16px
      background #F4F4F4
      &>img
        width 23px
        height 23px
      &>p
        margin-left 8px
        line-height 28px
        font-size 22px
        color #666666
    .money-alert
      position fixed
      left 0
      top 0
      width 100%
      height 100%
      display flex
      justify-content center
      align-items center
      background rgba(0,0,0,0.5)
      .box
        position relative
        width 483px
        border-radius 11px
        background #fff
        padding 36px
        &>h4
          margin-bottom 69px
          font-size 30px
          color #333333
          text-align center
        .close
          position absolute
          right 12px
          top 12px
          padding 20px
          font-size 30px
          color #D3D3D3
        &>input
          box-sizing border-box
          padding 0 14px
          width 100%
          height 98px
          border-radius 5px
          border 1px solid #D3D3D3
          font-size 28px
          background #F4F4F4
        .confirm
          width 180px
          margin 0 auto
          margin-top 83px
          height 65px
          border-radius 33px
          background $theme-color
          text-align center
          line-height 65px
          font-size 28px
          color #fff
</style>
