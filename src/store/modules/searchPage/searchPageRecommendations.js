import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'searchPageRecommendations/';

/** Actions types*/
export const FETCH_RECOMMENDATIONS = 'FETCH_RECOMMENDATIONS';
export const FETCH_RECOMMENDATIONS_NEXT_PAGE = 'FETCH_RECOMMENDATIONS_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const RECOMMENDATIONS = 'RECOMMENDATIONS';
export const LOADING = 'LOADING';

const module = {
  namespaced: true,
  state: {
    recommendations: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_RECOMMENDATIONS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_RECOMMENDATIONS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.recommendations = payload.data;
    },
    [FETCH_RECOMMENDATIONS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_RECOMMENDATIONS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_RECOMMENDATIONS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.recommendations.push(...payload.data);
    },
    [FETCH_RECOMMENDATIONS_NEXT_PAGE + ERROR](state, error) {
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
    async [FETCH_RECOMMENDATIONS]({commit, state}) {
      if(state.recommendations.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      }
      commit(FETCH_RECOMMENDATIONS + REQUEST);

      const data = new FormData();
      data.append('limit', '6');

      try {
        let res = await api.post.searchChunks(data);

        if(state.recommendations.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.recommendations[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_RECOMMENDATIONS + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_RECOMMENDATIONS + ERROR, e);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_RECOMMENDATIONS_NEXT_PAGE]({commit, state}) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_RECOMMENDATIONS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('limit', '6');
      data.append('page', state.nextPage);

      try {
        let res = await api.post.searchChunks(data);

        commit(FETCH_RECOMMENDATIONS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {

        commit(FETCH_RECOMMENDATIONS_NEXT_PAGE + ERROR, e);
      }
    }
  },
  getters: {
    [RECOMMENDATIONS](state) {
      return state.recommendations
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    }
  }
};

export default module;
