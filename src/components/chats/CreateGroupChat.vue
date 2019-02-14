<template>
  <div class="create-group-chat">
    <in-chats-common-header :name="$lang.variables.toCreateAGroup"/>

    <div class="create-group-chat-name">
      <input
        :placeholder="$lang.variables.groupNameMaximumCharacters"
        v-model="name"
        maxlength="18"
        class="create-group-chat-name-input" />
    </div>

    <in-search-people @select-user="selectUser" />

    <div
      @click="createChat"
      class="create-group-chat-create">
      <button
        class="create-group-chat-create-button"
        :class="{'create-group-chat-create-button-active' : selected.length > 0 && this.name}">
        {{$lang.variables.create}}
      </button>
    </div>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  import {
    moduleName as chatsAllModule,
    CREATE_CHAT
  } from "Store/modules/chats/chatsAll";
  import ChatsCommonHeader from 'ComponentsVue/chats/ChatsCommonHeader';
  import SearchPeople from 'ComponentsVue/chats/SearchPeople';

  export default {
    name: "CreateGroupChat",
    components: {
      inChatsCommonHeader: ChatsCommonHeader,
      inSearchPeople: SearchPeople
    },
    data() {
      return {
        selected: [],
        name: '',
        loading: false
      }
    },
    methods: {
      ...mapActions({
        createChatAction: chatsAllModule + CREATE_CHAT
      }),
      selectUser(value) {
        this.selected = value;
      },
      async createChat() {
        if(this.selected.length > 0 && this.name && !this.loading) {
          this.loading = true;

          let ids = [];

          for(let i = 0; i < this.selected.length; i++) {
            ids.push(this.selected[i].id);
          }

          const payload = {
            name: this.name,
            ids,
            onSuccess: this.onSuccess,
            onFail: this.onFail
          };

          this.createChatAction(payload);
        }
      },
      onSuccess(id) {
        this.loading = false;
        this.$router.push('/messages/' + id);
      },
      onFail() {
        this.loading = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~LessStyle/variables.less";

  .create-group-chat {
    &-name {
      width: calc(~'100vw - 10px');
      margin: 5px;
      padding-top: 5px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;

      &-input {
        border-radius: 5px;
        border: 2px solid #5ac5c6;
        color: #2c3e50;
        margin: 0;
        padding: 8px 10px;
        font-size: 16px;
        width: 100%;
        box-sizing: border-box;
      }
    }

    &-create {
      border-top: 1px solid #bbb;
      width: 100%;
      position: fixed;
      bottom: 0;
      background: @white;

      &-button {
        border-radius: 5px;
        color: @dark_grey;
        box-shadow: inset 0 0 0 1px @dark_grey;
        padding: 8px 10px;
        width: 50%;
        box-sizing: border-box;
        border: none;
        margin: 20px 0;
        font-size: 4.2vw;

        &-active {
          color: @white;
          box-shadow: none;
          .bgc-grad();
        }
      }
    }
  }
</style>
