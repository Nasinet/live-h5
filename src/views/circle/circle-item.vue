<template>
  <div class="circle-item">
    <div class="info" @click="$router.push('/circle/' + item.id)">
      <img :src="item.img_url || $store.state.defaultAvatar" alt="">
      <div class="desc">
        <h6>{{ item.title }}</h6>
        <p>{{ item.sub_title }}</p>
      </div>
      <div class="btn" @click.stop="focus">{{ item.isFollowed ? '已关注' : '关注' }}</div>
    </div>

    <div class="covers" v-if="one">
      <div class="big">
        <div class="one" @click="$router.push('/post/' + one.id)" :style="{backgroundImage: `url(${one.cover})`}">
          <div class="tag">{{ tags[one.type] }}</div>
        </div>
        <div class="two">
          <div class="vertical" @click="$router.push('/post/' + cir.id)" v-for="cir in two" :key="cir.id" :style="{backgroundImage: `url(${cir.cover})`}">
            <div class="tag">{{ tags[cir.type] }}</div>
          </div>
        </div>
      </div>
      <div class="three">
        <div class="horizon" @click="$router.push('/post/' + t.id)" v-for="t in three" :style="{backgroundImage: `url(${t.cover})`}" :key="t.id">
          <div class="tag">{{ tags[t.type] }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '../../common/js/http'

export default {
  name: 'circle-item',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      tags: ['', '短文', '图片', '视频']
    }
  },
  computed: {
    one() {
      if (!this.item.moments.length) return null
      const copy = { ...this.item.moments[0] }
      copy.cover = copy.image_url.split(',')[0]
      return copy
    },
    two() {
      if (!this.item.moments.length) return []
      const copy = this.item.moments.slice(1, 3)
      copy.forEach(item => {
        item.cover = item.image_url.split(',')[0]
      })
      return copy
    },
    three() {
      if (!this.item.moments.length) return []
      const copy = this.item.moments.slice(3, 6)
      copy.forEach(item => {
        item.cover = item.image_url.split(',')[0]
      })
      return copy
    }
  },
  methods: {
    focus() {
      post('/webapi/group/attentGroup', {
        groupid: this.item.id,
        type: !this.item.isFollowed
      })
        .then(() => {
          this.$emit('focus', this.index)
        })
    }
  }
}
</script>

<style scoped lang="stylus">
  .circle-item
    margin 0 30px
    margin-top 60px
    .info
      display flex
      align-items center
      margin-bottom 44px
      &>img
        margin-right 17px
        width 79px
        height 79px
        border-radius 10px
      .desc
        flex 1
        &>h6
          margin-bottom 26px
          font-size 30px
          color #070707
          font-weight bold
        &>p
          font-size 26px
          color #878787
      .btn
        width 111px
        height 53px
        line-height 53px
        font-size 26px
        color #FFFFFF
        text-align center
        border-radius 27px
        background linear-gradient(61deg, #DA81FF, #AC74FF)
    .covers
      .tag
        position absolute
        right 0
        bottom 0
        width 84px
        height 41px
        line-height 41px
        text-align center
        border-top-left-radius 10px
        background rgba(0, 0, 0, 0.4)
        font-size 24px
        color #FFFFFF
      .big
        display flex
        justify-content space-between
        .one
          width 425px
          height 468px
          background-size cover
          background-repeat no-repeat
          background-position center center
          position relative
        .two
          display flex
          flex-direction column
          justify-content space-between
          width 254px
          .vertical
            width 100%
            height 229px
            background-size cover
            background-repeat no-repeat
            background-position center center
            position relative
      .three
        display flex
        margin-top 9px
        .horizon
          width 224px
          height 224px
          margin-right 9px
          position relative
          background-size cover
          background-repeat no-repeat
          background-position center center
          &:last-child
            margin-right 0
</style>
