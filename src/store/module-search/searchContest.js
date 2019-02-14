import Vuex from 'vuex'
import axios from 'axios';

window.searchAllContest = new Vuex.Store({
  state: {
    contest: [],
    nextPage: 2,
    metaPage: 0,
    loadNext: false
  },
  actions: {
    LOAD_CONTEST({commit, state}){

      state.contest = [];

      let dataContest = new FormData();
      dataContest.append('include_users', 1);
      dataContest.append('limit', '15');

      axios.post('v1/contests/all', dataContest)
        .then(res =>{
          state.metaPage = res.data.meta.last_page;
          state.nextPage = 2;
          commit('ADD_CONTEST', {contest: res.data.data});
        })
    },
    LOAD_NEXT_PAGE_CONTEST({commit, state}){
      let dataContest = new FormData();
      dataContest.append('page', state.nextPage);
      dataContest.append('limit', '15');
      dataContest.append('include_users', 1);

      axios.post('v1/contests/all', dataContest)
        .then(res =>{
          let url = res.data.meta.current_page;
          state.nextPage = url + 1;
          commit('ADD_CONTEST', {contest: res.data.data});
        })
    }
  },
  mutations: {
    ADD_CONTEST(state, {contest}){
      contest.forEach(arr =>{
        state.contest.push(arr)
      });
    }
  },
  getters: {
    getContest(state){
      return state.contest
    },
  }
});
