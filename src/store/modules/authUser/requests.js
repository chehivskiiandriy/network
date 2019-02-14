import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";

import {
  CHANGE_AUTH_USER_REQUESTS_COUNT,
  CHANGE_SUBSCRIBE_USER_COUNT,
  moduleName as userModule
} from "Store/modules/authUser/user";
import {CHANGE_IS_FETCH_NEW_SUBSCRIBERS, moduleName as subscribersModule} from "Store/modules/users/subscribers";

/**
 * Types
 * */
export const moduleName = 'requests/';

/** Actions types*/
export const FETCH_REQUESTS = 'FETCH_REQUESTS';
export const FETCH_REQUESTS_NEXT_PAGE = 'FETCH_REQUESTS_NEXT_PAGE';
export const APPROVE_USER = 'APPROVE_USER';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const RESET_REQUESTS = 'RESET_REQUESTS';
export const CHANGE_QUERY = 'CHANGE_QUERY';

/** Getters types*/
export const LOADING = 'LOADING';
export const REQUESTS = 'REQUESTS';
export const QUERY = 'QUERY';

const module = {
  namespaced: true,
  state: {
    requests: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null,
    query: null
  },
  mutations: {
    [FETCH_REQUESTS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_REQUESTS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.requests = payload.data;
    },
    [FETCH_REQUESTS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_REQUESTS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_REQUESTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.requests.push(...payload.data);
    },
    [FETCH_REQUESTS_NEXT_PAGE + ERROR](state, error) {
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
    [RESET_REQUESTS](state) {
      state.requests = [];
    },
    [CHANGE_QUERY](state, payload) {
      state.query = payload;
    },
    [APPROVE_USER + REQUESTS](state) {

    },
    [APPROVE_USER + SUCCESS](state, payload) {
      state.requests.splice(payload, 1);
    },
    [APPROVE_USER + ERROR](state, error) {

    }
  },
  actions: {
    async [FETCH_REQUESTS]({commit, state}, payload) {
      if(state.requests.length > 0 && state.query === payload.query) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_QUERY, payload.query);
        commit(RESET_REQUESTS);
      }
      commit(FETCH_REQUESTS + REQUEST);

      const data = new FormData();
      data.append('type', 'subscribe_request');
      data.append('query', payload.query);

      try {
        let res = await api.users.usersSearch(data);

        if(state.requests.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.requests[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_REQUESTS + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_REQUESTS + ERROR, e);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_REQUESTS_NEXT_PAGE]({commit, state}, payload) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_REQUESTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('type', 'subscribe_request');
      data.append('query', payload.query);
      data.append('page', state.nextPage);

      try {
        let res = await api.users.usersSearch(data);

        commit(FETCH_REQUESTS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {

        commit(FETCH_REQUESTS_NEXT_PAGE + ERROR, e);
      }
    },
    async [APPROVE_USER]({commit}, payload) {
      commit(APPROVE_USER + REQUESTS);
      const { id, approve, index } = payload;

      try {
        const data = new FormData();
        data.append('user_id', id);
        data.append('approve', approve);

        await api.users.approveUser(data);

        commit(APPROVE_USER + SUCCESS, index);
        commit(userModule + CHANGE_AUTH_USER_REQUESTS_COUNT, null, { root: true });
        commit(userModule + CHANGE_SUBSCRIBE_USER_COUNT, approve ? 1 : -1, { root: true });
        commit(subscribersModule + CHANGE_IS_FETCH_NEW_SUBSCRIBERS, true, { root: true });
      } catch (e) {
        commit(APPROVE_USER + ERROR, e);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [REQUESTS](state) {
      return state.requests
    },
    [QUERY](state) {
      return state.query
    }
  }
};

export default module;
