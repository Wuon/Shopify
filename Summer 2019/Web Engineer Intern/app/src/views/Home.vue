<template>
  <div class="home">
    <Title title="Toronto Waste Lookup"></Title>
    <Searchbar></Searchbar>
    <Cards></Cards>
  </div>
</template>

<script>
// @ is an alias to /src
import store from '@/store';
import HelloWorld from '@/components/HelloWorld.vue';
import Searchbar from '@/components/atoms/Searchbar.vue';
import Title from '@/components/atoms/Title.vue';
import Cards from '@/components/molecules/Cards.vue';
import axios from 'axios';
import _ from 'lodash';

export default {
  name: 'home',
  components: {
    Searchbar,
    Title,
    Cards,
  },
  mounted() {
    const keywords = {};
    axios({
      method: 'get',
      url: 'https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000',
    }).then((res) => {
      _.forEach(res.data, (item, index) => {
        keywords[item.title] = index;
        _.forEach(item.keywords.split(', '), (keyword) => {
          keywords[keyword] = index;
        });
      });
      store.commit('setItems', res.data);
      store.commit('setFilter', res.data);
      store.commit('setKeywords', keywords);
    });
  },
};
</script>
