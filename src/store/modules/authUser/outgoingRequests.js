import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";

import {
  CHANGE_SUBSCRIBE_USER_COUNT,
  moduleName as userModule
} from "Store/modules/authUser/user";
import {CHANGE_IS_FETCH_NEW_SUBSCRIBERS, moduleName as subscribersModule} from "Store/modules/users/subscribers";

/**
 * Types
 * */
export const moduleName = 'outgoingRequests/';

/** Actions types*/
export const FETCH_OUTGOING_REQUESTS = 'FETCH_OUTGOING_REQUESTS';
export const FETCH_OUTGOING_REQUESTS_NEXT_PAGE = 'FETCH_OUTGOING_REQUESTS_NEXT_PAGE';
export const DELETE_OUTGOING_REQUEST = 'DELETE_OUTGOING_REQUEST';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const RESET_OUTGOING_REQUESTS = 'RESET_OUTGOING_REQUESTS';
export const CHANGE_TIMESTAMP = 'CHANGE_TIMESTAMP';

/** Getters types*/
export const LOADING = 'LOADING';
export const OUTGOING_REQUESTS = 'OUTGOING_REQUESTS';

const module = {
  namespaced: true,
  state: {
    outgoingRequests: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null,
    timestamp: null
  },
  mutations: {
    [FETCH_OUTGOING_REQUESTS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_OUTGOING_REQUESTS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.outgoingRequests = payload.data;
    },
    [FETCH_OUTGOING_REQUESTS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_OUTGOING_REQUESTS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_OUTGOING_REQUESTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.outgoingRequests.push(...payload.data);
    },
    [FETCH_OUTGOING_REQUESTS_NEXT_PAGE + ERROR](state, error) {
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
    [RESET_OUTGOING_REQUESTS](state) {
      state.outgoingRequests = [];
    },
    [CHANGE_TIMESTAMP](state, payload) {
      state.timestamp = payload;
    },
    [DELETE_OUTGOING_REQUEST + SUCCESS](state, payload) {
      state.outgoingRequests = state.outgoingRequests.filter(item => item.id !== payload);
    }
  },
  actions: {
    async [FETCH_OUTGOING_REQUESTS]({commit, state}) {
      if(state.outgoingRequests.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(RESET_OUTGOING_REQUESTS);
      }
      commit(FETCH_OUTGOING_REQUESTS + REQUEST);

      const timestamp = Math.ceil(Date.now() / 1000) + 5;
      const data = new FormData();
      data.append('timestamp', timestamp);
      data.append('type', 'outgoing');

      try {
        let res = await api.user.getOutgoingRequests(data);

        if(state.outgoingRequests.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.outgoingRequests[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_OUTGOING_REQUESTS + SUCCESS, res.data);
        commit(CHANGE_TIMESTAMP, timestamp);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_OUTGOING_REQUESTS + ERROR, e);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_OUTGOING_REQUESTS_NEXT_PAGE]({commit, state}) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_OUTGOING_REQUESTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('timestamp', state.timestamp);
      data.append('type', 'outgoing');
      data.append('page', state.nextPage);

      try {
        let res = await api.user.getOutgoingRequests(data);

        commit(FETCH_OUTGOING_REQUESTS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {

        commit(FETCH_OUTGOING_REQUESTS_NEXT_PAGE + ERROR, e);
      }
    },
    async [DELETE_OUTGOING_REQUEST]({commit}, payload) {
      const data = new FormData();
      data.append('user_id', payload);

      try {
        await api.user.deleteRequest(data);
        commit(DELETE_OUTGOING_REQUEST + SUCCESS, payload);
      } catch (e) {
        console.log(e);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [OUTGOING_REQUESTS](state) {
      return state.outgoingRequests
    }
  }
};

export default module;
