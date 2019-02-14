import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'bookmarks/';

/** Actions types*/
export const FETCH_BOOKMARKS = 'FETCH_BOOKMARKS';
export const FETCH_BOOKMARKS_NEXT_PAGE = 'FETCH_BOOKMARKS_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const ADD_POST_TO_BOOKMARKS = 'ADD_POST_TO_BOOKMARKS';
export const DELETE_POST_FROM_BOOKMARKS = 'DELETE_POST_FROM_BOOKMARKS';

/** Getters types*/
export const BOOKMARKS = 'BOOKMARKS';
export const LOADING = 'LOADING';

const module = {
  namespaced: true,
  state: {
    bookmarks: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_BOOKMARKS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_BOOKMARKS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.bookmarks = payload.data;
    },
    [FETCH_BOOKMARKS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_BOOKMARKS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_BOOKMARKS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.bookmarks.push(...payload.data);
    },
    [FETCH_BOOKMARKS_NEXT_PAGE + ERROR](state, error) {
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
    [ADD_POST_TO_BOOKMARKS](state, payload) {
      if(state.bookmarks.length > 0) {
        state.bookmarks = [payload, ...state.bookmarks];
      }
    },
    [DELETE_POST_FROM_BOOKMARKS](state, payload) {
      state.bookmarks = state.bookmarks.filter(item => item.id !== payload);
    }
  },
  actions: {
    async [FETCH_BOOKMARKS]({commit, state}) {
      if(state.bookmarks.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      }
      commit(FETCH_BOOKMARKS + REQUEST);

      const data = new FormData();
      data.append('limit', '24');

      try {
        let res = await api.user.getBookmarks(data);

        if(state.bookmarks.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.bookmarks[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_BOOKMARKS + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_BOOKMARKS + ERROR, e.response.data);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_BOOKMARKS_NEXT_PAGE]({commit, state}) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_BOOKMARKS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('limit', '24');
      data.append('page', state.nextPage);

      try {
        let res = await api.user.getBookmarks(data);

        commit(FETCH_BOOKMARKS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {
        commit(FETCH_BOOKMARKS_NEXT_PAGE + ERROR, e.response);
      }
    }
  },
  getters: {
    [BOOKMARKS](state) {
      return state.bookmarks
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    }
  }
};

export default module;
