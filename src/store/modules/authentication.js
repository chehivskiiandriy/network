import api from 'utils/api';
import { REQUEST, SUCCESS, ERROR} from 'Store/types'
import {
  FETCH_CURRENT_USER,
  moduleName as userModule,
} from 'Store/modules/authUser/user';
import axios from "axios";


// TODO: move check-credentials requests here

export const moduleName = 'authentication/';

/* Action types */
export const AUTHENTICATE = 'AUTHENTICATE';
export const AUTHENTICATE_AS_A_GUEST = 'AUTHENTICATE_AS_A_GUEST';

/* Mutation types */
export const LOG_OUT = 'LOG_OUT';

/* Getter types */
export const ACCESS_TOKEN = 'ACCESS_TOKEN';
export const AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR';
export const IS_AUTHENTICATION_PASSING = 'IS_AUTHENTICATION_PASSING';


const module={
  namespaced: true,
  state: {
    token: null,
    authenticateAction: {
      loading: false,
      error: null,
    },
  },
  mutations:{
    [AUTHENTICATE + REQUEST] (state) {
      state.token = null;
      localStorage.setItem('token', state.token);
      state.authenticateAction = {
        loading: true,
        error: null,
      };
    },
    [AUTHENTICATE + SUCCESS] (state, { token }) {
      state.token = token;
      localStorage.setItem('token', state.token);
      axios.defaults.headers['Authorization']  = `Bearer ${token}`;
      state.authenticateAction = {
        loading: false,
        error: null,
      };
    },
    [AUTHENTICATE + ERROR] (state, error) {
      state.token = null;
      localStorage.setItem('token', state.token);
      state.authenticateAction = {
        loading: false,
        error,
      };
    },
    [AUTHENTICATE_AS_A_GUEST + REQUEST] (state) {
    },
    [AUTHENTICATE_AS_A_GUEST + SUCCESS] (state) {
    },
    [AUTHENTICATE_AS_A_GUEST + ERROR] (state, error) {
    },
    [LOG_OUT] (state) {
      state.token = null;
      localStorage.removeItem('token');
      delete axios.defaults.headers['Authorization'];
    },
  },
  actions: {
    async [AUTHENTICATE] ({ commit, dispatch }, {
      clientId = 2,
      clientSecret = '0123456789987654321',
      grantType = 'password',
      username,
      password,
    }) {
      commit(AUTHENTICATE + REQUEST);
      try {
        const requestData = {
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: grantType,
          username: username,
          password: password,
        };

        const { data: { access_token: token } } = await api.auth.authenticate(requestData);

        commit(AUTHENTICATE + SUCCESS, { token });

        await dispatch(userModule + FETCH_CURRENT_USER, null, { root: true });
      } catch (error) {
        commit(AUTHENTICATE + ERROR, error.message || error.toString());
      }
    },
    async [AUTHENTICATE_AS_A_GUEST] ({ commit, dispatch }) {
      commit(AUTHENTICATE_AS_A_GUEST + REQUEST);
      try {
        let userLang = localStorage.getItem('lang') || 'en';
        const guestResponse = await api.auth.getGuest(userLang),
          {nickname} = guestResponse.data;

        await dispatch(AUTHENTICATE, {
          username: nickname,
          password: nickname,
        });

        commit(AUTHENTICATE_AS_A_GUEST + SUCCESS);

        await dispatch(userModule + FETCH_CURRENT_USER, null, {root: true});
      } catch (error) {
        commit(AUTHENTICATE_AS_A_GUEST + ERROR, error.message || error.toString());
      }
    },
  },
  getters: {
    [ACCESS_TOKEN] (state) {
      return state.token;
    },
    [AUTHENTICATION_ERROR] (state) {
      return state.authenticateAction.error;
    },
    [IS_AUTHENTICATION_PASSING] (state) {
      return state.authenticateAction.loading;
    },
  }

};

export default module;
