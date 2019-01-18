import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    query: '',
    keywords: [],
    items: [],
    filter: [],
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
  },
  actions: {

  },
});
