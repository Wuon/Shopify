<template>
  <div id="app">
    <HeaderContainer></HeaderContainer>
    <router-view/>
  </div>
</template>
<style>
#app {
  font-family: 'Product Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #222222;
}
</style>
<script>
import HeaderContainer from './components/organisms/HeaderContainer.vue';

export default {
  components: { HeaderContainer },
};
</script>
