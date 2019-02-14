import api from 'utils/api';
import {ERROR, REQUEST, SUCCESS} from 'Store/types';

/**
 * Types
 * */
export const moduleName = 'intagsHistory/';

/** Mutation types*/

export const PUSH_INTAG_TO_HISTORY = 'PUSH_INTAG_TO_HISTORY';
export const PUSH_INTAGS_TO_HISTORY = 'PUSH_INTAGS_TO_HISTORY';
export const CLEAR_INTAGS_HISTORY = 'CLEAR_INTAGS_HISTORY';
export const LOAD_INTAGS_HISTORY = 'LOAD_INTAGS_HISTORY';

/** Getter types*/
export const INTAGS_HISTORY = 'INTAGS_HISTORY';
export const FIND_INTAGS_BY_A_BEGINNING = 'FIND_INTAGS_BY_A_BEGINNING';

class UniqueStackItem {
  constructor(data) {
    this.data = data;
  }
}

// class UniqueStack {
//   constructor() {
//     this.firstItem = null;
//     this.lastItem = null;
//     this.count = 0;
//     this.maxCount = 10;
//     this.cachedArray = null
//   }
//
//   push(element) {
//     this.removeElement(element);
//     this.addElementToEnd(element);
//     this.cachedArray = null;
//   }
//
//   removeElement(element) {
//     let item = this.firstItem;
//     if(!item) {
//       return;
//     }
//     do {
//       if(item.nextItem && item.nextItem.data === element && this.lastItem !== item.nextItem) {
//         const existedItem = item.nextItem,
//           itemBeforeExisted = item,
//           itemAfterExisted = existedItem.nextItem;
//         delete itemBeforeExisted.nextItem;
//         itemBeforeExisted.nextItem = itemAfterExisted;
//         existedItem.nextItem = null;
//         this.lastItem = existedItem;
//         break;
//       }
//     } while(item = item.nextItem);
//   }
//
//   addElementToEnd(element) {
//     const newItem = new UniqueStackItem(element);
//     if(!this.firstItem) {
//       this.firstItem =  newItem;
//     } else {
//       this.lastItem.nextItem = newItem;
//     }
//     this.lastItem = newItem;
//     if (this.count === this.maxCount) {
//       this.firstItem = this.firstItem.nextItem;
//     } else {
//       this.count++;
//     }
//     console.log(this.firstItem);
//   }
//
//   clear() {
//     this.firstItem = null;
//     this.lastItem = null;
//     this.count = 0;
//   }
//
//   getAll() {
//     if(!this.cachedArray) {
//       this.cachedArray = [];
//       if(this.firstItem) {
//         let item = this.firstItem;
//         do {
//           this.cachedArray.push(item.data);
//         } while (item = item.nextItem);
//       }
//     }
//     return this.cachedArray;
//   }
//
//   toJSON() {
//     return this.getAll();
//   }
// }


class UniqueStack {
  constructor() {
    this.elements = [];
  }

  push(element) {
    const ar = this.elements.filter(el => el !== element);
    this.elements = [
      ...(ar.length < 10
        ? ar
        : ar.slice(ar.length - 9, ar.length)),
      element
    ];
  }

  clear() {
    this.elements = [];
  }

  getAll() {
    return this.elements;
  }

  toJSON() {
    return this.getAll();
  }
}


const module = {
  namespaced: true,
  state: {
    intags: new UniqueStack(),
    pointer: 0,
  },
  mutations: {
    [PUSH_INTAG_TO_HISTORY] (state, { intag }) {
      state.intags.push(intag);
      localStorage.setItem('intags-history', JSON.stringify(state.intags));
    },
    [PUSH_INTAGS_TO_HISTORY] (state, { intags }) {
      for(const intag of intags) {
        state.intags.push(intag);
      }
      localStorage.setItem('intags-history', JSON.stringify(state.intags));
    },
    [CLEAR_INTAGS_HISTORY] (state) {
      state.intags.clear();
      localStorage.setItem('intags-history', JSON.stringify(state.intags));
    },
    [LOAD_INTAGS_HISTORY] (state) {
      if(!state.intags.count) {
        let intags;
        try {
          intags = JSON.parse(localStorage.getItem('intags-history'));
          if (!intags) {
            intags = [];
            localStorage.setItem('intags-history', JSON.stringify(intags));
          }
        } catch (error) {
          intags = [];
          localStorage.setItem('intags-history', JSON.stringify(intags));
          console.error('It got error during loading intags history:\n\n' + error.message);
        }
        for (const intag of intags) {
          state.intags.push(intag);
        }
      }
    },
  },
  getters: {
    [INTAGS_HISTORY] (state) {
      return state.intags.getAll().reverse();
    },
    [FIND_INTAGS_BY_A_BEGINNING]: state => query => {
      const normalizedQuery = query.toLowerCase().trim();
      const intags = state.intags.getAll().filter(function doesTheIntagContainQuery(intag) {
        const normalizedIntag = intag.toLowerCase();
        return normalizedIntag.indexOf(normalizedQuery) !== -1;
      });
      if(intags.length === 1) {
        return [];
      }
      return intags;
    },
  }
};

export default module;
