import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'searchPageCommunities/';

/** Actions types*/
export const FETCH_COMMUNITIES = 'FETCH_COMMUNITIES';
export const FETCH_COMMUNITIES_NEXT_PAGE = 'FETCH_COMMUNITIES_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const COMMUNITIES = 'COMMUNITIES';
export const LOADING = 'LOADING';

const module = {
  namespaced: true,
  state: {
    communities: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_COMMUNITIES + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_COMMUNITIES + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.communities = payload.data;
    },
    [FETCH_COMMUNITIES + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_COMMUNITIES_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_COMMUNITIES_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.communities.push(...payload.data);
    },
    [FETCH_COMMUNITIES_NEXT_PAGE + ERROR](state, error) {
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
    async [FETCH_COMMUNITIES]({commit, state}) {
      if(state.communities.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      }
      commit(FETCH_COMMUNITIES + REQUEST);

      const data = new FormData();
      data.append('without_user_groups', 'true');
      data.append('type', 'community');
      data.append('shortList', '1');

      try {
        let res = await api.groups.getGroups(data);

        if(state.communities.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.communities[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_COMMUNITIES + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_COMMUNITIES + ERROR, e);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_COMMUNITIES_NEXT_PAGE]({commit, state}) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_COMMUNITIES_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('without_user_groups', 'true');
      data.append('type', 'community');
      data.append('shortList', '1');
      data.append('page', state.nextPage);

      try {
        let res = await api.groups.getGroups(data);

        commit(FETCH_COMMUNITIES_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {

        commit(FETCH_COMMUNITIES_NEXT_PAGE + ERROR, e);
      }
    }
  },
  getters: {
    [COMMUNITIES](state) {
      return state.communities
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    }
  }
};

export default module;
