import {ERROR, REQUEST, SUCCESS} from "Store/types";
import api from "utils/api";

import {READ_MESSAGES} from "Store/modules/chats/chatsAll";

/**
 * Types
 * */
export const moduleName = 'chatMessages/';

/** Actions types*/
export const FETCH_MESSAGES = 'FETCH_MESSAGES';
export const FETCH_MESSAGES_NEXT_PAGE = 'FETCH_MESSAGES_NEXT_PAGE';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const DELETE_MESSAGES = 'DELETE_MESSAGES';
export const FORWARD_MESSAGES = 'FORWARD_MESSAGES';
export const FORWARD_POST = 'FORWARD_POST';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_SHOW_LOADING = 'CHANGE_SHOW_LOADING';
export const FETCH = 'FETCH';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const ADD_TRANSLATED_MESSAGE = 'ADD_TRANSLATED_MESSAGE';
export const SELECT_MESSAGE = 'SELECT_MESSAGE';
export const RESET_SELECTED_MESSAGES = 'RESET_SELECTED_MESSAGES';
export const SELECT_POST = 'SELECT_POST';
export const RESET_SELECTED_POST = 'RESET_SELECTED_POST';
export const CHANGE_SELECTED_FORWARD_MESSAGES = 'CHANGE_SELECTED_FORWARD_MESSAGES';
export const CHANGE_SELECTED_FORWARD_POST = 'CHANGE_SELECTED_FORWARD_POST';
export const READ_MESSAGES_IN_CHAT = 'READ_MESSAGES_IN_CHAT';
export const CHANGE_SELECTED_IMAGE = 'CHANGE_SELECTED_IMAGE';

/** Getters types*/
export const LOADING = 'LOADING';
export const MESSAGES = 'MESSAGES';
export const SELECTED_MESSAGES = 'SELECTED_MESSAGES';
export const SELECTED_POST = 'SELECTED_POST';
export const SELECTED_FORWARD_MESSAGES = 'SELECTED_FORWARD_MESSAGES';
export const SELECTED_FORWARD_POST = 'SELECTED_FORWARD_POST';
export const SELECTED_IMAGE = 'SELECTED_IMAGE';

const module = {
  namespaced: true,
  state: {
    messages: {},
    messagesMeta: {},
    messagesIds: [],
    maxCount: 30,
    loading: false,
    showLoading: true,
    error: null,
    selectedMessages: [],
    selectedPost: null,
    selectedForwardMessages: null,
    selectedForwardPost: null,
    selectedImage: null
  },
  mutations: {
    [FETCH_MESSAGES + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_MESSAGES + SUCCESS](state, payload) {
      state.loading = false;
      state.messages = {
        ...payload.messagesTemp,
        [payload.chatId]: payload.res.data.reverse()
      };
      state.messagesMeta = {
        ...payload.messagesMetaTemp,
        [payload.chatId]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.messagesIds = [...payload.messagesIdsOrder, payload.chatId];
    },
    [FETCH_MESSAGES + ERROR](state, error) {
      state.loading = false;
      state.error = error;
    },
    [FETCH_MESSAGES_NEXT_PAGE + REQUEST](state) {
      state.loading = true;
      state.error = null;
    },
    [FETCH_MESSAGES_NEXT_PAGE + SUCCESS](state, payload) {
      state.loading = false;
      state.messages[payload.chatId] = [...payload.res.data.reverse(), ...state.messages[payload.chatId].slice(state.messages[payload.chatId].length % 30)];
      state.messagesMeta = {
        ...payload.messagesMetaTemp,
        [payload.chatId]: {
          lastPage: payload.res.meta.last_page,
          nextPage: payload.res.meta.current_page + 1,
        }
      };
      state.messagesIds = [...payload.messagesIdsOrder, payload.chatId];
    },
    [FETCH_MESSAGES_NEXT_PAGE + ERROR](state, error) {
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
    [SEND_MESSAGE + REQUEST](state) {

    },
    [ADD_MESSAGE](state, payload) {
      if (state.messages[payload.chat_id]) {
        state.messages[payload.chat_id].push(payload);
      }
    },
    [ADD_TRANSLATED_MESSAGE](state, payload) {
      if (state.messages[payload.chat_id]) {
        let length = state.messages[payload.chat_id].length;

        for (let i = 0; i < length; i++) {
          if (state.messages[payload.chat_id][length - i - 1].id === payload.id) {
            state.messages[payload.chat_id][length - i - 1].translated_message = payload.translated_message;
            break;
          }
        }
      }
    },
    [SELECT_MESSAGE](state, payload) {
      if (payload.state) {
        state.selectedMessages = state.selectedMessages.filter(item => item.id !== payload.message.id);
      } else {
        state.selectedMessages.push(payload.message);
      }
    },
    [RESET_SELECTED_MESSAGES](state) {
      state.selectedMessages = [];
    },
    [SELECT_POST](state, payload) {
      state.selectedPost = payload;
    },
    [RESET_SELECTED_POST](state) {
      state.selectedPost = null;
    },
    [CHANGE_SELECTED_FORWARD_MESSAGES](state, payload) {
      state.selectedForwardMessages = payload;
    },
    [CHANGE_SELECTED_FORWARD_POST](state, payload) {
      state.selectedForwardPost = payload;
    },
    [DELETE_MESSAGES + REQUEST](state) {

    },
    [DELETE_MESSAGES + SUCCESS](state, payload) {
      state.messages[payload.chatId] = state.messages[payload.chatId].filter(item => !payload.ids.includes(item.id));
    },
    [DELETE_MESSAGES + ERROR](state, error) {

    },
    [FORWARD_MESSAGES + REQUEST](state) {

    },
    [FORWARD_MESSAGES + SUCCESS](state, payload) {

    },
    [FORWARD_MESSAGES + ERROR](state, error) {

    },
    [FORWARD_POST + REQUEST](state) {

    },
    [FORWARD_POST + SUCCESS](state, payload) {

    },
    [FORWARD_POST + ERROR](state, error) {

    },
    [READ_MESSAGES_IN_CHAT](state, payload) {
      if (state.messages[payload.id]) {
        for (let i = state.messages[payload.id].length - 1; i > 0; i--) {
          if (state.messages[payload.id][i].was_read) {
            break;
          } else {
            state.messages[payload.id][i].was_read = true;
          }
        }
      }
    },
    [CHANGE_SELECTED_IMAGE](state, payload) {
      state.selectedImage = payload;
    }
  },
  actions: {
    async [FETCH_MESSAGES]({commit, state}, payload) {
      if (state.messages[payload]) {
        commit(CHANGE_SHOW_LOADING, false);
      } else {
        commit(CHANGE_SHOW_LOADING, true);
      }
      commit(FETCH_MESSAGES + REQUEST);

      const data = new FormData();
      data.append('chat_id', payload);
      data.append('limit', '30');

      try {
        let res = await api.messages.getAll(data);

        if (state.messages[payload] && state.messages[payload].length > 0 && res.data.data.length > 0 && res.data.data[0].id === state.messages[payload][state.messages[payload].length - 1].id) {
          commit(FETCH + SUCCESS);
          return;
        }

        let messagesIdsOrder = state.messagesIds.filter(id => id !== payload);
        let messagesTemp = {...state.messages};
        let messagesMetaTemp = {...state.messagesMeta};

        if (messagesIdsOrder.length >= state.maxCount) {
          delete messagesTemp[messagesIdsOrder[0]];
          delete messagesMetaTemp[messagesIdsOrder[0]];
          messagesIdsOrder = messagesIdsOrder.slice(1);
        }

        let result = {
          chatId: payload,
          res: res.data,
          messagesIdsOrder,
          messagesTemp,
          messagesMetaTemp
        };

        if (state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_MESSAGES + SUCCESS, result);
      } catch (e) {
        if (state.showLoading === false) commit(CHANGE_SHOW_LOADING, true);
        commit(FETCH_MESSAGES + ERROR, e);
      }
    },
    async [FETCH_MESSAGES_NEXT_PAGE]({commit, state}, payload) {
      if (state.messagesMeta[payload].lastPage < state.messagesMeta[payload].nextPage || state.loading) {
        return;
      }

      commit(FETCH_MESSAGES_NEXT_PAGE + REQUEST);

      let nextPage = Math.floor(state.messages[payload].length / 30) + 1;

      const data = new FormData();
      data.append('chat_id', payload);
      data.append('page', String(nextPage));
      data.append('limit', '30');

      try {
        let res = await api.messages.getAll(data);

        let messagesIdsOrder = state.messagesIds.filter(id => id !== payload);
        let messagesTemp = {...state.messages};
        let messagesMetaTemp = {...state.messagesMeta};

        if (messagesIdsOrder.length >= state.maxCount) {
          delete messagesTemp[messagesIdsOrder[0]];
          delete messagesMetaTemp[messagesIdsOrder[0]];
          messagesIdsOrder = messagesIdsOrder.slice(1);
        }

        let result = {
          chatId: payload,
          res: res.data,
          messagesIdsOrder,
          messagesTemp,
          messagesMetaTemp,
        };

        commit(FETCH_MESSAGES_NEXT_PAGE + SUCCESS, result)
      } catch (e) {
        console.log(e);
        commit(FETCH_MESSAGES_NEXT_PAGE + ERROR, e);
      }
    },
    async [SEND_MESSAGE]({commit}, payload) {
      commit(SEND_MESSAGE + REQUEST);

      const {file, chatId, message, onSuccess} = payload;

      let fileData;

      try {
        if (file) {
          const createUploadData = new FormData();
          createUploadData.append('type', 'user-message');

          console.log(payload);

          const upload = await api.user.createUpload(createUploadData);
          const uploadId = upload.data.upload_id;

          const loadData = new FormData();
          loadData.append('upload_id', uploadId);
          loadData.append('file', file);

          const config = {headers: {'Content-Type': 'multipart/form-data'}};

          const load = await api.user.loadUpload(loadData, config);

          fileData = {
            id: uploadId,
            items: [load.data.file_id]
          }
        }

        const data = new FormData();
        data.append('chat_id', chatId);
        data.append('message', message);
        if (file) data.append('upload', JSON.stringify(fileData));

        await api.messages.send(data);

        if (onSuccess) onSuccess(chatId);
      } catch (e) {

      }
    },
    async [DELETE_MESSAGES]({commit}, payload) {
      commit(DELETE_MESSAGES + REQUEST);

      const {ids, deleteForAll, chatId, onSuccess} = payload;

      try {
        const data = new FormData();
        data.append('chat_id', chatId);
        data.append('ids', JSON.stringify(ids));
        if (deleteForAll) data.append('delete_for_all', 'true');

        const res = await api.messages.delete(data);
        console.log(res);
        commit(RESET_SELECTED_MESSAGES);
        // commit(DELETE_MESSAGES + SUCCESS, {ids, chatId});
        // commit(chatFavouriteMessagesModule + DELETE_FAVOURITE_MESSAGES + SUCCESS, ids, { root: true });
        if (onSuccess) onSuccess();
      } catch (e) {
        console.log(e);
        commit(DELETE_MESSAGES + ERROR, e);
      }
    },
    async [FORWARD_MESSAGES]({commit}, payload) {
      commit(FORWARD_MESSAGES + REQUEST);

      const {ids, chatId} = payload;

      try {
        const data = new FormData();
        data.append('chat_id', chatId);
        data.append('ids', JSON.stringify(ids));

        const res = await api.messages.forwardMessage(data);

        commit(FORWARD_MESSAGES + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(FORWARD_MESSAGES + ERROR, e);
      }
    },
    async [FORWARD_POST]({commit}, payload) {
      commit(FORWARD_POST + REQUEST);

      const {postId, chatId} = payload;

      try {
        const data = new FormData();
        data.append('chat_id', chatId);
        data.append('post_id', postId);

        const res = await api.messages.forwardPost(data);

        commit(FORWARD_POST + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
        commit(FORWARD_POST + ERROR, e);
      }
    }
  },
  getters: {
    [LOADING](state) {
      return state.loading && state.showLoading
    },
    [MESSAGES]: state => id => {
      return state.messages[id]
    },
    [SELECTED_MESSAGES](state) {
      return state.selectedMessages
    },
    [SELECTED_POST](state) {
      return state.selectedPost
    },
    [SELECTED_FORWARD_MESSAGES](state) {
      return state.selectedForwardMessages
    },
    [SELECTED_FORWARD_POST](state) {
      return state.selectedForwardPost
    },
    [SELECTED_IMAGE](state) {
      return state.selectedImage
    }
  }
};

export default module;
