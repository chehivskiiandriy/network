import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";
import {ADD_POST_TO_USER, CHANGE_USER_FAMILY_STATUS, moduleName as usersModule} from "Store/modules/users/users";
import {ACCEPT_USER_GIFT, moduleName as giftsModule} from "Store/modules/authUser/gifts";
import {ADD_POST_TO_PROFILE, moduleName as userProfilePostsModule} from "Store/modules/users/usersProfilePosts";
import {ADD_GIFT_TO_POST, moduleName as mainPostsModule} from "Store/modules/mainPosts";

/**
 * Types
 * */
export const moduleName = 'user/';

/** Actions types*/
export const FETCH_CURRENT_USER = 'FETCH_CURRENT_USER';
export const ADD_LOADED = 'ADD_LOADED';
export const CHANGE_FAMILY_STATUS = 'CHANGE_FAMILY_STATUS';
export const ACCEPT_GIFT = 'ACCEPT_GIFT';
export const CHANGE_AVATAR = 'CHANGE_AVATAR';
export const EDIT_BASE_USER_SETTINGS = 'EDIT_BASE_USER_SETTINGS';
export const EDIT_USER_SETTINGS = 'EDIT_USER_SETTINGS';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const ADD_POST_TO_AUTH_USER = 'ADD_POST_TO_AUTH_USER';
export const DELETE_POST_FROM_AUTH_USER = 'DELETE_POST_FROM_AUTH_USER';
export const CHANGE_SUBSCRIBE_USER_COUNT = 'CHANGE_SUBSCRIBE_USER_COUNT';
export const CHANGE_SUBSCRIPTIONS_USER_COUNT = 'CHANGE_SUBSCRIPTIONS_USER_COUNT';
export const CHANGE_BOOKMARKS_COUNT = 'CHANGE_BOOKMARKS_COUNT';
export const CHANGE_AUTH_USER_REQUESTS_COUNT = 'CHANGE_AUTH_USER_REQUESTS_COUNT';
export const UPDATE_AUTH_USER = 'UPDATE_AUTH_USER';

/** Getters types*/
export const AUTH_USER = 'AUTH_USER';
export const LOADED = 'LOADED';

const module = {
  namespaced: true,
  state: {
    user: {
      active_gift: {
        id: null,
        image: '',
        name: '',
      },
      activity_statuses: [],
      avatar_image: {
        id: null,
        mentioned_users_count: null,
        url: '',
        url_large: '',
        url_medium: '',
        url_small: '',
      },
      birth_date: null,
      birth_date_timestamp: null,
      bookmarks_count: null,
      comments: null,
      contest_entry: null,
      email: '',
      family_status: '',
      gender: '',
      geo_id: null,
      id: null,
      is_active_story: null,
      is_chined: null,
      is_online: null,
      is_story_seen: null,
      is_subscribed: null,
      is_voted: null,
      last_online_timestamp: null,
      lastname: null,
      name: null,
      nickname: null,
      off_page: null,
      personal_status: null,
      phone: null,
      posts_count: null,
      privacy_settings: {
        chat: null,
        profile: null,
        subscribe: null,
        subscribers: null,
        subscriptions: null
      },
      rating: {
        level: null,
        proportion: null,
        value: null,
      },
      settings: {
        chat_langs: {
          main_lang: null,
          sub_langs: []
        },
        lang: null,
        sounds: null,
      },
      social_links: [],
      social_statuses: [],
      status: null,
      subscribers_count: null,
      subscriptions_count: null,
      tutorial: {
        android: null,
        ios: null,
        user_id: null,
        web_desktop: null,
        web_mobile: null
      },
      typed_rating: {
        day: null,
        month: null,
        week: null
      }
    },
    loaded: false,
    loading: false,
    error: null
  },
  mutations: {
    /** fetch current user */
    [FETCH_CURRENT_USER + REQUEST](state) {
      state.loading = true;
    },
    [FETCH_CURRENT_USER + SUCCESS](state, user) {
      state.loading = false;
      state.loaded = true;
      state.error = null;
      state.user = user;
    },
    [FETCH_CURRENT_USER + ERROR](state, error) {
      state.loading = false;
      state.loaded = true;
      state.error = error;
      state.user = null;
    },
    [ADD_LOADED + SUCCESS](state) {
      state.loaded = true;
    },
    [CHANGE_FAMILY_STATUS + REQUEST](state) {

    },
    [CHANGE_FAMILY_STATUS + SUCCESS](state, payload) {
      state.user.family_status = payload;
    } ,
    [CHANGE_FAMILY_STATUS + ERROR](state, payload) {

    },
    [ACCEPT_GIFT + REQUEST](state) {

    },
    [ACCEPT_GIFT + SUCCESS](state, payload) {
      if(payload.state){
        state.user.active_gift = payload.gift.gift_model;
        // state.user.active_gift.id = payload.gift.gift_model.id;
        // state.user.active_gift.image = payload.gift.gift_model.image;
        // state.user.active_gift.name = payload.gift.gift_model.name;
      }
    },
    [ACCEPT_GIFT + ERROR](state, error) {

    },
    [ADD_POST_TO_AUTH_USER](state) {
      state.user.posts_count = state.user.posts_count + 1;
    },
    [DELETE_POST_FROM_AUTH_USER](state) {
      state.user.posts_count = state.user.posts_count - 1;
    },
    [CHANGE_SUBSCRIBE_USER_COUNT](state, payload) {
      state.user.subscribers_count = state.user.subscribers_count + payload;
    },
    [CHANGE_SUBSCRIPTIONS_USER_COUNT](state, payload) {
      state.user.subscriptions_count = state.user.subscriptions_count + payload;
    },
    [CHANGE_AVATAR + REQUEST](state) {

    },
    [CHANGE_AVATAR + SUCCESS](state, payload) {
      state.user.avatar_image = payload;
    },
    [CHANGE_AVATAR + ERROR](state, error) {

    },
    [EDIT_BASE_USER_SETTINGS + REQUEST](state) {

    },
    [EDIT_BASE_USER_SETTINGS + SUCCESS](state, payload) {

    },
    [EDIT_BASE_USER_SETTINGS + ERROR](state, error) {

    },
    [EDIT_USER_SETTINGS + REQUEST](state) {

    },
    [EDIT_USER_SETTINGS + SUCCESS](state, payload) {

    },
    [EDIT_USER_SETTINGS + ERROR](state, error) {

    },
    [CHANGE_BOOKMARKS_COUNT](state, payload) {
      state.user.bookmarks_count = state.user.bookmarks_count + payload;
    },
    [CHANGE_AUTH_USER_REQUESTS_COUNT](state) {
      state.user.subscribe_requests_count = state.user.subscribe_requests_count - 1;
    },
    [UPDATE_AUTH_USER](state, payload) {
      state.user = payload;
    }
  },
  actions: {
    async [FETCH_CURRENT_USER]({commit}, payload) {
      commit(FETCH_CURRENT_USER + REQUEST);

      try {
        let res = await api.user.getUser();

        //temporary
        localStorage.setItem('user', JSON.stringify(res.data));

        commit(FETCH_CURRENT_USER + SUCCESS, res.data);
        if(payload && payload.onSuccess) payload.onSuccess();
      } catch (e) {
        commit(FETCH_CURRENT_USER + ERROR, e);

        //temporary
        if(localStorage.getItem('user')) localStorage.removeItem('user');

        if(payload && payload.onFail) payload.onFail();
      }
    },
    [ADD_LOADED]({commit}) {
      commit(ADD_LOADED + SUCCESS);
    },
    async [CHANGE_FAMILY_STATUS]({commit, state}, payload) {
      commit(CHANGE_FAMILY_STATUS + REQUEST);

      try {
        const data = new FormData();
        data.append('family_status', payload);

        const res = await api.user.changeMySettings(data);
        //console.log(res);

        if(res.data.state) {
          commit(CHANGE_FAMILY_STATUS + SUCCESS, payload);
          commit(usersModule + CHANGE_USER_FAMILY_STATUS, {nickname: state.user.nickname, status: payload}, {root: true})
        }
      } catch (e) {
        commit(CHANGE_FAMILY_STATUS + ERROR, e.response)
      }
    },
    async [ACCEPT_GIFT]({commit, rootState}, payload) {
      commit(ACCEPT_GIFT + REQUEST);

      const data = new FormData();
      data.append('event_id', payload);

      try {
        let res = await api.user.acceptGift(data);
        console.log(res);

        commit(ACCEPT_GIFT + SUCCESS, res.data);
        if(res.data.state) {
          commit(giftsModule + ACCEPT_USER_GIFT, payload, {root: true});
          let result = {
            nickname: rootState.user.user.nickname,
            gift: res.data.gift.gift_model
          };
          commit(mainPostsModule + ADD_GIFT_TO_POST, result, {root: true});
        }
      } catch (e) {
        console.log(e);
        commit(ACCEPT_GIFT + ERROR, e.response);
      }
    },
    async [CHANGE_AVATAR]({commit, rootState}, payload) {
      commit(CHANGE_AVATAR + REQUEST);

      const {file, onSuccess, onFail} = payload;
      try {
        const dataCreate = new FormData();
        dataCreate.append('type', 'user-post');
        let resCreate = await api.user.createUpload(dataCreate);

        const dataLoad = new FormData();
        dataLoad.append('upload_id', resCreate.data.upload_id);
        dataLoad.append('file', file);
        let resLoad = await api.user.loadUpload(dataLoad);

        let uploadFile = JSON.stringify({
          'id': resLoad.data.upload_id,
          'items': [resLoad.data.file_id]
        });
        const dataPost = new FormData();
        dataPost.append('upload', uploadFile);
        let resPostAdd = await api.users.addUserPost(dataPost);

        const dataChangeAvatar = new FormData();
        dataChangeAvatar.append('post_id', resPostAdd.data.id);
        await api.user.changeAvatar(dataChangeAvatar);

        let result = {
          nickname: rootState.user.user.nickname,
          data: [resPostAdd.data]
        };

        console.log(rootState.user.user.nickname);

        commit(userProfilePostsModule + ADD_POST_TO_PROFILE, result, {root: true});
        commit(usersModule + ADD_POST_TO_USER, rootState.user.user.nickname, {root: true});
        commit(ADD_POST_TO_AUTH_USER);

        // console.log(resPostAdd.data);
        commit(CHANGE_AVATAR + SUCCESS, resPostAdd.data.attachments.images[0]);

        onSuccess();
      } catch (e) {
        commit(CHANGE_AVATAR + ERROR, e.response);
        console.log(e);
        onFail();
      }
    }
  },
  getters: {
    [AUTH_USER](state) {
      return state.user
    },
    [LOADED](state) {
      return state.loaded
    }
  }
};

export default module;
