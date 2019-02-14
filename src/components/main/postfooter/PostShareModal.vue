<template>
    <in-transition-component name="timeout">
      <in-settings-menu
        v-show="selectedPost"
        @click="closeShare"
        class="settings-menu-block">
        <in-transition-component name="fade">
          <div
            v-if="selectedPost"
            @click="closeShare"
            class="settings-menu-block-bg"></div>
        </in-transition-component>
        <in-transition-component name="translateY">
          <div v-if="selectedPost" class="settings-menu-block-container">
            <div class="settings-menu-block-section settings-menu-block-center">
              <div
                class="settings-menu-block-item"
                @click="showChats">{{$lang.variables.shareToChat}}
              </div>
              <div
                class="settings-menu-block-item"
                @click="shareSocial('facebook')">{{$lang.variables.shareInFacebook}}
              </div>
              <div
                class="settings-menu-block-item"
                @click="shareSocial('twitter')">{{$lang.variables.shareOnTwitter}}
              </div>
              <div
                class="settings-menu-block-item"
                @click="copyLink">{{$lang.variables.copyTheLink}}
              </div>
            </div>
            <div class="settings-menu-block-section settings-menu-block-bottom">
              <div
                @click="closeShare"
                class="settings-menu-block-item">{{$lang.variables.cancel}}
              </div>
            </div>
          </div>
        </in-transition-component>

        <in-chat-messages-forward
          :show="isShowForwardModal"
          isForwardPost
          @hideModal="hideForwardModal"/>
      </in-settings-menu>
    </in-transition-component>
</template>

<script>
  import {mapGetters, mapMutations} from 'vuex';

  import {writeTextToClipboard} from 'JsLib/clipboard';

  import {
    moduleName as chatMessagesModule,
    SELECT_POST
  } from "Store/modules/chats/chatMessages";

  import {
    moduleName as userModule,
    AUTH_USER
  } from "Store/modules/authUser/user";

  import {
    moduleName as postsModule,
    CHANGE_SELECTED_POST
  } from "Store/modules/posts";

  import Share from 'JsLib/social-link';
  import ChatMessagesForward from "ComponentsVue/chats/ChatMessagesForward/ChatMessagesForward";

  export default {
    components: {
      inChatMessagesForward: ChatMessagesForward
    },
    props: {
      selectedPost: [Object, null]
    },
    data() {
      return {
        isShowForwardModal: false,
        scrollTop: 0
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      })
    },
    mounted() {
      if(this.selectedPost) {
        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        document.getElementsByTagName('body')[0].style.top = -this.scrollTop + 'px';
        document.getElementsByTagName('body')[0].style.width = '100%';
        document.getElementsByTagName('body')[0].style.position = 'fixed';
      }
    },
    methods: {
      ...mapMutations({
        selectPost: chatMessagesModule + SELECT_POST,
        changeSelectedPost: postsModule + CHANGE_SELECTED_POST
      }),
      shareSocial(_name) {
        let Social = new Share(
          this.selectedPost.site_link,
          this.selectedPost.title,
        );

        if (_name === 'facebook') {
          Social.facebook()
        } else if (_name === 'twitter') {
          Social.twitter()
        }
      },
      closeShare() {
        document.getElementsByTagName('body')[0].style.removeProperty('top');
        document.getElementsByTagName('body')[0].style.removeProperty('position');
        document.getElementsByTagName('body')[0].style.removeProperty('width');
        document.body.scrollTop = this.scrollTop;
        document.documentElement.scrollTop = this.scrollTop;

        this.changeSelectedPost(null);
      },
      async copyLink() {
        let text = host + '/p/' + this.selectedPost.slug;
        await writeTextToClipboard(text);
        this.$notify({
          group: 'copy-link',
          duration: 3000,
          speed: 300,
        });
        this.closeShare();
      },
      showChats() {
        if (!this.$userStatus(this.authUser)) {
          return;
        }
        this.showModal();
      },
      showModal() {
        this.selectPost(this.selectedPost);
        this.isShowForwardModal = true;
      },
      hideForwardModal() {
        this.isShowForwardModal = false;
        this.closeShare();
      }
    }
  }
</script>

<style>

</style>
