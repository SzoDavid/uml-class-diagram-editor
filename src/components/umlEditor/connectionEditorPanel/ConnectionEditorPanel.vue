<script lang="ts" src="./ConnectionEditorPanel.ts" />
<style scoped src="./ConnectionEditorPanel.css" />

<template>
  <template v-if="data.instance instanceof BasicConnectionPoint">
    <v-expansion-panel :title="t('appearance')">
      <v-expansion-panel-text>
        <v-text-field label="x" v-model="data.instance.x" type="number" />
        <v-text-field label="y" v-model="data.instance.y" type="number" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </template>
  <v-expansion-panel :title="t('detail', 2)">
    <v-expansion-panel-text>
      <template v-if="data.instance instanceof ConnectionPart">
        <v-btn @click="breakConnectionPart" class="capitalized">{{ t("add_breakpoint") }}</v-btn>
      </template>
      <template v-else-if="data.instance instanceof Association
        || data.instance instanceof Aggregation
        || data.instance instanceof Generalization
        || data.instance instanceof Composition">

        <!-- Global options -->
        <template v-if="data.instance instanceof Generalization || data.instance instanceof Composition">
          <v-checkbox :label="t('reversed')" v-model="data.instance.reversed" />
        </template>
        <template v-else-if="data.instance instanceof Association">
          <v-text-field :label="t('name')"
                        v-model="data.instance.associationName"
                        :rules="[() => t(getError({parameter: 'associationName'})) ?? true]"
                        type="text" />

          <v-checkbox :label="t('show_ownership')" v-model="data.instance.showOwnership" />
          <v-checkbox :label="t('reversed')" v-model="data.instance.reversedOwnership" />
        </template>

        <!-- Endpoints -->
        <template v-if="data.instance instanceof Association
          || data.instance instanceof Aggregation
          || data.instance instanceof Composition">

          <!-- Start point -->
          <v-card :title="t('start_point')" variant="outlined">
            <v-card-text>
              <v-text-field :label="t('name')"
                            v-model="data.instance.startName"
                            :rules="[() => t(getError({parameter: 'startName'})) ?? true]"
                            type="text" />

              <template v-if="data.instance instanceof Aggregation">
                <v-checkbox :label="t('shared')" v-model="data.instance.isStartShared" />
              </template>
              <template v-else-if="data.instance instanceof Association">
                <v-select :label="t('navigability.title')" v-model="data.instance.startNavigability" :items="[
                  { title: t('navigability.unspecified'), value: AssociationNavigability.UNSPECIFIED },
                  { title: t('navigability.navigable'), value: AssociationNavigability.NAVIGABLE },
                  { title: t('navigability.unnavigable'), value: AssociationNavigability.UNNAVIGABLE }
                ]" />
              </template>

              <v-card :title="t('multiplicity')" variant="outlined">

              </v-card>
            </v-card-text>
          </v-card>

        </template>
      </template>
      <template v-else-if="data.instance instanceof ConnectionPoint"></template>
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-btn @click="onSave">{{ t("save") }}</v-btn>
  <!--  <fieldset>-->
  <!--    <legend class="capitalized">{{ t("detail", 2) }}</legend>-->
  <!--    <template v-else-if="data.instance instanceof Association-->
  <!--      || data.instance instanceof Aggregation-->
  <!--      || data.instance instanceof Generalization-->
  <!--      || data.instance instanceof Composition">-->
  <!--      -->
  <!--      <fieldset v-if="!(data.instance instanceof Generalization)">-->
  <!--        <legend class="capitalized">{{ t("start_point") }}</legend>-->


  <!--        <fieldset>-->
  <!--          <legend class="capitalized">{{ t("multiplicity") }}</legend>-->
  <!--          <div class="grid-form">-->
  <!--            <label for="startMultiUpper" class="capitalized">{{ t("multiplicity_upper") }}</label>-->
  <!--            <input id="startMultiUpper" type="text" v-model="data.instance['startMultiplicity'].upper">-->

  <!--            <label for="startMultiLower" class="capitalized">{{ t("multiplicity_lower") }}</label>-->
  <!--            <input id="startMultiLower" type="number" v-model="data.instance['startMultiplicity'].lower">-->
  <!--          </div>-->
  <!--        </fieldset>-->
  <!--      </fieldset>-->
  <!--      <fieldset v-if="!(data.instance instanceof Generalization)">-->
  <!--        <legend class="capitalized">{{ t("end_point") }}</legend>-->

  <!--        <div class="grid-form">-->
  <!--          <label for="endName" class="capitalized">{{ t("name") }}</label>-->
  <!--          <input id="endName" type="text" v-model="data.instance['endName']">-->

  <!--          <template v-if="data.instance instanceof Aggregation">-->
  <!--            <label for="endShared" class="capitalized">{{ t("shared") }}</label>-->
  <!--            <input id="endShared" type="checkbox" v-model="data.instance.isEndShared">-->
  <!--          </template>-->

  <!--          <template v-if="data.instance instanceof Association">-->
  <!--            <label for="endNavigability" class="capitalized">{{ t("navigability.title") }}</label>-->
  <!--            <select id="endNavigability" v-model="data.instance.endNavigability">-->
  <!--              <option :value="AssociationNavigability.UNSPECIFIED">{{ t("navigability.unspecified") }}</option>-->
  <!--              <option :value="AssociationNavigability.NAVIGABLE">{{ t("navigability.navigable") }}</option>-->
  <!--              <option :value="AssociationNavigability.UNNAVIGABLE">{{ t("navigability.unnavigable") }}</option>-->
  <!--            </select>-->
  <!--          </template>-->
  <!--        </div>-->

  <!--        <fieldset>-->
  <!--          <legend class="capitalized">{{ t("multiplicity") }}</legend>-->
  <!--          <div class="grid-form">-->
  <!--            <label for="endMultiUpper" class="capitalized">{{ t("multiplicity_upper") }}</label>-->
  <!--            <input id="endMultiUpper" type="text" v-model="data.instance['endMultiplicity'].upper">-->

  <!--            <label for="endMultiLower" class="capitalized">{{ t("multiplicity_lower") }}</label>-->
  <!--            <input id="endMultiLower" type="number" v-model="data.instance['endMultiplicity'].lower">-->
  <!--          </div>-->
  <!--        </fieldset>-->
  <!--      </fieldset>-->
  <!--    </template>-->
  <!--    <template v-if="data.instance instanceof ConnectionPoint">-->
  <!--      <template v-if="data.instance.isStartPoint && (-->
  <!--        data.instance.parent instanceof Aggregation ||-->
  <!--        data.instance.parent instanceof Association ||-->
  <!--        data.instance.parent instanceof Composition)">-->

  <!--        <div class="grid-form">-->
  <!--          <label for="startName" class="capitalized">{{ t("name") }}</label>-->
  <!--          <input id="startName" type="text" v-model="data.instance.parent['startName']">-->

  <!--          <template v-if="data.instance.parent instanceof Aggregation">-->
  <!--            <label for="startShared" class="capitalized">{{ t("shared") }}</label>-->
  <!--            <input id="startShared" type="checkbox" v-model="data.instance.parent.isStartShared">-->
  <!--          </template>-->

  <!--          <template v-if="data.instance.parent instanceof Association">-->
  <!--            <label for="startNavigability" class="capitalized">{{ t("navigability.title") }}</label>-->
  <!--            <select id="startNavigability" v-model="data.instance.parent.startNavigability">-->
  <!--              <option :value="AssociationNavigability.UNSPECIFIED">{{ t("navigability.unspecified") }}</option>-->
  <!--              <option :value="AssociationNavigability.NAVIGABLE">{{ t("navigability.navigable") }}</option>-->
  <!--              <option :value="AssociationNavigability.UNNAVIGABLE">{{ t("navigability.unnavigable") }}</option>-->
  <!--            </select>-->
  <!--          </template>-->
  <!--        </div>-->

  <!--        <fieldset>-->
  <!--          <legend class="capitalized">{{ t("multiplicity") }}</legend>-->
  <!--          <div class="grid-form">-->
  <!--            <label for="startMultiUpper" class="capitalized">{{ t("multiplicity_upper") }}</label>-->
  <!--            <input id="startMultiUpper" type="text" v-model="data.instance.parent['startMultiplicity'].upper">-->

  <!--            <label for="startMultiLower" class="capitalized">{{ t("multiplicity_lower") }}</label>-->
  <!--            <input id="startMultiLower" type="number" v-model="data.instance.parent['startMultiplicity'].lower">-->
  <!--          </div>-->
  <!--        </fieldset>-->
  <!--      </template>-->
  <!--      <template v-else-if="data.instance.isEndpoint && (-->
  <!--        data.instance.parent instanceof Aggregation ||-->
  <!--        data.instance.parent instanceof Association ||-->
  <!--        data.instance.parent instanceof Composition)">-->

  <!--        <div class="grid-form">-->
  <!--          <label for="endName" class="capitalized">{{ t("name") }}</label>-->
  <!--          <input id="endName" type="text" v-model="data.instance.parent['endName']">-->

  <!--          <template v-if="data.instance.parent instanceof Aggregation">-->
  <!--            <label for="endShared" class="capitalized">{{ t("shared") }}</label>-->
  <!--            <input id="endShared" type="checkbox" v-model="data.instance.parent.isEndShared">-->
  <!--          </template>-->

  <!--          <template v-if="data.instance.parent instanceof Association">-->
  <!--            <label for="endNavigability" class="capitalized">{{ t("navigability.title") }}</label>-->
  <!--            <select id="endNavigability" v-model="data.instance.parent.endNavigability">-->
  <!--              <option :value="AssociationNavigability.UNSPECIFIED">{{ t("navigability.unspecified") }}</option>-->
  <!--              <option :value="AssociationNavigability.NAVIGABLE">{{ t("navigability.navigable") }}</option>-->
  <!--              <option :value="AssociationNavigability.UNNAVIGABLE">{{ t("navigability.unnavigable") }}</option>-->
  <!--            </select>-->
  <!--          </template>-->
  <!--        </div>-->

  <!--        <fieldset>-->
  <!--          <legend class="capitalized">{{ t("multiplicity") }}</legend>-->
  <!--          <div class="grid-form">-->
  <!--            <label for="endMultiUpper" class="capitalized">{{ t("multiplicity_upper") }}</label>-->
  <!--            <input id="endMultiUpper" type="text" v-model="data.instance.parent['endMultiplicity'].upper">-->

  <!--            <label for="endMultiLower" class="capitalized">{{ t("multiplicity_lower") }}</label>-->
  <!--            <input id="endMultiLower" type="number" v-model="data.instance.parent['endMultiplicity'].lower">-->
  <!--          </div>-->
  <!--        </fieldset>-->
  <!--      </template>-->
  <!--    </template>-->
  <!--  </fieldset>-->
</template>