<template>
  <div class="group-invite">
    <in-header-block class="header header-gradient">
      <div
        @click="goBack"
        class="header-back">
        <i class="icon-left-f"></i>
      </div>
      <div class="header-content">
        <span class="header-content-name">{{$lang.variables.toInvite}}</span>
      </div>
      <div class="empty-block"></div>
    </in-header-block>

    <in-search-block class="search">
      <div
        class="search-input-block"
        :style="{width: searchInputWidth}">
        <input
          type="text"
          :placeholder="$lang.variables.searchByNameOrNickname"
          v-model="searchInput"
          @keyup="fetchSubscribers"
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
    <div
      @click="inviteSubscribers"
      class="group-invite-block">
      <button
        class="invite"
        :class="{'invite-active' : selected.length > 0 }">
        {{$lang.variables.toInvite}}
      </button>
    </div>
  </div>
</template>
<script>
  import {scrollOnBottom} from "Mixins/scrollOnBottom";

  export default {
    name: 'groupInvite',
    mixins: [scrollOnBottom],
    data() {
      return {
        searchInput: '',
        users: [],
        selected: [],
        selectedObject: {},
        groupSlug: this.$route.params.group_slug,
        loading: false,
        nextPage: 2,
        lastPage: 1
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.fetchSubscribersNextPage();
        }
      }
    },
    computed: {
      searchInputWidth() {
        return this.selected.length > 0 ? '60%' : '100%'
      }
    },
    mounted() {
      this.fetchSubscribers();
    },
    methods: {
      async inviteSubscribers() {
        try {
          const data = new FormData();
          data.append('group_slug', this.groupSlug);
          data.append('receiver_ids', JSON.stringify(this.selected.map(item => item.id)));

          await this.$api.groups.inviteToGroup(data);

          this.$notify({
            group: 'user-is-invited-to-group',
            duration: 3000,
            speed: 300,
          });
          this.$router.push(/group/ + this.groupSlug);
        } catch (e) {
          console.log(e);
          this.$notify({
            group: 'action-error',
            duration: 3000,
            speed: 300,
          });
          this.$router.push(/group/ + this.groupSlug);
        }
      },
      async fetchSubscribers() {
        this.loading = true;
        this.users = [];

        const data = new FormData();
        data.append('type', 'followers');
        data.append('query', this.searchInput);

        try {
          let res = await this.$api.users.usersSearch(data);

          this.users = res.data.data;
          this.nextPage = res.data.meta.current_page + 1;
          this.lastPage = res.data.meta.last_page;

          this.loading = false;
        } catch (e) {
          console.log(e);
          this.loading = false;
        }
      },
      async fetchSubscribersNextPage() {
        if (this.loading || this.lastPage < this.nextPage) {
          return;
        }

        this.loading = true;

        const data = new FormData();
        data.append('type', 'followers');
        data.append('query', this.searchInput);
        data.append('page', this.nextPage);

        try {
          let res = await this.$api.users.usersSearch(data);

          this.users = [...this.users, ...res.data.data];
          this.nextPage = res.data.meta.current_page + 1;

          this.loading = false;
        } catch (e) {
          console.log(e);
          this.loading = false;
        }
      },
      goBack() {
        history.go(-1);
      },
      clearArray() {
        this.selected = [];
        this.selectedObject = {};
      },
      addUser(user) {
        if (this.selectedObject[user.id]) {
          this.selected = this.selected.filter(item => item.id !== user.id);
          this.$set(this.selectedObject, user.id, null);
        } else {
          this.selected.push(user);
          this.$set(this.selectedObject, user.id, user.id);
        }
      }
    },
  }
</script>
<style lang="less">
  @import "~LessStyle/variables.less";

  .group-invite {
    padding-bottom: 80px;

    &-block {
      border-top: 1px solid @dark_grey;
      width: 100%;
      position: fixed;
      bottom: 0;
      background: @white;
      /*height: 20vh;*/

      .invite {
        border-radius: 5px;
        color: @dark_grey;
        box-shadow: inset 0 0 0 1px @dark_grey;
        padding: 8px 10px;
        width: 50%;
        box-sizing: border-box;
        border: none;
        margin-top: 2vh;
        margin-bottom: calc(~'3vh + 65px');
        font-size: 4.2vw;

        &-active {
          color: @white;
          box-shadow: none;
          .bgc-grad();
        }
      }
    }

  }

  .modal-title {
    color: @white;
  }

  .profile-subscribers-item {
    position: relative;
    display: flex;
    margin: 10px 10px;
    box-sizing: border-box;
    padding: 5px 0;
    border-radius: 10px;
    box-shadow: 2px 2px 0 0 rgba(95, 92, 92, 0.2);
  }

  .go-back {
    position: absolute;
    left: 4px;
    top: 1px;
    font-size: 22px;
    color: #fff;
  }

  .search-users {
    padding-bottom: 50px;
  }

  .selected-users {
    display: flex;
    flex-wrap: wrap;
    margin: 5px;
  }
</style>
