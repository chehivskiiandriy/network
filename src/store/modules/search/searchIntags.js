import api from 'utils/api';

import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */

export const moduleName = 'searchIntags/';

/** Actions types*/
export const FETCH_INTAGS_POSTS = 'FETCH_INTAGS_POSTS';
export const FETCH_INTAGS_POSTS_NEXT_PAGE = 'FETCH_INTAGS_POSTS_NEXT_PAGE';

/** Mutation types*/
export const CHANGE_QUERY = 'CHANGE_QUERY';

/** Getters types*/
export const INTAGS_POSTS = 'INTAGS_POSTS';
export const LOADING = 'LOADING';
export const QUERY = 'QUERY';

const module = {
    namespaced: true,
    state: {
      posts: [],
      nextPage: 2,
      lastPage: 1,
      loading: false,
      query: ''
    },
    mutations: {
      [FETCH_INTAGS_POSTS + REQUEST](state) {
        state.posts = [];
        state.loading = true;
      },
      [FETCH_INTAGS_POSTS + SUCCESS](state, payload) {
        state.posts = payload.data;
        state.loading = false;
        state.nextPage = payload.meta.current_page + 1;
        state.lastPage = payload.meta.last_page;
      },
      [FETCH_INTAGS_POSTS + ERROR](state) {
        state.loading = false;
      },
      [FETCH_INTAGS_POSTS_NEXT_PAGE + REQUEST](state) {
        state.loading = true;
      },
      [FETCH_INTAGS_POSTS_NEXT_PAGE + SUCCESS](state, payload) {
        state.posts.push(...payload.data);
        state.nextPage = payload.meta.current_page + 1;
        state.loading = false;
      },
      [FETCH_INTAGS_POSTS_NEXT_PAGE + ERROR](state) {
        state.loading = false;
      },
      [CHANGE_QUERY](state, payload) {
        state.query = payload;
      }
    },
    actions: {
      async [FETCH_INTAGS_POSTS]({commit, state}) {
        commit(FETCH_INTAGS_POSTS + REQUEST);

        let data = new FormData();
        data.append('intag', state.query);
        data.append('limit', '28');

        try {
          let res = await api.search.getPosts(data);

          commit(FETCH_INTAGS_POSTS + SUCCESS, res.data);
        }
        catch (e) {
          console.log(e);
          commit(FETCH_INTAGS_POSTS + ERROR);
        }
      },
      async [FETCH_INTAGS_POSTS_NEXT_PAGE]({commit, state}) {
        if (state.lastPage < state.nextPage || state.loading) {
          return;
        }

        commit(FETCH_INTAGS_POSTS_NEXT_PAGE + REQUEST);

        let data = new FormData();
        data.append('intag', state.query);
        data.append('limit', '28');
        data.append('page', state.nextPage);

        try {
          let res = await api.search.getPosts(data);

          commit(FETCH_INTAGS_POSTS_NEXT_PAGE + SUCCESS, res.data);
        }
        catch (e) {
          console.log(e);
          commit(FETCH_INTAGS_POSTS_NEXT_PAGE + ERROR);
        }
      },
    },
    getters: {
      [INTAGS_POSTS](state) {
        return state.posts;
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
