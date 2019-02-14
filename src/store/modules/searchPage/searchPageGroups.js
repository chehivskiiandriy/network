import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'searchPageGroups/';

/** Actions types*/
export const FETCH_GROUPS = 'FETCH_GROUPS';
export const FETCH_GROUPS_NEXT_PAGE = 'FETCH_GROUPS_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const GROUPS = 'GROUPS';
export const LOADING = 'LOADING';

const module = {
  namespaced: true,
  state: {
    groups: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_GROUPS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUPS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.groups = payload.data;
    },
    [FETCH_GROUPS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_GROUPS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_GROUPS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.groups.push(...payload.data);
    },
    [FETCH_GROUPS_NEXT_PAGE + ERROR](state, error) {
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
    async [FETCH_GROUPS]({commit, state}) {
      if(state.groups.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      }
      commit(FETCH_GROUPS + REQUEST);

      const data = new FormData();
      data.append('without_user_groups', 'true');
      data.append('type', 'group');
      data.append('shortList', '1');

      try {
        let res = await api.groups.getGroups(data);

        if(state.groups.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.groups[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_GROUPS + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_GROUPS + ERROR, e);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_GROUPS_NEXT_PAGE]({commit, state}) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_GROUPS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('without_user_groups', 'true');
      data.append('type', 'group');
      data.append('shortList', '1');
      data.append('page', state.nextPage);

      try {
        let res = await api.groups.getGroups(data);

        commit(FETCH_GROUPS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {

        commit(FETCH_GROUPS_NEXT_PAGE + ERROR, e);
      }
    }
  },
  getters: {
    [GROUPS](state) {
      return state.groups
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    }
  }
};

export default module;
