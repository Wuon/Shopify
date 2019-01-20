<template>
  <div class="home">
    <div class="cardsContainer">
      <Cards></Cards>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import store from '@/store';
import Cards from '@/components/molecules/Cards.vue';
import axios from 'axios';
import _ from 'lodash';

export default {
  name: 'home',
  components: {
    Cards,
  },
  mounted() {
    store.commit('setQuery', '');
    const keywords = {};
    axios({
      method: 'get',
      url: 'https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000',
    }).then((res) => {
      const data = [];
      /*
        Add an ID to each item in the dataset. This will make it easier to keep track of which
        items are favourites or not. Also, this will make it easier to filter out when
        searching.
      */
      _.forEach(res.data, (item, index) => {
        const temp = item;
        temp.index = index;
        data.push(temp);
      });
      /*
        Iterate through the objects to get searchable objects. We start off with getting the title,
        then we move down and go through the keywords. This will generate a full list in a hash map
        for fast access in the future.
      */
      _.forEach(res.data, (item) => {
        keywords[item.title] = item.index;
        _.forEach(item.keywords.split(', '), (keyword) => {
          keywords[keyword] = item.index;
        });
      });
      store.commit('setItems', res.data);
      store.commit('setFilter', res.data);
      store.commit('setKeywords', keywords);
    });
  },
};
</script>

<style scoped>
  .cardsContainer{
    padding: 110px 100px 50px 100px;
  }
</style>
