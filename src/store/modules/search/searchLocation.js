import api from 'utils/api';

import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {INTAGS_POSTS} from "Store/modules/search/searchIntags";

/**
 * Types
 * */

export const moduleName = 'searchLocation/';

/** Actions types*/
export const FETCH_LOCATION_POSTS = 'FETCH_LOCATION_POSTS';
export const FETCH_LOCATION_POSTS_NEXT_PAGE = 'FETCH_LOCATION_POSTS_NEXT_PAGE';

/** Mutation types*/
export const CHANGE_PLACE = 'CHANGE_PLACE';

/** Getters types*/
export const LOCATION_POSTS = 'LOCATION_POSTS';
export const LOADING = 'LOADING';
export const PLACE = 'PLACE';

const module = {
    namespaced: true,
    state: {
      posts: [],
      nextPage: 2,
      lastPage: 1,
      loading: false,
      place: null
    },
    mutations: {
      [FETCH_LOCATION_POSTS + REQUEST](state) {
        state.posts = [];
        state.loading = true;
      },
      [FETCH_LOCATION_POSTS + SUCCESS](state, payload) {
        state.posts = payload.data;
        state.loading = false;
        state.nextPage = payload.meta.current_page + 1;
        state.lastPage = payload.meta.last_page;
      },
      [FETCH_LOCATION_POSTS + ERROR](state) {
        state.loading = false;
      },
      [FETCH_LOCATION_POSTS_NEXT_PAGE + REQUEST](state) {
        state.loading = true;
      },
      [FETCH_LOCATION_POSTS_NEXT_PAGE + SUCCESS](state, payload) {
        state.posts.push(...payload.data);
        state.nextPage = payload.meta.current_page + 1;
        state.loading = false;
      },
      [FETCH_LOCATION_POSTS_NEXT_PAGE + ERROR](state) {
        state.loading = false;
      },
      [CHANGE_PLACE](state, payload) {
        state.place = payload;
      }
    },
    actions: {
      async [FETCH_LOCATION_POSTS]({commit, state}) {
        commit(FETCH_LOCATION_POSTS + REQUEST);

        let data = new FormData();
        data.append('location', state.place ? state.place.place_id : '');
        data.append('limit', '28');

        try {
          let res = await api.search.getPosts(data);

          commit(FETCH_LOCATION_POSTS + SUCCESS, res.data);
        }
        catch (e) {
          console.log(e);
          commit(FETCH_LOCATION_POSTS + ERROR);
        }
      },
      async [FETCH_LOCATION_POSTS_NEXT_PAGE]({commit, state}) {
        if (state.lastPage < state.nextPage || state.loading) {
          return;
        }

        commit(FETCH_LOCATION_POSTS_NEXT_PAGE + REQUEST);

        let data = new FormData();
        data.append('location', state.place ? state.place.place_id : '');
        data.append('limit', '28');
        data.append('page', state.nextPage);

        try {
          let res = await api.search.getPosts(data);

          commit(FETCH_LOCATION_POSTS_NEXT_PAGE + SUCCESS, res.data);
        }
        catch (e) {
          console.log(e);
          commit(FETCH_LOCATION_POSTS_NEXT_PAGE + ERROR);
        }
      },
    },
    getters: {
      [LOCATION_POSTS](state) {
        return state.posts;
      },
      [PLACE](state) {
        return state.place;
      },
      [LOADING](state) {
        return state.loading
      }
    }
  }
;

export default module;
