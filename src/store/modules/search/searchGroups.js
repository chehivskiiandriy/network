import api from 'utils/api';
import axios from 'axios';
const CancelToken = axios.CancelToken;

import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */

export const moduleName = 'searchGroups/';

/** Actions types*/
export const FETCH_GROUPS_POSTS = 'FETCH_GROUPS_POSTS';
export const FETCH_GROUPS_POSTS_NEXT_PAGE = 'FETCH_GROUPS_POSTS_NEXT_PAGE';

/** Mutation types*/
export const CHANGE_QUERY = 'CHANGE_QUERY';
export const CHANGE_SOURCE = 'CHANGE_SOURCE';

/** Getters types*/
export const GROUPS = 'GROUPS';
export const LOADING = 'LOADING';
export const QUERY = 'QUERY';

const module = {
    namespaced: true,
    state: {
      groups: [],
      nextPage: 2,
      lastPage: 1,
      loading: false,
      query: '',
      source: null
    },
    mutations: {
      [FETCH_GROUPS_POSTS + REQUEST](state) {
        state.groups = [];
        state.loading = true;
      },
      [FETCH_GROUPS_POSTS + SUCCESS](state, payload) {
        state.groups = payload.data;
        state.loading = false;
        state.nextPage = payload.meta.current_page + 1;
        state.lastPage = payload.meta.last_page;
      },
      [FETCH_GROUPS_POSTS + ERROR](state) {
        state.loading = false;
      },
      [FETCH_GROUPS_POSTS_NEXT_PAGE + REQUEST](state) {
        state.loading = true;
      },
      [FETCH_GROUPS_POSTS_NEXT_PAGE + SUCCESS](state, payload) {
        state.groups.push(...payload.data);
        state.nextPage = payload.meta.current_page + 1;
        state.loading = false;
      },
      [FETCH_GROUPS_POSTS_NEXT_PAGE + ERROR](state) {
        state.loading = false;
      },
      [CHANGE_QUERY](state, payload) {
        state.query = payload;
      },
      [CHANGE_SOURCE](state, payload) {
        state.source = payload;
      }
    },
    actions: {
      async [FETCH_GROUPS_POSTS]({commit, state}) {
        commit(FETCH_GROUPS_POSTS + REQUEST);

        state.source && state.source.cancel();
        commit(CHANGE_SOURCE, CancelToken.source());

        const query = state.query;

        let data = new FormData();
        data.append('query', state.query);

        try {
          let res = await api.groups.getGroupSearch(data, {
            cancelToken: state.source.token,
          });

          if(query === state.query) {
            commit(FETCH_GROUPS_POSTS + SUCCESS, res.data);
          }
        }
        catch (e) {
          console.log(axios.isCancel(e), e);
          if(!axios.isCancel(e)) {
            commit(FETCH_GROUPS_POSTS + ERROR);
          }
        }
      },
      async [FETCH_GROUPS_POSTS_NEXT_PAGE]({commit, state}) {
        if (state.lastPage < state.nextPage || state.loading) {
          return;
        }

        commit(FETCH_GROUPS_POSTS_NEXT_PAGE + REQUEST);

        let data = new FormData();
        data.append('query', state.query);
        data.append('page', state.nextPage);

        try {
          let res = await api.groups.getGroupSearch(data, {
            cancelToken: state.source.token,
          });

          commit(FETCH_GROUPS_POSTS_NEXT_PAGE + SUCCESS, res.data);
        }
        catch (e) {
          console.log(e);
          if(!axios.isCancel(e)) {
            commit(FETCH_GROUPS_POSTS_NEXT_PAGE + ERROR);
          }
        }
      },
    },
    getters: {
      [GROUPS](state) {
        return state.groups;
      },
      [QUERY](state) {
        return state.query;
      },
      [LOADING](state) {
        return state.loading
      }
    }
  }
;

export default module;
