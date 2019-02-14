import Vue from 'vue';
import api from "utils/api";
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {FETCH, USER_PROFILE_POSTS} from "./usersProfilePosts";
import {
  ADD_STORY_POSTS, GET_STORY_POST_BY_SLUG,
  GET_STORY_POSTS_BY_SLUGS,
  moduleName as userStoryPostsModule,
} from './userStoryPosts';

/**
 * Types
 * */
export const moduleName = 'userActiveStories/';

/** Actions types*/
export const FETCH_USER_ACTIVE_STORIES = 'FETCH_USER_ACTIVE_STORIES';

/** Mutation types*/
export const DELETE_STORY_FOR_USERS_WITH_ACTIVE_STORIES = 'DELETE_STORY_FOR_USERS_WITH_ACTIVE_STORIES';

/** Getters types*/
export const LOADING = 'LOADING';
export const IS_HAVE_TO_SHOW_ACTIVE_STORIES_LOADING_SPINNER = 'IS_HAVE_TO_SHOW_ACTIVE_STORIES_LOADING_SPINNER';
export const GET_USER_ACTIVE_STORIES_BY_NICKNAME = 'GET_USER_ACTIVE_STORIES_BY_NICKNAME';
export const GET_ACTIVE_STORY_BY_SLUG = 'GET_ACTIVE_STORY_BY_SLUG';
export const NICKNAMES_OF_USERS_WHOSE_ACTIVE_STORIES_ARE_STORING_NOW =
  'NICKNAMES_OF_USERS_WHOSE_ACTIVE_STORIES_ARE_STORING_NOW';

const module = {
  namespaced: true,
  state: {
    activeStories: {},
    maxCount: 200,
    loading: false,
    error: null,
  },
  mutations: {
    [FETCH_USER_ACTIVE_STORIES + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_USER_ACTIVE_STORIES + SUCCESS](state, {
      nickname,
      stories,
      nicknameToClear,
    }) {
      state.loading = false;
      state.error = null;

      const nextActiveStories = {
        ...state.activeStories,
        [nickname]: stories,
      };

      if(nicknameToClear) {
        delete nextActiveStories[nicknameToClear];
      }

      state.activeStories = nextActiveStories;
    },
    [FETCH_USER_ACTIVE_STORIES + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
    },
    [DELETE_STORY_FOR_USERS_WITH_ACTIVE_STORIES] (state, { slug }) {
      for(const nickname in state.activeStories) {
        if(state.activeStories.hasOwnProperty(nickname)) {
          Vue.set(state.activeStories, nickname, state.activeStories[nickname].filter(storySlug => storySlug !== slug));
        }
      }
    },
  },
  actions: {
    async [FETCH_USER_ACTIVE_STORIES] ({commit, state, getters}, { nickname }) {
      if(!nickname) {
        throw new Error('Error while fetching user active stories. There is not nickname.');
      }
      commit(FETCH_USER_ACTIVE_STORIES + REQUEST);

      const timestamp = Math.ceil(Date.now() / 1000) + 5;

      const data = new FormData();
      data.append('nickname', nickname);

      try {
        let response = await api.stories.getActiveStories(data),
          stories = response.data;

        const hasAnyStoriesForThisNickname = state.activeStories[nickname] && state.activeStories[nickname].length > 0,
          isGotSamePage = hasAnyStoriesForThisNickname && stories.length > 0 && stories[0].id === state.activeStories[nickname][0].id;

        if (isGotSamePage) {
          commit(FETCH + SUCCESS);
          return;
        }

        const nicknames = getters[NICKNAMES_OF_USERS_WHOSE_ACTIVE_STORIES_ARE_STORING_NOW],
          nicknameToClear = nicknames.length >= state.maxCount
            ? nicknames.find(storedNickname => storedNickname !== nickname)
            : null;

        commit(userStoryPostsModule + ADD_STORY_POSTS, { posts: stories }, { root: true });

        commit(FETCH_USER_ACTIVE_STORIES + SUCCESS, {
          nickname,
          stories: stories.map(story => story.slug),
          nicknameToClear,
        });
      } catch (e) {
        commit(FETCH_USER_ACTIVE_STORIES + ERROR, e.response || e.toString());
      }
    },
  },
  getters: {
    [IS_HAVE_TO_SHOW_ACTIVE_STORIES_LOADING_SPINNER]: state => nickname => {
      const hasNotAnyStoriesForThisNickname = !state.activeStories[nickname];
      return hasNotAnyStoriesForThisNickname && state.loading;
    },
    [NICKNAMES_OF_USERS_WHOSE_ACTIVE_STORIES_ARE_STORING_NOW](state) {
      return Object.keys(state.activeStories);
    },
    [GET_USER_ACTIVE_STORIES_BY_NICKNAME]: (state, getters, rootState, rootGetters) => nickname => {
      const stories = state.activeStories[nickname];
      return stories && rootGetters[userStoryPostsModule + GET_STORY_POSTS_BY_SLUGS](stories);
    },
    [GET_ACTIVE_STORY_BY_SLUG]: (state, getters, rootState, rootGetters) => slug => {
      for(const nickname in state.activeStories) {
        const foundStory = state.activeStories[nickname].find(story => story.slug === slug);
        if(foundStory) {
          return foundStory && rootGetters[userStoryPostsModule + GET_STORY_POST_BY_SLUG](slug);
        }
      }
    }
  }
};

export default module;
