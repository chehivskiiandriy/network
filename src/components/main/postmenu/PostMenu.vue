<template>
  <div class="post-item--menu">
    <div class="item-menu--item">
      <in-toggle-icon
        v-if="authUser.status !== 'validating'"
        className="icon-share"
        classNameActive="icon-share-f"
        :authUser="authUser"
        :post="post"
        :count="post.reposts_count"
        :status="post.is_reposted"
        fillType="repost"
      />
      <div
        @click="userValid()"
        v-else>
        <p class="toogle-icon">{{post.reposts_count}}</p>
        <i class="icon-share"></i>
      </div>
    </div>
    <div class="item-menu--item">
      <div>
        <span @click="goToChat(post.author.id)"><i class="icon-letter"></i></span>
      </div>
    </div>
    <div class="item-menu--item">
      <in-toggle-icon
        className="icon-heart"
        classNameActive="icon-heart-f"
        :authUser="authUser"
        :post="post"
        :count="post.likes_count"
        :status="post.is_liked"
        fillType="like"
      />
    </div>
    <div class="item-menu--item">
      <span
        v-if="authUser.id === post.author.id"
        @click="cantToYou()"><i class="icon-gift"></i></span>
      <span v-else>
        <i
          @click="showPresentsModal"
          class=" icon-gift"></i>
      </span>
    </div>
    <div class="item-menu--item">
      <in-toggle-icon
        className="icon-bookmark"
        classNameActive="icon-bookmark-f"
        :authUser="authUser"
        :post="post"
        :count="post.bookmarks_count"
        :status="post.is_bookmarked"
        fillType="bookmark"
      />
    </div>
    <div
      class="opacity-bakcground"
      :style="{ 'backgroundImage': 'url('+this.backgroundImage+')'  }"></div>

    <in-wallet-presents-user-modal
      v-if="isShowPresentsModal"
      @hide-present-modal="hidePresentsModal"/>
  </div>
</template>

<script>
  import axios from 'axios';
  import {mapGetters, mapMutations} from 'vuex';
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import {moduleName as walletModule, CHANGE_SELECTED_USER} from "Store/modules/wallet";

  import Vue from 'vue'
  import PostToggleIcon from './PostToggleIcon.vue'
  import WalletPresentsUserModal from 'ComponentsVue/wallet/WalletPresentsUserModal';

  Vue.component('in-toggle-icon', PostToggleIcon);

  export default {
    name: 'PostMenu',
    props: ['post'],
    components: {
      inWalletPresentsUserModal: WalletPresentsUserModal
    },
    data() {
      return {
        backgroundImage: '',
        isShowPresentsModal: false
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      })
    },
    mounted() {
      if (this.post.attachments.images != null) {
        this.backgroundImage = this.post.attachments.images[0].url_medium;
      }
      else {
        if (this.post.attachments.posts != null ) {
          const obj = this.post.attachments.posts[0].attachments;
          this.backgroundImage = ( obj.images === null ? obj.videos[0].preview_url : obj.images[0].url_medium );
        }
      }
    },
    methods: {
      ...mapMutations({
        changeSelectedUser: walletModule + CHANGE_SELECTED_USER
      }),
      showPresentsModal() {
        this.changeSelectedUser({...this.post.author});
        this.isShowPresentsModal = true;
      },
      hidePresentsModal() {
        this.isShowPresentsModal = false;
      },
      chatUserNotify() {
        this.$notify({
          group: 'nophone',
          duration: 3000,
          speed: 300,
        });
      },
      userValid() {
        this.$notify({
          group: 'validating-template',
          duration: 3000,
          speed: 300,
        });
      },
      showRegistrationStep1() {
        this.$notify({
          group: 'guest-template',
          duration: 3000,
          speed: 300,
        });
      },
      goToChat(id) {
        if (this.$userStatus(this.authUser)) {
          if (this.authUser.id !== id) {
            axios.get('v1/me/chats/check?id=' + id)
              .then(res => {
                if (res.data.state)
                  this.$router.push('/messages/' + res.data.id);
                else
                  this.$router.push('/new-chat/' + id);
              })
          }
          else {
            this.$notify({
              group: 'write-to-you',
              duration: 3000,
              speed: 300,
            });
          }
        }
      },
      cantToYou() {
        this.$notify({
          group: 'cant-toyou',
          duration: 3000,
          speed: 300,
        });
      }
    }

  }
</script>

<style lang="less">
  @import '~LessStyle/variables.less';

  .item-menu--item {
    width: 18%;
    text-align: center;
    position: relative;
    z-index: 11;
    display: flex;
    align-items: flex-end;
    justify-content: center;

  }

  .item-menu--item i {

    color: #fff;
    font-size: 22px;
    &.icon-bookmark-f, &.icon-heart-f, .icon-share-f {
      .text-grad();
    }
  }

  .toogle-icon {
    color: #fff;
  }

</style>


