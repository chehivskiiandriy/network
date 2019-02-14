<template>

  <div class="post-stat">

    <div class="post-stat--item" v-if="!expanded || selected === 'views'">
      <div class="post-stat--title">
        <i class="icon-eye"></i>
        <span class="stat-name">{{$lang.poststatistics.views}}:</span>
        <span v-text="post.views_count"></span>
      </div>
    </div>
    <div class="post-stat--item" v-if="!expanded || selected === 'likes'" :class="{active: selected === 'likes' && expanded}">
      <div class="post-stat--title">
        <i :class="classIconLike"></i>
        <span class="stat-name">{{$lang.poststatistics.likes}}:</span>
        <span v-text="post.likes_count"></span>
        <template v-if="likers.length > 5">
          <span
            v-if="expanded"
            @click="hideStatClass"
            class="post-stat--expanded">
            {{$lang.poststatistics.back}}
          </span>
          <span
            v-else-if="!expanded"
            @click="selectStatClass('likes')"
            class="post-stat--expanded">
            {{$lang.poststatistics.more}}
            <i class="icon-right-f"></i>
          </span>
        </template>
      </div>
      <div
        v-if="likers.length > 0"
        class="stat-block--content">
        <template v-if="expanded || likers.length <= 5">
          <div
            class="stat-block--item"
            v-for="user in likers">
            <router-link :to="'/u/'+user.nickname">
              <img :src="user.avatar_image.url_small">
              <p v-text="user.nickname"></p>
              <span v-if="user.multiplier > 1" class="stat-block--multiplier">+{{user.multiplier}}</span>
            </router-link>
          </div>
        </template>
        <template v-else>
          <div
            class="stat-block--item"
            v-for="i in 5">
            <router-link :to="'/u/'+likers[i-1].nickname">
              <img :src="likers[i-1].avatar_image.url_small">
              <p v-text="likers[i-1].nickname"></p>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <div class="post-stat--item" v-if="!expanded || selected === 'commentators'" :class="{active: selected === 'commentators' && expanded}">
      <div class="post-stat--title">
        <i :class="classIconSpeech"></i>
        <span class="stat-name">{{$lang.poststatistics.commentators}}:</span>
        <span v-text="commentators.length"></span>
        <template v-if="commentators.length > 5">
          <span
            v-if="expanded"
            @click="hideStatClass"
            class="post-stat--expanded">
            {{$lang.poststatistics.back}}
          </span>
          <span
            v-else-if="!expanded"
            @click="selectStatClass('commentators')"
            class="post-stat--expanded">
            {{$lang.poststatistics.more}}
            <i class="icon-right-f"></i>
          </span>
        </template>
      </div>
      <div
        v-if="commentators.length > 0"
        class="stat-block--content">
        <template v-if="expanded || commentators.length <= 5">
          <div
            class="stat-block--item"
            v-for="user in commentators">
            <router-link :to="'/u/'+user.nickname">
              <img :src="user.avatar_image.url_small">
              <p v-text="user.nickname"></p>
            </router-link>
          </div>
        </template>
        <template v-else>
          <div
            class="stat-block--item"
            v-for="i in 5">
            <router-link :to="'/u/'+commentators[i-1].nickname">
              <img :src="commentators[i-1].avatar_image.url_small">
              <p v-text="commentators[i-1].nickname"></p>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <div class="post-stat--item" v-if="!expanded || selected === 'reposters'" :class="{active: selected === 'reposters' && expanded}">
      <div class="post-stat--title">
        <i :class="classIconRepost"></i>
        <span class="stat-name">{{$lang.poststatistics.reposts}}:</span>
        <span v-text="reposters.length"></span>
        <template v-if="reposters.length > 5">
          <span
            v-if="expanded"
            @click="hideStatClass"
            class="post-stat--expanded">
            {{$lang.poststatistics.back}}
          </span>
          <span
            v-else-if="!expanded"
            @click="selectStatClass('reposters')"
            class="post-stat--expanded">
            {{$lang.poststatistics.more}}
            <i class="icon-right-f"></i>
          </span>
        </template>
      </div>
      <div
        v-if="reposters.length > 0"
        class="stat-block--content">
        <template v-if="expanded || reposters.length <= 5">
          <div
            class="stat-block--item"
            v-for="user in reposters">
            <router-link :to="'/u/'+user.nickname">
              <img :src="user.avatar_image.url_small">
              <p v-text="user.nickname"></p>
            </router-link>
          </div>
        </template>
        <template v-else>
          <div
            class="stat-block--item"
            v-for="i in 5">
            <router-link :to="'/u/'+reposters[i-1].nickname">
              <img :src="reposters[i-1].avatar_image.url_small">
              <p v-text="reposters[i-1].nickname"></p>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <div class="post-stat--item" v-if="!expanded || selected === 'mentions'" :class="{active: selected === 'mentions' && expanded}">
      <div class="post-stat--title">
        <i :class="classIconMentions"></i>
        <span class="stat-name">{{$lang.poststatistics.mentions}}:</span>
        <span v-text="mentions.length"></span>
        <template v-if="mentions.length > 5">
          <span
            v-if="expanded"
            @click="hideStatClass"
            class="post-stat--expanded">
            {{$lang.poststatistics.back}}
          </span>
          <span
            v-else-if="!expanded"
            @click="selectStatClass('mentions')"
            class="post-stat--expanded">
            {{$lang.poststatistics.more}}
            <i class="icon-right-f"></i>
          </span>
        </template>
      </div>
      <div
        v-if="mentions.length > 0"
        class="stat-block--content">
        <template v-if="expanded || mentions.length <= 5">
          <div
            class="stat-block--item"
            v-for="user in mentions">
            <router-link :to="'/u/'+user.nickname">
              <img :src="user.avatar_image.url_small">
              <p v-text="user.nickname"></p>
            </router-link>
          </div>
        </template>
        <template v-else>
          <div
            class="stat-block--item"
            v-for="i in 5">
            <router-link :to="'/u/'+mentions[i-1].nickname">
              <img :src="mentions[i-1].avatar_image.url_small">
              <p v-text="mentions[i-1].nickname"></p>
            </router-link>
          </div>
        </template>
      </div>
    </div>
    <div
      v-if="!expanded"
      class="post-stat--item post-stat-flex">
      <span>Переходы в профиль</span>
      <span>{{profileViews}}</span>
    </div>
    <div
      v-if="!expanded"
      class="post-stat--item post-stat-flex">
      <span>Активность</span>
      <span>{{postActivityCount}}</span>
    </div>

    <p
      v-if="!expanded"
      class="statistic-info">Информация по статистике</p>

    <in-spinner :loading="loading" />
  </div>
</template>

<script>
  import axios from 'axios';

  import {scrollOnBottom} from "../mixins/scrollOnBottom";

  export default {
    mixins: [scrollOnBottom],
    data() {
      return {
        post: [],
        post_id: '',
        likers: [],
        commentators: [],
        reposters: [],
        mentions: [],
        // class icon
        classIconLike: 'icon-heart',
        classIconSpeech: 'icon-speech',
        classIconRepost: 'icon-share',
        classIconMentions: 'icon-guy-2',
        expanded: false,
        selected: '',
        likersLastPage: 1,
        likersNextPage: 2,
        commentatorsLastPage: 1,
        commentatorsNextPage: 2,
        repostersLastPage: 1,
        repostersNextPage: 2,
        mentionsLastPage: 1,
        mentionsNextPage: 2,
        loading: false,
        profileViews: 0,
      }
    },
    computed: {
      postActivityCount() {
        let count = this.post.views_count
          + this.likers.length
          + this.commentators.length
          + this.reposters.length
          + this.mentions.length
          + this.profileViews;

        if(count) {
          return count;
        } else {
          return 0;
        }
      }
    },
    watch: {
      bottom(bottom) {
        if(bottom && !this.loading) {
          if(this.selected === 'likes') {
            if (this.likersLastPage >= this.likersNextPage) {
              this.getLikersNext();
            }
          } else if(this.selected === 'commentators') {
            if (this.commentatorsLastPage >= this.commentatorsNextPage) {
              this.getCommentatorsNext();
            }
          } else if(this.selected === 'reposters') {
            if (this.repostersLastPage >= this.repostersNextPage) {
              this.getRepostersNext();
            }
          } else if(this.selected === 'mentions') {
            if (this.mentionsLastPage >= this.mentionsNextPage) {
              this.getMentionsNext();
            }
          }
        }
      }
    },
    mounted() {
      this.post_id = this.$route.params.statistics_id;
      axios.get('v1/users/posts/get?id=' + this.post_id)
        .then(res => {
          this.post = res.data;
        })
        .catch(err => console.log(err.response));

      const data = new FormData();
      data.append('id', this.post_id);

      (async () => {
        try {
          let res = await this.$api.users.getPostStatistics(data);
          this.profileViews = res.data.profile_views;
        } catch (e) {

        }
      })();

      (async () => {
        try {
          let [likers, commentators, reposters, mentions] = await Promise.all([
            this.getLikers(),
            this.getCommentators(),
            this.getReposters(),
            this.getMentions()
          ]);

          if (likers.data.data.length) {
            this.likers = likers.data.data;
            this.likersLastPage = likers.data.meta.last_page;
            this.classIconLike = 'icon-heart-f'
          }

          if (commentators.data.data.length) {
            this.commentators = commentators.data.data;
            this.commentatorsLastPage = commentators.data.meta.last_page;
            this.classIconSpeech = 'icon-speech-f'
          }

          if (reposters.data.data.length) {
            this.reposters = reposters.data.data;
            this.repostersLastPage = reposters.data.meta.last_page;
            this.classIconRepost = 'icon-share-f'
          }

          if (mentions.data.data.length) {
            this.mentions = mentions.data.data;
            this.mentionsLastPage = mentions.data.meta.last_page;
            this.classIconMentions = 'icon-guy-2-f'
          }
        } catch (e) {

        }

        this.bottom = false;
      })();
    },
    methods: {
      selectStatClass(type) {
        this.expanded = true;
        this.selected = type;
      },
      hideStatClass() {
        this.expanded = false;
      },
      getLikers() {
        return axios.get('v1/users/posts/likers/all?limit=60&id=' + this.post_id)
      },
      getCommentators() {
        return axios.get('v1/users/posts/commentators/all?limit=60&id=' + this.post_id)
      },
      getReposters() {
        return axios.get('v1/users/posts/reposters/all?limit=60&id=' + this.post_id)
      },
      getMentions() {
        return axios.get('v1/users/posts/mentions/all?limit=60&id=' + this.post_id)
      },
      getLikersNext() {
        this.loading = true;
        axios.get('v1/users/posts/likers/all?limit=60&id=' + this.post_id + '&page=' + this.likersNextPage).then(res => {
          this.likers = this.likers.concat(res.data.data);
          this.likersNextPage = res.data.meta.current_page + 1;
          this.loading = false;
        }).catch(e => {
          this.loading = false;
        })
      },
      getCommentatorsNext() {
        this.loading = true;
        axios.get('v1/users/posts/commentators/all?limit=60&id=' + this.post_id + '&page=' + this.commentatorsNextPage).then(res => {
          this.commentators = this.commentators.concat(res.data.data);
          this.commentatorsNextPage = res.data.meta.current_page + 1;
          this.loading = false;
        }).catch(e => {
          this.loading = false;
        })
      },
      getRepostersNext() {
        this.loading = true;
        axios.get('v1/users/posts/reposters/all?limit=60&id=' + this.post_id + '&page=' + this.repostersNextPage).then(res => {
          this.reposters = this.reposters.concat(res.data.data);
          this.repostersNextPage = res.data.meta.current_page + 1;
          this.loading = false;
        }).catch(e => {
          this.loading = false;
        })
      },
      getMentionsNext() {
        this.loading = true;
        axios.get('v1/users/posts/mentions/all?limit=60&id=' + this.post_id + '&page=' + this.mentionsNextPage).then(res => {
          this.mentions = this.mentions.concat(res.data.data);
          this.mentionsNextPage = res.data.meta.current_page + 1;
          this.loading = false;
        }).catch(e => {
          this.loading = false;
        })
      }
    },
    head: {
      title() {
        return {
          inner: this.$lang.variables.postStatistics
        }

      },
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  #SpinnerOnloadImg{
    display: block;
    width: 35%;
    margin: auto;
  }

  .post-stat {
    &--item {
      margin: 5px 0;
      padding: 3px 10px;
      text-align: left;
      background-color: #fff;
      border-bottom: 1px solid #d3d3d3;
      //.setShadowMobile();

      &.active {
        box-shadow: none;
      }
    }
    &--title {
      display: flex;
      align-items: center;
      padding-bottom: 5px;
      position: relative;
      i {
        .text-grad();
      }
    }
    &--expanded {
      position: absolute;
      right: 0;
      color: #5ac5c6;
      display: flex;
      align-items: center;

      .icon-right-f {
        font-size: 16px;
        padding-left: 5px;
      }
    }
  }

  .post-stat-flex {
    display: flex;
    justify-content: space-between;
    padding-bottom: 5px;
  }

  .stat-name {
    padding: 0 5px 0 10px;
  }

  .statistic-info {
    margin: 10px auto;
    color: @contest-list-text-color;
  }

  .stat-block--item {
    width: 19%;
    display: inline-block;
    margin: 0 0.5%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    img {
      width: 100%;
      height: auto;
      border-radius: 5px;
    }
    p {
      margin: 0;
      font-size: 10px;
      color: #000;
      text-align: center;
      margin-top: -3px;
    }
  }

  .stat-block--multiplier {
    position: absolute;
    top: 1px;
    right: 3px;
    color: @red;
    text-shadow: 1px 1px 0 #000;
  }

  .stat-block--content {
    padding-top: 10px;
  }
</style>
