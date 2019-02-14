/**
 * Types
 * */
export const moduleName = 'storiesNavigation/';

/** mutation types */
export const SET_NEXT_ROUTE = 'SET_NEXT_ROUTE';
export const SET_ROUTE_TO_COME_BACK = 'SET_ROUTE_TO_COME_BACK';
export const SET_PROGRESS = 'SET_PROGRESS';
export const SET_TIMER_ID = 'SET_TIMER_ID';
export const SET_IS_PAUSE = 'SET_IS_PAUSE';
export const TOGGLE_PAUSE = 'TOGGLE_PAUSE';
export const TIMER_CALLBACK = 'TIMER_CALLBACK';
export const CLEAR_TIMER = 'CLEAR_TIMER';

/** action types */
export const START_TIMER = 'START_TIMER';
export const STOP_TIMER = 'STOP_TIMER';

/** getter types */
export const NEXT_ROUTE = 'NEXT_ROUTE';
export const ROUTE_TO_COME_BACK = 'ROUTE_TO_COME_BACK';
export const PROGRESS = 'PROGRESS';
export const IS_PAUSE = 'IS_PAUSE';

const module = {
  namespaced: true,
  state: {
    routes: {
      nextRoute: null,
      routeToComeBack: null,
    },
    progress: 0,
    timerId: null,
    isPause: false,
  },
  mutations: {
    [SET_NEXT_ROUTE](state, { route }) {
      state.routes.nextRoute = JSON.stringify(route);
    },
    [SET_ROUTE_TO_COME_BACK](state, { route }) {
      state.routes.routeToComeBack = JSON.stringify(route);
    },
    [SET_PROGRESS](state, { progress }) {
      state.progress = progress;
    },
    [SET_TIMER_ID](state, { id }) {
      state.timerId = id;
    },
    [SET_IS_PAUSE](state, { isPause }) {
      state.isPause = isPause;
    },
    [TOGGLE_PAUSE](state) {
      state.isPause = !state.isPause;
    },
    [CLEAR_TIMER](state) {
      clearInterval(state.timerId);
      state.timerId = null;
    },
    [TIMER_CALLBACK](state, { isPause }) {
      if(state.pause) {
        return;
      }
      state.progress++;
      if(state.progress > 100) {
        clearInterval(state.timerId);
        state.timerId = null;
      }
    },
  },
  actions: {
    [START_TIMER] ({ commit, dispatch }) {
      dispatch(CLEAR_TIMER);
      commit(SET_IS_PAUSE, false);
      commit(SET_PROGRESS, 0);
      setInterval(() => commit(TIMER_CALLBACK));
    },
    [STOP_TIMER] ({ commit }) {
      commit(CLEAR_TIMER);
    },
  },
  getters: {
    [NEXT_ROUTE](state) {
      return JSON.parse(state.routes.nextRoute);
    },
    [ROUTE_TO_COME_BACK](state) {
      return JSON.parse(state.routes.routeToComeBack);
    },
    [PROGRESS](state) {
      return state.progress;
    },
    [IS_PAUSE](state) {
      return state.isPause;
    },
  },
};

export default module;
