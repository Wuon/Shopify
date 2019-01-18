<template>
  <div
    class="item-container"
    @click="setChannel"
  >
    <p class="item-header green">
      {{ category }}
    </p>
    <h1>
      {{ condensedTitle }}
    </h1>
    <p class="item-header green">
      {{ body }}
    </p>

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
  },
  data() {
    return {
      condensedTitle: (this.title.match(/\(([^)]+)\)/)) ? this.title.match(/\(([^)]+)\)/)[1] : this.title,
    };
  },
  methods: {
    setChannel() {
    },
  },
};
</script>

<style scoped>
  .item-container{
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
  .item-container:hover{
    outline: 8px solid;
  }
  .item-header{
    margin-bottom: -15px;
  }
</style>
