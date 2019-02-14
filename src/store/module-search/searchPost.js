import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex);

window.searchAllPosts = new Vuex.Store({
  state: {
    posts: [],
    nextPage: 2,
    metaPage: 0,
    loadNext: true
  },
  actions: {
    LOAD_POSTS({commit, state}){
      state.posts = [];
      commit('START_LOAD_NEXT_PAGE_POSTS');

      let dataPosts = new FormData();
      dataPosts.append('limit', '3');

      axios.post('v1/me/posts/search/chunks', dataPosts)
      .then(res =>{
        state.metaPage = res.data.meta.last_page;
        state.nextPage = 2;
        commit('ADD_POSTS', {posts: res.data.data});
      })
    },
    LOAD_NEXT_PAGE_POSTS({commit, state}){
      commit('START_LOAD_NEXT_PAGE_POSTS');
      let dataPosts = new FormData();
      dataPosts.append('page', state.nextPage);
      dataPosts.append('limit', '3');

      axios.post('v1/me/posts/search/chunks', dataPosts)
      .then(res =>{
        let url = res.data.meta.current_page;
        state.nextPage = url + 1;
        commit('ADD_POSTS', {posts: res.data.data});
      })
    }
  },
  mutations: {
    START_LOAD_NEXT_PAGE_POSTS(state) {
      state.loadNext = false;
    },
    ADD_POSTS(state, {posts}){
      posts.forEach(arr =>{
        state.posts.push(arr)
      });
      state.loadNext = true
    }
  },
  getters: {
    getPosts(state){
      return state.posts
    },
    canLoadNextPosts(state){
      return state.loadNext && state.nextPage <= state.metaPage
    },
    getLoad(state) {
      return !state.loadNext
    }
  }
});
