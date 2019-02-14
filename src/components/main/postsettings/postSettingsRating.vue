<template>
  <modal
    name="postSettingsRating"
    width="95%"
    height="auto"
    classes="v--modal settings-modal">
    <p class="settings-item" @click="shareSocial('facebook')">
      {{$lang.variables.shareInFacebook}}
    </p>
    <p class="settings-item" @click="shareSocial('twitter')">
      {{$lang.variables.shareOnTwitter}}
    </p>
    <p
      class="settings-item"
      :class="{'last-item': user.id === post.id}"
      ref="copyLink"
      @click="copyLink(slug)">
      {{$lang.variables.copyTheLink}}
    </p>

    <p
      v-if="user.id !== post.id"
      class="settings-item last-item">
      {{$lang.variables.complain}}
    </p>
    <p
      @click="closeSettings()"
      class="settings-item settings-close">
      {{$lang.variables.cancel}}
    </p>
  </modal>
</template>

<script>
  import { writeTextToClipboard } from 'JsLib/clipboard';
  import Share from 'JsLib/social-link'

  export default {
    props: ['user'],
    data() {
      return {
        post: {},
        postAuthor: {},
        subscribe: '',
        slug: '',
        id: '',
        isAvatar: 'false',
        title: '',
        site_link: '',
      }
    },
    mounted() {
      this.$root.$on('postAvatarShare', event => {
        this.post = event;
        this.postAuthor = event.author;
        this.subscribe = event.is_subscribed;
        this.slug = event.slug;
        this.id = event.avatar_post_id;

        this.title = event.title;
        this.site_link = event.site_link;
      });
    },
    computed: {
      isSubscribe: function () {
        return this.subscribe
      }
    },
    methods: {
      closeSettings() {
        this.$modal.hide('postSettingsRating');
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
          this.post.site_link,
          '',
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
    top: 40vh !important;
  }
</style>
