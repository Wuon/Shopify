<template>
  <div class="home">
    <div class="cardsContainer">
      <Cards></Cards>
    </div>
  </div>
</template>

<script>
import Cards from '@/components/molecules/Cards.vue';
import store from '@/store';
import _ from 'lodash';

export default {
  name: 'Favourites',
  components: {
    Cards,
  },
  mounted() {
    store.commit('setQuery', '');
    const filter = [];
    const keywords = {};
    const set = new Set(store.state.star);
    _.forEach(store.state.items, (item, index) => {
      if (set.has(index)) {
        filter.push(item);
      }
    });
    _.forEach(filter, (item, index) => {
      keywords[item.title] = index;
      _.forEach(item.keywords.split(', '), (keyword) => {
        keywords[keyword] = index;
      });
    });
    console.log(filter);
    store.commit('setItems', filter);
    store.commit('setFilter', filter);
    store.commit('setKeywords', keywords);
  },
};
</script>

<style scoped>
  .cardsContainer{
    padding: 110px 100px 50px 100px;
  }
</style>
