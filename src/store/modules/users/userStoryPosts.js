import api from 'utils/api';
import Vue from 'vue';

import { REQUEST, SUCCESS, ERROR } from 'Store/types';

import {
  CHANGE_SUBSCRIBE_USER,
  moduleName as usersModule,
} from 'Store/modules/users/users';

import {
  DELETE_STORY_FROM_ALBUMS,
  moduleName as userStoryAlbumsModule,
} from './userStoryAlbums';

import {
  DELETE_STORY_FROM_ARCHIVE,
  moduleName as userArchivedStoriesModule,
} from './userArchivedStories';

import {
  DELETE_STORY_FOR_USERS_WITH_ACTIVE_STORIES,
  moduleName as userActiveStoriesModule,
} from './userActiveStories';

/**
 * Types
 * */
export const moduleName = 'userStoryPosts/';

/** Action types*/

export const LIKE_STORY_POST = 'LIKE_STORY_POST';
export const BOOKMARK_STORY_POST = 'BOOKMARK_STORY_POST';
export const DELETE_STORY_POST = 'DELETE_STORY_POST';
export const UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST = 'UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST';

/** Mutation types*/
export const ADD_STORY_POSTS = 'ADD_STORY_POSTS';

/** Getters types*/
export const GET_STORY_POSTS_BY_SLUGS = 'GET_STORY_POSTS_BY_SLUGS';
export const GET_STORY_POST_BY_SLUG = 'GET_STORY_POST_BY_SLUG';

function preparePost(post) {
  const isImage = (post.attachments_order && post.attachments_order[0] && post.attachments_order[0].type === 'image') ||
    post.attachments.images && post.attachments.images.length > 0,
    isVideo = (post.attachments_order && post.attachments_order[0] && post.attachments_order[0].type === 'video') ||
      post.attachments.videos && post.attachments.videos.length > 0;
  let media, mediaType;
  if(isImage) {
    media = post.attachments.images[0];
    mediaType = 'image';
  } else if (isVideo) {
    media = post.attachments.videos[0];
    mediaType = 'video';
  }
  return {
    ...post,
    media,
    mediaType,
  };
}

const module = {
  namespaced: true,
  state: {
    storyPosts: {},
    likeAction: {
      loading: false,
      error: null,
    },
    bookmarkAction: {
      loading: false,
      error: null,
    },
    deleteAction: {
      loading: false,
      error: null,
    },
    unsubscribeAction: {
      loading: false,
      error: null,
    },
  },
  mutations: {
    [ADD_STORY_POSTS](state, { posts }) {
      posts.forEach(post => {
        Vue.set(state.storyPosts, post.slug, preparePost(post));
      });
    },
    [LIKE_STORY_POST + REQUEST] (state, { id, isDislike }) {
      state.likeAction = {
        loading: true,
        error: null,
      };
      for (const slug in state.storyPosts) {
        if(state.storyPosts.hasOwnProperty(slug) && state.storyPosts[slug].id === id) {
          state.storyPosts[slug].is_liked = !isDislike;
          break;
        }
      }
    },
    [LIKE_STORY_POST + SUCCESS] (state) {
      state.likeAction = {
        loading: false,
        error: null,
      };
    },
    [LIKE_STORY_POST + ERROR] (state, { error, id, isDislike }) {
      state.likeAction = {
        loading: true,
        error,
      };
      for (const slug in state.storyPosts) {
        if(state.storyPosts.hasOwnProperty(slug) && state.storyPosts[slug].id === id) {
          state.storyPosts[slug].is_liked = isDislike;
          break;
        }
      }
    },
    [BOOKMARK_STORY_POST + REQUEST] (state, { id, isUnbookmark }) {
      state.likeAction = {
        loading: true,
        error: null,
      };
      for (const slug in state.storyPosts) {
        if(state.storyPosts.hasOwnProperty(slug) && state.storyPosts[slug].id === id) {
          state.storyPosts[slug].is_bookmarked = !isUnbookmark;
          break;
        }
      }
    },
    [BOOKMARK_STORY_POST + SUCCESS] (state) {
      state.likeAction = {
        loading: false,
        error: null,
      };
    },
    [BOOKMARK_STORY_POST + ERROR] (state, { error, id, isUnbookmark }) {
      state.likeAction = {
        loading: true,
        error,
      };
      for (const slug in state.storyPosts) {
        if(state.storyPosts.hasOwnProperty(slug) && state.storyPosts[slug].id === id) {
          state.storyPosts[slug].is_bookmarked = isUnbookmark;
          break;
        }
      }
    },
    [DELETE_STORY_POST + REQUEST] (state) {
      Vue.set(state.deleteAction, 'loading', true);
      Vue.set(state.deleteAction, 'error', null);
    },
    [DELETE_STORY_POST + SUCCESS] (state, { id }) {
      Vue.set(state.deleteAction, 'loading', false);
      Vue.set(state.deleteAction, 'error', null);
      const targetPost = Object.values(state.storyPosts).find(post => post.id === id),
        slug = targetPost && targetPost.slug;
      if(slug) {
        Vue.delete(state.storyPosts, slug);
      } else {
        Vue.set(state.deleteAction, 'error', 'Slug is not found');
      }
    },
    [DELETE_STORY_POST + ERROR] (state, error) {
      Vue.set(state.deleteAction, 'loading', false);
      Vue.set(state.deleteAction, 'error', error);
    },
    [UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST + REQUEST] (state) {
      Vue.set(state.unsubscribeAction, 'loading', true);
      Vue.set(state.unsubscribeAction, 'error', null);
    },
    [UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST + SUCCESS] (state, { nickname }) {
      Vue.set(state.unsubscribeAction, 'loading', false);
      Vue.set(state.unsubscribeAction, 'error', null);
      Object.keys(state.storyPosts).forEach(slug => {
        if(state.storyPosts[slug].author.nickname === nickname){
          Vue.set(state.storyPosts[slug].author, 'is_subscribed', false);
        }
      })
      // const slugsOfPostsOfAuthorFromWhoseCurrentUserHaveUnsubscribed =
      //     Object.values(state.storyPosts).filter(post => post.author.nickname === nickname);
      // if(slugsOfPostsOfAuthorFromWhoseCurrentUserHaveUnsubscribed) {
      //   slugsOfPostsOfAuthorFromWhoseCurrentUserHaveUnsubscribed.forEach()
      //   Vue.delete(state.storyPosts, slug);
      // } else {
      //   Vue.set(state.deleteAction, 'error', 'Slugs are not found');
      // }
    },
    [UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST + ERROR] (state, error) {
      Vue.set(state.unsubscribeAction, 'loading', false);
      Vue.set(state.unsubscribeAction, 'error', error);
    },
  },
  actions: {
    async [LIKE_STORY_POST] ({commit}, { id, isDislike }) {
      commit(LIKE_STORY_POST + REQUEST, { id, isDislike });
      try {
        const data = new FormData();
        data.append('id', id);
        isDislike && data.append('delete', isDislike);
        const response = await api.users.likePost(data);
        commit(LIKE_STORY_POST + SUCCESS);
      } catch (error) {
        commit(LIKE_STORY_POST + ERROR, {
          error: error.message || error.toString(),
          id, isDislike,
        });
      }
    },
    async [BOOKMARK_STORY_POST] ({commit}, { id, isUnbookmark }) {
      commit(BOOKMARK_STORY_POST + REQUEST, { id, isUnbookmark });
      try {
        const data = new FormData();
        data.append('id', id);
        isUnbookmark && data.append('delete', isUnbookmark);
        const response = await api.users.bookmarkPost(data);
        commit(BOOKMARK_STORY_POST + SUCCESS, { id, isUnbookmark });
      } catch (error) {
        commit(BOOKMARK_STORY_POST + ERROR, error.message || error.toString());
      }
    },
    async [DELETE_STORY_POST] ({commit, state}, { id }) {
      if(!id) {
        throw new Error('Try to delete story post when there is not id of post');
      }
      commit(DELETE_STORY_POST + REQUEST);
      try {
        const targetPost = Object.values(state.storyPosts).find(post => post.id === id),
          slug = targetPost && targetPost.slug;
        const data = new FormData();
          data.append('id', id);
        const response = await api.users.deletePost(data);
        commit(DELETE_STORY_POST + SUCCESS, { id });
        commit(userStoryAlbumsModule + DELETE_STORY_FROM_ALBUMS, { slug }, {root: true});
        commit(userArchivedStoriesModule + DELETE_STORY_FROM_ARCHIVE, { slug }, {root: true});
        commit(userActiveStoriesModule + DELETE_STORY_FOR_USERS_WITH_ACTIVE_STORIES, { slug }, {root: true});
      } catch (error) {
        commit(DELETE_STORY_POST + ERROR, error.message || error.toString());
      }
    },
    async [UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST] ({commit, rootState, dispatch}, { nickname }) {
      if (!nickname) {
        throw new Error('Try to unsubscribe from author of story post ' +
          'when there is not nickname of author');
      }
      commit(UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST + REQUEST);
      await dispatch(usersModule + CHANGE_SUBSCRIBE_USER, {nickname, delete: true}, {root: true});
      const error = rootState.users.subscriptionError;
      if (!error) {
        commit(UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST + SUCCESS, { nickname });
      } else {
        commit(UNSUBSCRIBE_FROM_AUTHOR_OF_STORY_POST + ERROR, error.message || error.toString());
      }
    },
  },
  getters: {
    [GET_STORY_POSTS_BY_SLUGS]: state => slugs => {
      return slugs && slugs.map(slug => state.storyPosts[slug]);
    },
    [GET_STORY_POST_BY_SLUG]: state => slug => {
      return slug && state.storyPosts[slug];
    },
  }
};

export default module;
