//store contest
import Vuex from 'vuex'
import axios from 'axios'


window.storeUser = new Vuex.Store({
  state: {
    user:{},
    user_privacy:{},
    user_subsribers:{},
  },
  actions: {
    LOAD_USER_INFO({commit, state}, info){
        state.user={};

      let getUser=new FormData();
      getUser.append('nickname',info.nickname);

      axios.post('v1/users/get?nickname=',getUser)
        .then(res =>{
          commit('SAVE_USER_INFO', {user: res.data});
          commit('USER_PRIVACY', {privacy: res.data.privacy_settings});


        })

    },
    UPDATE_USER_PRIVACY({commit,state},info) {

      let userPrivacy=new FormData();
      userPrivacy.append(info.privacyField,info.privacyValue);
      axios.post('v1/me/settings/privacy/edit',userPrivacy)
        .then(
          res=>{
            state.user.privacy_settings[info.privacyField]=info.privacyValue;
          }
        )
    },

    USER_SUBSCRIBERS({commit,state}) {
      state.user_subsribers={};
      axios.post('v1/users/subscribers/all')
        .then(
          res=>{
            commit('SAVE_USER_SUBSCRIBERS', {subscribers: res.data.data});
          }
        )
    },



  },
  mutations: {
    SAVE_USER_INFO(state, {user}){
      state.user = user;
    },
    USER_PRIVACY(state, {privacy}) {
      state.user_privacy=privacy;
    },
    SAVE_USER_SUBSCRIBERS(state, {subscribers}) {
      state.user_subsribers=subscribers;
    }

  },
  getters: {
    getUserInfo(state){
      return state.user;
    },
    getUserPrivacy(state) {
      return state.user_privacy;
    },
    getUserSubscribers(state) {
      return state.user_subsribers;
    }
  }
});
