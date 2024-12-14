<script setup lang="ts">
import NavbarComponent from './components/navbar/navbarComponent.vue';
import {Node} from './utils/nodes/Node.ts';
import {TriggerService} from './services/TriggerService.ts';
import {inject} from 'vue';

const triggerService: TriggerService | undefined = inject('triggerService');

function handleImported(nodes: Node[]) {
    triggerService?.trigger('refreshEditor', nodes);
}

</script>

<template>
  <v-app>
    <navbar-component @imported="handleImported" />
    <RouterView />
  </v-app>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
}
</style>
