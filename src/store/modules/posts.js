import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";
import imageHelper from 'JsLib/imageHelper'

import {ADD_POST_TO_AUTH_USER, CHANGE_BOOKMARKS_COUNT, moduleName as userModule} from "Store/modules/authUser/user";
import {ADD_POST_TO_USER, moduleName as usersModule} from "Store/modules/users/users";
import {ADD_POST_TO_ALBUM, moduleName as albumPostsModule} from 'Store/modules/albumPosts'
import {
  ADD_POST_TO_GROUP,
  BOOKMARK_GROUP_POST,
  EDIT_GROUP_POST,
  LIKE_GROUP_POST,
  moduleName as groupPostsModule
} from 'Store/modules/groups/groupPosts'
import {ADD_POST_TO_PROFILE, moduleName as userProfilePostsModule} from 'Store/modules/users/usersProfilePosts'
import {
  BOOKMARK_POST_MAIN_PAGE,
  EDIT_POST_MAIN_PAGE,
  FETCH_MAIN_POSTS,
  LIKE_POST_MAIN_PAGE,
  ADD_IS_REPOSTED,
  moduleName as mainPostsModule,
  RESET_MAIN_PAGE
} from "Store/modules/mainPosts";
import {
  ADD_POST_TO_BOOKMARKS,
  DELETE_POST_FROM_BOOKMARKS,
  moduleName as bookmarksModule
} from "Store/modules/authUser/bookmarks";
import {ADD_POST_TO_MENTIONS, moduleName as mentionsModule} from "Store/modules/authUser/mentions";

/**
 * Types
 * */
export const moduleName = 'posts/';

/** Actions types*/
export const FETCH_POST = 'FETCH_POST';
export const ADD_POST = 'ADD_POST';
export const ADD_USER_POST = 'ADD_USER_POST';
export const ADD_ALBUM_POST = 'ADD_ALBUM_POST';
export const ADD_GROUP_POST = 'ADD_GROUP_POST';
export const REPOST_POST = 'REPOST_POST';
export const LIKE_POST = 'LIKE_POST';
export const BOOKMARK_POST = 'BOOKMARK_POST';
export const UNREPOST_POST = 'UNREPOST_POST';
export const EDIT_POST = 'EDIT_POST';
export const ADD_POST_NEW = 'ADD_POST_NEW';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const CHANGE_POST_USER_SUBSCRIBE = 'CHANGE_POST_USER_SUBSCRIBE';
export const CHANGE_SELECTED_POST = 'CHANGE_SELECTED_POST';
export const CHANGE_POST_COMMENT_COUNT = 'CHANGE_POST_COMMENT_COUNT';

/** Getters types*/
export const LOADING = 'LOADING';
export const POST = 'POST';
export const EDIT_POST_LOADING = 'EDIT_POST_LOADING';
export const SELECTED_POST = 'SELECTED_POST';

const module = {
  namespaced: true,
  state: {
    posts: {},
    postSlugs: [],
    maxCount: 500,
    loading: false,
    showLoading: true,
    error: null,
    editPostLoading: false,
    selectedPost: null
  },
  mutations: {
    [FETCH_POST + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_POST + SUCCESS](state, payload) {
      state.loading = false;
      state.posts = {
        ...payload.postsTemp,
        [payload.postSlug]: payload.res
      };
      state.postSlugs = [...payload.postSlugsOrder, payload.postSlug];
    },
    [FETCH_POST + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [CHANGE_SHOW_LOADING](state, payload) {
      state.showLoading = payload;
    },
    [FETCH + SUCCESS](state) {
      state.loading = false;
      state.showLoading = true;
    },
    [ADD_POST + REQUEST](state) {

    },
    [ADD_POST + SUCCESS](state, payload) {
      const {data, postSlug} = payload;

      if(state.posts[postSlug]) {
        state.posts = {
          ...state.posts,
          [postSlug]: [...data, ...state.posts[postSlug]]
        };
      }
    },
    [ADD_POST + ERROR](state, error) {

    },
    [LIKE_POST + REQUEST](state) {

    },
    [LIKE_POST + SUCCESS](state, payload) {
      if(state.posts[payload.slug]) {
        state.posts[payload.slug].is_liked = payload.isLiked;
        if(payload.isLiked) {
          state.posts[payload.slug].likes_count = state.posts[payload.slug].likes_count + payload.count;
        } else {
          state.posts[payload.slug].likes_count = state.posts[payload.slug].likes_count - payload.count;
        }
      }
    },
    [LIKE_POST + ERROR](state, error) {

    },
    [UNREPOST_POST + REQUEST](state, { slug }) {
      if(state.posts[slug]) {
        state.posts[slug].is_reposted = false;
      }
    },
    [UNREPOST_POST + SUCCESS](state) {
    },
    [UNREPOST_POST + ERROR](state, { slug }) {
      if(state.posts[slug]) {
        state.posts[slug].is_reposted = true;
      }
    },
    [BOOKMARK_POST + REQUEST](state) {

    },
    [BOOKMARK_POST + SUCCESS](state, payload) {
      if(state.posts[payload.slug]) {
        state.posts[payload.slug].is_bookmarked = payload.isBookmarked;
        if(payload.isBookmarked) {
          state.posts[payload.slug].bookmarks_count = state.posts[payload.slug].bookmarks_count + 1;
        } else {
          state.posts[payload.slug].bookmarks_count = state.posts[payload.slug].bookmarks_count - 1;
        }
      }
    },
    [BOOKMARK_POST + ERROR](state, error) {

    },
    [CHANGE_POST_USER_SUBSCRIBE](state, payload) {
      if(state.posts[payload.slug]) {
        state.posts[payload.slug].author.is_subscribed = payload.state;
      }
    },
    [EDIT_POST + REQUEST](state) {
      state.editPostLoading = true;
    },
    [EDIT_POST + SUCCESS](state, payload) {
      state.editPostLoading = false;
      for(let slug in state.posts) {
        if(state.posts[slug].id === payload.id) {
          state.posts[slug] = payload.post;
        }
      }
    },
    [EDIT_POST + ERROR](state, e) {
      state.editPostLoading = false;
    },
    [CHANGE_SELECTED_POST](state, payload) {
      state.selectedPost = payload;
    },
    [CHANGE_POST_COMMENT_COUNT](state, payload) {
      state.posts[payload.slug].comments_count += payload.value;
    }
  },
  actions: {
    async [FETCH_POST]({commit, state}, payload) {
      if(state.posts[payload]) {
        commit(CHANGE_SHOW_LOADING, false);
      }

      commit(FETCH_POST + REQUEST);

      const data = new FormData();
      data.append('slug', payload);

      try {
        let res = await api.users.getPost(data);

        let postSlugsOrder = state.postSlugs.filter(slug => slug !== payload);
        let postsTemp = {...state.posts};

        if(postSlugsOrder.length >= state.maxCount) {
          delete postsTemp[postSlugsOrder[0]];
          postSlugsOrder = postSlugsOrder.slice(1);
        }

        let result = {
          postSlug: payload,
          res: res.data,
          postSlugsOrder,
          postsTemp
        };

        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_POST + SUCCESS, result);

      } catch (e) {
        if(state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_POST + ERROR, e.response);
      }
    },
    async [ADD_POST]({commit, dispatch, rootState}, payload) {
      commit(ADD_POST + REQUEST);

      const {
        imagesArray,
        albumId,
        groupSlug,
        intags,
        geoId,
        title,
        mentions,
        onSuccess,
        redirectOnMain,
        goBack
      } = payload;

      let addPostToMention = false; // flag that check if user add yourself to mention

      let upload = {
        id: null,
        items: []
      };
      const mentionsPost = {};

      const uploadFile = i => {
        let file;
        if (imagesArray[i].type === 'img') {
          file = imageHelper.formatPhoto(imagesArray[i].img);
        } else {
          file = imagesArray[i].file;
        }

        let data = new FormData();
        data.append('upload_id', upload.id);
        data.append('file', file);
        data.append('order', i);

        const config = {headers: {'Content-Type': 'multipart/form-data'}};

        return api.user.loadUpload(data, config);
      };

      const addMentions = (index, resId) => {
        if(mentions[index]) {
          mentions[index].forEach((arr) => {
            let mention = {
              id: arr['userId'],
              x: arr['posXdB'],
              y: arr['posYdB']
            };

            if(!addPostToMention && mention.id === rootState.user.user.id) {
              addPostToMention = true;
            }
            if(mentionsPost[resId]) {
              mentionsPost[resId].push(mention);
            } else {
              mentionsPost[resId] = [mention];
            }
          });
        }
      };

      try {
        const dataCreate = new FormData();
        dataCreate.append('type', 'user-post');
        let resCreate = await api.user.createUpload(dataCreate);
        upload.id = resCreate.data.upload_id;

        let resUpload = await Promise.all(imagesArray.map((_, i) => uploadFile(i)));

        resUpload.forEach((res, i) => {
          console.log(res);
          upload.items[res.data.order] = res.data.file_id;
          addMentions(i, res.data.file_id)
        });

        const dataAdd = new FormData();
        dataAdd.append('title', title);
        dataAdd.append('place_geo_id', geoId);
        dataAdd.append('intags', JSON.stringify(intags));
        dataAdd.append('upload', JSON.stringify(upload));
        dataAdd.append('mentions', JSON.stringify(mentionsPost));
        if(albumId) {
          dataAdd.append('album_id', albumId);
        } else if(groupSlug) {
          dataAdd.append('group_slug', groupSlug);
        }

        const addPostPayload = {
          data: dataAdd,
          addPostToMention
        };
        if(albumId) {
          await dispatch(ADD_ALBUM_POST, addPostPayload);
        } else if(groupSlug) {
          await dispatch(ADD_GROUP_POST, addPostPayload);
        } else {
          await dispatch(ADD_USER_POST, addPostPayload)
        }

        onSuccess();

        if(!groupSlug && !albumId) {
          commit(mainPostsModule + RESET_MAIN_PAGE, null, {root: true});
          redirectOnMain();
        } else {
          goBack();
        }

        // commit(ADD_POST + SUCCESS, result);
      } catch (e) {
        commit(ADD_POST + ERROR, e.response);
      }
    },
    async [ADD_POST_NEW]({commit, dispatch, rootState}, payload) {
      commit(ADD_POST + REQUEST);

      const {
        files,
        albumId,
        groupSlug,
        intags,
        geoId,
        title,
        mentions,
        visibility,
        fromGroup,
        onSuccess,
        onFail
      } = payload;

      let addPostToMention = false; // flag that check if user add yourself to mention

      let upload = {
        id: null,
        items: []
      };
      const mentionsPost = {};

      const uploadFile = i => {
        let file;
        if (files[i].type === 'image') {
          if(files[i].cropped) {
            file = imageHelper.formatPhoto(files[i].cropped);
          } else {
            console.log(files[i].original);
            file = imageHelper.formatPhoto(files[i].file);
          }
        } else {
          file = files[i].original;
        }

        let data = new FormData();
        data.append('upload_id', upload.id);
        data.append('file', file);
        data.append('order', i);

        const config = {headers: {'Content-Type': 'multipart/form-data'}};

        return api.user.loadUpload(data, config);
      };

      const addMentions = (index, resId) => {
        if(mentions[index]) {
          mentions[index].forEach((arr) => {
            let mention = {
              id: arr['userId'],
              x: arr['posXdB'],
              y: arr['posYdB']
            };

            if(!addPostToMention && mention.id === rootState.user.user.id) {
              addPostToMention = true;
            }
            if(mentionsPost[resId]) {
              mentionsPost[resId].push(mention);
            } else {
              mentionsPost[resId] = [mention];
            }
          });
        }
      };

      try {
        const dataCreate = new FormData();
        dataCreate.append('type', 'user-post');
        let resCreate = await api.user.createUpload(dataCreate);
        upload.id = resCreate.data.upload_id;

        let resUpload = await Promise.all(files.map((_, i) => uploadFile(i)));

        resUpload.forEach((res, i) => {
          console.log(res);
          upload.items[res.data.order] = res.data.file_id;
          addMentions(i, res.data.file_id)
        });

        const dataAdd = new FormData();
        dataAdd.append('title', title);
        dataAdd.append('place_geo_id', geoId);
        dataAdd.append('intags', JSON.stringify(intags));
        dataAdd.append('upload', JSON.stringify(upload));
        dataAdd.append('mentions', JSON.stringify(mentionsPost));
        visibility && dataAdd.append('visibility', visibility);
        fromGroup && dataAdd.append('from_group', 1);
        if(albumId) {
          dataAdd.append('album_id', albumId);
        } else if(groupSlug) {
          dataAdd.append('group_slug', groupSlug);
        }

        const addPostPayload = {
          data: dataAdd,
          addPostToMention,
          onFail
        };
        if(albumId) {
          await dispatch(ADD_ALBUM_POST, addPostPayload);
        } else if(groupSlug) {
          await dispatch(ADD_GROUP_POST, addPostPayload);
        } else {
          await dispatch(ADD_USER_POST, addPostPayload)
        }

        onSuccess();
      } catch (e) {
        console.log(e);
        commit(ADD_POST + ERROR, e);
        if(onFail) onFail();
      }
    },
    async [ADD_USER_POST]({commit, rootState}, payload) {
      const config = {
        onUploadProgress(progressEvent) {
          console.log(progressEvent);
          let percentCompleted = progressEvent.loaded / progressEvent.total ;
          console.log(percentCompleted)
        }
      };

      try {
        let res = await api.users.addUserPost(payload.data, config);

        if(res.status === 201) {
          let result = {
            nickname: rootState.user.user.nickname,
            data: [res.data]
          };

          commit(userProfilePostsModule + ADD_POST_TO_PROFILE, result, {root: true});
          commit(usersModule + ADD_POST_TO_USER, rootState.user.user.nickname, {root: true});
          commit(userModule + ADD_POST_TO_AUTH_USER, null, {root: true});
          if(payload.addPostToMention) {
            commit(mentionsModule + ADD_POST_TO_MENTIONS, res.data, {root: true});
          }
        }
      } catch (e) {
        console.log(e);
        if(payload.onFail()) payload.onFail();
      }
    },
    async [ADD_ALBUM_POST]({commit}, payload) {
      try {
        let res = await api.albums.addAlbumPost(payload.data);

        console.log(payload.getAll('albumId'));

        if(res.status === 201) {
          let result = {
            albumId: payload.data.getAll('albumId'),
            data: [res.data]
          };

          commit(albumPostsModule + ADD_POST_TO_ALBUM, result, {root: true});
          if(payload.addPostToMention) {
            commit(mentionsModule + ADD_POST_TO_MENTIONS, res.data, {root: true});
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    async [UNREPOST_POST]({commit}, payload) {
      commit(UNREPOST_POST + REQUEST, { slug });

      const {id, slug, onSuccess} = payload;

      try {
        const data = new FormData();
        data.append('id', id);
        data.append('delete', '1');

        let res = await api.users.repostPost(data);

        let result = {
          isReposted: res.data.state,
          id,
          slug,
        };

        commit(UNREPOST_POST + SUCCESS, { slug });
        commit(mainPostsModule + ADD_IS_REPOSTED, result, {root: true});
        onSuccess && onSuccess();
      } catch (e) {
        console.error(e);
        commit(UNREPOST_POST + ERROR, { slug });
      }
    },
    async [ADD_GROUP_POST]({commit}, payload) {
      try {
        let res = await api.groups.addGroupPost(payload.data);

        if(res.status === 201) {

          let result = {
            groupSlug: payload.data.getAll('groupSlug'),
            data: [res.data]
          };

          commit(groupPostsModule + ADD_POST_TO_GROUP, result, {root: true});
          if(payload.addPostToMention) {
            commit(mentionsModule + ADD_POST_TO_MENTIONS, res.data, {root: true});
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    async [LIKE_POST]({commit}, payload) {
      commit(LIKE_POST + REQUEST);

      const {id, slug, groupSlug, onSuccess} = payload;

      try {
        const data = new FormData();
        data.append('id', id);
        if(payload.delete) data.append('delete', '1');

        let res = await api.users.likePost(data);

        let result = {
          isLiked: res.data.state,
          slug: slug,
          count: res.data.multiplier,
          groupSlug
        };

        commit(LIKE_POST + SUCCESS, result);
        commit(mainPostsModule + LIKE_POST_MAIN_PAGE, result, {root: true});
        commit(groupPostsModule + LIKE_GROUP_POST, result, {root: true});
        onSuccess();
      } catch (e) {
        console.log(e);
      }
    },
    async [BOOKMARK_POST]({commit}, payload) {
      commit(BOOKMARK_POST + REQUEST);

      const {post, groupSlug, onSuccess} = payload;

      try {
        const data = new FormData();
        data.append('id', post.id);
        if(payload.delete) data.append('delete', '1');

        let res = await api.users.bookmarkPost(data);

        let result = {
          isBookmarked: res.data.state,
          slug: post.slug,
          groupSlug
        };

        post.is_bookmarked = res.data.state;

        commit(BOOKMARK_POST + SUCCESS, result);
        commit(mainPostsModule + BOOKMARK_POST_MAIN_PAGE, result, {root: true});
        commit(userModule + CHANGE_BOOKMARKS_COUNT, res.data.state ? 1 : -1, {root: true});
        commit(groupPostsModule + BOOKMARK_GROUP_POST, result, {root: true});
        if(res.data.state) {
          commit(bookmarksModule + ADD_POST_TO_BOOKMARKS, post, {root: true});
        } else {
          commit(bookmarksModule + DELETE_POST_FROM_BOOKMARKS, post.id, {root: true});
        }

        onSuccess();
      } catch (e) {
        console.log(e);
      }
    },
    async [EDIT_POST]({commit}, payload) {
      commit(EDIT_POST + REQUEST);

      const { params: { post_id, title, place_geo_id, intags, mentions}, onSuccess } = payload;

      const data = new FormData();
      data.append('post_id', post_id);
      data.append('title', title);
      data.append('place_geo_id', place_geo_id);
      data.append('intags', intags);
      data.append('mentions', mentions);

      try {
        let res = await api.post.editPost(data);

        commit(EDIT_POST + SUCCESS, res.data);
        commit(mainPostsModule + EDIT_POST_MAIN_PAGE, res.data, { root: true });
        commit(groupPostsModule + EDIT_GROUP_POST, res.data, { root: true });

        if(onSuccess) onSuccess();
      } catch (e) {
        console.log(e);
        commit(EDIT_POST + ERROR, e);
      }
    }
    // async [REPOST_POST]({commit}, payload) {
    //   commit(REPOST_POST + REQUEST);
    //
    //   try {
    //     const {id, slug } = payload;
    //
    //     const data = new FormData();
    //     data.append('id', id);
    //     if(payload.delete) data.append('delete', '1');
    //
    //     let res = await api.users.repostPost(data);
    //
    //     let result = {
    //       isLiked: res.data.state,
    //       slug: slug,
    //     };
    //
    //     commit(REPOST_POST + SUCCESS, result);
    //     commit(mainPostsModule + LIKE_POST_MAIN_PAGE, result, {root: true});
    //   } catch (e) {
    //       console.log(e);
    //   }
    // }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [POST]: state => slug => {
      return state.posts[slug]
    },
    [EDIT_POST_LOADING](state) {
      return state.editPostLoading
    },
    [SELECTED_POST](state) {
      return state.selectedPost
    }
  }
};

export default module;
