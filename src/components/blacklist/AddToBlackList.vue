<template>
  <div id="black-list">
    <div class="black-list-header">
      <div
        class="title">{{$lang.variables.addToBlackList}}
      </div>
      <i
        @click="goBack()"
        class="icon-left-f icon-back"></i>
    </div>
    <div class="search-input">
      <input
        id="searchPeople"
        :placeholder="$lang.variables.searchByNameOrNickname"
        type="text"
        @keyup="searchPeople"
        v-model="searchInput">
    </div>
    <div class="search-block">
      <div class="search-item" v-for="user in allSearch">
        <div class="item-block">
          <router-link :to="'/u/'+user.nickname">
            <div class="item-avatar ">
              <img :src="user.avatar_image.url_medium">
            </div>
          </router-link>
          <div class="item-info">
            <in-nickname class="user-nickname" tag="p" :status="user.status">{{user.nickname}}</in-nickname>
            <p class="user-name">
              <span v-text="user.name"></span>
              <span v-text="user.lastname"></span>
            </p>
          </div>
          <div class="feed-button">
          <span
            class="user-block-button"
            @click="blockUser(user.id)">{{$lang.variables.append}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: "AddToBlackList",
    data() {
      return {
        allSearch: [],
        searchInput: ''
      }
    },
    mounted() {
      this.searchPeople();
    },
    methods: {
      goBack() {
        this.$router.go(-1);
      },
      searchPeople() {
        axios.get('v1/users/search?query=' + this.searchInput)
          .then(
            res => {
              this.allSearch = res.data.data;
            }
          )
          .catch(err => console.log(err.response));
      },
      blockUser(id) {
        let data = new FormData();
        data.append('ids', JSON.stringify([id]));
        axios.post('v1/me/settings/blacklist/add', data)
          .then(res => {
            this.searchPeople();
          })
          .catch(err => {
          })
      }
    }
  }
</script>

<style lang="less">
  @import '~LessStyle/blacklist.less';
</style>
