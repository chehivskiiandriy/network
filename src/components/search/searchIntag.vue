<template>
  <div>
    <in-search-block
      class="search">
      <div class="search-input-block" style="width: 100%">
        <input
          type="text"
          :placeholder="$lang.variables.searchByInTag"
          :value="searchInput"
          @keyup="search"
          class="search-input-field">
      </div>
    </in-search-block>

    <div
      v-if="posts.length > 0"
      class="post-block">
      <div
        v-for="post in posts"
        :key="post.id"
        class="prof-post profile-post">
        <in-profile-post-solo :post="post"/>
      </div>
    </div>

    <in-spinner :loading="loading"/>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex'

  import {
    FETCH_INTAGS_POSTS,
    FETCH_INTAGS_POSTS_NEXT_PAGE,
    INTAGS_POSTS,
    LOADING,
    CHANGE_QUERY,
    QUERY,
    moduleName as searchIntagsModule
  } from "Store/modules/search/searchIntags";

  import {scrollOnBottom} from "Mixins/scrollOnBottom";

  import ProfilePostSolo from 'ComponentsVue/profile/content/ProfilePostSolo.vue'


  export default {
    mixins: [scrollOnBottom],
    components: {
      inProfilePostSolo: ProfilePostSolo
    },
    data() {
      return {
        timeout: null
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.getPostsIntagsNextPage()
        }
      },
    },
    computed: {
      ...mapGetters({
        posts: searchIntagsModule + INTAGS_POSTS,
        loading: searchIntagsModule + LOADING,
        searchInput: searchIntagsModule + QUERY
      })
    },
    mounted() {
      if(this.posts.length === 0) {
        this.getPostsIntags();
      }
    },
    methods: {
      ...mapActions({
        getPostsIntags: searchIntagsModule + FETCH_INTAGS_POSTS,
        getPostsIntagsNextPage: searchIntagsModule + FETCH_INTAGS_POSTS_NEXT_PAGE
      }),
      ...mapMutations({
        changeQuery : searchIntagsModule + CHANGE_QUERY
      }),
      search(e) {
        this.changeQuery(e.target.value);
        this.searchIntagsAction();
      },
      searchIntagsAction() {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
          this.getPostsIntags();
        }, 500);
      },
      goToLink(slug) {
        this.$router.push('/p/' + slug);
      }
    }
  }
</script>

<style lang="less">
  .profile-post{
    width: calc(~'25vw - 2.5px');
    height: calc(~'25vw - 2.5px');
    display: inline-block;
    position: relative;
    margin: 0 0 2px 2px;

    .profile-video-background {
      height: calc(~'25vw - 2.5px');
    }

    img {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 5px;
    }
  }

  .post-block--item {
    display: inline-block;
  }

  .post-block {
    display: flex;
    flex-wrap: wrap;
    text-align: left;
  }
</style>
