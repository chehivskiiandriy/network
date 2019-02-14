import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'searchPageContests/';

/** Actions types*/
export const FETCH_CONTESTS = 'FETCH_CONTESTS_CONTESTS';
export const FETCH_CONTESTS_NEXT_PAGE = 'FETCH_CONTESTS_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const CONTESTS = 'CONTESTS';
export const LOADING = 'LOADING';

const module = {
  namespaced: true,
  state: {
    contests: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_CONTESTS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_CONTESTS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.contests = payload.data;
    },
    [FETCH_CONTESTS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_CONTESTS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_CONTESTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.contests.push(...payload.data);
    },
    [FETCH_CONTESTS_NEXT_PAGE + ERROR](state, error) {
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
    async [FETCH_CONTESTS]({commit, state}) {
      if(state.contests.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      }
      commit(FETCH_CONTESTS + REQUEST);

      const data = new FormData();
      data.append('include_users', 'true');
      data.append('type', 'all');

      try {
        let res = await api.contests.getAll(data);

        if(state.contests.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.contests[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_CONTESTS + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_CONTESTS + ERROR, e);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_CONTESTS_NEXT_PAGE]({commit, state}) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_CONTESTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('include_users', 'true');
      data.append('type', 'all');
      data.append('page', state.nextPage);

      try {
        let res = await api.contests.getAll(data);

        commit(FETCH_CONTESTS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {
        commit(FETCH_CONTESTS_NEXT_PAGE + ERROR, e);
      }
    }
  },
  getters: {
    [CONTESTS](state) {
      return state.contests
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    }
  }
};

export default module;
