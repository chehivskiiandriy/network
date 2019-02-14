<template>
  <div id="userPrivacy">
    <div class="settings-header">
      <div
        class="modal-title"
        >{{$lang.variables.settingPrivate}}
        <i @click="goBack" class="icon-left-f go-back"></i>
      </div>
    </div>
    <p>{{$lang.variables.whoCanSubscribeToThePage}}</p>
    <div class="private_tabs">
      <template v-if="getUserPrivacySettings">
        <div :class="(getUserPrivacySettings.subscribe==='all' || getUserPrivacySettings.subscribe===null) ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('all','subscribe')">
          {{$lang.variables.all}}
        </div>
        <div :class="getUserPrivacySettings.subscribe==='request' ? 'private_tab_item onactive_tabs' : 'private_tab_item' " @click="sendPrivacy('request','subscribe')">
          {{$lang.variables.onlyForApplications}}
        </div>
      </template>
    </div>
    <p>{{$lang.variables.seeMePost}}</p>
    <div class="private_tabs">
      <template v-if="getUserPrivacySettings">
        <div :class="getUserPrivacySettings.profile==='none' ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('none','profile')">
          {{$lang.variables.onlyI}}
        </div>
        <div :class="(getUserPrivacySettings.profile==='all' || getUserPrivacySettings.profile===null) ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('all','profile')">
          {{$lang.variables.all}}
        </div>
        <div :class="getUserPrivacySettings.profile==='subs' ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('subs','profile')">
          {{$lang.variables.subscribers}}
        </div>
      </template>
    </div>
    <p>{{$lang.variables.whoSeeMyFollowers}}</p>
    <div class="private_tabs">
      <template v-if="getUserPrivacySettings">
        <div :class="getUserPrivacySettings.subscribers==='none' ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('none','subscribers')">
          {{$lang.variables.onlyI}}
        </div>
        <div :class="(getUserPrivacySettings.subscribers==='all'  || getUserPrivacySettings.subscribers===null) ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('all','subscribers')">
          {{$lang.variables.all}}
        </div>
        <div :class="getUserPrivacySettings.subscribers==='subs' ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('subs','subscribers')">
          {{$lang.variables.subscribers}}
        </div>
      </template>
    </div>
    <p>{{$lang.variables.whoCanSeeMySubscriptions}}</p>
    <div class="private_tabs">
      <template v-if="getUserPrivacySettings">
        <div :class="getUserPrivacySettings.subscriptions==='none' ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('none','subscriptions')">
          {{$lang.variables.onlyI}}
        </div>
        <div :class="(getUserPrivacySettings.subscriptions==='all' || getUserPrivacySettings.subscriptions===null) ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('all','subscriptions')">
          {{$lang.variables.all}}
        </div>
        <div :class="getUserPrivacySettings.subscriptions==='subs' ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('subs','subscriptions')">
          {{$lang.variables.subscribers}}
        </div>
      </template>
    </div>
    <p>{{$lang.variables.whoCanSeeMyInTheChat}}</p>
    <div class="private_tabs">
      <template v-if="getUserPrivacySettings">
        <div :class="getUserPrivacySettings.chat==='none' ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('none','chat')">
          {{$lang.variables.onlyI}}
        </div>
        <div :class="(getUserPrivacySettings.chat==='all' || getUserPrivacySettings.chat===null ) ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('all','chat')">
          {{$lang.variables.all}}
        </div>
        <div :class="getUserPrivacySettings.chat==='subs' ? 'private_tab_item onactive_tabs' : 'private_tab_item'" @click="sendPrivacy('subs','chat')">
          {{$lang.variables.subscribers}}
        </div>
      </template>
    </div>

  </div>

</template>
<script>
    export default  {
      data() {
        return {
          user:JSON.parse(localStorage.getItem('user')),
        }
      },
      computed: {
        getUserInfo() {
          return window.storeUser.getters.getUserInfo;
        },
        getUserPrivacySettings() {
          return this.getUserInfo.privacy_settings;
        },
      },
      mounted() {
        window.storeUser.dispatch('LOAD_USER_INFO',{nickname:this.user.nickname});
      },
      methods: {
        sendPrivacy(value,field) {

          window.storeUser.dispatch('UPDATE_USER_PRIVACY',{privacyValue:value,privacyField:field,nickname:this.user.nickname});
        },
        goBack() {
          history.go(-1);
        }
      }
    }
</script>
<style lang="less">
  @import "~LessStyle/userprivacy";
  @import '~LessStyle/settings.less';
  @import '~LessStyle/changeprofile.less';
</style>
