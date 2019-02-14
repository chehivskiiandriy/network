<template>
  <modal
    name="openShare"
    width="95%"
    height="auto"
    classes="v--modal share-modal">
    <p class="share-item" @click="showChats()">
      {{$lang.variables.shareToChat}}
    </p>
    <p class="share-item" @click="shareSocial('facebook')">
      {{$lang.variables.shareInFacebook}}
    </p>
    <p class="share-item">
      {{$lang.variables.shareOnTwitter}}
    </p>
    <p class="share-item last-item" ref="copyLink" @click="copyLink(shareSlug)">
      {{$lang.variables.copyTheLink}}
    </p>
    <p @click="closeShare()" class="share-item share-close">
      {{$lang.variables.cancel}}
    </p>
  </modal>
</template>

<script>
  import axios from 'axios';

  import { writeTextToClipboard } from 'JsLib/clipboard';
  import Share from 'JsLib/social-link'

  export default {
    name: "share",
    data() {
      return {
        shareID: '',
        shareSlug: '',
        site_link: '',
        title: ''
      }
    },
    mounted() {
      this.$root.$on('shareID', (event) => {
        this.changeShareId(event);
      });
    },
    methods: {
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
      changeShareId(e) {
        this.shareID = e;
        axios.get('v1/users/posts/get?id=' + this.shareID)
          .then(res => {
            this.site_link = res.data.site_link;
            this.title = res.data.title;
            this.shareSlug = res.data.slug;
          });
      },
      showChats() {
        this.$modal.show('chatsModal');
      },
      closeShare() {
        this.$modal.hide('openShare');
      },
      async copyLink(id) {
        let text = host + '/p/' + id;
        await writeTextToClipboard(text);
      },
    }
  }
</script>

<style scoped>

</style>
