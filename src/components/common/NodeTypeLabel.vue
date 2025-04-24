<script setup lang="ts">
import { srcObject } from 'vuetify/lib/components/VImg/VImg';

defineProps<{ name: string; isSelected: boolean; imgSrc: srcObject }>();
</script>

<template>
    <v-card
        :title="name"
        density="compact"
        border-rounded
        :class="{ selected: isSelected }"
    >
        <v-card-text>
            <v-img cover :src="imgSrc" />
        </v-card-text>
    </v-card>
</template>

<style scoped>
.v-card {
    margin-left: 2px;
    margin-right: 2px;
    border-width: medium;
    border-color: #444;
    background-color: #333;
}

.v-card:hover {
    border-color: #66f;
}

.selected {
    border-color: #55e;
    background-color: #66f7;
}
</style>
