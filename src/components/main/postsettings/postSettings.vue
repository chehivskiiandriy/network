<template>
  <in-bottom-menu :show="show" @update:show="$emit('update:show', $event)" v-if="post">
    <in-bottom-menu-section>
      <template>
        <template v-if="!groupSlug">
          <in-bottom-menu-item
            v-if="post.author.is_subscribed && user.id !== post.author.id"
            @action="changeSubscribe">
            {{$lang.variables.subscribed}}
          </in-bottom-menu-item>
          <in-bottom-menu-item
            v-else-if="!post.author.is_subscribed && user.id !== post.author.id"
            @action="changeSubscribe">
            {{$lang.variables.subscribe}}
          </in-bottom-menu-item>
        </template>
        <in-bottom-menu-item
          v-if="user.id === post.author.id && post.is_avatar === false">
          <router-link :to="'/edit-post/' + post.slug"> {{$lang.variables.editPost}}</router-link>
        </in-bottom-menu-item>
        <template v-if="!group">
          <in-bottom-menu-item
            v-if="user.id === post.author.id && post.is_avatar === false"
            @action="deletePost">
            {{$lang.variables.deletePost}}
          </in-bottom-menu-item>
        </template>
        <template v-else>
          <in-bottom-menu-item
            v-if="shouldShowDeleteMenuItem"
            @action="deletePost">
            {{$lang.variables.deletePost}}
          </in-bottom-menu-item>
        </template>
        <in-bottom-menu-item
          v-if="user.id !== post.author.id"
          @action="postReport">
          {{$lang.post.complain}}
        </in-bottom-menu-item>
      </template>
    </in-bottom-menu-section>
  </in-bottom-menu>
</template>

<script>
  import axios from 'axios';
  import {mapActions, mapGetters} from 'vuex';

  import {DELETE_POST, moduleName as usersProfilePosts} from "Store/modules/users/usersProfilePosts";
  import {CURRENT_GROUP, moduleName as groupModule} from "Store/modules/groups/groups";
  import {CHANGE_SUBSCRIBE_USER, moduleName as usersModule} from 'Store/modules/users/users';

  import { writeTextToClipboard } from 'JsLib/clipboard';
  import Share from 'JsLib/social-link'
  import GroupAccess from 'utils/GroupAccess';

  export default {
    props: {
      user: Object,
      show: Boolean,
    },
    data() {
      return {
        post: null,
        title: '',
        site_link: '',
        groupSlug: this.$route.params.group_slug,
      }
    },
    mounted() {
      this.$root.$on('postAuthor', (post) => {
        this.post = post;
      });
    },
    computed: {
      ...mapGetters({
        groupInfo: groupModule + CURRENT_GROUP
      }),
      group() {
        return this.groupInfo(this.groupSlug);
      },
      shouldShowDeleteMenuItem() {
        const {user, post, group} = this;
        return (user && post && user.id === post.author.id && post.is_avatar === false) ||
          GroupAccess.canIDo(group && group.group_user.role, user && user.nickname,
            null, post && post.author && post.author.nickname, 'delete-post');
      },
    },
    methods: {
      ...mapActions({
        deletePostAction: usersProfilePosts + DELETE_POST,
        changeSubscribeUser: usersModule + CHANGE_SUBSCRIBE_USER
      }),
      closeSettings() {
        this.$modal.hide('postSettings');
      },
      changeSubscribe() {
        const payload = {
          nickname: this.post.author.nickname,
          delete: this.post.author.is_subscribed ? '1' : '0',
          onFail: this.onFailSubscribe,
          slug: this.$route.params.slug,
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
      onFailSubscribe(err) {
        if (err.response.data.errorInfo.errorCode === 1000) {
          this.$notify({
            group: 'guest-template',
            duration: 3000,
            speed: 300,
          });
        }
      },
      deletePost() {
        if (this.$route.params.group_slug) {
          let data = new FormData();
          data.append('group_slug', this.groupSlug);
          data.append('post_id', this.post.id);
          axios.post('v1/groups/posts/delete', data)
            .then(res => {
              window.location.reload();
            });
        }
        else {
          console.log(this.post.author);
          const payload = {
            nickname: this.post.author.nickname,
            id: this.post.id,
            onSuccess: this.onSuccessDeletePost
          };

          this.deletePostAction(payload);
        }
      },
      onSuccessDeletePost() {
        if (this.$route.fullPath.indexOf('/p/') !== -1) {
          history.go(-1);
        } else {
          window.location.reload();
        }
      },
      postReport() {
        axios.get('v1/users/posts/report?id=' + this.post.id)
          .then(res => {
            if (this.$route.params.slug)
              history.go(-1);
            else
              window.location.reload();
          })
      },
      async copyLink(id) {
        let text = host + '/p/' + id;
        await writeTextToClipboard(text);
        this.$notify({
          group: 'copy-link',
          duration: 3000,
          speed: 300,
        });
      },
      shareSocial(_name) {
        let Social = new Share(
          this.site_link,
          this.title,
        );

        if (_name === 'facebook') {
          Social.facebook()
        } else if (_name === 'twitter') {
          Social.twitter()
        }
      },
    }
  }
</script>

<style>
  .settings-modal {
    top: 70vh !important;
  }
</style>
