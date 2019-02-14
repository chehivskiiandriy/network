import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'subscriptions/';

/** Actions types*/
export const FETCH_SUBSCRIPTIONS = 'FETCH_SUBSCRIPTIONS';
export const FETCH_SUBSCRIPTIONS_NEXT_PAGE = 'FETCH_SUBSCRIPTIONS_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const RESET_SUBSCRIPTIONS = 'RESET_SUBSCRIPTIONS';
export const CHANGE_QUERY = 'CHANGE_QUERY';
export const DELETE_USER_FROM_SUBSCRIPTIONS = 'DELETE_USER_FROM_SUBSCRIPTIONS';
export const ADD_SUBSCRIPTIONS = 'ADD_SUBSCRIPTIONS';
export const DELETE_SUBSCRIPTIONS = 'DELETE_SUBSCRIPTIONS';
export const CHANGE_IS_FETCH_NEW = 'CHANGE_IS_FETCH_NEW';
export const CHANGE_SUBSCRIPTIONS = 'CHANGE_SUBSCRIPTIONS';

/** Getters types*/
export const LOADING = 'LOADING';
export const SUBSCRIPTIONS = 'SUBSCRIPTIONS';
export const QUERY = 'QUERY';

const module = {
  namespaced: true,
  state: {
    subscriptions: {},
    subscriptionsMeta: {},
    subscriptionsIds: [],
    maxCount: 200,
    loading: false,
    showLoading: true,
    error: null,
    isFetchNew: false
  },
  mutations: {
    [FETCH_SUBSCRIPTIONS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_SUBSCRIPTIONS + SUCCESS](state, payload) {
      state.loading = false;
      state.subscriptions = {
        ...payload.subscriptionsTemp,
        [payload.nickname]: payload.res.data
      };
      state.subscriptionsMeta = {
        ...payload.subscriptionsMetaTemp,
        [payload.nickname]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
          query: payload.query,
          total: payload.res.meta.total
        }
      };
      state.subscriptionsIds = [...payload.subscriptionsIdsOrder, payload.nickname];
      state.isFetchNew = false;
    },
    [FETCH_SUBSCRIPTIONS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_SUBSCRIPTIONS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_SUBSCRIPTIONS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.subscriptions[payload.nickname].push(...payload.res.data);
      state.subscriptionsMeta = {
        ...payload.subscriptionsMetaTemp,
        [payload.nickname]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
          query: state.subscriptionsMeta[payload.nickname].query,
          total: state.subscriptionsMeta[payload.nickname].total,
        }
      };
      state.subscriptionsIds = [...payload.subscriptionsIdsOrder, payload.nickname];
    },
    [FETCH_SUBSCRIPTIONS_NEXT_PAGE + ERROR](state, error) {
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
    [RESET_SUBSCRIPTIONS](state, payload) {
      if(state.subscriptions[payload]) {
        state.subscriptions[payload] = undefined;
      }
    },
    [CHANGE_QUERY](state, payload) {
      if(state.subscriptionsMeta[payload.nickname]) {
        state.subscriptionsMeta[payload.nickname].query = payload.query;
      }
    },
    [DELETE_USER_FROM_SUBSCRIPTIONS](state, payload) {
      if(state.subscriptions[payload.authUserNickname]) {
        state.subscriptions[payload.authUserNickname] = state.subscriptions[payload.authUserNickname].filter(item => item.id !== payload.userDeleteId);
      }
    },
    [ADD_SUBSCRIPTIONS](state, payload) {
      if(state.subscriptions[payload.authUserNickname]) state.subscriptions[payload.authUserNickname] = [payload.subscribeUser, ...state.subscriptions[payload.authUserNickname]]
    },
    [DELETE_SUBSCRIPTIONS](state, payload) {
      if(state.subscriptions[payload.authUserNickname]) {
        state.subscriptions[payload.authUserNickname] = state.subscriptions[payload.authUserNickname].filter(item => item.id !== payload.subscribeUser.id);
      }
    },
    [CHANGE_IS_FETCH_NEW](state, payload) {
      state.isFetchNew = payload;
    },
    [CHANGE_SUBSCRIPTIONS](state, payload) {
      // if(state.subscriptions) {
        for (let userNickname in state.subscriptions) {
          state.subscriptions[userNickname].forEach(item => {
            if(item.nickname === payload.nickname) {
              item.is_subscribed = payload.state;
            }
          });
        }
      // }
    }
  },
  actions: {
    async [FETCH_SUBSCRIPTIONS]({commit, state}, payload) {
      if(!state.isFetchNew && state.subscriptions[payload.nickname] && state.subscriptionsMeta[payload.nickname] && state.subscriptionsMeta[payload.nickname].query === payload.query) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(RESET_SUBSCRIPTIONS, payload.nickname);
      }
      if(state.subscriptionsMeta[payload.nickname]) {
        commit(CHANGE_QUERY, payload);
      }
      commit(FETCH_SUBSCRIPTIONS + REQUEST);

      const data = new FormData();
      data.append('user_nickname', payload.nickname);
      data.append('type', 'follow');
      data.append('query', payload.query);
      data.append('limit', '24');

      try {
        let res = await api.users.usersSearch(data);

        if(!state.isFetchNew && state.subscriptions[payload.nickname] && state.subscriptionsMeta[payload.nickname].total === res.data.meta.total && res.data.data.length > 0 && res.data.data[0].id === state.subscriptions[payload.nickname][0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let subscriptionsIdsOrder = state.subscriptionsIds.filter(id => id !== payload.nickname);
        let subscriptionsTemp = {...state.subscriptions};
        let subscriptionsMetaTemp = {...state.subscriptionsMeta};

        if(subscriptionsIdsOrder.length >= state.maxCount) {
          delete subscriptionsTemp[subscriptionsIdsOrder[0]];
          delete subscriptionsMetaTemp[subscriptionsIdsOrder[0]];
          subscriptionsIdsOrder = subscriptionsIdsOrder.slice(1);
        }

        let result = {
          nickname: payload.nickname,
          res: res.data,
          subscriptionsIdsOrder,
          subscriptionsTemp,
          subscriptionsMetaTemp,
          query: payload.query
        };

        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_SUBSCRIPTIONS + SUCCESS, result);
      } catch (e) {
        console.log(e);
        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_SUBSCRIPTIONS + ERROR, e);
      }
    },
    async [FETCH_SUBSCRIPTIONS_NEXT_PAGE]({commit, state}, payload) {
      if(!state.subscriptionsMeta[payload.nickname] || state.subscriptionsMeta[payload.nickname].lastPage < state.subscriptionsMeta[payload.nickname].nextPage || state.loading) {
        return;
      }

      commit(FETCH_SUBSCRIPTIONS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('user_nickname', payload.nickname);
      data.append('type', 'follow');
      data.append('query', payload.query);
      data.append('page', state.subscriptionsMeta[payload.nickname].nextPage);
      data.append('limit', '24');

      try {
        let res = await api.users.usersSearch(data);

        let subscriptionsIdsOrder = state.subscriptionsIds.filter(id => id !== payload.nickname);
        let subscriptionsTemp = {...state.subscriptions};
        let subscriptionsMetaTemp = {...state.subscriptionsMeta};

        if(subscriptionsIdsOrder.length >= state.maxCount) {
          delete subscriptionsTemp[subscriptionsIdsOrder[0]];
          delete subscriptionsMetaTemp[subscriptionsIdsOrder[0]];
          subscriptionsIdsOrder = subscriptionsIdsOrder.slice(1);
        }

        let result = {
          nickname: payload.nickname,
          res: res.data,
          subscriptionsIdsOrder,
          subscriptionsTemp,
          subscriptionsMetaTemp
        };

        commit(FETCH_SUBSCRIPTIONS_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        commit(FETCH_SUBSCRIPTIONS_NEXT_PAGE + ERROR, e.response);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [SUBSCRIPTIONS]: state => nickname => {
      return state.subscriptions[nickname]
    },
    [QUERY]: state => nickname => {
      return state.subscriptionsMeta[nickname] ? state.subscriptionsMeta[nickname].query : ''
    }
  }
};

export default module;
