<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'Title',
  props: {
    title: String,
  },
};
</script>

<style scoped>
  h1{
    font-weight: bold;
  }
</style>
