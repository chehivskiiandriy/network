import api from 'utils/api';
import { REQUEST, SUCCESS, ERROR} from 'Store/types'


// TODO: move check-credentials requests here

export const moduleName = 'registration/';

/* Action types */
export const REGISTER = 'REGISTER';

/* Getter types */
export const IS_LIMIT_EXCEEDED = 'IS_LIMIT_EXCEEDED';
export const REGISTRATION_ERROR = 'REGISTRATION_ERROR';
export const IS_REGISTRATION_PASSING = 'IS_REGISTRATION_PASSING';


const module={
  namespaced: true,
  state: {
    isLimitExceeded: false,
    registerAction: {
      loading: false,
      error: null,
    },
  },
  mutations:{
    [REGISTER + REQUEST] (state) {
      state.isLimitExceeded = false;
      state.registerAction = {
        loading: true,
        error: null,
      };
    },
    [REGISTER + SUCCESS] (state) {
      state.isLimitExceeded = false;
      state.registerAction = {
        loading: false,
        error: null,
      };
    },
    [REGISTER + ERROR] (state, { error } ) {
      state.isLimitExceeded = error.errorCode === 1001;
      state.registerAction = {
        loading: false,
        error: error.message || error.toString(),
      };
    },
  },
  actions: {
    async [REGISTER] ({ commit }, {
      name, lastName, nickname,
      phone, password, file,
      email, // not required
      lang, // not required
    }) {
      commit(REGISTER + REQUEST);
      try {
        const requestData = {
          name,
          lastname: lastName,
          nickname,
          phone,
          password,
          file,
        };
        email && (requestData.email = email);
        lang && (requestData.lang = lang);

        const response = await api.auth.register(requestData);
        commit(REGISTER + SUCCESS, response);
      } catch (error) {
        const { errorInfo } = error.response.data;
        commit(REGISTER + ERROR, { error: errorInfo });
      }
    }
  },
  getters: {
    [IS_LIMIT_EXCEEDED] (state) {
      return state.isLimitExceeded;
    },
    [REGISTRATION_ERROR] (state) {
      return state.registerAction.error;
    },
    [IS_REGISTRATION_PASSING] (state) {
      return state.registerAction.loading;
    },
  }

};

export default module;
