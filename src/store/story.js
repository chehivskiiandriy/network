import Vuex from 'vuex'


window.story = new Vuex.Store({
  state: {
    newStoryFile:{},
  },
  actions: {
    LOAD_NEW_STORY({commit, state}, file){
      state.newStoryFile={};
      commit('SAVE_NEW_STORY', {file});
    },
  },
  mutations: {
    SAVE_NEW_STORY(state, {file}){
      state.newStoryFile = file;
    },
  },
  getters: {
    getNewStory(state){
      return state.newStoryFile;
    }
  }
});
