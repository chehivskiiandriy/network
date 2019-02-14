import Vuex from 'vuex'
import axios from 'axios'
import api from 'utils/api'


window.storeUserStories = new Vuex.Store({
  state: {
    allstories:{},
    storyUser: {},
  },
  actions: {
    LOAD_USER_STORIES({commit, state}, info){
      state.allstories={};

      let getUser=new FormData();
      getUser.append('nickname',info.nickname);

      axios.post('v1/users/stories/get?nickname=',getUser)
        .then(res =>{
          commit('STORY_USER', {user: res.data[0].author});
          commit('SAVE_USER_STORIES', {allstories: res.data});
          let seenStories=[];
          res.data.map((item)=>{
              seenStories.push(item.id);
          });
          let postStoriesSeen=new FormData();
          postStoriesSeen.append('ids',JSON.stringify(seenStories));
          axios.post('v1/users/posts/view',postStoriesSeen);
        })

    },
    USER_UNSUBSCRIBE({commit,state},info) {
      let data = info;
      let config = null;
      api.user.subscribeUser({data, config})
        .then(res=>{

          state.storyUser.is_subscribed=res.data.state;
        });
    },

  },
  mutations: {
    SAVE_USER_STORIES(state, {allstories}){
      state.allstories = allstories;
    },
    STORY_USER(state, {user}) {
      state.storyUser=user;
    }
  },
  getters: {
    getUserStories(state){
      return state.allstories;
    },

    getUserStory(state) {

      return state.storyUser;
    }

  }
});
