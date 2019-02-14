import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {
  CHANGE_IS_FETCH_NEW_SUBSCRIBERS,
  DELETE_USER_FROM_SUBSCRIBERS,
  moduleName as subscribersModule
} from "Store/modules/users/subscribers";
import {
  CHANGE_IS_FETCH_NEW,
  DELETE_USER_FROM_SUBSCRIPTIONS,
  moduleName as subscriptionsModule
} from "Store/modules/users/subscriptions";
import {
  CHANGE_SUBSCRIBE_USER_COUNT,
  CHANGE_SUBSCRIPTIONS_USER_COUNT,
  moduleName as userModule
} from "Store/modules/authUser/user";

/**
 * Types
 * */
export const moduleName = 'blackList/';

/** Actions types*/
export const FETCH_BLACK_LIST = 'FETCH_BLACK_LIST';
export const FETCH_BLACK_LIST_NEXT_PAGE = 'FETCH_BLACK_LIST_NEXT_PAGE';
export const ADD_TO_BLACK_LIST = 'ADD_TO_BLACK_LIST';
export const DELETE_FROM_BLACKLIST = 'DELETE_FROM_BLACKLIST';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const RESET_BLACK_LIST = 'RESET_BLACK_LIST';
export const CHANGE_QUERY = 'CHANGE_QUERY';

/** Getters types*/
export const BLACK_LIST = 'BLACK_LIST';
export const LOADING = 'LOADING';
export const QUERY = 'QUERY';

const module = {
  namespaced: true,
  state: {
    blackList: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null,
    query: null
  },
  mutations: {
    [FETCH_BLACK_LIST + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_BLACK_LIST + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.blackList = payload.data;
    },
    [FETCH_BLACK_LIST + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_BLACK_LIST_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_BLACK_LIST_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.blackList.push(...payload.data);
    },
    [FETCH_BLACK_LIST_NEXT_PAGE + ERROR](state, error) {
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
    [RESET_BLACK_LIST](state) {
      state.blackList = [];
    },
    [CHANGE_QUERY](state, payload) {
      state.query = payload;
    },
    [ADD_TO_BLACK_LIST + REQUEST](state) {

    },
    [ADD_TO_BLACK_LIST + SUCCESS](state, payload) {
      state.blackList = [payload, ...state.blackList];
    },
    [ADD_TO_BLACK_LIST + ERROR](state, error) {

    },
    [DELETE_FROM_BLACKLIST + REQUEST](state) {

    },
    [DELETE_FROM_BLACKLIST + SUCCESS](state, payload) {
      state.blackList = state.blackList.filter(item => item.id !== payload);
    },
    [DELETE_FROM_BLACKLIST + ERROR](state, error) {

    }
  },
  actions: {
    async [FETCH_BLACK_LIST]({commit, state}, payload) {
      if(state.blackList.length > 0 && state.query === payload.query) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_QUERY, payload.query);
        commit(RESET_BLACK_LIST);
      }
      commit(FETCH_BLACK_LIST + REQUEST);

      const data = new FormData();
      data.append('type', 'blacklist');
      data.append('query', payload.query);

      try {
        let res = await api.users.usersSearch(data);

        if(state.blackList.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.blackList[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_BLACK_LIST + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_BLACK_LIST + ERROR, e.response.data);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_BLACK_LIST_NEXT_PAGE]({commit, state}, payload) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_BLACK_LIST_NEXT_PAGE + REQUEST);

      const data = new FormData();
      // data.append('user_nickname', payload.nickname);
      data.append('type', 'blacklist');
      data.append('query', payload.query);
      data.append('page', state.nextPage);

      try {
        let res = await api.users.usersSearch(data);

        commit(FETCH_BLACK_LIST_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {

        commit(FETCH_BLACK_LIST_NEXT_PAGE + ERROR, e.response);
      }
    },
    async [ADD_TO_BLACK_LIST]({commit, rootState}, payload) {
      commit(ADD_TO_BLACK_LIST + REQUEST);

      const {user, onSuccess} = payload;

      const data = new FormData();
      data.append('ids', JSON.stringify([user.id]));

      try {
        await api.user.addToBlackList(data);

        user.is_subscribed = false;

        let deletePayload = {
          authUserNickname: rootState.user.user.nickname,
          userDeleteId: user.id
        };

        commit(ADD_TO_BLACK_LIST + SUCCESS, user);

        let isChangeSubscribeCount = false, isChangeSubscriptionsCount = false;
        if(rootState.subscribers.subscribers[rootState.user.user.nickname]) rootState.subscribers.subscribers[rootState.user.user.nickname].forEach(item => {
          if(item.id === user.id) {
            isChangeSubscribeCount = true;
          }
        });
        if(rootState.subscriptions.subscriptions[rootState.user.user.nickname]) rootState.subscriptions.subscriptions[rootState.user.user.nickname].forEach(item => {
          if(item.id === user.id) {
            isChangeSubscriptionsCount = true;
          }
        });
        commit(userModule + CHANGE_SUBSCRIBE_USER_COUNT, -1, {root: true});
        commit(userModule + CHANGE_SUBSCRIPTIONS_USER_COUNT, -1, {root: true});

        if(isChangeSubscribeCount) {
          commit(subscribersModule + CHANGE_IS_FETCH_NEW_SUBSCRIBERS, true, {root: true});
        }
        if(isChangeSubscriptionsCount) {
          commit(subscriptionsModule + CHANGE_IS_FETCH_NEW, true, {root: true});
        }

        commit(subscribersModule + DELETE_USER_FROM_SUBSCRIBERS, deletePayload, {root: true});
        commit(subscriptionsModule + DELETE_USER_FROM_SUBSCRIPTIONS, deletePayload, {root: true});
        onSuccess();
      } catch (e) {
        commit(ADD_TO_BLACK_LIST + ERROR, e);
        console.log(e);
      }
    },
    async [DELETE_FROM_BLACKLIST]({commit}, payload) {
      commit(DELETE_FROM_BLACKLIST + REQUEST);

      console.log(payload);
      const data = new FormData();
      data.append('ids', JSON.stringify(payload));

      try {
        await api.user.deleteFromBlackList(data);

        commit(DELETE_FROM_BLACKLIST + SUCCESS, payload[0]);
      } catch (e) {
        commit(DELETE_FROM_BLACKLIST + ERROR, e);
        console.log(e);
      }
    }
  },
  getters: {
    [BLACK_LIST](state) {
      return state.blackList
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [QUERY](state) {
      return state.query
    }
  }
};

export default module;
