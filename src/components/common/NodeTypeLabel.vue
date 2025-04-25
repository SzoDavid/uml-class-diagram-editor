<script setup lang="ts">
defineProps<{ name: string; isSelected: boolean; imgSrc: string }>();
</script>

<template>
    <v-card density="compact" border-rounded :class="{ selected: isSelected }">
        <v-card-title>{{ name }}</v-card-title>
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
    border-radius: 8px;
}

.v-card:hover {
    border-color: #66f;
}

.v-card-title {
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    padding: 4px 4px 0;
}

.v-card-text {
    padding: 4px;
}

.v-img {
    border-radius: 4px;
}

.selected {
    border-color: #55e;
    background-color: #66f7;
}
</style>
