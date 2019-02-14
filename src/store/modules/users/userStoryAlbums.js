import Vue from 'vue';
import api from 'utils/api';
import imageHelper from 'JsLib/imageHelper';
import {ERROR, REQUEST, SUCCESS} from 'Store/types';
import {
  ADD_STORY_POSTS,
  GET_STORY_POSTS_BY_SLUGS,
  moduleName as userStoryPostsModule,
} from './userStoryPosts';
import {DELETE_STORY_FOR_USERS_WITH_ACTIVE_STORIES} from "Store/modules/users/userActiveStories";

/**
 * Types
 * */
export const moduleName = 'userStoryAlbums/';

/** Actions types*/
export const FETCH_USER_STORY_ALBUMS = 'FETCH_USER_STORY_ALBUMS';
export const FETCH_USER_STORY_ALBUM = 'FETCH_USER_STORY_ALBUM';
export const CREATE_USER_STORY_ALBUM = 'CREATE_USER_STORY_ALBUM';
export const DELETE_USER_STORY_ALBUM = 'DELETE_USER_STORY_ALBUM';

/** Mutation types*/
export const DELETE_STORY_FROM_ALBUMS = 'DELETE_STORY_FROM_ALBUMS';

/** Getters types*/
export const LOADING = 'LOADING';
export const IS_HAVE_TO_SHOW_STORY_ALBUMS_LOADING_SPINNER = 'IS_HAVE_TO_SHOW_STORY_ALBUMS_LOADING_SPINNER';
export const GET_USER_STORY_ALBUMS_BY_NICKNAME = 'GET_USER_STORY_ALBUMS_BY_NICKNAME';
export const GET_ALBUM_STORIES_BY_ALBUM_ID = 'GET_ALBUM_STORIES_BY_ALBUM_ID';
export const CREATION_ERROR = 'CREATION_ERROR';
export const NICKNAMES_OF_USERS_WHOSE_STORY_ALBUMS_ARE_STORING_NOW =
  'NICKNAMES_OF_USERS_WHOSE_STORY_ALBUMS_ARE_STORING_NOW';

const module = {
  namespaced: true,
  state: {
    storyAlbums: {},
    meta: {},
    maxCount: 200,
    loading: false,
    loadingNextPage: false,
    error: null,
    creating: false,
    creationError: null,
    deleteAction: {
      loading: false,
      error: null,
    },
  },
  mutations: {
    [FETCH_USER_STORY_ALBUMS + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_USER_STORY_ALBUMS + SUCCESS](state, {
      nickname,
      albums,
      meta,
      timestamp,
      nicknameToClear,
    }) {
      state.loading = false;
      state.error = null;

      let albumsForThisNickname = albums;
      if(state.storyAlbums[nickname]) {
        const albumsById = {};
        [...state.storyAlbums[nickname], ...albums].forEach(album => {
          albumsById[album.id] = album;
        });
        albumsForThisNickname = Object.values(albumsById).reverse();
      }

      const nextStoryAlbums = {
        ...state.storyAlbums,
        [nickname]: albumsForThisNickname,
      };

      const nextMeta = {
        ...state.meta,
        [nickname]: {
          lastPage: meta.last_page,
          nextPage: meta.current_page + 1,
          timestamp: timestamp,
        },
      };

      if(nicknameToClear) {
        delete nextStoryAlbums[nicknameToClear];
        delete nextMeta[nicknameToClear];
      }

      state.storyAlbums = nextStoryAlbums;
      state.meta = nextMeta;
    },
    [FETCH_USER_STORY_ALBUMS + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [CREATE_USER_STORY_ALBUM + REQUEST] (state) {
      state.creating = true;
      state.creationError = null;
    },
    [CREATE_USER_STORY_ALBUM + SUCCESS] (state) {
      state.creating = false;
      state.creationError = null;
    },
    [CREATE_USER_STORY_ALBUM + ERROR] (state, error) {
      state.creating = false;
      state.creationError = error;
    },
    [FETCH_USER_STORY_ALBUM + REQUEST] (state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_USER_STORY_ALBUM + SUCCESS] (state, {
      authorNickname,
      storyAlbum,
      nicknameToClear,
    }) {
      state.loading = false;
      state.error = null;

      if(state.storyAlbums.hasOwnProperty(authorNickname) &&
        state.storyAlbums[authorNickname]
          .findIndex(album => album.id === storyAlbum.id) === -1) {
        const nextStoryAlbums = {
          ...state.storyAlbums,
          [authorNickname]: state.storyAlbums[authorNickname] &&
          [...state.storyAlbums[authorNickname], storyAlbum]
            .sort((left, right) => right.id - left.id) || [storyAlbum],
        };

        if (nicknameToClear) {
          delete nextStoryAlbums[nicknameToClear];
        }

        state.storyAlbums = nextStoryAlbums;
      }
    },
    [FETCH_USER_STORY_ALBUM + ERROR] (state, error) {
      state.loading = false;
      state.error = error;
    },
    [DELETE_USER_STORY_ALBUM + REQUEST] (state) {
      state.deleteAction = {
        loading: true,
        error: null,
      }
    },
    [DELETE_USER_STORY_ALBUM + SUCCESS] (state, { id }) {
      state.deleteAction = {
        loading: false,
        error: null,
      };

      for(const nickname in state.storyAlbums) {
        if(state.storyAlbums.hasOwnProperty(nickname)) {
          const index = state.storyAlbums[nickname].findIndex(album => album.id === id);
          Vue.delete(state.storyAlbums[nickname], index);
        }
      }
    },
    [DELETE_USER_STORY_ALBUM + ERROR] (state, error) {
      state.deleteAction = {
        loading: false,
        error,
      }
    },
    [DELETE_STORY_FROM_ALBUMS] (state, { slug }) {
      for(const nickname in state.storyAlbums) {
        if(state.storyAlbums.hasOwnProperty(nickname)) {
          Vue.set(state.storyAlbums,
            nickname,
            state.storyAlbums[nickname]
              .map(album => ({...album, posts: album.posts.filter(storySlug => storySlug !== slug)}))
          );
        }
      }
    },
  },
  actions: {
    async [FETCH_USER_STORY_ALBUMS] ({commit, state, getters}, { nickname }) {
      if(!nickname) {
        throw new Error('Error while fetching user story albums. There is not nickname.');
      }
      commit(FETCH_USER_STORY_ALBUMS + REQUEST);

      const timestamp = Math.ceil(Date.now() / 1000) + 5;

      const data = new FormData();
      data.append('nickname', nickname);

      try {
        let response = await api.stories.getStoryAlbums(data),
          responseData = response.data,
          albums = responseData.data,
          clearedAlbums = albums.map(album => ({...album, posts: album.posts.map(post => post.slug)})),
          meta = responseData.meta;

        const albumPosts = [];

        albums.forEach(album => album.posts && album.posts.forEach(post => albumPosts.push(post)));

        const nicknames = getters[NICKNAMES_OF_USERS_WHOSE_STORY_ALBUMS_ARE_STORING_NOW],
          nicknameToClear = nicknames.length >= state.maxCount
            ? nicknames.find(storedNickname => storedNickname !== nickname)
            : null;

        commit(userStoryPostsModule + ADD_STORY_POSTS, { posts: albumPosts }, { root: true });

        commit(FETCH_USER_STORY_ALBUMS + SUCCESS, {
          nickname,
          albums: clearedAlbums,
          nicknameToClear,
          timestamp,
          meta,
        });
      } catch (e) {
        commit(FETCH_USER_STORY_ALBUMS + ERROR, e.response || e.toString());
      }
    },
    async [CREATE_USER_STORY_ALBUM] ({commit, state, getters}, { ids, dataUrl, title }) {
      commit(CREATE_USER_STORY_ALBUM + REQUEST);

      try {
        const dataForUploadsCreate = new FormData();
        dataForUploadsCreate.append('type', 'user-post');

        const responseForUploadsCreate = await api.user.createUpload(dataForUploadsCreate),
          uploadId = responseForUploadsCreate && responseForUploadsCreate.data && responseForUploadsCreate.data.upload_id;


        const dataForUploadsLoad = new FormData();
        dataForUploadsLoad.append('upload_id', uploadId);
        dataUrl && dataForUploadsLoad.append('file', imageHelper.formatPhoto(dataUrl));

        const responseForUploadsLoad = await api.user.loadImageUpload(dataForUploadsLoad),
          fileId = responseForUploadsLoad && responseForUploadsLoad.data && responseForUploadsLoad.data.image_id;

        const dataForStoryAlbumAdd = new FormData();
        dataForStoryAlbumAdd.append('title', title);
        dataForStoryAlbumAdd.append('cover', fileId);
        dataForStoryAlbumAdd.append('posts_id', JSON.stringify(ids));

        const responseForStoryAlbumAdd = await api.stories.addStoryAlbum(dataForStoryAlbumAdd),
          newStory = responseForStoryAlbumAdd && responseForStoryAlbumAdd.data && responseForStoryAlbumAdd.data;

        console.log('newstory', newStory);

        commit(CREATE_USER_STORY_ALBUM + SUCCESS, {
        });
      } catch (e) {
        commit(CREATE_USER_STORY_ALBUM + ERROR, e.response || e.toString());
      }
    },
    async [FETCH_USER_STORY_ALBUM] ({commit, state, getters}, { id }) {
      commit(FETCH_USER_STORY_ALBUM + REQUEST);

      try {

        const data = new FormData();
        data.append('album_id', id);
        const response = await api.stories.getStoryAlbum(data),
          album = response && response.data,
          posts = album && response.data.posts,
          authorNickname = posts && posts.length > 0 && posts[0].author && posts[0].author.nickname,
          postSlugs = posts.map(post => post.slug),
          clearedAlbum = album && {...album, posts: postSlugs};

        const nicknames = getters[NICKNAMES_OF_USERS_WHOSE_STORY_ALBUMS_ARE_STORING_NOW],
          nicknameToClear = nicknames.length >= state.maxCount
            ? nicknames.find(storedNickname => storedNickname !== nickname)
            : null;

        commit(userStoryPostsModule + ADD_STORY_POSTS, { posts: posts }, { root: true });

        commit(FETCH_USER_STORY_ALBUM + SUCCESS, {
          authorNickname,
          storyAlbum: clearedAlbum,
          nicknameToClear,
        });
      } catch (e) {
        commit(FETCH_USER_STORY_ALBUM + ERROR, e.response || e.toString());
      }
    },
    async [DELETE_USER_STORY_ALBUM] ({commit, state, getters}, { id }) {
      commit(DELETE_USER_STORY_ALBUM + REQUEST);

      try {

        const data = new FormData();
        data.append('album_id', id);
        const response = await api.stories.deleteStoryAlbum(data);

        commit(DELETE_USER_STORY_ALBUM + SUCCESS, {
          id,
        });
      } catch (e) {
        commit(DELETE_USER_STORY_ALBUM + ERROR, e.response || e.toString());
      }
    },
  },
  getters: {
    [LOADING]: state => {
      return state.loading;
    },
    [IS_HAVE_TO_SHOW_STORY_ALBUMS_LOADING_SPINNER]: state => nickname => {
      const hasNotAnyStoriesForThisNickname = !state.storyAlbums[nickname] || state.storyAlbums[nickname].length < 1;
      return hasNotAnyStoriesForThisNickname && state.loading || state.loadingNextPage;
    },
    [NICKNAMES_OF_USERS_WHOSE_STORY_ALBUMS_ARE_STORING_NOW](state) {
      return Object.keys(state.storyAlbums);
    },
    [GET_USER_STORY_ALBUMS_BY_NICKNAME]: (state, getters, rootState, rootGetters) => nickname => {
      const foundAlbums = state.storyAlbums[nickname];
      return foundAlbums && foundAlbums.map(album => ({
        ...album,
        posts: rootGetters[userStoryPostsModule + GET_STORY_POSTS_BY_SLUGS](album.posts),
      }));
    },
    [CREATION_ERROR]: state => {
      return state.creationError;
    },
    [GET_ALBUM_STORIES_BY_ALBUM_ID]: (state, getters, rootState, rootGetters) => id => {
      for(const nickname in state.storyAlbums) {
        const foundAlbum = state.storyAlbums[nickname].find(album => `${album.id}` === `${id}`);
        if(foundAlbum) {
          return foundAlbum && rootGetters[userStoryPostsModule + GET_STORY_POSTS_BY_SLUGS](foundAlbum.posts);
        }
      }
    }
  }
};

export default module;
