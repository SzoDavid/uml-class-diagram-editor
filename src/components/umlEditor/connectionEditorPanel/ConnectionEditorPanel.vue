<script lang="ts" src="./ConnectionEditorPanel.ts" />
<style scoped src="./ConnectionEditorPanel.css" />

<template>
  <template v-if="data.instance instanceof BasicConnectionPoint">
    <v-expansion-panel :title="t('appearance')">
      <v-expansion-panel-text>
        <v-text-field label="x" v-model="data.instance.x" type="number" density="comfortable" />
        <v-text-field label="y" v-model="data.instance.y" type="number" density="comfortable" />
      </v-expansion-panel-text>
    </v-expansion-panel>
  </template>
  <v-expansion-panel :title="t('detail', 2)">
    <v-expansion-panel-text>
      <template v-if="data.instance instanceof ConnectionPart">
        <v-btn block @click="breakConnectionPart" density="comfortable">{{ t("add_breakpoint") }}</v-btn>
      </template>
      <template v-else-if="data.instance instanceof Association
        || data.instance instanceof Aggregation
        || data.instance instanceof Generalization
        || data.instance instanceof Composition">

        <!-- Global options -->
        <template v-if="data.instance instanceof Generalization || data.instance instanceof Composition">
          <v-checkbox density="compact" :label="t('reversed')" v-model="data.instance.reversed" />
        </template>
        <template v-else-if="data.instance instanceof Association">
          <v-text-field :label="t('name')"
                        v-model="data.instance.associationName"
                        :rules="[() => t(getError({parameter: 'associationName'})) ?? true]"
                        density="comfortable"
                        type="text" />

          <v-checkbox density="compact" :label="t('show_ownership')" v-model="data.instance.showOwnership" />
          <v-checkbox density="compact" :label="t('reversed')" v-model="data.instance.reversedOwnership" />
        </template>

        <!-- Endpoints -->
        <template v-if="data.instance instanceof Association
          || data.instance instanceof Aggregation
          || data.instance instanceof Composition">

          <v-expansion-panels multiple>
            <v-expansion-panel :title="t('start_point')">
              <v-expansion-panel-text>
                <v-text-field :label="t('name')"
                              v-model="data.instance.startName"
                              :rules="[() => t(getError({parameter: 'startName'})) ?? true]"
                              density="comfortable"
                              type="text" />

                <template v-if="data.instance instanceof Aggregation">
                  <v-checkbox density="compact" :label="t('shared')" v-model="data.instance.isStartShared" />
                </template>
                <template v-else-if="data.instance instanceof Association">
                  <v-select :label="t('navigability.title')" v-model="data.instance.startNavigability" density="comfortable" :items="[
                    { title: t('navigability.unspecified'), value: AssociationNavigability.UNSPECIFIED },
                    { title: t('navigability.navigable'), value: AssociationNavigability.NAVIGABLE },
                    { title: t('navigability.unnavigable'), value: AssociationNavigability.UNNAVIGABLE }
                  ]" />
                </template>

                <v-card :title="t('multiplicity')" variant="tonal" density="comfortable">
                  <v-card-text>
                    <v-text-field :label="t('multiplicity_upper')"
                                  v-model="data.instance.startMultiplicity.upper"
                                  :rules="[() => t(getError({parameter: 'startMultiplicity', child: {parameter: 'upper'}})) ?? true]"
                                  density="comfortable"
                                  type="text" />

                    <v-text-field :label="t('multiplicity_lower')"
                                  v-model="data.instance.startMultiplicity.lower"
                                  :rules="[() => t(getError({parameter: 'startMultiplicity', child: {parameter: 'lower'}})) ?? true]"
                                  density="comfortable"
                                  type="number" />
                  </v-card-text>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel :title="t('end_point')">
              <v-expansion-panel-text>
                <v-text-field :label="t('name')"
                              v-model="data.instance.endName"
                              :rules="[() => t(getError({parameter: 'endName'})) ?? true]"
                              density="comfortable"
                              type="text" />

                <template v-if="data.instance instanceof Aggregation">
                  <v-checkbox density="compact" :label="t('shared')" v-model="data.instance.isEndShared" />
                </template>
                <template v-else-if="data.instance instanceof Association">
                  <v-select :label="t('navigability.title')" v-model="data.instance.endNavigability" density="comfortable" :items="[
                    { title: t('navigability.unspecified'), value: AssociationNavigability.UNSPECIFIED },
                    { title: t('navigability.navigable'), value: AssociationNavigability.NAVIGABLE },
                    { title: t('navigability.unnavigable'), value: AssociationNavigability.UNNAVIGABLE }
                  ]" />
                </template>

                <v-card :title="t('multiplicity')" variant="tonal" density="compact">
                  <v-card-text>
                    <v-text-field :label="t('multiplicity_upper')"
                                  v-model="data.instance.endMultiplicity.upper"
                                  :rules="[() => t(getError({parameter: 'endMultiplicity', child: {parameter: 'upper'}})) ?? true]"
                                  density="comfortable"
                                  type="text" />

                    <v-text-field :label="t('multiplicity_lower')"
                                  v-model="data.instance.endMultiplicity.lower"
                                  :rules="[() => t(getError({parameter: 'endMultiplicity', child: {parameter: 'lower'}})) ?? true]"
                                  density="comfortable"
                                  type="number" />
                  </v-card-text>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
      </template>
      <template v-else-if="data.instance instanceof ConnectionPoint && (
        data.instance.parent instanceof Aggregation ||
        data.instance.parent instanceof Association ||
        data.instance.parent instanceof Composition)">
        <template v-if="data.instance.isStartPoint">
          <v-text-field :label="t('name')"
                        v-model="data.instance.parent.startName"
                        :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'startName'}})) ?? true]"
                        density="comfortable"
                        type="text" />

          <template v-if="data.instance.parent instanceof Aggregation">
            <v-checkbox density="compact" :label="t('shared')" v-model="data.instance.parent.isStartShared" />
          </template>
          <template v-else-if="data.instance.parent instanceof Association">
            <v-select :label="t('navigability.title')" v-model="data.instance.parent.startNavigability" density="comfortable" :items="[
              { title: t('navigability.unspecified'), value: AssociationNavigability.UNSPECIFIED },
              { title: t('navigability.navigable'), value: AssociationNavigability.NAVIGABLE },
              { title: t('navigability.unnavigable'), value: AssociationNavigability.UNNAVIGABLE }
            ]" />
          </template>

          <v-card :title="t('multiplicity')" variant="tonal" density="compact">
            <v-card-text>
              <v-text-field :label="t('multiplicity_upper')"
                            v-model="data.instance.parent.startMultiplicity.upper"
                            :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'startMultiplicity', child: {parameter: 'upper'}}})) ?? true]"
                            density="comfortable"
                            type="text" />

              <v-text-field :label="t('multiplicity_lower')"
                            v-model="data.instance.parent.startMultiplicity.lower"
                            :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'startMultiplicity', child: {parameter: 'lower'}}})) ?? true]"
                            density="comfortable"
                            type="number" />
            </v-card-text>
          </v-card>
        </template>
        <template v-else-if="data.instance.isEndpoint">
          <v-text-field :label="t('name')"
                        v-model="data.instance.parent.endName"
                        :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'endName'}})) ?? true]"
                        density="comfortable"
                        type="text" />

          <template v-if="data.instance.parent instanceof Aggregation">
            <v-checkbox density="compact" :label="t('shared')" v-model="data.instance.parent.isEndShared" />
          </template>
          <template v-else-if="data.instance.parent instanceof Association">
            <v-select :label="t('navigability.title')" v-model="data.instance.parent.endNavigability" density="comfortable" :items="[
              { title: t('navigability.unspecified'), value: AssociationNavigability.UNSPECIFIED },
              { title: t('navigability.navigable'), value: AssociationNavigability.NAVIGABLE },
              { title: t('navigability.unnavigable'), value: AssociationNavigability.UNNAVIGABLE }
            ]" />
          </template>

          <v-card :title="t('multiplicity')" variant="tonal" density="compact">
            <v-card-text>
              <v-text-field :label="t('multiplicity_upper')"
                            v-model="data.instance.parent.endMultiplicity.upper"
                            :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'endMultiplicity', child: {parameter: 'upper'}}})) ?? true]"
                            density="comfortable"
                            type="text" />

              <v-text-field :label="t('multiplicity_lower')"
                            v-model="data.instance.parent.endMultiplicity.lower"
                            :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'endMultiplicity', child: {parameter: 'lower'}}})) ?? true]"
                            density="comfortable"
                            type="number" />
            </v-card-text>
          </v-card>
        </template>
      </template>
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-btn block @click="onSave">{{ t("save") }}</v-btn>
</template>