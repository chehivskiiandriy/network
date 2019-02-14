import Vuex from 'vuex'
import axios from 'axios';

window.searchAllGroup = new Vuex.Store({
  state: {
    group: [],
    nextPage: 2,
    metaPage: 0,
    loadNext: false
  },
  actions: {
    LOAD_GROUP({commit, state}){

      state.group = [];

      let dataGroup = new FormData();
      dataGroup.append('without_user_groups', true);
      dataGroup.append('limit', '15');

      axios.post('v1/groups/all', dataGroup)
      .then(res =>{
        state.metaPage = res.data.meta.last_page;
        state.nextPage = 2;
        commit('ADD_GROUP', {group: res.data.data});
      })
    },
    LOAD_NEXT_PAGE_GROUP({commit, state}){
      let dataGroup = new FormData();
      dataGroup.append('page', state.nextPage);
      dataGroup.append('without_user_groups', true);
      dataGroup.append('limit', '15');

      axios.post('v1/groups/all', dataGroup)
      .then(res =>{
        let url = res.data.meta.current_page;
        state.nextPage = url + 1;
        commit('ADD_GROUP', {group: res.data.data});
      })
    }
  },
  mutations: {
    ADD_GROUP(state, {group}){
      group.forEach(arr =>{
        state.group.push(arr)
      });
    }
  },
  getters: {
    getGroup(state){
      return state.group
    },
  }
});
