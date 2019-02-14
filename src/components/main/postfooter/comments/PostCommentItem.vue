<template>
  <div class="post-comment-item">
    <div class="comment-avatar">
      <router-link :to="'/u/' + comment.author.nickname">
        <in-user-avatar-solo :user="comment.author"></in-user-avatar-solo>
      </router-link>
    </div>
    <div class="comment-body">
      <in-nickname :status="comment.author.status">
        <b class="comment-nickname" v-text="comment.author.nickname"></b>
      </in-nickname>
      <p class="comment-text">
        <in-text-with-mentions :text="comment.body" />
      </p>
      <in-time :time="comment.created_at_timestamp"></in-time>
    </div>
    <div
      v-if="canComment"
      @click="answerComment"
      class="comment-answer">
      <span> {{$lang.variables.answer}} </span>
    </div>
    <div
      v-if="canDelete"
      class="comment-delete">
      <i @click="deleteComment" class="icon-delete-f"></i>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Time from './Time.vue'
  import UserAvatar from 'ComponentsVue/UserAvatar'
  import {mapGetters} from 'vuex'
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";

  Vue.component('in-user-avatar-solo', UserAvatar);
  Vue.component('in-time', Time);

  export default {
    props: ['postAuthor', 'comment'],
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
      }),
      isGuest() {
        return this.authUser.status === 'guest'
      },
      canDelete() {
        return !this.isGuest && (this.comment.author.id === this.authUser.id || this.postAuthor.id === this.authUser.id)
      },
      canComment() {
        return !this.isGuest && this.comment.author.id !== this.authUser.id
      }
    },
    methods: {
      answerComment() {
        this.$parent.$emit('answerNickname', this.comment.author.nickname);
      },
      deleteComment() {
        this.$emit('action:delete-comment', this.comment.id);
      }
    },

  }
</script>
<style lang="less">
  @import '~LessStyle/comment.less';
</style>

