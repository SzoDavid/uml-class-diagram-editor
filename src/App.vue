<script setup lang="ts">
import NavbarComponent from './components/navbar/navbarComponent.vue';
</script>

<template>
    <v-app>
        <navbar-component />
        <RouterView />
    </v-app>
</template>

<style scoped>
html,
body {
    margin: 0;
    padding: 0;
    height: 100vh;
    overflow: hidden;
}
</style>
