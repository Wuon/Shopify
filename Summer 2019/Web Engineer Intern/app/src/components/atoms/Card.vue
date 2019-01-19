<template>
  <div
    class="item-container"
  >
    <font-awesome-icon
      v-if="checkStar"
      :icon="['fas', 'star']"
      class="star"
      @click="setStar"
    />
    <font-awesome-icon
      v-else
      :icon="['far', 'star']"
      class="star"
      @click="setStar"
    />
    <p class="item-header green">
      {{ category }}
    </p>
    <h1>
      {{ condensedTitle }}
    </h1>
    <div v-html="escapedBody"></div>
  </div>
</template>

<script>
import store from '@/store';

export default {
  name: 'Card',
  props: {
    title: String,
    category: String,
    body: String,
    index: Number,
  },
  computed: {
    checkStar() {
      const set = new Set(store.state.star);
      return set.has(this.index);
    },
  },
  data() {
    return {
      condensedTitle: (this.title.match(/\(([^)]+)\)/)) ? this.title.match(/\(([^)]+)\)/)[1] : this.title,
      escapedBody: new DOMParser().parseFromString(this.body, 'text/html').documentElement.textContent,
    };
  },
  methods: {
    setStar() {
      store.commit('setStar', this.index);
      this.$forceUpdate();
    },
  },
};
</script>

<style scoped>
  .item-container{
    display: inline-block;
    outline: 2px solid;
    padding: 64px 56px;
    -webkit-transition: all 100ms;
    transition: all 100ms;
    margin-right: 1rem;
    margin-bottom: 1rem;
    width: calc(50% - 56px - 56px - 1rem);
  }
  .item-header{
    margin-bottom: -15px;
  }
  .star{
    font-size: 25px;
    color: #ECB22E;
    transition: all 100ms;
    -webkit-transition: all 100ms;
    cursor: pointer;
  }
  .star:hover{
    transform: scale(1.1);
  }
</style>
