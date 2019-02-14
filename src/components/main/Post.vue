<docs>
  # post with info
</docs>

<template>
  <div class="post-item">
    <div class="post-item--header">
      <div class="header-logo">
        <div @click="goToUser">
          <i :class="postLogo"></i>
          <p class="post-logo-text"><b>R</b>
            <span>{{post.author.rating.value}}</span>
          </p>
        </div>
        <div
          class="header-location"
          v-if="post.place !== null">
          <div class="header-location-city">{{this.locationBold}}</div>
          <div class="header-location-place">{{this.locationNormal}}</div>
        </div>
      </div>
      <div
        class="header-user_avatar"
        @click="goToUser">
        <div>
          <in-user-avatar-solo :user="post.author"/>
        </div>
        <div class="header-user--link">
          <in-nickname
            class="header-user--nickname"
            :status="post.author.status">{{post.author.nickname}}</in-nickname>
        </div>
      </div>
      <div
        @click="openSettings()"
        class="header-settings">
        <i class="icon-vvv"></i>
      </div>
    </div>
    <div
      class="post-item__post-pagination post-pagination"
      v-if="paginationBulletsCount > 1">
      <span v-for="i in paginationBulletsCount"
            :class="getPaginationBulletClasses(i - 1)"></span>
    </div>

    <p class="post-title" v-if="postTitle || post.title">
      <span v-if="$route.params.slug === undefined" ><in-text-with-mentions :text="postTitle"/></span>
      <span v-else><in-text-with-mentions :text="post.title"/></span>
      <span v-if="moreView" @click="showMore" class="moreView">{{$lang.variables.more}}</span>
    </p>

    <div
      class="repost-ownertext"
      v-if="post.attachments.posts!=null">
      <p
        :class="getRepostTitleClasses()"
        v-if="post.attachments.posts[0].title && post.attachments.posts[0].title !== 'null' && post.attachments.posts[0].title !== ''">
        <in-text-with-mentions :text="post.attachments.posts[0].title" />
      </p>
    </div>

    <div
      class="post-image--ooops"
      v-if="hasMedia">
      <img src="http://storage.innet.club/img/default/Ooops.png"/>
    </div>
    <div v-else>
      <div
        class="post-repost"
        v-if="post.attachments.posts != null">

        <in-post-image
          @slide="slideHandler"
          :post="post.attachments.posts[0].attachments"
          :order="post.attachments.posts[0].attachments_order"/>
        <div class="post__content-forward-media post-repost-icon">
          <i class="icon-share-f"></i>
          <router-link v-if="post.attachments.posts[0].type === 1" :to="'/u/' + post.attachments.posts[0].author.nickname">
            <span v-text="post.attachments.posts[0].author.nickname"></span>
          </router-link>
          <router-link v-else-if="post.attachments.posts[0].type === 2" :to="'/group/' + post.attachments.posts[0].extra.group.slug">
            <span v-text="post.attachments.posts[0].extra.group.name"></span>
          </router-link>
        </div>
      </div>
      <div
        class="post-normal"
        v-else>
        <in-post-image
          @slide="slideHandler"
          :avatar="post.is_avatar"
          :user="post.author"
          :post="post.attachments"
          :order="post.attachments_order"/>

        <router-link v-if="post.author.contest_entry_instance" :to="'/contest/'+post.author.contest_entry_instance.slug">
          <span  class="post__content-forward-media post-author-contest"><i class="icon-Kubok_konkurs-f"></i></span>
        </router-link>
      </div>
      <in-postmenu :post='post'/>
      <div
        class="repost-ownertext"
        v-if="post.attachments.posts!=null">
        <div v-if="post.attachments.posts[0].intags.length" class="post-intags" :class="getRepostIntagsClasses()">
          <span
            v-for="intag in post.attachments.posts[0].intags">
            <router-link :to="'/intag/'+intag.name" @click.native="searchByHash(intag.name)">
              <span>{{'^^'+intag.name}}</span>
            </router-link>

          </span>
        </div>
      </div>

      <div class="post-intags">
        <span
          v-for="intag in  post.intags">
            <router-link :to="{ name: 'intag', params: {intag: intag.name} }">
              <span>{{'^^'+intag.name}}</span>
            </router-link>
          </span>
      </div>
      <div class="post-time">
        <in-time :time="post.created_at_timestamp"/>
      </div>
      <in-post-footer :post='post'/>
    </div>
  </div>
</template>

<script>
  import PostMenu from './postmenu/PostMenu.vue'
  import PostFooter from './postfooter/PostFooter.vue'
  import PostImage from './postimage/PostImage.vue'
  import UserAvatar from 'ComponentsVue/UserAvatar'

  export default {
    name: 'Post',
    components: {
      'in-user-avatar-solo': UserAvatar,
      'in-postmenu': PostMenu,
      'in-post-footer': PostFooter,
      'in-post-image': PostImage,
    },
    props: ['post'],
    data(){
      return {
        locationBold: '',
        locationNormal: '',
        moreButton: '',
        moreView: false,
        currentSlideIndex: 0,
      }
    },
    computed: {
      postLogo() {
        return (this.post.author && this.post.author.is_voted)
          ? 'icon-logo-f'
          : 'icon-logo';
      },
      profilePost() {
        return this.$route.path.split('/')[1] !== 'u';
      },
      postTitle() {
        !this.post && console.warn('There is no post in Post.vue');
        const maxLength = 100;
        return this.post && this.moreView
          ? (this.post.title.length > maxLength
            ? this.post.title.slice(0, 100) + '...'
            : this.post.title)
          : this.post.title;
      },
      hasMedia() {
        const { post: { attachments }} = this;
        return attachments.videos == null && attachments.images == null && attachments.posts == null;
      },
      paginationBulletsCount() {
        const order = (this.post.attachments.posts && this.post.attachments.posts[0].attachments_order) ||
          this.post.attachments_order;
        return order.length;
      }
    },
    mounted(){
      if(this.$route.params.slug === undefined){
        let textLength = this.post.title.length;
        if(textLength > 100){
          this.moreView = true;
        }
      }
      if(this.post.place != null){
        let locationArray = this.post.place.location.split(',');
        this.locationBold = locationArray[locationArray.length - 1];
        this.locationNormal = locationArray[1];
      }
    },
    methods: {
      goToUser() {
        const data = new FormData();
        data.append('type', 'profile_visit');
        data.append('id', this.post.id);

        this.$api.users.profileVisitFromPost(data);
        this.$router.push('/u/' + this.post.author.nickname);
      },
      showMore() {
        this.moreView = false;
      },
      openSettings(){
        this.$root.$emit('postAuthor', this.post, this.post.author, this.post.slug, this.post.id, this.post.is_avatar, this.post.title, this.post.site_link);
        this.$emit('show-post-settings');
      },
      searchByHash(link) {
        this.$router.push('/intag/'+link);
      },
      getPaginationBulletClasses(index) {
        return {
          'post-pagination__bullet': true,
          'post-pagination__bullet_active' : this.currentSlideIndex === index,
        };
      },
      slideHandler(index) {
        this.currentSlideIndex = index;
      },
      getRepostTitleClasses() {
        return {
          'repost-ownertitle': true,
          'repost-ownertitle_border-top': (this.post.title || this.postTitle),
        }
      },
      getRepostIntagsClasses() {
        return {
          'repost-ownertext__intags': true,
          'repost-ownertext__intags_border-bottom': (this.post.intags.length > 0),
        }
      },
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/post.less';

  .post-item__post-pagination {

    margin-left: -2px;
    margin-bottom: 0.8vw;
  }

  .post-pagination {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .post-pagination__bullet {
    border-radius: 2px;
    margin: 0 0.56vw;
    background-color: black;
    padding: 1%;
    display: inline-block;
    height: 0;
    width: 0;
    opacity: 0.2;
  }

  .post-pagination__bullet_active {
    opacity: 1;
    background: linear-gradient(to left top, #000fbc, #0cb4be 50%);
  }

  .repost-ownertitle {
    margin-top: 0 !important;
    padding: 1vw 0 1vw 5px !important;
    border-bottom: none !important;
  }

  .repost-ownertitle_border-top {
    border-top: 1px solid #cccccc;
  }

  .repost-ownertext__intags {
    padding-bottom: 5px;
  }

  .repost-ownertext__intags_border-bottom {
    border-bottom: 1px solid #cccccc;
  }
</style>
