<template>
    <modal name="storyMenu"
           width="90%"
           classes="storyMenu"
           :scrollable="true"
           height="auto"
           @closed="closeModal"	>
      <template v-if="authUser.id!==getUserInfo.id">
        <template v-if="getUserInfo.is_subscribed">
          <p class="settings-item" @click="unsubscribeUser">
            {{$lang.variables.unsubscribe}}
          </p>
        </template>
        <template v-else>
          <p class="settings-item" @click="addToBlackList">
            {{$lang.variables.addToBlackList}}
          </p>
        </template>
      </template>
      <template v-else>
        <p class="settings-item" @click="deleteInStory">
          Удалить InStory
        </p>
        <p class="settings-item" >
          Добавить в актуальное
        </p>
      </template>

      <p class="settings-item last-item" @click="closeModal">
        {{$lang.post.cancel}}
      </p>
    </modal>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'
  import {DELETE_STORY, moduleName as storyName} from 'Store/modules/stories'
  import {AUTH_USER, moduleName as userModule} from "Store/modules/authUser/user";

  export default  {
    name:'storyMenu',
    computed: {
      ...mapGetters({
        authUser: userModule + AUTH_USER
      }),
      getUserInfo() {
        return window.storeUserStories.getters.getUserStory;
      },
    },
    data() {
      return {
        storyId:'',
      }
    },
    mounted() {
      this.$root.$on('openMenuStory', (event)=>{
        this.storyId=event;
      });

    },
    methods: {
      ...mapActions({
        deleteStory:storyName+DELETE_STORY,
      }),
      unsubscribeUser() {
        window.storeUserStories.dispatch('USER_UNSUBSCRIBE',{delete:true, id:this.getUserInfo.id});
      },
      addToBlackList() {
        if (this.authUser.status !== 'guest') {
          let arr=[this.getUserInfo.id];
          window.storeBlackList.dispatch('ADD_TO_BLACKLIST',{ ids:JSON.stringify(arr)});
          this.$modal.hide('storyMenu');
          history.go(-1);
        }
        else {
          this.$notify({
            group: 'guest-template',
            duration: 3000,
            speed: 300,
          });
        }

      },
      closeModal() {
        this.$modal.hide('storyMenu');
        this.$root.$emit('continueStory');
      },
      deleteInStory() {
        this.$modal.hide('storyMenu');
        let data=new FormData;
        data.append('id',this.storyId);
        this.deleteStory(data);
        history.go(-1);
      },
    },
  }
</script>
<style lang="less">
  .storyMenu {
    border-radius: 5px;
    p {
      margin: 0px;
    }
    .settings-item {
      text-align: center;
      background: #fff;
      padding: 13px 0px;
      color: #0A84FF;
      font-size: 20px;
      border-bottom: 1px solid #777;
    }
    .last-item {
      border-radius:0px 0px 5px 5px ;
    }
  }
</style>
