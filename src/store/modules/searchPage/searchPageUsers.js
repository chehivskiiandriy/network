import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'searchPageUsers/';

/** Actions types*/
export const FETCH_USERS = 'FETCH_USERS';
export const FETCH_USERS_NEXT_PAGE = 'FETCH_USERS_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const USERS = 'USERS';
export const LOADING = 'LOADING';

const module = {
  namespaced: true,
  state: {
    users: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_USERS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_USERS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.users = payload.data;
    },
    [FETCH_USERS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_USERS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_USERS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.users.push(...payload.data);
    },
    [FETCH_USERS_NEXT_PAGE + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [CHANGE_SHOW_LOADING](state, payload) {
      state.showLoading = payload;
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
      state.showLoading = true;
    }
  },
  actions: {
    async [FETCH_USERS]({commit, state}) {
      if(state.users.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      }
      commit(FETCH_USERS + REQUEST);

      try {
        let res = await api.users.getAll();

        if(state.users.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.users[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_USERS + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_USERS + ERROR, e);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_USERS_NEXT_PAGE]({commit, state}) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_USERS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('page', state.nextPage);

      try {
        let res = await api.users.getAll(data);

        commit(FETCH_USERS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {

        commit(FETCH_USERS_NEXT_PAGE + ERROR, e);
      }
    }
  },
  getters: {
    [USERS](state) {
      return state.users
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    }
  }
};

export default module;
