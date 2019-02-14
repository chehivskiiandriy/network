import Vuex from 'vuex'
import axios from 'axios';


window.storeGroup=new Vuex.Store({
  state: {
    group:{},
    requests:{},
  },
  actions: {
    LOAD_GROUP_INFO({commit, state},info){
      state.group={};
      let getGroup=new FormData();
      getGroup.append('slug',info.group);
      axios.post('v1/groups/get?slug=',getGroup)
        .then( res=>{
          commit('GROUP_INFO', {group: res.data});
        })
    },
    LOAD_GROUP_REQUESTS({commit,state},info) {
      state.requests={};
      let getGroup=new FormData();

      getGroup.append('group_slug',info.group_slug);
      axios.post('v1/groups/users/requests?group_slug=',getGroup)
        .then( res=>{
          commit('GROUP_REQUESTS', {requests: res.data.data});
        })
    },
    APPLY_USER_REQUESTS({commit},info) {
      let getGroup=new FormData();

      getGroup.append('group_slug',info.group_slug);
      getGroup.append('user_id',info.user_id);
      getGroup.append('apply',info.apply);
      axios.post('v1/groups/users/requests/apply',getGroup)
        .then( res=>{
        })
    },
    INVITE_USER({},info) {
      let groupInvite=new FormData();
      groupInvite.append('group_slug',info.group_slug);
      groupInvite.append('receiver_id',info.user_id);
      axios.post('v1/groups/invite/add',groupInvite)
        .then( res=>{
        })
    }
  },
  mutations: {
    GROUP_INFO(state, {group}){
      state.group = group;
    },
    GROUP_REQUESTS(state, {requests}) {
      state.requests=requests;
    }

  },
  getters: {
    getGroup(state){
      return state.group;
    },
    getRequests(state) {
      return state.requests;
    }
  }
});
