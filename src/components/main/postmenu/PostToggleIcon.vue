<template>
  <div @click="eventToggle" class="post-toggle-icon">
    <div :class="likeAnimation">
      <i :class="[toggleFunction, isActiveGift]"></i>
    </div>
    <p class="toggle-count" v-text="countField"></p>
  </div>
</template>

<script>
  import {mapActions, mapMutations} from 'vuex';

  import {BOOKMARK_POST, LIKE_POST, UNREPOST_POST, moduleName as postsModule} from "Store/modules/posts";

  export default {
    name: "PostToggleIcon",
    props: ['className', 'classNameActive', 'count', 'status', 'fillType', 'authUser', 'post'],
    data() {
      return {
        animateLike: false,
        loading: false,
        statusField: this.status,
        countField: this.count,
        requests: 0
      }
    },
    watch: {
      status(value) {
        if (this.requests === 0) {
          this.statusField = value;
        }
      },
      count(value) {
        if (this.requests === 0) {
          this.countField = value;
        }
      }
    },
    computed: {
      isLike() {
        return this.animateLike && this.statusField && this.activePremium;
      },
      isActiveGift() {
        return this.statusField && this.activePremium ? 'premium-icon' : ''
      },
      activePremium() {
        return this.fillType === 'like'
          && this.authUser.active_gift
          && (this.authUser.active_gift.id === 41 || this.authUser.active_gift.id === 42);
      },
      likeAnimation() {
        if (this.isLike) {
          if (this.authUser.active_gift.id === 41) {
            return 'like-animation-41'
          } else if (this.authUser.active_gift.id === 42) {
            return 'like-animation-42'
          } else {
            return ''
          }
        } else {
          return '';
        }
      },
      toggleFunction: function () {
        return this.statusField
          ? this.classNameActive
          : this.className
      }
    },
    methods: {
      ...mapActions({
        likePost: postsModule + LIKE_POST,
        bookmarkPost: postsModule + BOOKMARK_POST,
        unrepostPost: postsModule + UNREPOST_POST,
      }),
      notRepostOwnPost() {
        if(this.fillType === 'repost' && this.authUser.id === this.post.author.id) {
          this.$notify({
            group: 'cant-toyou',
            duration: 3000,
            speed: 300
          });
        }
        return !(this.fillType === 'repost' && this.authUser.id === this.post.author.id);
      },
      onSuccess() {
        this.requests--;
      },
      newCount() {
        if (this.authUser.active_gift) {
          if (this.authUser.active_gift.id === 41) {
            return 5;
          }
          if (this.authUser.active_gift.id === 42) {
            return 10;
          }
        }
        return 1;
      },
      eventToggle() {
        if (this.$userStatus(this.authUser) && this.notRepostOwnPost()) {
          if (this.fillType === 'like') {
            const payload = {
              slug: this.post.slug,
              id: this.post.id,
              delete: this.statusField,
              groupSlug: this.$route.params.group_slug ? this.$route.params.group_slug : '',
              onSuccess: this.onSuccess
            };

            this.animateLike = !this.statusField;
            if (this.statusField) {
              let tempCount = this.countField - this.newCount();
              if (tempCount < 0) this.countField = 0; else this.countField = tempCount;
            } else {
              this.countField = this.countField + this.newCount();
            }
            this.statusField = !this.statusField;
            this.requests++;
            this.likePost(payload);
          } else if (this.fillType === 'bookmark') {
            const payload = {
              post: this.post,
              delete: this.statusField,
              groupSlug: this.$route.params.group_slug ? this.$route.params.group_slug : '',
              onSuccess: this.onSuccess
            };
            if (this.statusField) {
              this.countField -= 1;
            } else {
              this.countField += 1;
            }
            this.statusField = !this.statusField;
            this.requests++;
            this.bookmarkPost(payload);
          } else if (this.fillType === "repost") {
            if(!this.status) {
              this.$root.$emit('postModalRepost', this.post);
            } else {
              this.unrepostPost({
                id: this.post.id,
                slug: this.post.slug,
              });
            }
          }
        }
      },
    },
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';
  @import '~LessStyle/animation.less';

  .post-toggle-icon {
    display: flex;
    flex-direction: column-reverse;
    width: 100%;
  }

  p {
    margin: 0px
  }

  .toggle-count {
    color: #fff;
  }

  .toggle-count-like {
    position: absolute;
    top: 0;
  }

  .toggle-item {
    position: relative;
    display: flex;
    flex-flow: column;
    align-items: center;
    justify-content: flex-end;
    /*height: 39px;*/
  }

  .premium-icon {
    opacity: 0.8;
    .text-red-grad();
  }
</style>
