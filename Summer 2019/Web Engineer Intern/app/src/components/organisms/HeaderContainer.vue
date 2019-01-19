<template>
  <div class="container">
    <Header></Header>
  </div>
</template>

<script>
import Header from '../molecules/Header.vue';

export default {
  name: 'HeaderContainer',
  components: { Header },
};

</script>

<style scoped>
  .container{
    height: 70px;
    width: 100%;
    border-bottom: 1px solid #e2e2e2;
    display: flex;
    align-items: center;
    justify-content: space-between;
    z-index: 1000;
    background-color: #ffffff;
    position: fixed;
  }
</style>
