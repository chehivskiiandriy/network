<template>
  <div class="feed-item">
    <div class="feed-item-info">
      <span @click="goToUser">
        <b class="feed-info-nickname" v-text="feedUsername"></b>
      </span>
      <p class="feed-info-body"> {{feedText}}
        <template v-if="feed.type === 'like'">
          <span v-if="feed.entity.multiplier > 1" class="red-content">+{{feed.entity.multiplier}}</span>
        </template>
        <template v-else-if="feed.type === 'rating-vote'">
          <span v-if="feed.entity.rate > 1" class="red-content">+{{feed.entity.rate}}</span>
        </template>
        <template v-else-if="feed.type === 'comment'">
          <i>{{$textLength(feed.entity.comment.body, 15)}}</i>
        </template>
        <template v-else-if="feed.type === 'coins-received'">
          {{feed.entity.transaction.coins}} {{$lang.variables.incoins}}
        </template>
      </p>

      <in-time :time="feed.created_at_timestamp"/>
      <in-gift-timer v-if="feed.type === 'gift'" :gift="feed.entity.gift"/>
    </div>

    <div class="feed-item-avatar">
      <span @click="goToUser">
        <img
          class="feed-item-avatar-user"
          :src="feedUserAvatarSource">
        <img
          v-if="feedUser.active_gift!=null"
          class="feed-item-avatar-present"
          :src="feedUser.active_gift.image">
      </span>
    </div>

    <div class="feed-item-action">
      <div class="feed-item-icon" v-if="feed.type !== 'registration'">
        <p>
          <i
            @click="goToChat(feedUser.id)"
            class="icon-letter"></i>
        </p>
        <i
          :class="classSubscribe"
          @click="changeSubscribe"></i>
      </div>
      <span @click="goToPost"
            v-if="feed.type==='comment'">
          <img
            v-if="previewPostType === 'image'"
            :src="previewPost.url_small">
          <img
            v-else-if="previewPostType === 'video'"
            :src="previewPost.preview_url">
          <img v-else :src="imgArray.Ooops">
          <img v-if="previewPostType === 'video'" class="feed-play-video" :src="playImg"/>
        </span>
      <span @click="goToPost"
            v-else-if="feed.type==='like'">
          <img
            v-if="previewPostType === 'image'"
            :src="previewPost.url_small">
          <img
            v-else-if="previewPostType === 'video'"
            :src="previewPost.preview_url">
          <img v-else :src="imgArray.Ooops">
          <img v-if="previewPostType === 'video'" class="feed-play-video" :src="playImg"/>
        </span>
      <div v-else-if="feed.type==='contest-vote'">
        <i class="icon-heart-f feed-action"></i>
      </div>
      <span @click="goToGifts"
            v-else-if="feed.type==='gift'">
          <img :src="feed.entity.gift.gift_model.image">
        </span>
      <div class="feed-item-addrating-img" v-else-if="feed.type==='rating-vote'">
        <i class="icon-logo-f"></i>
      </div>
      <div v-else-if="feed.type==='chin-chin'">
        <i class="icon-chin-chin feed-action"></i>
      </div>
      <div v-else-if="feed.type==='follow'">
        <i class="icon-plus-guy-f feed-action"></i>
      </div>
      <div v-else-if="feed.type==='coins-received'">
        <i class="icon-Monet_R_2 feed-action"></i>
      </div>
      <div @click="goToComment" v-else-if="feed.type==='nick-mention-comment'">
        <i class="icon-Men_icon feed-action"></i>
      </div>
      <div @click="goToPost" v-else-if="feed.type==='nick-mention-post'">
        <i class="icon-Men_icon feed-action"></i>
      </div>
      <div @click="goToUser" v-else-if="feed.type==='nick-mention-status'">
        <i class="icon-Men_icon feed-action"></i>
      </div>
      <span @click="goToPost" v-else-if="feed.type==='mention'">
        <img
          v-if="feed.entity.post.attachments"
          :src="feed.entity.post.attachments.images[0].url_medium">
        <img
          v-else
          :src="imgArray.Ooops">
      </span>
      <span @click="goToGroup" v-else-if="feed.type==='group-invite'">
        <img :src="feed.entity.group.logo.url_medium">
      </span>
      <span class="feed-item-registration-img" @click="goToCurrentUser" v-else-if="feed.type==='registration'">
        <i
          class="icon-logo"
          :class="{'red-grad-icon': feed.entity.rate > 1}"></i>
      </span>
    </div>

  </div>
</template>
<script>
  import axios from 'axios';
  import {mapActions} from 'vuex';

  import {CHANGE_SUBSCRIBE_USER, moduleName as usersModule} from 'Store/modules/users/users';

  import Vue from 'vue'
  import Time from '../main/postfooter/comments/Time.vue'

  import giftTimer from 'ComponentsVue/profile/content/ProfileGiftTimer'

  Vue.component('in-gift-timer', giftTimer);
  Vue.component('in-time', Time);
  export default {
    props: {
      feed: Object,
      authUser: Object,
    },
    data() {
      return {
        playImg: img.PlaySmall,
        imgArray: window.img,
        previewPost: '',
        previewPostType: '',
        type: '',
        postI: '',
        objectInfo: {
          'comment': {
            type: 'comment',
            text: this.$lang.variables.commented
          },
          'gift': {
            type: 'gift',
            text: this.$lang.variables.sentYouGift// this.$lang.variables.senderGift
          },
          'follow': {
            type: 'follow',
            text: this.$lang.variables.subscribedToYou
          },
          'rating-vote': {
            type: 'rating-vote',
            text: this.$lang.variables.riseRating
          },
          'post-vote': {
            type: 'post-vote',
            text: this.$lang.variables.riseRating
          },
          'contest-vote': {
            type: 'contest-vote',
            text: this.$lang.variables.votedForYouInTheContest
          },
          'group-invite': {
            type: 'group-invite',
            text: this.$lang.variables.invitationToGroup
          },
          'mention': {
            type: 'mention',
            text: this.$lang.variables.mentionYouInThePost
          },
          'registration': {
            type: 'registration',
            text: this.$lang.variables.welcomeToInratingTop
          },
          'chin-chin': {
            type: 'chin-chin',
            text: this.$lang.variables.chinChinSend
          },
          'like': {
            type: 'like',
            text: this.$lang.variables.likedFromUser
          },
          'coins-received': {
            type: 'coins-received',
            text: this.$lang.variables.coinsRecieved
          },
          'nick-mention-comment': {
            type: 'nick-mention-comment',
            text: this.$lang.variables.mentionYourNicknameInTheComment,
          },
          'nick-mention-post': {
            type: 'nick-mention-post',
            text: this.$lang.variables.mentionYourNicknameInThePost,
          },
          'nick-mention-status': {
            type: 'nick-mention-status',
            text: this.$lang.variables.mentionYourNicknameInTheStatus,
          },
        }
      }
    },
    mounted() {
      if (this.feed.entity.post) {
        this.postI = this.feed.entity.post;

        if (this.postI.attachments_order[0].type === 'post') {
          this.type = 'post';
          this.postI = this.feed.entity.post.attachments.posts[0];
        }

        if (this.postI.attachments_order[0].type === 'image') {
          for (let i = 0; i < this.postI.attachments.images.length; i++) {
            if (this.postI.attachments_order[0].id === this.postI.attachments.images[i].id) {
              this.previewPost = this.postI.attachments.images[i];
              this.previewPostType = 'image';
              break;
            }
          }
        } else if (this.postI.attachments_order[0].type === 'video') {
          for (let i = 0; i < this.postI.attachments.videos.length; i++) {
            if (this.postI.attachments_order[0].id === this.postI.attachments.videos[i].id) {
              this.previewPost = this.postI.attachments.videos[i];
              this.previewPostType = 'video';
              break;
            }
          }
        }
      }
    },
    computed: {
      classSubscribe: function () {
        return this.feedUser.is_subscribed
          ? 'icon-plus-guy-f'
          : 'icon-plus-guy'
      },
      feedType() {
        const { feed } = this;
        return feed && feed.type;
      },
      feedUser() {
        const { feed } = this;
        return feed && feed.entity && (feed.entity.user || feed.entity.author);
      },
      feedUsername() {
        const { feedUser } = this;
        return feedUser && feedUser.nickname;
      },
      feedPost() {
        const { feed, feedType } = this;
        return feed && feed.entity && feedType === 'nick-mention-post'
          ? feed.entity
          : feed.entity.post;
      },
      postType() {
        const { feedPost } = this;
        switch(feedPost && feedPost.type) {
          case 2:
            return 'group-post';
          case 3:
            return 'album-post';
          case 4:
            return 'story-post';
          case 5:
            return 'group-video-post';
          case 6:
            return 'group-banner-left';
          case 7:
            return 'group-banner-right';
          default:
            return 'user-post';
        }
      },
      isPostStory() {
        return this.feedType === 'nick-mention-post' && this.postType === 'story-post';
      },
      feedUserAvatarSource() {
        const { feedUser } = this;
        return feedUser && feedUser.avatar_image && feedUser.avatar_image.url_medium;
      },
      feedText() {
        if(this.isPostStory) {
            return this.$lang.variables.mentionYourNicknameInTheStory;
        }
        return this.objectInfo[this.feedType] && this.objectInfo[this.feedType].text;
      },
      feedCommentId() {
        const { feed } = this;
        return feed && feed.entity && feed.entity.comment && feed.entity.comment.id;
      }
    },
    methods: {
      ...mapActions({
        changeSubscribeUser: usersModule + CHANGE_SUBSCRIBE_USER
      }),
      goToUser() {
        this.feedUsername && this.$router.push('/u/' + this.feedUsername);
      },
      goToCurrentUser() {
        this.feedUsername && this.$router.push('/u/' + this.authUser.nickname);
      },
      goToPost() {
        if(this.isPostStory) {
          return this.goToStory();
        }
        this.feedPost && this.$router.push('/p/' + this.feedPost.slug);
      },
      goToStory() {
        this.feedPost && this.$router.push({path: '/story/' + this.feedUsername});
      },
      goToComment() {
        if(this.feedPost && this.feedPost.slug) {
          let link = '/p/' + this.feedPost.slug;
          this.$router.push({path: link, hash: `#post-comment-${this.feedCommentId}`});
        }
      },
      goToGifts() {
        this.$router.push('/u/' + this.authUser.nickname + '/gift');
      },
      goToGroup() {
        if (this.feed.entity.group) {
          this.$router.push('/group/' + this.feed.entity.group.slug);
        }
      },
      changeSubscribe() {
        const payload = {
          nickname: this.feedUsername,
          delete: this.feedUser.is_subscribed ? '1' : '0',
          onRequest: this.onRequestSubscribe
        };

        this.changeSubscribeUser(payload);
      },
      onRequestSubscribe() {
        this.$notify({
          group: 'send-subscriber-request',
          duration: 3000,
          speed: 300,
        });
      },
      goToChat(id) {
        if (this.$userStatus(this.authUser)) {
          if (this.authUser.id !== id) {
            axios.get('v1/me/chats/check?id=' + id)
              .then(res => {
                if (res.data.state)
                  this.$router.push('/messages/' + res.data.id);
                else
                  this.$router.push('/new-chat/' + id);
              })
          }
          else {
            this.$notify({
              group: 'write-to-you',
              duration: 3000,
              speed: 300,
            });
          }
        }
      },
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/feed.less';

</style>
