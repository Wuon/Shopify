<template>
  <div>
    <font-awesome-icon
      icon="search"
      class="search"
    />
    <input id="real-search-field" autocomplete="off" placeholder="search" type="text"
           v-model="query" name="search" @keyup="search">
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'Searchbar',
  data: () => ({
    query: '',
  }),
  methods: {
    search() {
      store.commit('setQuery', this.query);
    },
  },
};
</script>

<style scoped>
  input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;

    font-family: 'Product Sans', sans-serif;
    font-size: 1rem;
    max-width: 50px;
    min-width: 50px;
    height: 50px;
    padding: 0 15px 0 45px;

    background: transparent;
    outline: none;
    color: #222222;

    border-radius: 0;
    border: solid 2px #ffffff;

    transition: all 100ms;
    -webkit-transition: all 100ms;
    -moz-transition: all 100ms;
    -ms-transition: all 100ms;
  }

  input:focus {
    color: #222222 !important;
    border: solid 2px #222222;
    max-width: 300px;
    min-width: 300px;
  }

  input:focus::placeholder{
    color:#222222 !important;
  }
  .search{
    position: absolute;
    padding: 20px;
    transition: all .2s ease-in-out;
  }
  .search:hover{
    transform: scale(1.2);
  }
</style>
