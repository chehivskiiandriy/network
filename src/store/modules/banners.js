import api from 'utils/api';

import {SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'banners/';

/** Actions types*/
export const FETCH_BANNERS = 'FETCH_BANNERS';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR

/** Getters types*/
export const BANNERS = 'BANNERS';

const module = {
  namespaced: true,
  state: {
    banners: null
  },
  mutations: {
    [FETCH_BANNERS + SUCCESS](state, payload) {
      state.banners = payload;
    }
  },
  actions: {
    async [FETCH_BANNERS]({commit}) {
      try {
        const res = await  api.banner.getAll();

        commit(FETCH_BANNERS + SUCCESS, res.data.data);
      } catch (e) {
        console.log(e);
      }
    }
  },
  getters: {
    [BANNERS](state) {
      return state.banners
    }
  }
};

export default module;
