<script setup lang="ts">
import {useSettingsService} from '../../services/SettingsService.ts';
import {useI18n} from 'vue-i18n';
import {ClassAbstractionDisplayMode} from '../../services/renderer/RenderConfiguration.ts';

const { settings, resetRenderSettings } = useSettingsService();
const { t } = useI18n();
</script>

<template>
  <div class="main-container">
    <v-card :title="t('settings.options.title')">
      <v-card-text>
        <v-select :label="t('settings.options.class_abstraction_display_mode.title')"
                  v-model="settings.renderer.options.classAbstractionDisplayMode"
                  :items="[
                    { title: t('settings.options.class_abstraction_display_mode.italic'), value: ClassAbstractionDisplayMode.ITALIC },
                    { title: t('settings.options.class_abstraction_display_mode.keyword'), value: ClassAbstractionDisplayMode.KEYWORD },
                  ]" />

        <v-checkbox :label="t('settings.options.show_invalidity')" v-model="settings.renderer.showInvalidity" />

        <v-text-field :label="t('settings.options.grid_size')"
                      v-model="settings.renderer.options.gridSize"
                      type="number" />

      </v-card-text>
    </v-card>
    <v-card :title="t('settings.renderer.title')" :subtitle="t('settings.renderer.warning')">
      <v-card-text>
        <v-text-field :label="t('settings.renderer.text_size')"
                      v-model="settings.renderer.textSize"
                      type="number" />

        <v-text-field :label="t('settings.renderer.default_width')"
                      v-model="settings.renderer.defaultWidth"
                      type="number" />

        <v-text-field :label="t('settings.renderer.line_height')"
                      v-model="settings.renderer.lineHeight"
                      type="number" />

        <v-text-field :label="t('settings.renderer.line_margin')"
                      v-model="settings.renderer.lineMargin"
                      type="number" />

        <v-text-field :label="t('settings.renderer.tab_size')"
                      v-model="settings.renderer.tabSize"
                      type="number" />

        <v-text-field :label="t('settings.renderer.border_thickness')"
                      v-model="settings.renderer.borderSize"
                      type="number" />

        <v-text-field :label="t('settings.renderer.underline_delta')"
                      v-model="settings.renderer.underlineDelta"
                      type="number" />

        <v-text-field :label="t('settings.renderer.underline_thickness')"
                      v-model="settings.renderer.underlineWidth"
                      type="number" />

        <v-text-field :label="t('settings.renderer.separate_object_parameters_width_limit')"
                      v-model="settings.renderer.separateObjectParametersWidthLimit"
                      type="number" />

        <v-text-field :label="t('settings.renderer.dot_size')"
                      v-model="settings.renderer.dotSize"
                      type="number" />
      </v-card-text>
      <v-card-actions>
        <v-btn :text="t('reset')" @click="resetRenderSettings"/>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
  .main-container {
    padding-top: 48px;
  }

  .v-card {
    max-width: 1000px;
    margin: 25px auto;
  }

  .v-btn {
    background-color: #66F;
  }
</style>