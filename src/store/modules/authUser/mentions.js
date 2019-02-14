import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'mentions/';

/** Actions types*/
export const FETCH_MENTIONS = 'FETCH_MENTIONS';
export const FETCH_MENTIONS_NEXT_PAGE = 'FETCH_MENTIONS_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const ADD_POST_TO_MENTIONS = 'ADD_POST_TO_MENTIONS';
export const DELETE_POST_FROM_MENTIONS = 'DELETE_POST_FROM_MENTIONS';

/** Getters types*/
export const MENTIONS = 'MENTIONS';
export const LOADING = 'LOADING';

const module = {
  namespaced: true,
  state: {
    mentions: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_MENTIONS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_MENTIONS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.mentions = payload.data;
    },
    [FETCH_MENTIONS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_MENTIONS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_MENTIONS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.mentions.push(...payload.data);
    },
    [FETCH_MENTIONS_NEXT_PAGE + ERROR](state, error) {
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
    [ADD_POST_TO_MENTIONS](state, payload) {
      state.mentions = [payload, ...state.mentions];
    },
    [DELETE_POST_FROM_MENTIONS](state, payload) {
      state.mentions = state.mentions.filter(item => item.id !== payload);
    }
  },
  actions: {
    async [FETCH_MENTIONS]({commit, state}) {
      if(state.mentions.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      }
      commit(FETCH_MENTIONS + REQUEST);

      const data = new FormData();
      data.append('limit', '24');

      try {
        let res = await api.user.getMentions(data);

        if(state.mentions.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.mentions[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_MENTIONS + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_MENTIONS + ERROR, e);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_MENTIONS_NEXT_PAGE]({commit, state}) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_MENTIONS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('limit', '24');
      data.append('page', state.nextPage);

      try {
        let res = await api.user.getMentions(data);

        commit(FETCH_MENTIONS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {
        commit(FETCH_MENTIONS_NEXT_PAGE + ERROR, e);
      }
    }
  },
  getters: {
    [MENTIONS](state) {
      return state.mentions
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    }
  }
};

export default module;
