import Vuex from 'vuex'
import axios from 'axios';

window.searchAllUser = new Vuex.Store({
  state: {
    user: [],
    nextPage: 2,
    metaPage: 0,
    loadNext: false
  },
  actions: {
    LOAD_USER({commit, state}){

      state.user = [];

      let dataUser = new FormData();
      dataUser.append('limit', '15');

      axios.post('v1/users/all', dataUser)
        .then(res =>{
          state.metaPage = res.data.meta.last_page;
          state.nextPage = 2;
          commit('ADD_BODY', {user: res.data.data});
        })
    },
    LOAD_NEXT_PAGE_USER({commit, state}){
      let dataUser = new FormData();
      dataUser.append('page', state.nextPage);
      dataUser.append('limit', '15');

      axios.post('v1/users/all', dataUser)
        .then(res =>{
          let url = res.data.meta.current_page;
          state.nextPage = url + 1;
          commit('ADD_BODY', {user: res.data.data});
        })
    }
  },
  mutations: {
    ADD_BODY(state, {user}){
      user.forEach(arr =>{
        state.user.push(arr)
      });
    }
  },
  getters: {
    getUser(state){
      return state.user
    },
  }
});
