import {SUCCESS} from "Store/types";

/**
 * Types
 * */
export const moduleName = 'countPostOnPage/';

/** Actions types*/
export const INITIAL_LOADING = 'INITIAL_LOADING';
export const CHANGE_HOME_POST_COUNT = 'CHANGE_HOME_POST_COUNT';
export const CHANGE_RATING_POST_COUNT = 'CHANGE_RATING_POST_COUNT';
export const CHANGE_PROFILE_POST_COUNT = 'CHANGE_PROFILE_POST_COUNT';
export const CHANGE_SUBSCRIBE_POST_COUNT = 'CHANGE_SUBSCRIBE_POST_COUNT';
export const CHANGE_CONTEST_POST_COUNT = 'CHANGE_CONTEST_POST_COUNT';
export const CHANGE_RECOMMENDATIONS_GROUPS_POST_COUNT = 'CHANGE_RECOMMENDATIONS_GROUPS_POST_COUNT';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR

/** Getters types*/
export const HOME_POST_COUNT = 'HOME_POST_COUNT';
export const RATING_POST_COUNT = 'RATING_POST_COUNT';
export const PROFILE_POST_COUNT = 'PROFILE_POST_COUNT';
export const SUBSCRIBE_POST_COUNT = 'SUBSCRIBE_POST_COUNT';
export const CONTEST_POST_COUNT = 'CONTEST_POST_COUNT';
export const RECOMMENDATIONS_GROUPS_POST_COUNT = 'RECOMMENDATIONS_GROUPS_POST_COUNT';

const module = {
  namespaced: true,
  state: {
    homePostCount: null,
    ratingPostCount: null,
    profilePostCount: null,
    subscribePostCount: null,
    contestPostCount: null,
    recommendationsGroupsPostCount: null
  },
  mutations: {
    [INITIAL_LOADING + SUCCESS](state, payload) {
      state.homePostCount = payload.homePostCount;
      state.ratingPostCount = payload.ratingPostCount;
      state.profilePostCount = payload.profilePostCount;
      state.subscribePostCount = payload.subscribePostCount;
      state.contestPostCount = payload.contestPostCount;
      state.recommendationsGroupsPostCount = payload.recommendationsGroupsPostCount;
    },
    [CHANGE_HOME_POST_COUNT + SUCCESS](state, payload) {
      state.homePostCount = payload;
    },
    [CHANGE_RATING_POST_COUNT + SUCCESS](state, payload) {
      state.ratingPostCount = payload;
    },
    [CHANGE_PROFILE_POST_COUNT + SUCCESS](state, payload) {
      state.profilePostCount = payload;
    },
    [CHANGE_SUBSCRIBE_POST_COUNT + SUCCESS](state, payload) {
      state.subscribePostCount = payload;
    },
    [CHANGE_CONTEST_POST_COUNT + SUCCESS](state, payload) {
      state.contestPostCount = payload;
    },
    [CHANGE_RECOMMENDATIONS_GROUPS_POST_COUNT + SUCCESS](state, payload) {
      state.recommendationsGroupsPostCount = payload;
    }
  },
  actions: {
    [INITIAL_LOADING]({commit}) {
      let homePostCount = localStorage.getItem('homePostCount');
      let ratingPostCount = localStorage.getItem('ratingPostCount');
      let profilePostCount = localStorage.getItem('profilePostCount');
      let subscribePostCount = localStorage.getItem('subscribePostCount');
      let contestPostCount = localStorage.getItem('contestPostCount');
      let recommendationsGroupsPostCount = localStorage.getItem('recommendationsGroupsPostCount');

      if(!homePostCount) {
        localStorage.setItem('homePostCount', '1');
        homePostCount = '1';
      }
      if(!ratingPostCount) {
        localStorage.setItem('ratingPostCount', '1');
        ratingPostCount = '1';
      }
      if(!profilePostCount) {
        localStorage.setItem('profilePostCount', '4');
        profilePostCount = '4';
      }
      if(!subscribePostCount) {
        localStorage.setItem('subscribePostCount', '1');
        subscribePostCount = '1';
      }
      if(!contestPostCount) {
        localStorage.setItem('contestPostCount', '1');
        contestPostCount = '1';
      }
      if(!recommendationsGroupsPostCount) {
        localStorage.setItem('recommendationsGroupsPostCount', '2');
        recommendationsGroupsPostCount = '4';
      }

      const payload = {
        homePostCount,
        ratingPostCount,
        profilePostCount,
        subscribePostCount,
        contestPostCount,
        recommendationsGroupsPostCount
      };
      commit(INITIAL_LOADING + SUCCESS, payload);
    },
    [CHANGE_HOME_POST_COUNT]({commit}, payload) {
      localStorage.setItem('homePostCount', payload);
      commit(CHANGE_HOME_POST_COUNT + SUCCESS, payload);
    },
    [CHANGE_RATING_POST_COUNT]({commit}, payload) {
      localStorage.setItem('ratingPostCount', payload);
      commit(CHANGE_RATING_POST_COUNT + SUCCESS, payload);
    },
    [CHANGE_PROFILE_POST_COUNT]({commit}, payload) {
      localStorage.setItem('profilePostCount', payload);
      commit(CHANGE_PROFILE_POST_COUNT + SUCCESS, payload);
    },
    [CHANGE_SUBSCRIBE_POST_COUNT]({commit}, payload) {
      localStorage.setItem('subscribePostCount', payload);
      commit(CHANGE_SUBSCRIBE_POST_COUNT + SUCCESS, payload);
    },
    [CHANGE_CONTEST_POST_COUNT]({commit}, payload) {
      localStorage.setItem('contestPostCount', payload);
      commit(CHANGE_CONTEST_POST_COUNT + SUCCESS, payload);
    },
    [CHANGE_RECOMMENDATIONS_GROUPS_POST_COUNT]({commit}, payload) {
      localStorage.setItem('recommendationsGroupsPostCount', payload);
      commit(CHANGE_RECOMMENDATIONS_GROUPS_POST_COUNT + SUCCESS, payload);
    }
  },
  getters: {
    [HOME_POST_COUNT](state) {
      return state.homePostCount
    },
    [RATING_POST_COUNT](state) {
      return state.ratingPostCount
    },
    [PROFILE_POST_COUNT](state) {
      return state.profilePostCount
    },
    [SUBSCRIBE_POST_COUNT](state) {
      return state.subscribePostCount
    },
    [CONTEST_POST_COUNT](state) {
      return state.contestPostCount
    },
    [RECOMMENDATIONS_GROUPS_POST_COUNT](state) {
      return state.recommendationsGroupsPostCount
    }
  }
};

export default module;
