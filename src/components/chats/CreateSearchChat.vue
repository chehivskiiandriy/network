<template>
  <div class="create-search-chat">
    <in-chats-common-header :name="$lang.variables.search"/>

    <in-search-block class="search">
      <div class="search-input-block" style="width: 100%">
        <input
          type="text"
          :placeholder="$lang.variables.searchByNameOrNickname"
          v-model="searchInput"
          @keyup="fetch"
          class="search-input-field">
      </div>
    </in-search-block>

    <div class="selected-users">
      <in-user-card
        v-for="user in users"
        :key="user.id">
        <div
          class="user-card"
          @click="createChat(user.id)">
          <div class="user-card-avatar">
            <img
              class="user-card-avatar-preview"
              :src="user.avatar_image.url_medium">
          </div>
          <div class="user-card-info">
            <div class="user-card-info-container">
              <in-nickname class="user-card-nickname" tag="p" :status="user.status">{{user.nickname}}</in-nickname>
              <p class="user-card-name">
                <span v-text="user.name"></span>
                <span v-text="user.lastname"></span>
              </p>
            </div>
          </div>
          <div class="user-card-actions">
            <div class="start-chat">
              {{$lang.variables.startChatting}}
            </div>
          </div>
        </div>
      </in-user-card>
    </div>

    <in-spinner :loading="loading"/>
  </div>
</template>

<script>
  import {mapActions} from 'vuex';

  import {scrollOnBottom} from "Mixins/scrollOnBottom";
  import {CHECK_CHAT, moduleName as chatsModule} from "Store/modules/chats/chats";
  import ChatsCommonHeader from 'ComponentsVue/chats/ChatsCommonHeader';

  export default {
    name: "CreateSearchChat",
    mixins: [scrollOnBottom],
    components: {
      inChatsCommonHeader: ChatsCommonHeader
    },
    data() {
      return {
        searchInput: '',
        users: [],
        loading: false,
        nextPage: 2,
        lastPage: 1
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchNextPage();
        }
      }
    },
    mounted() {
      this.fetch();
    },
    methods: {
      ...mapActions({
        checkChat: chatsModule + CHECK_CHAT,
      }),
      async fetch() {
        this.loading = true;
        this.users = [];

        const data = new FormData();
        data.append('query', this.searchInput);

        try {
          let res = await this.$api.users.usersSearch(data);

          this.users = res.data.data;
          this.nextPage = res.data.meta.current_page + 1;
          this.lastPage = res.data.meta.last_page;

          this.loading = false;
        } catch (e) {
          this.loading = false;
        }
      },
      async fetchNextPage() {
        if (this.loading || this.lastPage < this.nextPage) {
          return;
        }

        this.loading = true;

        const data = new FormData();
        data.append('query', this.searchInput);
        data.append('page', this.nextPage);

        try {
          let res = await this.$api.users.usersSearch(data);

          this.users = [...this.users, ...res.data.data];
          this.nextPage = res.data.meta.current_page + 1;

          this.loading = false;
        } catch (e) {
          this.loading = false;
        }
      },
      createChat(id) {
        const payload = {
          id,
          onSuccess: this.onSuccessGoToChat,
          onFail: this.goToNewChat
        };
        this.checkChat(payload);
      },
      onSuccessGoToChat(id) {
        this.$router.push('/messages/' + id);
      },
      goToNewChat(id) {
        this.$router.push('/new-chat/' + id);
      },
    }
  }
</script>

<style lang="less" scoped>
  @import "~LessStyle/variables.less";

  .create-search-chat {
    .selected-users {
      display: flex;
      flex-wrap: wrap;
      margin: 5px;
    }

    .start-chat {
      color: @contest-list-text-color;
      padding-right: 10px;
      font-size: 3.8vw;
    }
  }
</style>
