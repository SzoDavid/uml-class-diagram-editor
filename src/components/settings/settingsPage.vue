<script setup lang="ts">
import {useSettingsService} from '../../services/SettingsService.ts';
import {useI18n} from 'vue-i18n';
import {ClassAbstractionDisplayMode} from '../../services/renderer/RenderConfiguration.ts';

const { settings } = useSettingsService();
const { t } = useI18n();
</script>

<template>
  <fieldset>
    <legend class="capitalized">{{ t('settings.title') }}</legend>

    <label for="classAbstractionDisplayMode">{{ t('settings.options.class_abstraction_display_mode.title') }}</label>
    <select id="classAbstractionDisplayMode" v-model="settings.renderer.options.classAbstractionDisplayMode">
      <option :value="ClassAbstractionDisplayMode.ITALIC">{{ t('settings.options.class_abstraction_display_mode.italic') }}</option>
      <option :value="ClassAbstractionDisplayMode.KEYWORD">{{ t('settings.options.class_abstraction_display_mode.keyword') }}</option>
    </select>

    <fieldset>
      <legend class="capitalized">{{ t('settings.renderer.title') }}</legend>
      <p>{{ t('settings.renderer.warning') }}</p>

      <label for="renderingTextSize" class="capitalized">{{ t('settings.renderer.text_size')}}</label>
      <input id="renderingTextSize" type="number" v-model="settings.renderer.textSize">

      <label for="renderingDefaultWidth" class="capitalized">{{ t('settings.renderer.default_width')}}</label>
      <input id="renderingDefaultWidth" type="number" v-model="settings.renderer.defaultWidth">

      <label for="renderingLineHeight" class="capitalized">{{ t('settings.renderer.line_height')}}</label>
      <input id="renderingLineHeight" type="number" v-model="settings.renderer.lineHeight">

      <label for="renderingLineMargin" class="capitalized">{{ t('settings.renderer.line_margin')}}</label>
      <input id="renderingLineMargin" type="number" v-model="settings.renderer.lineMargin">

      <label for="renderingTabSize" class="capitalized">{{ t('settings.renderer.tab_size')}}</label>
      <input id="renderingTabSize" type="number" v-model="settings.renderer.tabSize">

      <label for="renderingBorderSize" class="capitalized">{{ t('settings.renderer.border_thickness')}}</label>
      <input id="renderingBorderSize" type="number" v-model="settings.renderer.borderSize">

      <label for="renderingUnderlineDelta" class="capitalized">{{ t('settings.renderer.underline_delta')}}</label>
      <input id="renderingUnderlineDelta" type="number" v-model="settings.renderer.underlineDelta">

      <label for="renderingUnderlineWidth" class="capitalized">{{ t('settings.renderer.underline_thickness')}}</label>
      <input id="renderingUnderlineWidth" type="number" v-model="settings.renderer.underlineWidth">

      <label for="renderingShowInvalidity" class="capitalized">{{ t('settings.renderer.show_invalidity')}}</label>
      <input id="renderingShowInvalidity" type="checkbox" v-model="settings.renderer.showInvalidity">

      <label for="renderingSeparateObjectParametersWidthLimit" class="capitalized">{{ t('settings.renderer.separate_object_parameters_width_limit')}}</label>
      <input id="renderingSeparateObjectParametersWidthLimit" type="number" v-model="settings.renderer.separateObjectParametersWidthLimit">

      <fieldset>
        <legend class="capitalized">{{ t('settings.renderer.color.title') }}</legend>

        <fieldset>
          <legend class="capitalized">{{ t('settings.renderer.color.fill') }}</legend>

          <label for="renderingFillDefault" class="capitalized">{{ t('settings.renderer.color.default')}}</label>
          <input id="renderingFillDefault" type="color" v-model="settings.renderer.fillColor">

          <label for="renderingFillSelected" class="capitalized">{{ t('settings.renderer.color.selected')}}</label>
          <input id="renderingFillSelected" type="color" v-model="settings.renderer.fillColorSelected">

          <label for="renderingFillInvalid" class="capitalized">{{ t('settings.renderer.color.invalid')}}</label>
          <input id="renderingFillInvalid" type="color" v-model="settings.renderer.fillColorInvalid">

          <label for="renderingFillInvalidSelected" class="capitalized">{{ t('settings.renderer.color.invalid_selected')}}</label>
          <input id="renderingFillInvalidSelected" type="color" v-model="settings.renderer.fillColorInvalid">
        </fieldset>

        <fieldset>
          <legend class="capitalized">{{ t('settings.renderer.color.accent') }}</legend>

          <label for="renderingAccentDefault" class="capitalized">{{ t('settings.renderer.color.default')}}</label>
          <input id="renderingAccentDefault" type="color" v-model="settings.renderer.accentColor">

          <label for="renderingAccentSelected" class="capitalized">{{ t('settings.renderer.color.selected')}}</label>
          <input id="renderingAccentSelected" type="color" v-model="settings.renderer.accentColorSelected">

          <label for="renderingAccentInvalid" class="capitalized">{{ t('settings.renderer.color.invalid')}}</label>
          <input id="renderingAccentInvalid" type="color" v-model="settings.renderer.accentColorInvalid">

          <label for="renderingAccentInvalidSelected" class="capitalized">{{ t('settings.renderer.color.invalid_selected')}}</label>
          <input id="renderingAccentInvalidSelected" type="color" v-model="settings.renderer.accentColorInvalidSelected">
        </fieldset>
      </fieldset>
    </fieldset>
  </fieldset>
</template>

<style scoped>

</style>