<script setup lang="ts">
</script>

<template>
  <nav>
    <RouterLink to="/en">en</RouterLink>
    <RouterLink to="/hu">hu</RouterLink>
  </nav>
  <RouterView />
</template>

<style scoped>
nav {
  margin-bottom: 15px;
}

nav * {
  margin-right: 10px;
}
</style>
