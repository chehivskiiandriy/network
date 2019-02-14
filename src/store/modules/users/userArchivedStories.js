import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {FETCH, USER_PROFILE_POSTS} from "./usersProfilePosts";
import {
  ADD_STORY_POSTS,
  GET_STORY_POSTS_BY_SLUGS,
  GET_STORY_POST_BY_SLUG,
  moduleName as userStoryPostsModule,
} from './userStoryPosts';
import {DELETE_STORY_FOR_USERS_WITH_ACTIVE_STORIES} from "Store/modules/users/userActiveStories";

/**
 * Types
 * */
export const moduleName = 'userArchivedStories/';

/** Actions types*/
export const FETCH_USER_ARCHIVED_STORIES = 'FETCH_USER_ARCHIVED_STORIES';
export const FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE = 'FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE';

/** Mutation types*/
export const DELETE_STORY_FROM_ARCHIVE = 'DELETE_STORY_FROM_ARCHIVE';

/** Getters types*/
export const LOADING = 'LOADING';
export const IS_HAVE_TO_SHOW_ARCHIVED_STORIES_LOADING_SPINNER = 'IS_HAVE_TO_SHOW_ARCHIVED_STORIES_LOADING_SPINNER';
export const USER_ARCHIVED_STORIES = 'USER_ARCHIVED_STORIES';
export const GET_ARCHIVED_STORY_BY_SLUG = 'GET_ARCHIVED_STORY_BY_SLUG';
export const HAS_ARCHIVED_STORIES = 'HAS_ARCHIVED_STORIES';

const module = {
  namespaced: true,
  state: {
    archivedStories: [],
    meta: {},
    maxCount: 200,
    loading: false,
    error: null,
  },
  mutations: {
    [FETCH_USER_ARCHIVED_STORIES + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_USER_ARCHIVED_STORIES + SUCCESS](state, {
      stories,
      meta,
      timestamp,
    }) {
      state.loading = false;
      state.error = null;

      state.archivedStories = stories;

      state.meta = {
        lastPage: meta.last_page,
        nextPage: meta.current_page + 1,
        timestamp: timestamp,
      };
    },
    [FETCH_USER_ARCHIVED_STORIES + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE + SUCCESS](state, {
      stories,
      meta,
    }) {
      state.loading = false;
      state.error = null;

      state.archivedStories = [
        ...state.archivedStories,
        ...stories,
      ];

      state.meta = {
        lastPage: meta.last_page,
        nextPage: meta.current_page + 1,
        timestamp: state.meta.timestamp,
      };
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
    },
    [DELETE_STORY_FROM_ARCHIVE] (state, { slug }) {
      state.archivedStories = state.archivedStories.filter(storySlug => storySlug !== slug);
    },
  },
  actions: {
    async [FETCH_USER_ARCHIVED_STORIES] ({commit, state}) {
      commit(FETCH_USER_ARCHIVED_STORIES + REQUEST);

      const timestamp = Math.ceil(Date.now() / 1000) + 5;
      
      const data = new FormData();
      data.append('limit', '24');
      data.append('timestamp', timestamp);

      try {
        let response = await api.stories.getArchivedStories(data),
          responseData = response.data,
          receivedStories = responseData && responseData.data,
          meta = responseData && responseData.meta;

        const hasAnyStories = state.archivedStories.length > 0,
          gotAnyStories = receivedStories.length > 0,
          isGotSamePage = hasAnyStories && gotAnyStories && receivedStories[0].id === state.archivedStories[0].id;

        if (isGotSamePage) {
          commit(FETCH + SUCCESS);
          return;
        }

        commit(userStoryPostsModule + ADD_STORY_POSTS, { posts: receivedStories }, { root: true });

        commit(FETCH_USER_ARCHIVED_STORIES + SUCCESS, {
          stories: receivedStories.map(story => story.slug),
          meta,
          timestamp,
        });
      } catch (e) {
        commit(FETCH_USER_ARCHIVED_STORIES + ERROR, e.response || e.toString());
      }
    },
    async [FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE]({commit, state}) {
      const isLastPageMoreThanNextPage = state.meta && (state.meta.lastPage < state.meta.nextPage);
      if (!state.meta || isLastPageMoreThanNextPage || state.loading) {
        return;
      }

      commit(FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE + REQUEST);

      const data = new FormData();
      data.append('limit', '24');
      data.append('page', state.meta.nextPage);
      data.append('timestamp', state.meta.timestamp);

      try {
        let response = await api.stories.getArchivedStories(data),
          responseData = response.data,
          receivedStories = responseData && responseData.data,
          meta = responseData && responseData.meta;

        commit(userStoryPostsModule + ADD_STORY_POSTS, { posts: receivedStories }, { root: true });

        commit(FETCH_USER_ARCHIVED_STORIES_NEXT_PAGE + SUCCESS, {
          stories: receivedStories.map(story => story.slug),
          meta,
        })
      } catch (e) {
        commit(FETCH_USER_ARCHIVED_STORIES + ERROR, e.response);
      }
    },
  },
  getters: {
    [IS_HAVE_TO_SHOW_ARCHIVED_STORIES_LOADING_SPINNER]: state => {
      const hasNotAnyStories = !state.archivedStories || state.archivedStories.length < 1;
      return hasNotAnyStories && state.loading;
    },
    [USER_ARCHIVED_STORIES]: (state, getters, rootState, rootGetters) => {
      return state.archivedStories &&
        rootGetters[userStoryPostsModule + GET_STORY_POSTS_BY_SLUGS](state.archivedStories);
    },
    [HAS_ARCHIVED_STORIES]: (state) => {
      return state.archivedStories.length > 0;
    },
    [GET_ARCHIVED_STORY_BY_SLUG]: (state, getters, rootState, rootGetters) => slug => {
      return rootGetters[userStoryPostsModule + GET_STORY_POST_BY_SLUG](slug);
    }
  }
};

export default module;
