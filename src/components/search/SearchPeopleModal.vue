<template>
  <div class="search-people">
    <in-search-block class="search">
      <div
        class="search-input-block"
        :style="{width: searchInputWidth}">
        <input
          type="text"
          :placeholder="$lang.variables.searchByNameOrNickname"
          v-model="searchInput"
          @keyup="fetch"
          class="search-input-field">
      </div>
      <div
        v-show="selected.length > 0"
        class="search-selected">
        <span class="count">
          {{$lang.variables.selected}}: {{selected.length}}
        </span>
        <i
          @click="clearArray"
          class="icon-gradient icon-delete-f"></i>
      </div>
    </in-search-block>

    <div class="search-people-choose">
      <span
        class="search-people-choose-item"
        v-for="user in selected"
        :key="user.id">
        <span>{{user.nickname}}</span>
        <i
          @click="removeUser(user.id)"
          class="icon-delete-f"></i>
     </span>
    </div>

    <div class="selected-users">
      <in-user-card
        v-for="user in users"
        :key="selectedObject[user.id]">
        <div
          class="user-card"
          @click="addUser(user)">
          <div class="user-card-avatar">
            <img
              class="user-card-avatar-preview"
              :src="user.avatar_image.url_medium">
          </div>
          <div class="user-card-info">
            <div class="user-card-info-container">
              <in-nickname tag="p" class="user-card-nickname" :status="user.status">{{user.nickname}}</in-nickname>
              <p class="user-card-name">
                <span v-text="user.name"></span>
                <span v-text="user.lastname"></span>
              </p>
            </div>
          </div>
          <div class="user-card-actions">
            <i
              v-if="selectedObject[user.id]"
              class="icon-actions icon-check-f"></i>
            <i
              v-else
              class="icon-actions icon-check"></i>
          </div>
        </div>
      </in-user-card>
    </div>

    <in-spinner :loading="loading"/>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';

  import {
    moduleName as walletModule,
    SELECTED_USER
  } from "Store/modules/wallet";

  export default {
    name: "SearchPeopleModal",
    props: {
      bottom: Boolean,
      withCoins: Boolean
    },
    data() {
      return {
        searchInput: '',
        users: [],
        selected: [],
        selectedObject: {},
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
    computed: {
      ...mapGetters({
        selectedUser: walletModule + SELECTED_USER
      }),
      searchInputWidth() {
        return this.selected.length > 0 ? '60%' : '100%'
      }
    },
    mounted() {
      if(this.selectedUser) {
        this.users.push({...this.selectedUser});
        let user = {...this.selectedUser};

        if(this.withCoins) {
          user.coins = 1000;
        }
        this.selected.push(user);
        this.$set(this.selectedObject, user.id, user.id);
        this.$emit('select-user', [...this.selected]);
      } else {
        this.fetch();
      }
    },
    methods: {
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
      clearArray() {
        this.selected = [];
        this.selectedObject = {};
        this.$emit('select-user', []);
      },
      removeUser(id) {
        this.selected = this.selected.filter(item => item.id !== id);
        this.$set(this.selectedObject, id, null);
        this.$emit('select-user', [...this.selected]);
      },
      addUser(user) {
        if (this.selectedObject[user.id]) {
          this.selected = this.selected.filter(item => item.id !== user.id);
          this.$set(this.selectedObject, user.id, null);
          this.$emit('select-user', [...this.selected]);
        } else {
          if(this.withCoins) {
            user.coins = 1000;
          }
          this.selected.push(user);
          this.$set(this.selectedObject, user.id, user.id);
          this.$emit('select-user', [...this.selected]);
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~LessStyle/variables.less";

  .search-people {
    padding-bottom: 80px;

    .selected-users {
      display: flex;
      flex-wrap: wrap;
      margin: 5px;
    }

    .search-people-choose {
      width: 98%;
      margin: auto;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-start;
      overflow-y: scroll;

      &-item {
        padding: 5px 10px;
        border: 1px solid #d3d3d3;
        color: #d3d3d3;
        border-radius: 4px;
        margin: 2px 2px;
        display: flex;
        align-items: center;

        i {
          color: #5ac5c6;
          margin-left: 10px;
        }
      }
    }
  }
</style>
