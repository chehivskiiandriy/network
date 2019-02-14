<template>
  <div class="profile-container">
    <div class="bookmarks-header"><h3>{{$lang.variables.bookmarks}}</h3></div>
    <div
      v-if="bookmarks.length > 0"
      class="bookmarks-container">
      <in-profile-post-solo
        v-for="post in bookmarks"
        :key="post.id"
        :post="post"
        :class="postCount"
      />
    </div>
    <div v-else-if="!loading">
      У Вас пока еще нет закладок
    </div>
    <in-spinner :loading="loading"/>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'

  import {scrollOnBottom} from "../../../mixins/scrollOnBottom";
  import {moduleName as countPostOnPageModule, PROFILE_POST_COUNT} from 'Store/modules/countPostOnPage';
  import {
    BOOKMARKS,
    FETCH_BOOKMARKS,
    FETCH_BOOKMARKS_NEXT_PAGE,
    LOADING,
    moduleName as bookmarksModule
  } from "Store/modules/authUser/bookmarks";
  import ProfilePostSolo from './ProfilePostSolo.vue'

  export default {
    name: 'ProfileBookmarks',
    components: {
      inProfilePostSolo: ProfilePostSolo
    },
    mixins: [scrollOnBottom],
    computed: {
      ...mapGetters({
        profilePostCount: countPostOnPageModule + PROFILE_POST_COUNT,
        bookmarks: bookmarksModule + BOOKMARKS,
        loading: bookmarksModule + LOADING,
      }),
      postCount: function () {
        if (this.profilePostCount === '4') {
          return 'prof-post profile-post';
        }
        else if (this.profilePostCount === '2') {
          return 'prof-post profile-post-big';
        }
        else {
          return 'prof-post profile-post-big';
        }
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchBookmarksNextPage();
        }
      },
    },
    mounted() {
      this.fetchBookmarks();
    },
    methods: {
      ...mapActions({
        fetchBookmarks: bookmarksModule + FETCH_BOOKMARKS,
        fetchBookmarksNextPage: bookmarksModule + FETCH_BOOKMARKS_NEXT_PAGE,
      })
    }
  }
</script>
<style lang="less">
  @import '~LessStyle/variables.less';

  #SpinnerOnloadImg {
    display: block;
    width: 35%;
    margin: auto;
  }

  .profile-container {
    text-align: left;

  }

  .bookmarks-container {
    display: flex;
    flex-wrap: wrap;
  }

  .profile-post img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 5px;
  }

  .profile-post-big {
    /*position: relative;*/
    /*width: 49.4%;*/
    /*display: inline-block;*/
    /*margin-left: 2px;*/
  }

  .profile-post-big img {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 5px;
  }

  .profile-post-big video {
    width: 100%;
    display: block;
    border-radius: 10px;
    background-color: #000;
  }

  .bookmarks-header {
    width: 100%;
    color: #81d8d0;
    padding: 0 8px;
    text-align: center;
    margin-top: 0;
    margin-bottom: 10px;
    h3 {
      position: relative;
      left: -6px;
      .text-grad();
      font-weight: 400;
      margin: 0;
    }
  }
</style>
