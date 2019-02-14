<template>
  <div class="search-people">
    <in-search-block
      class="search">
      <div class="search-input-block" style="width: 100%">
        <input
          type="text"
          :placeholder="$lang.variables.searchByNameOrNickname"
          :value="searchInput"
          @keyup="search"
          class="search-input-field">
      </div>
    </in-search-block>

    <div
      class="selected-users">
      <in-user-card
        v-for="user in users"
        :key="user.id">
        <div
          class="user-card"
          @click="goToUser(user.nickname)">
          <div class="user-card-avatar">
            <img
              class="user-card-avatar-preview"
              :src="user.avatar_image.url_medium">
          </div>
          <div class="user-card-info">
            <div class="user-card-info-container">
              <p
                class="user-card-nickname"
                v-text="user.nickname"></p>
              <p class="user-card-name">
                <span v-text="user.name"></span>
                <span v-text="user.lastname"></span>
              </p>
            </div>
          </div>
          <div class="user-card-actions">
            <!--<div class="start-chat">-->
              <!--{{$lang.variables.startChatting}}-->
            <!--</div>-->
          </div>
        </div>
      </in-user-card>
    </div>

    <div
      v-if="!loading && users.length === 0"
      class="nothing-found">Nothing found</div>

    <in-spinner :loading="loading"/>
  </div>
</template>
<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex';

  import {
    moduleName as searchPeopleModule,
    LOADING,
    QUERY,
    CHANGE_QUERY,
    SEARCH_RESULT,
    SEARCH_PEOPLE,
    SEARCH_PEOPLE_NEXT_PAGE
  } from "Store/modules/search/searchPeople";

  import {scrollOnBottom} from "Mixins/scrollOnBottom";


  export default {
    mixins: [scrollOnBottom],
    data() {
      return {
        timeout: null
      }
    },
    watch: {
      bottom(bottom) {
        if (bottom) {
          this.searchPeopleNextPage();
        }
      }
    },
    computed: {
      ...mapGetters({
        searchInput : searchPeopleModule + QUERY,
        users : searchPeopleModule + SEARCH_RESULT,
        loading : searchPeopleModule + LOADING,
      }),
    },
    mounted() {
      if(this.users.length === 0) {
        this.searchPeople();
      }
    },
    methods: {
      ...mapActions({
        searchPeople: searchPeopleModule + SEARCH_PEOPLE,
        searchPeopleNextPage: searchPeopleModule + SEARCH_PEOPLE_NEXT_PAGE
      }),
      ...mapMutations({
        changeQuery : searchPeopleModule + CHANGE_QUERY
      }),
      search(e) {
        this.changeQuery(e.target.value);
        this.searchPeopleAction();
      },
      searchPeopleAction() {
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() => {
          this.searchPeople();
        }, 300);
      },
      goToUser(nickname) {
        this.$router.push(`/u/${nickname}`);
      }
    }
  }
</script>

<style lang="less">
  .search-people {
    .selected-users {
      display: flex;
      flex-wrap: wrap;
      padding-top: 2px;
      margin: 0 5px;
    }

    .nothing-found {

    }
  }

  .search-item {
    display: flex;
    margin: 10px 0px;
    position: relative;
    box-sizing: border-box;
    padding: 5px 0px;
    border-radius: 10px;
    box-shadow: 2px 2px 0px 0px rgba(95, 92, 92, 0.2);

  }

  .search-input {
    border-radius: 5px;
    border: 1px solid #5ac5c6;
    color: #d3d3d3;
    margin: 10px 0px;
    text-align: left;
    padding: 5px 10px;
  }

  #searchPeople {
    border: 0px;
    width: 95%;
    padding: 5px;
    font-size: 15px;
  }

</style>
