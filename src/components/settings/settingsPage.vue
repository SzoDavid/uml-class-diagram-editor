<script setup lang="ts">
import { useSettingsService } from '../../services/SettingsService.ts';
import { useI18n } from 'vue-i18n';
import { ClassAbstractionDisplayMode } from '../../services/renderer/RenderConfiguration.ts';

const { settings, resetRenderSettings, saveRenderSettings } =
    useSettingsService();
const { t } = useI18n();
</script>

<template>
    <div class="main-container">
        <div class="header-container">
            <h1>{{ t('settings.title') }}</h1>
            <v-btn :text="t('save')" @click="saveRenderSettings" />
        </div>

        <v-card :title="t('settings.options.title')">
            <v-card-text>
                <v-select
                    :label="
                        t(
                            'settings.options.class_abstraction_display_mode.title',
                        )
                    "
                    v-model="
                        settings.renderer.options.classAbstractionDisplayMode
                    "
                    :items="[
                        {
                            title: t(
                                'settings.options.class_abstraction_display_mode.italic',
                            ),
                            value: ClassAbstractionDisplayMode.ITALIC,
                        },
                        {
                            title: t(
                                'settings.options.class_abstraction_display_mode.keyword',
                            ),
                            value: ClassAbstractionDisplayMode.KEYWORD,
                        },
                    ]"
                />

                <v-checkbox
                    :label="t('settings.options.show_invalidity')"
                    v-model="settings.renderer.showInvalidity"
                />

                <v-text-field
                    :label="t('settings.options.grid_size')"
                    v-model.number="settings.renderer.options.gridSize"
                    type="number"
                />
            </v-card-text>
        </v-card>
        <v-card
            :title="t('settings.renderer.title')"
            :subtitle="t('settings.renderer.warning')"
        >
            <v-card-text>
                <v-text-field
                    :label="t('settings.renderer.text_size')"
                    v-model.number="settings.renderer.textSize"
                    type="number"
                />

                <v-text-field
                    :label="t('settings.renderer.default_width')"
                    v-model.number="settings.renderer.defaultWidth"
                    type="number"
                />

                <v-text-field
                    :label="t('settings.renderer.line_height')"
                    v-model.number="settings.renderer.lineHeight"
                    type="number"
                />

                <v-text-field
                    :label="t('settings.renderer.line_margin')"
                    v-model.number="settings.renderer.lineMargin"
                    type="number"
                />

                <v-text-field
                    :label="t('settings.renderer.tab_size')"
                    v-model.number="settings.renderer.tabSize"
                    type="number"
                />

                <v-text-field
                    :label="t('settings.renderer.border_thickness')"
                    v-model.number="settings.renderer.borderSize"
                    type="number"
                />

                <v-text-field
                    :label="t('settings.renderer.underline_delta')"
                    v-model.number="settings.renderer.underlineDelta"
                    type="number"
                />

                <v-text-field
                    :label="t('settings.renderer.underline_thickness')"
                    v-model.number="settings.renderer.underlineWidth"
                    type="number"
                />

                <v-text-field
                    :label="
                        t(
                            'settings.renderer.separate_object_parameters_width_limit',
                        )
                    "
                    v-model.number="
                        settings.renderer.separateObjectParametersWidthLimit
                    "
                    type="number"
                />

                <v-text-field
                    :label="t('settings.renderer.dot_size')"
                    v-model.number="settings.renderer.dotSize"
                    type="number"
                />
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn
                    variant="tonal"
                    :text="t('reset')"
                    @click="resetRenderSettings"
                />
            </v-card-actions>
        </v-card>
    </div>
</template>

<style scoped>
.main-container {
    max-width: 1000px;
    width: 100%;
    margin: auto;
    padding-top: 48px;
}

.header-container {
    width: 100%;
    display: flex;
    flex-direction: row;
    padding: 20px;
}

.header-container .v-btn {
    margin-left: auto;
    align-self: center;
    background-color: #66f;
}

.v-card {
    margin-bottom: 25px;
}

h1 {
    height: 100%;
    vertical-align: middle;
}

.v-btn {
}
</style>
