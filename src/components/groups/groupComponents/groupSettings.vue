<template>
  <in-bottom-menu :show="show" @update:show="$emit('update:show')">
    <in-bottom-menu-section>
      <in-bottom-menu-item
        v-if="group.fee && user.role==='admin'">
        {{$lang.variables.balance}}: {{group.coins}}
      </in-bottom-menu-item>
      <in-bottom-menu-item
        v-if="user.role==='participant' || user.role==='admin'"
        class="balance-icon"
        @action="createVideo">{{$lang.variables.createVideo}}</in-bottom-menu-item>
      <in-bottom-menu-item
        v-if="user.role==='participant' || user.role==='admin'"
        @action="createAlbum">{{$lang.variables.createAlbum}}</in-bottom-menu-item>
      <in-bottom-menu-item
        @action="groupInvite">{{$lang.variables.toInvite}}</in-bottom-menu-item>
      <in-bottom-menu-item
        v-if="user.role==='admin'"
        @action="editGroup">{{$lang.variables.editGroup}}</in-bottom-menu-item>
      <in-bottom-menu-item
        ref="copyLink"
        @action="copyLink">{{$lang.variables.copyTheLink}}</in-bottom-menu-item>
      <in-bottom-menu-item
        @action="shareInFacebook">{{$lang.variables.shareInFacebook}}</in-bottom-menu-item>
      <in-bottom-menu-item
        @action="shareOnTwitter">{{$lang.variables.shareOnTwitter}}</in-bottom-menu-item>
    </in-bottom-menu-section>
  </in-bottom-menu>
</template>

<script>
  import {mapGetters} from 'vuex';
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";
  import { writeTextToClipboard } from 'JsLib/clipboard';
  import Share from 'JsLib/social-link';

  export default {
    name:'groupSettings',
    props:['group','user', 'show'],
    data() {
      return {
        groupId:'',
      }
    },
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER,
      })
    },
    mounted() {
    },
    methods: {
      closeSettings() {
        this.$modal.hide('groupSettingsModal');
      },
      leaveGroup() {
        axios.post('v1/groups/join?group_slug='+this.group.slug+'&delete=true')
          .then(
            res=> {

            }
          )
      },
      editGroup() {
        this.$modal.hide('groupSettingsModal');
        this.$router.push('/group/'+this.group.slug+'/edit');
      },
      createVideo() {
        this.$modal.hide('groupSettingsModal');
        this.$router.push('/group/'+this.group.slug+'/create-video');
      },
      createAlbum() {
        this.$modal.hide('groupSettingsModal');
        this.$router.push('/group/'+this.group.slug+'/create-album');
      },
      groupInvite() {
        this.$modal.hide('groupSettingsModal');
        this.$router.push('/group/'+this.group.slug+'/invite');
      },
      async copyLink() {
        let text = window.location.href;
        await writeTextToClipboard(text);
        this.$notify({
          group:'copy-link',
          duration: 5000,
          spedd: 300,
        });
        this.$modal.hide('groupSettingsModal');
      },
      shareInFacebook() {
        const social = new Share(
          window.location.href,
          this.group.name,
        );
        social.facebook();
      },
      shareOnTwitter() {
        const social = new Share(
          window.location.href,
          this.group.name,
        );
        social.twitter();
      },
    }
  }
</script>

<style lang="less">
    @import '~LessStyle/variables.less';
    .settings-item {
      background: #fff;
      padding: 13px 0;
      color: #0A84FF;
      font-size: 20px;
      text-align: center;
      margin: 0px;
      border-bottom: 1px solid #777;
    }

    .first-item {
      border-radius: 10px 10px 0 0;
      border-top: 0;
    }

    .last-item {
      border-radius: 0 0 10px 10px;
      border-bottom: 0;
    }

    .settings-close {
      margin-top: 10px;
      border-radius: 10px;
    }

    .group-settings {
      background: transparent;
      border-radius: 10px;
      // top: 10vw !important;
    }

    .balance-icon {
      color:@base_green
    }
</style>
