<script setup lang="ts">
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({ name: String });
const emit = defineEmits(['submit', 'cancel']);

let name = props.name;
</script>

<template>
    <v-card :title="`${t('rename')} ${props.name}`">
        <v-card-text>
            <v-text-field :label="t('name')" v-model.trim="name" required />
        </v-card-text>
        <v-card-actions>
            <v-spacer />
            <v-btn
                @click="
                    () => {
                        emit('cancel');
                    }
                "
            >
                {{ t('cancel') }}
            </v-btn>
            <v-btn
                color="primary"
                @click="
                    () => {
                        emit('submit', name);
                    }
                "
            >
                {{ t('save') }}
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<style scoped>
.v-card {
    margin-bottom: 75%;
}
</style>
