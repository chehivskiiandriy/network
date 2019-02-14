import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {CHANGE_SUBSCRIBE_USER_GIFTS, moduleName as giftsModule} from "Store/modules/authUser/gifts";
import {CHANGE_SUBSCRIBE_USER_FEEDS, moduleName as feedsModule} from "Store/modules/feeds";
import {CHANGE_SUBSCRIPTIONS_USER_COUNT, moduleName as userModule} from "Store/modules/authUser/user";
import {CHANGE_SUBSCRIBE_MAIN_POSTS, CHANGE_VOTE_USER, moduleName as mainPostsModule} from "Store/modules/mainPosts";
import {CHANGE_POST_USER_SUBSCRIBE, moduleName as postsModule} from "Store/modules/posts";
import {
  ADD_SUBSCRIPTIONS,
  CHANGE_IS_FETCH_NEW,
  CHANGE_SUBSCRIPTIONS,
  DELETE_SUBSCRIPTIONS,
  moduleName as subscriptionsModule
} from "Store/modules/users/subscriptions";
import {CHANGE_SUBSCRIBERS, moduleName as subscribersModule} from "Store/modules/users/subscribers";

/**
 * Types
 * */
export const moduleName = 'users/';

/** Actions types*/
export const CHANGE_SUBSCRIBE_USER = 'CHANGE_SUBSCRIBE_USER';
export const FETCH_USER = 'FETCH_USER';
export const VOTE_USER = 'VOTE_USER';
export const SEND_CHIN_CHIN = 'SEND_CHIN_CHIN';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const CHANGE_USER_FAMILY_STATUS = 'CHANGE_USER_FAMILY_STATUS';
export const ADD_POST_TO_USER = 'ADD_POST_TO_USER';
export const DELETE_POST_FROM_USER = 'DELETE_POST_FROM_USER';
export const UPDATE_ONLINE_USERS = 'UPDATE_ONLINE_USERS';

/** Getters types*/
export const LOADING = 'LOADING';
export const USER = 'USER';
export const USER_ERROR = 'USER_ERROR';

const module = {
  namespaced: true,
  state: {
    users: {},
    userNicknames: [],
    maxCount: 200,
    loading: false,
    showLoading: true,
    error: null,
    searchResultsList: [],
    searchString: '',
    subscriptionError: null,
  },
  mutations: {
    [CHANGE_SUBSCRIBE_USER + REQUEST](state) {
      state.subscriptionError = null;
    },
    [CHANGE_SUBSCRIBE_USER + SUCCESS](state, payload) {
      state.subscriptionError = null;
      if(state.users[payload.nickname])
        state.users[payload.nickname].is_subscribed = payload.state;
      //temporary authUser will save only in user.js
      if(state.users[payload.authUserNickname])
        state.users[payload.authUserNickname].subscriptions_count += (payload.state ? 1 : -1);
    },
    [CHANGE_SUBSCRIBE_USER + ERROR](state, payload) {
      state.subscriptionError = payload;
    },
    [FETCH_USER + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_USER + SUCCESS](state, payload) {
      state.loading = false;
      state.users = {
        ...payload.usersTemp,
        [payload.nickname]: payload.res
      };
      state.userNicknames = [...payload.userNicknamesOrder, payload.nickname];
    },
    [FETCH_USER + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [CHANGE_SHOW_LOADING](state, payload) {
      state.showLoading = payload;
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
      state.showLoading = true;
    },
    [CHANGE_USER_FAMILY_STATUS](state, payload) {
      if(state.users[payload.nickname]) state.users[payload.nickname].family_status = payload.status;
    },
    [VOTE_USER + REQUEST](state) {

    },
    [VOTE_USER + SUCCESS](state, payload) {
      if(payload.state) {
        state.users[payload.nickname].is_voted = true;
        state.users[payload.nickname].rating.level = payload.rating.level;
        state.users[payload.nickname].rating.proportion = payload.rating.proportion;
        const ratingDifference = payload.rating.value - state.users[payload.nickname].rating.value;
        state.users[payload.nickname].rating.value = payload.rating.value;
        state.users[payload.nickname].typed_rating.day += ratingDifference;
        state.users[payload.nickname].typed_rating.week += ratingDifference;
        state.users[payload.nickname].typed_rating.month += ratingDifference;
      }
    },
    [VOTE_USER + ERROR](state, error) {

    },
    [SEND_CHIN_CHIN + REQUEST](state) {

    },
    [SEND_CHIN_CHIN + SUCCESS](state, payload) {
      if(payload.state) state.users[payload.nickname].is_chined = true;
    },
    [SEND_CHIN_CHIN + ERROR](state, error) {

    },
    [ADD_POST_TO_USER](state, payload) {
      if(state.users[payload]) state.users[payload].posts_count = state.users[payload].posts_count + 1;
    },
    [DELETE_POST_FROM_USER](state, payload) {
      if(state.users[payload]) state.users[payload].posts_count = state.users[payload].posts_count - 1;
    },
    [UPDATE_ONLINE_USERS](state, payload) {
      if(state.users[payload.nickname]) state.users[payload.nickname].is_online = payload.status;
    }
  },
  actions: {
    async [CHANGE_SUBSCRIBE_USER]({commit, dispatch, rootState}, payload) {
      commit(CHANGE_SUBSCRIBE_USER + REQUEST);

      const data = new FormData();
      data.append('nickname', payload.nickname);
      if (payload.delete === '1') {
        data.append('delete', payload.delete);
      }

      try {
        let res = await api.users.subscribeUser(data);

        let result = {
          state: res.data.state,
          nickname: payload.nickname,
          authUserNickname: rootState.user.user.nickname
        };

        if(!res.data.hasOwnProperty('status') || (res.data.hasOwnProperty('status') && res.data.status !== 'request')) {
          commit(CHANGE_SUBSCRIBE_USER + SUCCESS, result);
          commit(giftsModule + CHANGE_SUBSCRIBE_USER_GIFTS, result, { root: true });
          commit(feedsModule + CHANGE_SUBSCRIBE_USER_FEEDS, result, { root: true });
          commit(userModule + CHANGE_SUBSCRIPTIONS_USER_COUNT, res.data.state ? 1 : -1, { root: true });
          commit(mainPostsModule + CHANGE_SUBSCRIBE_MAIN_POSTS, result, { root: true });
          commit(subscribersModule + CHANGE_SUBSCRIBERS, result, { root: true });
          commit(subscriptionsModule + CHANGE_SUBSCRIPTIONS, result, { root: true });

          if(payload.slug) {
            const resPost = {
              state: res.data.state,
              nickname: payload.nickname,
              slug: payload.slug
            };
            commit(postsModule + CHANGE_POST_USER_SUBSCRIBE, resPost, { root: true });
          }

          if(payload.subscribeUser) {
            const subscriptionsPayload = {
              authUserNickname: rootState.user.user.nickname,
              subscribeUser: {
                ...payload.subscribeUser,
                is_subscribed: res.data.state
              }
            };

            if(res.data.state) {
              commit(subscriptionsModule + ADD_SUBSCRIPTIONS, subscriptionsPayload, { root: true });
            } else {
              commit(subscriptionsModule + DELETE_SUBSCRIPTIONS, subscriptionsPayload, { root: true });
            }
          } else {
            commit(subscriptionsModule + CHANGE_IS_FETCH_NEW, true, { root: true });
          }
        } else {
          console.log('you send request to user');
          if(payload.onRequest) payload.onRequest();
        }

        if(payload.onSuccess) payload.onSuccess(res.data);
      } catch (e) {
        console.log(e);
        commit(CHANGE_SUBSCRIBE_USER + ERROR, e);
        if(payload.onFail) payload.onFail(e);
      }
    },
    async [FETCH_USER]({commit, state, rootState}, payload) {
      if(state.users[payload]) {
        commit(CHANGE_SHOW_LOADING, false);
      }

      commit(FETCH_USER + REQUEST);

      try {
        let res;

        if(rootState.user.user.nickname === payload) {
          let temp = {...rootState.user.user};
          res = { data: temp };
        } else {
          const data = new FormData();
          data.append('nickname', payload);

          res = await api.users.getUser(data);
        }

        let userNicknamesOrder = state.userNicknames.filter(slug => slug !== payload);
        let usersTemp = {...state.users};

        if(userNicknamesOrder.length >= state.maxCount) {
          delete usersTemp[userNicknamesOrder[0]];
          userNicknamesOrder = userNicknamesOrder.slice(1);
        }

        let result = {
          nickname: payload,
          res: res.data,
          userNicknamesOrder,
          usersTemp
        };

        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_USER + SUCCESS, result);

      } catch (e) {
        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_USER + ERROR, e.response);
      }
    },
    async [VOTE_USER]({commit}, payload) {
      commit(VOTE_USER + REQUEST);

      const {nickname, onSuccess, onFail} = payload;

      const data = new FormData();
      data.append('nickname', nickname);

      try {
        let res = await api.users.voteUser(data);

        commit(VOTE_USER + SUCCESS, res.data);
        commit(mainPostsModule +  CHANGE_VOTE_USER, nickname, { root: true });
        onSuccess(res.data);
      } catch (e) {
        commit(VOTE_USER + ERROR, e.response);
        onFail(e);
      }
    },
    async [SEND_CHIN_CHIN]({commit}, payload) {
      commit(SEND_CHIN_CHIN + REQUEST);

      const { nickname, onSuccess } = payload;

      const data = new FormData();
      data.append('nickname', nickname);

      try {
        let res = await api.user.sendChinChin(data);

        let result = {
          state: res.data.state,
          nickname
        };

        commit(SEND_CHIN_CHIN + SUCCESS, result);
        onSuccess(res.data)
      } catch (e) {
        commit(SEND_CHIN_CHIN + ERROR, e.response);
      }
    },
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [USER]: state => nickname => {
      return state.users[nickname]
    },
    [USER_ERROR](state) {
      return state.error
    },
  }
};

export default module;
