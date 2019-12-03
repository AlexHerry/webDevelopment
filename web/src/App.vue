<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html {
  height: 100%;
}
body {
  height: 100%;
}
#app {
  width: 100%;
  height: 100%;
}
.page_brand {
  background: #d3dce6;
  width: 100%;
  height: 40px;
  padding-left: 30px;
}
</style>
