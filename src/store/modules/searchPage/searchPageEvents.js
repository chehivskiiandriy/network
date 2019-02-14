import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'searchPageEvents/';

/** Actions types*/
export const FETCH_EVENTS = 'FETCH_EVENTS';
export const FETCH_EVENTS_NEXT_PAGE = 'FETCH_EVENTS_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';

/** Getters types*/
export const EVENTS = 'EVENTS';
export const LOADING = 'LOADING';

const module = {
  namespaced: true,
  state: {
    events: [],
    lastPage: 1,
    nextPage: 2,
    loading: false,
    showLoading: true,
    error: null
  },
  mutations: {
    [FETCH_EVENTS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_EVENTS + SUCCESS](state, payload) {
      state.loading = false;
      state.lastPage = payload.meta.last_page;
      state.nextPage = payload.meta.current_page + 1;
      state.events = payload.data;
    },
    [FETCH_EVENTS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_EVENTS_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_EVENTS_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.nextPage = payload.meta.current_page + 1;
      state.events.push(...payload.data);
    },
    [FETCH_EVENTS_NEXT_PAGE + ERROR](state, error) {
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
    async [FETCH_EVENTS]({commit, state}) {
      if(state.events.length > 0) {
        commit(CHANGE_SHOW_LOADING, false);
      }
      commit(FETCH_EVENTS + REQUEST);

      const data = new FormData();
      data.append('without_user_groups', 'true');
      data.append('type', 'event');
      data.append('shortList', '1');

      try {
        let res = await api.groups.getGroups(data);

        if(state.events.length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.events[0].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(FETCH_EVENTS + SUCCESS, res.data);
        commit(CHANGE_SHOW_LOADING, true);
      } catch (e) {
        commit(FETCH_EVENTS + ERROR, e);
        commit(CHANGE_SHOW_LOADING, true);
      }
    },
    async [FETCH_EVENTS_NEXT_PAGE]({commit, state}) {
      if(state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(FETCH_EVENTS_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('without_user_groups', 'true');
      data.append('type', 'event');
      data.append('shortList', '1');
      data.append('page', state.nextPage);

      try {
        let res = await api.groups.getGroups(data);

        commit(FETCH_EVENTS_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {

        commit(FETCH_EVENTS_NEXT_PAGE + ERROR, e);
      }
    }
  },
  getters: {
    [EVENTS](state) {
      return state.events
    },
    [LOADING](state) {
      return state.loading && state.showLoading
    }
  }
};

export default module;
