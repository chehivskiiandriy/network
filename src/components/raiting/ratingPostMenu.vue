<template>
  <div class="postraiting-menu" @click="showSubscribe">
    <div class="postraiting-menu-item raiting-sub">
      <in-ratingpost-toggle
        className="icon-R_line-guy-plus"
        classNameActive="icon-R_line-guy-plus-f"
        :statusFieldName="post.is_subscribed"
        fillType="subscribe"
        :authUser="authUser"
        :actionId="post.id"/>
    </div>
    <div class="postraiting-menu-item raiting-letter">
      <span
        v-if="authUser.status !== 'guest'"
        @click="goToChat()"><i class="icon-R_line_letter"></i></span>
      <span
        v-else
        @click="showRegistrationStep1()">  <i class="icon-R_line_letter"></i></span>
    </div>
    <div
      v-if="authUser.status !== 'guest'"
      class="postraiting-menu-item raiting-chin-chin">

      <in-ratingpost-toggle
        v-if="authUser.status !== 'validating'"
        className="icon-R_line_Chin-Chin"
        classNameActive="icon-R_line_Chin-Chin-f"
        :statusFieldName="post.is_chined"
        fillType="chin"
        :authUser="authUser"
        :actionId="post.id"/>
      <div
        @click="userValid()"
        v-else>
        <i class="icon-R_line_Chin-Chin"></i>
      </div>
    </div>
    <div
      v-else
      class="postraiting-menu-item raiting-chin-chin">
      <span @click="showRegistrationStep1()">  <i class="icon-R_line_Chin-Chin"></i></span>
    </div>
    <div class="postraiting-menu-item raiting-gift">
      <i
        v-if="authUser.status !== 'guest' && authUser.status !== 'validating'"
        @click="showPresentsModal"
        class=" icon-R_line-gift"></i>
      <i
        v-else-if="authUser.status === 'guest'"
        @click="showRegistrationStep1()"
        class="icon-R_line-gift"></i>
      <i
        v-else
        @click="userValid()"
        class="icon-R_line-gift"></i>
    </div>
    <div
      v-if="authUser.status !== 'guest'"
      class="postraiting-menu-item raiting-bookmark">
      <in-ratingpost-toggle
        className="icon-R_line-bookmark"
        classNameActive="icon-R_line-bookmark-f"
        :statusFieldName="post.is_bookmarked"
        fillType="bookmark"
        :authUser="authUser"
        :actionId="post.avatar_post_id"/>
    </div>
    <div
      v-else
      class="postraiting-menu-item raiting-bookmark">
      <span @click="showRegistrationStep1()">  <i class="icon-R_line-bookmark"></i></span>
    </div>

    <in-wallet-presents-user-modal
      v-if="isShowPresentsModal"
      @hide-present-modal="hidePresentsModal"/>
  </div>
</template>
<script>
  import axios from 'axios';
  import {mapGetters, mapMutations} from 'vuex';
  import Vue from 'vue'

  import ratingPostToggle from 'ComponentsVue/raiting/ratingPostToggle'
  import {AUTH_USER, moduleName as userModule} from 'Store/modules/authUser/user';
  import {moduleName as walletModule, CHANGE_SELECTED_USER} from "Store/modules/wallet";

  import WalletPresentsUserModal from 'ComponentsVue/wallet/WalletPresentsUserModal';

  Vue.component('in-ratingpost-toggle', ratingPostToggle);
  export default {
    props: ['post'],
    components: {
      inWalletPresentsUserModal: WalletPresentsUserModal
    },
    data() {
      return {
        isShowPresentsModal: false
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      })
    },
    methods: {
      ...mapMutations({
        changeSelectedUser: walletModule + CHANGE_SELECTED_USER
      }),
      showPresentsModal() {
        this.changeSelectedUser({...this.post});
        this.isShowPresentsModal = true;
      },
      hidePresentsModal() {
        this.isShowPresentsModal = false;
      },
      showSubscribe() {

      },
      userValid(){
        this.$notify({
          group: 'validating-template',
          duration: 3000,
          speed: 300,
        });
      },
      goToChat(){
        if(this.authUser.id !== this.post.id){
          axios.get('v1/me/chats/check?id=' + this.post.id)
          .then(res =>{
            if(res.data.state)
              this.$router.push('/messages/' + res.data.id);
            else
              this.$router.push('/new-chat/' + this.post.id);
          })
        }
        else{
          this.$notify({
            group: 'write-to-you',
            duration: 3000,
            speed: 300,
          });
        }

      },
      showRegistrationStep1(){
        this.$notify(
          {
            group: 'guest-template',
            duration: 3000,
            speed: 300,
          }
        )
      }
    },
  }
</script>
<style>

</style>
