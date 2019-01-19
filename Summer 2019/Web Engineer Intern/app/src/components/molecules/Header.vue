<template>
  <header>
    <div class="logoContainer">
      <RouterLink to="/">
        <a>
          <img src="https://slackhq.com/wp-content/themes/babka/img/_rebrand/icons/icon_slack.svg" width="100" class="logo" alt="" scale="0">
        </a>
      </RouterLink>
      <RouterLink to="/favourite">
        <a>
          <span class="text">Favourites</span>
        </a>
      </RouterLink>
    </div>
    <div class="titleContainer">
      <Title title="Toronto Waste Lookup"></Title>
    </div>
    <div class="searchBarContainer">
      <Searchbar></Searchbar>
    </div>
  </header>
</template>

<script>
import Title from '../atoms/Title.vue';
import Searchbar from '../atoms/Searchbar.vue';

export default {
  name: 'Header',
  components: { Searchbar, Title },
};
</script>

<style scoped>
  header{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 100px;
    width: 100%;
  }
  a{
    text-decoration: none;
    color: #222222;
  }
  a:visited {color:#222222;}
  a:hover {color:#222222;}
  a:active {color:#222222;}
  ul{

  }
  li {
    display: inline-block;
  }
  .logoContainer{
    display: flex;
    align-items: center;
    flex: 1;
  }
  .titleContainer{
    display: flex;
    justify-content: center;
    flex: 1;
    text-align: center;
    align-items: center;
  }
  .searchBarContainer{
    display: flex;
    justify-content: right;
    align-items: center;
    flex: 1;
    flex-direction: row-reverse;
  }
  .logo{
    margin-right: 1rem;
  }
  .text{
    border-left: 1px solid #e2e2e2;
    padding-left: 1rem;
  }
</style>
