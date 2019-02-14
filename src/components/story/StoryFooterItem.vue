<template>
  <div
    class="story-toggle-div"
    @click="eventToggle"
    :class="likeAnimation">
    <i :class="[toggleFunction, isActiveGift]"></i>
  </div>
</template>
<script>
  import axios from 'axios';

  export default {
    props: ['className', 'classNameActive', 'actionId', 'fillType', 'user', 'statusFieldName'],
    data() {
      return {
        fillTypePost: '',
        statusFieldNamePost: '',
        postCount: '',
        animateLike: false,
        loading: false,
        userStatus: JSON.parse(localStorage.getItem('user')).status,
      }

    },
    created() {
      this.fillTypePost = this.fillType;
      this.statusFieldNamePost = this.statusFieldName;
      this.postCount = this.count;
    },
    mounted() {
      this.$root.$on('changeFooter', (res) => {
        if (this.fillType === 'like') {
          this.statusFieldNamePost = res[1];
        }

        else {
          this.statusFieldNamePost = res[0];
        }

      });
      this.postCount = this.count;
      this.fillTypePost = this.fillType;
    },
    computed: {
      isLike() {
        return this.animateLike && this.statusFieldNamePost && this.activePremium;
      },
      isActiveGift() {
        return this.statusFieldNamePost && this.activePremium ? 'premium-icon' : ''
      },
      activePremium() {
        return this.fillTypePost === 'like' && this.user.active_gift && (this.user.active_gift.id === 41 || this.user.active_gift.id === 42);
      },
      likeAnimation() {
        if (this.isLike) {
          if (this.user.active_gift.id === 41) {
            return 'like-animation-41'
          } else if (this.user.active_gift.id === 42) {
            return 'like-animation-42'
          } else {
            return ''
          }
        } else {
          return '';
        }
      },
      toggleFunction: function () {
        return this.statusFieldNamePost
          ? this.classNameActive
          : this.className
      }
    },
    methods: {
      eventToggle() {
        let fillType = this.fillTypePost;
        let status = this.statusFieldNamePost;
        if (this.userStatus === 'guest') {
          this.$notify({
            group:'guest-template',
            duration: 3000,
            speed: 300,
          });
        }
        else {
          if (status) {
            axios.get('v1/users/posts/' + fillType + '?id=' + this.actionId + '&delete=true')
              .then(
                res => {
                  this.statusFieldNamePost = res.data.state;
                  if (!res.data.state) {
                    this.animateLike = false;
                    if (fillType === 'like') {
                      this.postCount -= res.data.multiplier;
                    } else {
                      this.postCount--;
                    }
                  }

                }
              )
              .catch(err => console.log(err.response));
          }
          else {
            if (fillType === "repost") {
              this.$modal.show('repostModal');
              this.$root.$emit('postModalRepost', this.actionId);
            }
            else {
              axios.get('v1/users/posts/' + fillType + '?id=' + this.actionId)
                .then(
                  res => {
                    this.statusFieldNamePost = res.data.state;
                    if (res.data.state) {
                      this.animateLike = true;
                      if (fillType === 'like') {
                        this.postCount += res.data.multiplier;
                      } else {
                        this.postCount++;
                      }
                    }
                  }
                )
                .catch(err => console.log(err.response));
            }

          }
        }

      }
    },
  }
</script>
<style lang="less">
  @import '~LessStyle/animation.less';

  .story-toggle-div {
    display: flex;
  }

  .premium-icon {
    background: linear-gradient(to right bottom, #f00, #000 95%) !important;
    opacity: 0.8;
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent !important;
  }
</style>
