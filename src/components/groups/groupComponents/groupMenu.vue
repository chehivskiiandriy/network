<template>
  <div class="group-menu--block">
    <div class="groups-menu">
      <div class="group-menu">
        <div @click="showAllParticipant()" class="group-menu--item">
          <i class="icon-group-ic"></i>
          <p v-text="group.users_count"></p>
        </div>
        <div class="group-menu--item" @click="goToAlbums">
          <i class="icon-photobank"></i>
          <p v-text="group.albums_count"></p>
        </div>
        <div v-if="group.group_user!=null && (group.group_user.role==='admin' || group.group_user.role==='participant')"
             class="group-menu--item subscribe">
          <router-link v-if="(postRoute && user.status!=='validating')" :to="'/new-post/'+group.slug"><i
            class="icon-plus-f"></i></router-link>
          <i v-else-if="(postRoute && user.status==='validating')" @click="userValid()" class="icon-plus-f"></i>
          <span v-else @click="goToGroupPost()"> <i class=" icon-photobank "></i></span>
        </div>
        <div v-else class="group-menu--item subscribe">
          <i @click="subscribeToGroup()" class=" icon-plus-guy "></i>
        </div>
        <!--<div class="group-menu--item" @click="goToDiscussion">
             <i class="icon-about-us-f"></i>
             <p v-text="this.group.discussions_count"></p>
        </div>-->
        <div class="group-menu--item">
          <i class="icon-videocamera-f"></i>
          <p v-text="0"></p>
        </div>
        <div class="group-menu--item settings">
          <i @click="openGroupSettings()" class="icon-vvv"></i>
        </div>
      </div>
    </div>
    <in-allparticipant></in-allparticipant>
    <in-group-settings :show.sync="shouldShowGroupSettings" :group="group" :user="group.group_user"></in-group-settings>
  </div>
</template>

<script>
  import axios from 'axios';

  import Vue from 'vue'
  import modalOfParticipant from 'ComponentsVue/groups/groupComponents/groupParticipant.vue'
  import groupSettings from 'ComponentsVue/groups/groupComponents/groupSettings.vue'

  Vue.component('in-allparticipant', modalOfParticipant);
  Vue.component('in-group-settings', groupSettings);
  export default {
    name: 'groupMenu',
    props: ['group'],
    computed: {},
    data() {
      return {
        groupSlug: '',
        postRoute: true,
        user: {},
        shouldShowGroupSettings: false,
      }
    },
    mounted() {
      this.groupSlug = this.$route.params.group_slug;
      this.user = JSON.parse(localStorage.getItem('user'));
    },
    methods: {
      subscribeToGroup() {
        axios.post('v1/groups/join?group_slug=' + this.groupSlug)
          .then(
            res => {
              let userId = JSON.parse(localStorage.getItem('user')).id;
              this.group.group_user = {
                group_id: this.group.id,
                role: 'participant',
                user_id: userId,
              }
            }
          )
      },
      leftToGroup() {
        axios.post('v1/groups/join?group_slug=' + this.groupSlug + '&delete=true')
          .then(
            res => {
              this.group.group_user = null;
            }
          )
      },
      showAllParticipant() {
        this.$modal.show('allParicipants');
      },
      openGroupSettings() {
        this.shouldShowGroupSettings = true;
      },
      goToDiscussion() {
        this.$router.push('/groups/' + this.group.slug + '/discussions');
        this.postRoute = false;
      },
      goToGroupPost() {
        this.$router.push('/groups/' + this.group.slug);
        this.postRoute = true;
      },
      goToAlbums() {
        this.$router.push('/groups/' + this.group.slug + '/albums');
        this.postRoute = false;
      },
      userValid() {
        this.$notify({
          group: 'validating-template',
          duration: 3000,
          speed: 300,
        });
      },

    }
  }
</script>

<style>

</style>
