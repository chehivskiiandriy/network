<template>
  <div class="profile-container">
    <div class="mention-header">
      <h3>{{$lang.variables.marks}}</h3>
    </div>
    <div
      v-if="mentions.length > 0"
      class="mentions-container">
      <in-profile-post-solo
        v-for="post in mentions"
        :key="post.id"
        :post="post"
        :class="postCount"
      />
    </div>
    <div v-else-if="!loading">
      Вас пока не отметили ни на одном посте
    </div>
    <in-spinner :loading="loading"/>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'

  import {scrollOnBottom} from "../../../mixins/scrollOnBottom";
  import {moduleName as countPostOnPageModule, PROFILE_POST_COUNT} from 'Store/modules/countPostOnPage';
  import {
    FETCH_MENTIONS,
    FETCH_MENTIONS_NEXT_PAGE,
    LOADING,
    MENTIONS,
    moduleName as mentionsModule
  } from "Store/modules/authUser/mentions";
  import ProfilePostSolo from './ProfilePostSolo.vue'

  export default {
    name: 'ProfileMentions',
    components: {
      inProfilePostSolo: ProfilePostSolo
    },
    mixins: [scrollOnBottom],
    computed: {
      ...mapGetters({
        profilePostCount: countPostOnPageModule + PROFILE_POST_COUNT,
        mentions: mentionsModule + MENTIONS,
        loading: mentionsModule + LOADING
      }),
      postCount: function(){
        if(this.profilePostCount === '4')
          return 'prof-post profile-post';
        else if(this.profilePostCount === '2')
          return 'prof-post profile-post-big';
        else
          return 'prof-post profile-post-big';
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchMentionsNextPage();
        }
      },
    },
    mounted(){
      this.fetchMentions();
    },
    methods: {
      ...mapActions({
        fetchMentions: mentionsModule + FETCH_MENTIONS,
        fetchMentionsNextPage: mentionsModule + FETCH_MENTIONS_NEXT_PAGE
      })
    }
  }
</script>
<style lang="less">

  @import '~LessStyle/variables.less';

  .profile-container{
    text-align: left;
  }

  .mentions-container {
    display: flex;
    flex-wrap: wrap;
  }

  .profile-post img{
    width: 100%;
    height: auto;
    display: block;
    border-radius: 5px;
  }

  .profile-post-big{
    position: relative;
    width: 49.4%;
    display: inline-block;
    margin-left: 2px;

  }

  .profile-post-big img{
    width: 100%;
    height: auto;
    display: block;
    border-radius: 5px;
  }

  .profile-post-big video{
    width: 100%;
    display: block;
    border-radius: 10px;
    background-color: #000;
  }

  .mention-header  {
    background: linear-gradient(to left top, #000fbc, #30c2be 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    width: 100%;
    padding: 0 8px;
    text-align: center;
    margin-top: 0;
    margin-bottom: 10px;
    h3 {
      position: relative;
      left: -6px;
      font-weight: 400;
      margin: 0;
      .text-grad();
    }
  }
</style>
