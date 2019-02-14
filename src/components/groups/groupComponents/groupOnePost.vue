<template>
    <div class="post-item">
      <div
        class="post-image--ooops"
        v-if="post.attachments.videos==null && this.post.attachments.images==null && post.attachments.posts==null">
        <img src="http://storage.innet.club/img/default/Ooops.png"/>
      </div>
      <div v-else>
        <div
          class="post-normal">
          <in-post-image
            :avatar="post.is_avatar"
            :user="post.author"
            :post="post.attachments"
            :order="post.attachments_order"/>

          <div class="post-normal-info">
            <div class="left">
              <p class="post-logo-text" v-if="post.author.rating"><b>R</b>
                <span>{{post.author.rating.value}}</span>
              </p>
            </div>
            <div class="right">
              <div class="right-info">
                <div
                  class="group-header-location"
                  v-if="post.place !== null">

                  <div class="header-location-city">{{locationBold}},</div>
                  <div class="header-location-place">{{locationNormal}}</div>
                  <i class="icon-location-f"></i>
                </div>
                <div v-else></div>
                <div
                  @click="goToUser"
                  class="header-user--link-1">
                  <in-nickname
                    class="header-user--nickname header-user--nickname-group"
                    :status="post.author.status">{{title}}</in-nickname>
                </div>
              </div>
              <div
                @click="goToUser"
                class="header-user_avatar">
                  <in-user-avatar-solo :avatar="avatar" :active-gift="activeGift"/>
              </div>
            </div>

          </div>
        </div>
        <in-postmenu :post='post'/>
        <div
          class="repost-ownertext"
          v-if="post.attachments.posts!=null">
          <p
            class="repost-ownertitle"
            v-if="post.attachments.posts[0].title!=='null' && post.attachments.posts[0].title !== ''"
            v-text="post.attachments.posts[0].title"></p>
          <div class="post-intags">
          <span
            v-for="intag in post.attachments.posts[0].intags">
            <router-link :to="'/intag/'+intag.name">
              <span>{{'^^'+intag.name}}</span>
            </router-link>
          </span>
          </div>
        </div>

        <p class="post-title">
          <span v-if="$route.params.slug === undefined"><in-text-with-mentions :text="postTitle"/></span>
          <span v-else><in-text-with-mentions :text="post.title"/></span>
          <span v-if="moreView" @click="showMore" class="moreView">{{$lang.variables.more}}</span>
        </p>
        <div class="post-intags">
        <span
          v-for="intag in  post.intags">
            <router-link :to="'/intag/'+intag.name">
              <span>{{'^^'+intag.name}}</span>
            </router-link>

          </span>
        </div>
        <div class="post-time">

          <in-time :time="post.created_at_timestamp"/>

        </div>
        <in-group-post-footer
          @show-post-settings="$emit('show-post-settings')"
          :post='post'
          :user='user'/>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue'
  import PostMenu from 'ComponentsVue/main/postmenu/PostMenu.vue'
  // import PostFooter from 'ComponentsVue/main/postfooter/PostFooter.vue'
  import PostImage from 'ComponentsVue/main/postimage/PostImage.vue'
  import UserAvatar from 'ComponentsVue/UserAvatar'
  import GroupPostFooter from './groupPostFooter';


  Vue.component('in-user-avatar-solo', UserAvatar);
  Vue.component('in-postmenu', PostMenu);
  Vue.component('in-group-post-footer', GroupPostFooter);
  Vue.component('in-post-image', PostImage);

  export default {
    name: "groupOnePost",
    props: ['post'],
    created() {
      this.postTitle = this.post.title;
    },
    computed: {
      postLogo: function () {

        if (this.post.author) {
          if (this.post.author.is_voted)
            return 'icon-logo-f';
          else
            return 'icon-logo';
        }
      },
      avatar() {
        return this.post.author.avatar_image || this.post.author.logo;
      },
      title() {
        return this.post.author.nickname || this.post.author.name;
      },
      activeGift() {
        return this.post.author.active_gift;
      },
    },
    data() {
      return {
        user: {},
        locationBold: '',
        locationNormal: '',
        postTitle: this.post.title,
        moreButton: '',
        moreView: false,

        shareID:'',
        postAuthor:{},
      }
    },
    mounted() {
      this.user = JSON.parse(localStorage.getItem('user'));

      if (this.$route.params.slug === undefined) {
        let textLength = this.post.title.split('').length;
        if (textLength > 100) {
          this.moreView = true;
          this.postTitle = this.post.title.slice(0, 100) + '...';
        }
        else {
          this.postTitle = this.post.title
        }
      }

      if(this.post.place != null){
        let locationArray = this.post.place.location.split(',');
        this.locationBold = locationArray[locationArray.length - 1];
        this.locationNormal = locationArray[1];
      }
    },
    methods: {
      showMore() {
        this.postTitle = this.post.title;
        this.moreView = false;
      },
      goToUser() {
        const data = new FormData();
        data.append('type', 'profile_visit');
        data.append('id', this.post.id);
        this.$api.users.profileVisitFromPost(data);

        if(this.post.author.nickname) {
          this.$router.push('/u/' + this.post.author.nickname);
        }
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/post.less';
  @import '~LessStyle/sharemodal.less';

  .post-item {
    /*padding-top: 0;*/
  }

  .post-mentions--icon {
    top: 5px;
  }

  .post-footer {
    /*margin-bottom: 0 !important;*/
    border-bottom: none;
  }

  .post-normal {
    position: relative;
  }

  .post-normal-info {
    position: absolute;
    bottom: 10px;
    left: 10px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    color: #fff;
    text-shadow: 1px 1px 2px #000;
    z-index: 2;

    .left {
      display: flex;
      align-items: flex-end;
    }

    .right {
      display: flex;
      justify-content: flex-end;
      width: 70%;
    }

    .header-user--nickname {
      color: #fff;
      padding-right: 10px;
    }

    .header-user_avatar {
      width: auto;
    }
  }
  .group-post  .header-user--nickname-group {
    font-size: 4vw;
  }

  .right-info {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }
</style>
