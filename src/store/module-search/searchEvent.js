import Vuex from 'vuex'
import axios from 'axios';

window.searchAllEvent = new Vuex.Store({
  state: {
    event: [],
    nextPage: 2,
    metaPage: 0,
    loadNext: false
  },
  actions: {
    LOAD_EVENT({commit, state}){

      state.event = [];

      let dataGroup = new FormData();
      dataGroup.append('without_event_groups', true);
      dataGroup.append('limit', '15');
      dataGroup.append('type', 'event');

      axios.post('v1/groups/all', dataGroup)
      .then(res =>{
        state.metaPage = res.data.meta.last_page;
        state.nextPage = 2;
        commit('ADD_BODY', {event: res.data.data});
      })
    },
    LOAD_NEXT_PAGE_EVENT({commit, state}){
      let dataGroup = new FormData();
      dataGroup.append('page', state.nextPage);
      dataGroup.append('without_event_groups', true);
      dataGroup.append('limit', '15');
      dataGroup.append('type', 'event');

      axios.post('v1/groups/all', dataGroup)
      .then(res =>{
        let url = res.data.meta.current_page;
        state.nextPage = url + 1;
        commit('ADD_BODY', {event: res.data.data});
      })
    }
  },
  mutations: {
    ADD_BODY(state, {event}){
      event.forEach(arr =>{
        state.event.push(arr)
      });
    }
  },
  getters: {
    getEvent(state){
      return state.event
    },
  }
});
