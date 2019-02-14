import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from "Store/types";

/**
 * Types
 * */

export const moduleName = 'wallet/';

/** Actions types*/
export const FETCH_WALLET_INFO = 'FETCH_WALLET_INFO';
export const FETCH_COIN_PACKS = 'FETCH_COIN_PACKS';
export const FETCH_PRESENTS = 'FETCH_PRESENTS';

/** Mutation types*/
// Actions types + REQUEST or SUCCESS or ERROR
export const CHANGE_ACTIVE_TAB = 'CHANGE_ACTIVE_TAB';
export const CHANGE_CURRENT_BALANCE = 'CHANGE_CURRENT_BALANCE';
export const CHANGE_CURRENT_GOLD_BALANCE = 'CHANGE_CURRENT_GOLD_BALANCE';
export const CHANGE_CURRENT_CROWN_BALANCE = 'CHANGE_CURRENT_CROWN_BALANCE';
export const CHANGE_SELECTED_USER = 'CHANGE_SELECTED_USER';

/** Getters types*/
export const ACTIVE_TAB = 'ACTIVE_TAB';
export const CURRENT_BALANCE = 'CURRENT_BALANCE';
export const GIFT_GOLD_AMOUNT = 'GIFT_GOLD_AMOUNT';
export const GIFT_CROWN_AMOUNT = 'GIFT_CROWN_AMOUNT';
export const COIN_PACKS = 'COIN_PACKS';
export const GOLD_PRESENTS = 'GOLD_PRESENTS';
export const PLATINUM_PRESENTS = 'PLATINUM_PRESENTS';
export const VIP_PRESENTS = 'VIP_PRESENTS';
export const PREMIUM_PRESENTS = 'PREMIUM_PRESENTS';
export const PRESENTS = 'PRESENTS';
export const SELECTED_USER = 'SELECTED_USER';

const module = {
  namespaced: true,
  state: {
    activeTab: 'gifts',
    currentBalance: null,
    giftGoldAmount: null,
    giftCrownAmount: null,
    coinPacks: null,
    presents: null,
    selectedUser: null
  },
  mutations: {
    [CHANGE_ACTIVE_TAB](state, payload) {
      state.activeTab = payload;
    },
    [FETCH_WALLET_INFO + SUCCESS](state, payload) {
      state.currentBalance = payload.coins;
      state.giftGoldAmount = payload.gift_gold_amount;
      state.giftCrownAmount = payload.gift_crown_amount;
    },
    [FETCH_COIN_PACKS + SUCCESS](state, payload) {
      state.coinPacks = payload;
    },
    [FETCH_PRESENTS + SUCCESS](state, payload) {
      state.presents = payload;
    },
    [CHANGE_CURRENT_BALANCE](state, payload) {
      state.currentBalance += payload;
    },
    [CHANGE_CURRENT_GOLD_BALANCE](state, payload) {
      state.giftGoldAmount += payload;
    },
    [CHANGE_CURRENT_CROWN_BALANCE](state, payload) {
      state.giftCrownAmount += payload;
    },
    [CHANGE_SELECTED_USER](state, payload) {
      state.selectedUser = payload;
    }
  },
  actions: {
    async [FETCH_WALLET_INFO]({commit}) {
      try {
        const res = await api.user.getWalletInfo();
        commit(FETCH_WALLET_INFO + SUCCESS, res.data);
      } catch (e) {
        console.log(e);
      }
    },
    async [FETCH_COIN_PACKS]({commit}) {
      try {
        const res = await api.user.getCoinPacks();
        commit(FETCH_COIN_PACKS + SUCCESS, res.data.data);
      } catch (e) {
        console.log(e);
      }
    },
    async [FETCH_PRESENTS]({commit}) {
      try {
        const res = await api.gifts.getAll();
        commit(FETCH_PRESENTS + SUCCESS, res.data.data);
      } catch (e) {
        console.log(e);
      }
    }
  },
  getters: {
    [ACTIVE_TAB](state) {
      return state.activeTab
    },
    [CURRENT_BALANCE](state) {
      return state.currentBalance
    },
    [GIFT_GOLD_AMOUNT](state) {
      return state.giftGoldAmount
    },
    [GIFT_CROWN_AMOUNT](state) {
      return state.giftCrownAmount
    },
    [COIN_PACKS](state) {
      return state.coinPacks
    },
    [GOLD_PRESENTS](state) {
      return state.presents ? state.presents.slice(0, 3) : null
    },
    [PLATINUM_PRESENTS](state) {
      return state.presents ? state.presents.slice(3, 6) : null
    },
    [VIP_PRESENTS](state) {
      return state.presents ? state.presents.slice(6, 9) : null
    },
    [PREMIUM_PRESENTS](state) {
      return state.presents ? state.presents.slice(9, 12) : null
    },
    [PRESENTS](state) {
      return state.presents
    },
    [SELECTED_USER](state) {
      return state.selectedUser
    }
  }
};

export default module;
