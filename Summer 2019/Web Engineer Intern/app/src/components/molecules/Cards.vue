<template>
  <div class="grid">
    <Card
      v-for="(item) in filter"
      :key="item.index"
      :index="item.index"
      :title="item.title"
      :category="item.category"
      :body="item.body"
    />
    <div class="info-container" v-if="isFilterEmpty">
      <h3 class="info-header green">
        No Items found
      </h3>
    </div>
  </div>
</template>

<script>
import store from '@/store';
import Card from '@/components/atoms/Card.vue';
import _ from 'lodash';

export default {
  name: 'Cards',
  components: {
    Card,
  },
  computed: {
    isFilterEmpty() {
      return this.filter.length === 0;
    },
    query() {
      return store.state.query;
    },
    items() {
      return store.state.items;
    },
    filter() {
      return store.state.filter;
    },
  },
  watch: {
    query(value) {
      let filter = [];
      if (value !== '') {
        const set = new Set();
        _.forEach(store.state.keywords, (index, keyword) => {
          if (keyword.includes(value) && !set.has(index)) {
            filter.push(store.state.items[index]);
            set.add(index);
          }
        });
      } else {
        filter = store.state.items;
      }
      store.commit('setFilter', filter);
    },
  },
};
</script>

<style scoped>
  .grid{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .info-container{
    display: inline-block;
    outline: 2px solid;
    cursor: pointer;
    padding: 64px 56px;
    -webkit-transition: all 100ms;
    transition: all 100ms;
    width: calc(50% - 112px - 1rem);
    margin-right: 1rem;
    margin-bottom: 1rem;
    height: 150px;
    max-height: 150px;
  }
  .info-container:hover{
    outline: 8px solid;
  }
  .device-header{
    margin-bottom: -15px;
  }
</style>
