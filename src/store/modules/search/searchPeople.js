import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'searchPeople/';

/** Actions types*/
export const SEARCH_PEOPLE = 'SEARCH_PEOPLE';
export const SEARCH_PEOPLE_NEXT_PAGE = 'SEARCH_PEOPLE_NEXT_PAGE';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_QUERY = 'CHANGE_QUERY';

/** Getters types*/
export const LOADING = 'LOADING';
export const SEARCH_RESULT = 'SEARCH_RESULT';
export const QUERY = 'QUERY';

const module = {
  namespaced: true,
  state: {
    searchResult: [],
    nextPage: 2,
    lastPage: 1,
    loading: false,
    query: '',
  },
  mutations: {
    [SEARCH_PEOPLE + REQUEST](state) {
      state.loading = true;
      state.searchResult = [];
    },
    [SEARCH_PEOPLE + SUCCESS](state, payload) {
      state.loading = false;
      state.searchResult = payload.data;
      state.nextPage = payload.meta.current_page + 1;
      state.lastPage = payload.meta.last_page;
    },
    [SEARCH_PEOPLE + ERROR](state) {
      state.loading = false;
    },
    [SEARCH_PEOPLE_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
    },
    [SEARCH_PEOPLE_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.searchResult.push(...payload.data);
      state.nextPage = payload.meta.current_page + 1;
    },
    [SEARCH_PEOPLE_NEXT_PAGE + ERROR](state) {
      state.loading = false;
    },
    [CHANGE_QUERY](state, payload) {
      state.query = payload;
    }
  },
  actions: {
    async [SEARCH_PEOPLE]({state, commit}) {
      commit(SEARCH_PEOPLE + REQUEST);

      const data = new FormData();
      data.append('query', state.query);
      data.append('exclude_me', '1');

      try {
        let res = await api.users.usersSearch(data);

        commit(SEARCH_PEOPLE + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(SEARCH_PEOPLE + ERROR);
      }
    },
    async [SEARCH_PEOPLE_NEXT_PAGE]({state, commit}) {
      if (state.lastPage < state.nextPage || state.loading) {
        return;
      }

      commit(SEARCH_PEOPLE_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('query', state.query);
      data.append('exclude_me', '1');
      data.append('page', state.nextPage);

      try {
        let res = await api.users.usersSearch(data);
        commit(SEARCH_PEOPLE_NEXT_PAGE + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(SEARCH_PEOPLE_NEXT_PAGE + ERROR);
      }
    },
  },
  getters: {
    [LOADING](state) {
      return state.loading
    },
    [QUERY](state) {
      return state.query;
    },
    [SEARCH_RESULT](state) {
      return state.searchResult
    },
  }
};

export default module;
