import Vuex from 'vuex'
import api from 'utils/api'

window.storeAllStories = new Vuex.Store({
  state: {
    allstories:{},
  },
  actions: {
    LOAD_ALL_STORIES({commit, state}, info){
      state.allstories={};


      api.stories.getAllStories()
        .then(res =>{
          commit('SAVE_ALL_STORIES', {allstories: res.data.data});

        })

    },

  },
  mutations: {
    SAVE_ALL_STORIES(state, {allstories}){
      state.allstories = allstories;
    },
  },
  getters: {
    getAllStories(state){
      return state.allstories;
    },

  }
});
