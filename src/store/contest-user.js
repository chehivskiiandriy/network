import axios from 'axios';
//store contest
import Vuex from 'vuex'

window.storeContestUser = new Vuex.Store({
  state: {
    allContestUser: [],
    nextPage: 2,
    metaPage: 0,
    type:'all',
    maxUserInContest: 0,
    load: true,
    loading: false,
    emptyUser: {
      avatar_image: {
        id: 0,
        mentioned_users_count: 0,
        url: 'https://media.inrating.top/storage/img/backgrounds/b.png',
        url_large: 'https://media.inrating.top/storage/img/backgrounds/b.png',
        url_medium: 'https://media.inrating.top/storage/img/backgrounds/b.png',
        url_small: 'https://media.inrating.top/storage/img/backgrounds/b.png',
      },
      contest_info: {
        contest_current_position: 0,
        contest_initial_position: 0,
        created_at: '2018-01-01 00:00:00',
        extra: '',
        is_voted: true,
        likes: 0,
        post_id: 0,
        rating: 0,
        status: 'active'
      },
      gender: null,
      id: 0,
      is_subscribed: false,
      lastname: 'Фамилия',
      name: 'Имя',
      nickname: 'Nickname',
      status: 'active'
    }
  },
  actions: {
    LOAD_CONTEST_USER({commit, state}, info){
      state.allContestUser = [];
      state.maxUserInContest = info.max;

      let dataContestAll = new FormData();
      dataContestAll.append('contest_id', info.id);
      dataContestAll.append('status', 'participant');
      dataContestAll.append('limit', '16');

      state.loading = true;

      axios.post('v1/contests/users/all?type='+info.type, dataContestAll)
        .then(res =>{
          commit('ADD_CONTEST_USER', {user: res.data.data});
          state.metaPage = res.data.meta.last_page;
          state.nextPage = 2;
          state.loading = false;
          let length = res.data.data.length;
          if(length < 16){
            state.load = false;
            /*for(let i = 0; i < state.maxUserInContest - length; i++){
              state.allContestUser.push(state.emptyUser);
            }*/
          }else{

          }
        })

    },
    LOAD_NEXT_PAGE_CONTEST_USER({commit, state}, info){

      if(Number(state.metaPage) < Number(state.nextPage) || state.loading){
        state.load = false;
        return
      }

      let dataContestAll = new FormData();
      dataContestAll.append('contest_id', info.id);
      dataContestAll.append('status', 'participant');
      dataContestAll.append('page', state.nextPage);
      dataContestAll.append('limit', '16');

      state.loading = true;

      axios.post('v1/contests/users/all?type='+info.type, dataContestAll)
        .then(res =>{
          let url = res.data.meta.current_page;
          state.loading = false;
          state.allContestUser = state.allContestUser.concat(res.data.data);
          state.nextPage = url + 1;
          res.data.data.length < 16 ? state.load = false : '';
        })

    }
  },
  mutations: {
    ADD_CONTEST_USER(state, {user}){
      state.allContestUser = user;
    },
    CONCAT_CONTEST_USER(state, {user}){
      state.allContestUser = user;
    }
  },
  getters: {
    getAllContestUser(state){
      return state.allContestUser;
    },
    getLoading(state) {
      return state.loading
    }
  }
});
