import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'subscribers/';

/** Actions types*/
export const FETCH_SUBSCRIBERS = 'FETCH_SUBSCRIBERS';
export const FETCH_SUBSCRIBERS_NEXT_PAGE = 'FETCH_SUBSCRIBERS_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const RESET_SUBSCRIBERS = 'RESET_SUBSCRIBERS';
export const CHANGE_QUERY = 'CHANGE_QUERY';
export const DELETE_USER_FROM_SUBSCRIBERS = 'DELETE_USER_FROM_SUBSCRIBERS';
export const CHANGE_SUBSCRIBERS = 'CHANGE_SUBSCRIBERS';
export const CHANGE_IS_FETCH_NEW_SUBSCRIBERS = 'CHANGE_IS_FETCH_NEW_SUBSCRIBERS';

/** Getters types*/
export const LOADING = 'LOADING';
export const SUBSCRIBERS = 'SUBSCRIBERS';
export const QUERY = 'QUERY';

const module = {
  namespaced: true,
  state: {
    subscribers: {},
    subscribersMeta: {},
    subscribersIds: [],
    maxCount: 200,
    loading: false,
    showLoading: true,
    error: null,
    isFetchNew: false
  },
  mutations: {
    [FETCH_SUBSCRIBERS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_SUBSCRIBERS + SUCCESS](state, payload) {
      state.loading = false;
      state.subscribers = {
        ...payload.subscribersTemp,
        [payload.nickname]: payload.res.data
      };
      state.subscribersMeta = {
        ...payload.subscribersMetaTemp,
        [payload.nickname]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
          query: payload.query,
          total: payload.res.meta.total
        }
      };
      state.subscribersIds = [...payload.subscribersIdsOrder, payload.nickname];
    },
    [FETCH_SUBSCRIBERS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_SUBSCRIBERS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_SUBSCRIBERS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.subscribers[payload.nickname].push(...payload.res.data);
      state.subscribersMeta = {
        ...payload.subscribersMetaTemp,
        [payload.nickname]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
          query: state.subscribersMeta[payload.nickname].query,
          total: state.subscribersMeta[payload.nickname].total,
        }
      };
      state.subscribersIds = [...payload.subscribersIdsOrder, payload.nickname];
    },
    [FETCH_SUBSCRIBERS_NEXT_PAGE + ERROR](state, error) {
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
    [RESET_SUBSCRIBERS](state, payload) {
      if (state.subscribers[payload]) {
        state.subscribers[payload] = undefined;
      }
    },
    [CHANGE_QUERY](state, payload) {
      if (state.subscribersMeta[payload.nickname]) {
        state.subscribersMeta[payload.nickname].query = payload.query;
      }
    },
    [DELETE_USER_FROM_SUBSCRIBERS](state, payload) {
      if (state.subscribers[payload.authUserNickname]) {
        state.subscribers[payload.authUserNickname] = state.subscribers[payload.authUserNickname].filter(item => item.id !== payload.userDeleteId);
      }
    },
    [CHANGE_SUBSCRIBERS](state, payload) {
      if (state.subscribers[payload.authUserNickname]) state.subscribers[payload.authUserNickname].forEach(item => {
        if (item.nickname === payload.nickname) {
          item.is_subscribed = payload.state
        }
      });
    },
    [CHANGE_IS_FETCH_NEW_SUBSCRIBERS](state, payload) {
      state.isFetchNew = payload;
    }
  },
  actions: {
    async [FETCH_SUBSCRIBERS]({commit, state, rootState}, payload) {
      if ((!state.isFetchNew || payload.nickname !== rootState.user.user.nickname) && state.subscribers[payload.nickname] && state.subscribersMeta[payload.nickname] && state.subscribersMeta[payload.nickname].query === payload.query) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(RESET_SUBSCRIBERS, payload.nickname);
      }
      if (state.subscribersMeta[payload.nickname]) {
        commit(CHANGE_QUERY, payload);
      }
      commit(FETCH_SUBSCRIBERS + REQUEST);

      const data = new FormData();
      data.append('user_nickname', payload.nickname);
      data.append('type', 'followers');
      data.append('query', payload.query);
      data.append('limit', '24');

      try {
        let res = await api.users.usersSearch(data);

        if (!state.isFetchNew && state.subscribers[payload.nickname] && state.subscribersMeta[payload.nickname].total === res.data.meta.total && res.data.data.length > 0 && res.data.data[0].id === state.subscribers[payload.nickname][0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let subscribersIdsOrder = state.subscribersIds.filter(id => id !== payload.nickname);
        let subscribersTemp = {...state.subscribers};
        let subscribersMetaTemp = {...state.subscribersMeta};

        if (subscribersIdsOrder.length >= state.maxCount) {
          delete subscribersTemp[subscribersIdsOrder[0]];
          delete subscribersMetaTemp[subscribersIdsOrder[0]];
          subscribersIdsOrder = subscribersIdsOrder.slice(1);
        }

        let result = {
          nickname: payload.nickname,
          res: res.data,
          subscribersIdsOrder,
          subscribersTemp,
          subscribersMetaTemp,
          query: payload.query
        };

        if (state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        if (payload.nickname === rootState.user.user.nickname) commit(CHANGE_IS_FETCH_NEW_SUBSCRIBERS, false);
        commit(FETCH_SUBSCRIBERS + SUCCESS, result);
      } catch (e) {
        console.log(e);
        if (state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_SUBSCRIBERS + ERROR, e);
      }
    },
    async [FETCH_SUBSCRIBERS_NEXT_PAGE]({commit, state}, payload) {
      if (!state.subscribersMeta[payload.nickname] || state.subscribersMeta[payload.nickname].lastPage < state.subscribersMeta[payload.nickname].nextPage || state.loading) {
        return;
      }

      commit(FETCH_SUBSCRIBERS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('user_nickname', payload.nickname);
      data.append('type', 'followers');
      data.append('query', payload.query);
      data.append('page', state.subscribersMeta[payload.nickname].nextPage);
      data.append('limit', '24');

      try {
        let res = await api.users.usersSearch(data);

        let subscribersIdsOrder = state.subscribersIds.filter(id => id !== payload.nickname);
        let subscribersTemp = {...state.subscribers};
        let subscribersMetaTemp = {...state.subscribersMeta};

        if (subscribersIdsOrder.length >= state.maxCount) {
          delete subscribersTemp[subscribersIdsOrder[0]];
          delete subscribersMetaTemp[subscribersIdsOrder[0]];
          subscribersIdsOrder = subscribersIdsOrder.slice(1);
        }

        let result = {
          nickname: payload.nickname,
          res: res.data,
          subscribersIdsOrder,
          subscribersTemp,
          subscribersMetaTemp
        };

        commit(FETCH_SUBSCRIBERS_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        commit(FETCH_SUBSCRIBERS_NEXT_PAGE + ERROR, e.response);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [SUBSCRIBERS]: state => nickname => {
      return state.subscribers[nickname]
    },
    [QUERY]: state => nickname => {
      return state.subscribersMeta[nickname] ? state.subscribersMeta[nickname].query : ''
    }
  }
};

export default module;
