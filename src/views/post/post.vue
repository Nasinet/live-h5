<template>
  <div class="post">
    <scroll clickable ref="scroll" :is-finished="isFinished" @scrollToEnd="scrollToEnd">
      <post-item v-if="post.id" @changeDyItem="changeDyItem" type="detail" class="post-info" :post="post" />
      <h4 v-if="post.id" class="comment-title">最新评论（{{ post.comment_count }}）</h4>

      <div class="list">
        <Comment @liked="liked" v-for="(item, index) in list" :index="index" :comment="item" :key="item.id" />
      </div>
    </scroll>

    <form @submit.prevent="comment" class="form border-top-1px">
      <input ref="input" v-model="commText" @blur="inputBlur" type="text" placeholder="发布评论">
      <img @click="likeMoment" v-if="!post.liked" src="./ic_zan@2x.png" alt="">
      <img v-else src="./ic_zan_pre@2x.png" alt="">
      <img @click="collection(1)" v-if="!post.collected" src="./ic_shoucang@2x.png" alt="">
      <img @click="collection(0)" src="./ic_yishoucang@2x.png" v-else alt="">
    </form>
  </div>
</template>

<script>
import Scroll from '../../components/scroll/scroll'
import PostItem from '../../components/post-item/post-item'
import Comment from '../../components/comment/comment'
import { blurInput } from '../../common/js/mixins'
import { post } from '../../common/js/http'

export default {
  mixins: [blurInput],
  name: 'post',
  components: {
    Scroll,
    PostItem,
    Comment
  },
  data() {
    return {
      post: {
        user: {
          profile: {}
        },
        liked: false,
        collected: false
      },
      list: [],
      isFinished: true,
      page: 1,
      commText: ''
    }
  },
  created() {
    this.getDetail()
    this.getComments()
    this.exposure()
  },
  methods: {
    exposure() {
      // post('/api/Moment/addWatchLog', {
      //   momentid: this.$route.params.id,
      //   hideLoading: true
      // })
    },
    changeDyItem({ index, item }) {
      this.post = item
    },
    comment() {
      if (!this.commText) {
        this.$toast.fail('请输入评论内容')
        return
      }
      clearTimeout(this.commentTimer)
      this.commentTimer = setTimeout(() => {
        if (this.commenting) return
        this.commenting = true
        post('/api/Moment/publishComment', {
          momentid: this.post.id,
          content: this.commText
        })
          .then(({ data: { data } }) => {
            this.list.unshift(data)
            this.commenting = false
            this.commText = ''
            this.$refs.input.blur()
            this.$nextTick(() => {
              this.$refs.scroll.refresh()
            })
          })
      }, 200)
    },
    likeMoment() {
      post('/api/Moment/likeMoment', {
        momentid: this.post.id
      })
        .then(() => {
          this.post.liked = true
        })
    },
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
      this.getComments()
    },
    getDetail() {
      post('/webapi/Moment/getMomentInfo', {
        id: this.$route.params.id
      })
        .then(({ data: { data } }) => {
          data.liked = data.liked ? data.liked : false
          data.collected = data.collected ? data.collected : 0
          this.post = data
          this.$nextTick(() => {
            this.$refs.scroll.refresh()
          })
        })
    },
    collection(type) {
      post('/api/Moment/collectMoment', {
        momentid: this.post.id,
        type
      })
        .then(() => {
          this.post.collected = type
        })
    },
    getComments() {
      post('/webapi/Moment/getComments', {
        momentid: this.$route.params.id,
        page: this.page,
        hideLoading: this.page > 1,
        size: 10
      })
        .then(({ data: { data } }) => {
          this.isFinished = data.length < 10
          this.list = this.list.concat(data)
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
.post
  height 100%
  padding-bottom 95px
  box-sizing border-box
  .post-info
    margin-top 30px
  .comment-title
    margin-bottom 22px
    padding 0 30px
    font-weight bold
    font-size 24px
    color #000000
  .list
    padding-left 30px
  .form
    position fixed
    left 0
    bottom 0
    width 100%
    height 95px
    box-sizing border-box
    padding 0 30px
    display flex
    align-items center
    &>input
      flex 1
      background #F5F5F5
      height 58px
      line-height 58px
      padding-left 22px
      border-radius 29px
      font-size 28px
      outline none
    &>img
      width 44px
      height 44px
      margin-left 46px
</style>
