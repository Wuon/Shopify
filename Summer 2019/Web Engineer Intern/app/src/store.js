import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    query: '',
    keywords: [],
    items: [],
    filter: [],
    star: [],
  },
  mutations: {
    setQuery(state, query) {
      state.query = query;
    },
    setItems(state, items) {
      state.items = items;
    },
    setKeywords(state, keywords) {
      state.keywords = keywords;
    },
    setFilter(state, filter) {
      state.filter = filter;
    },
    setStar(state, star) {
      const set = new Set(state.star);
      if (set.has(star)) {
        set.delete(star);
      } else {
        set.add(star);
      }
      state.star = Array.from(set);
    },
  },
  actions: {

  },
});
