import api from 'utils/api';
import { REQUEST, ERROR, SUCCESS } from '../types';

import { FETCH_CURRENT_USER, moduleName as authUserModule } from 'Store/modules/authUser/user';

/**
 * Types
 * */
export const moduleName = 'usersWhoHasActiveStories/';

/** Actions types*/
export const FETCH_USERS_WHO_HAS_ACTIVE_STORIES = 'FETCH_USERS_WHO_HAS_ACTIVE_STORIES';


/** Mutation types*/

/** Getters types*/

export const USERS_WHO_HAS_ACTIVE_STORIES  = 'USERS_WHO_HAS_ACTIVE_STORIES';
export const NICKNAMES_OF_USERS_WHO_HAS_ACTIVE_STORIES  = 'NICKNAMES_OF_USERS_WHO_HAS_ACTIVE_STORIES';

const module = {
  namespaced: true,
  state: {
    stories: [],
    loading: false,
    error: null,
  },
  mutations: {
    [FETCH_USERS_WHO_HAS_ACTIVE_STORIES + REQUEST] (state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_USERS_WHO_HAS_ACTIVE_STORIES + SUCCESS] (state, { stories }) {
      state.loading = false;
      state.error = null;
      state.stories = stories;
    },
    [FETCH_USERS_WHO_HAS_ACTIVE_STORIES + ERROR] (state, { error }) {
      state.loading = false;
      state.error = error;
    },
  },
  actions: {
    async [FETCH_USERS_WHO_HAS_ACTIVE_STORIES] ({state, commit, dispatch}) {
      commit(FETCH_USERS_WHO_HAS_ACTIVE_STORIES + REQUEST);
      try {
        const responseWithUsersWhoHaveActiveStories = await api.stories.getAllStories(),
          usersWhoHaveActiveStories = responseWithUsersWhoHaveActiveStories.data.data;
        dispatch(authUserModule + FETCH_CURRENT_USER, null, { root: true });
        commit(FETCH_USERS_WHO_HAS_ACTIVE_STORIES + SUCCESS, {
          stories: usersWhoHaveActiveStories,
        });
      } catch(error) {
        commit(FETCH_USERS_WHO_HAS_ACTIVE_STORIES + ERROR, {
          error: error.message || error.toString(),
        });
      }
    },
  },
  getters: {
    [USERS_WHO_HAS_ACTIVE_STORIES] (state, getters, rootState) {
      const authUser = rootState.user.user;
      return authUser.is_active_story
        ? [{author: authUser, is_seen: true}, ...state.stories.sort((left, right) => left.is_seen - right.is_seen)]
        : state.stories;
    },
    [NICKNAMES_OF_USERS_WHO_HAS_ACTIVE_STORIES] (state, getters) {
      return getters[USERS_WHO_HAS_ACTIVE_STORIES].map(({ author }) => author && author.nickname);
    }
  }
};

export default module;
