<script setup lang="ts">
import UmlEditor from './components/umlEditor/UmlEditor.vue';
</script>

<template>
  <nav>
    <RouterLink to="/en">en</RouterLink>
    <RouterLink to="/hu">hu</RouterLink>
  </nav>
  <UmlEditor />
</template>

<style scoped>
nav {
  margin-bottom: 15px;
}

nav * {
  margin-right: 10px;
}
</style>
