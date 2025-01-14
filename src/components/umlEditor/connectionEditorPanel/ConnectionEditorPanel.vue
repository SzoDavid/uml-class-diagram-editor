<script lang="ts" src="./ConnectionEditorPanel.ts" />
<style scoped src="./ConnectionEditorPanel.css" />

<template>
  <template v-if="data.instance instanceof BasicConnectionPoint">
    <v-expansion-panel :title="t('appearance')">
      <v-expansion-panel-text>
        <v-text-field label="x" v-model.number="data.instance.x" density="comfortable" type="number" />
        <v-text-field label="y" v-model.number="data.instance.y" density="comfortable" type="number" />
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

        <p class="error-text" v-if="getError({parameter: 'root'}) !== null">{{ t(getError({parameter: 'root'}) ?? 'error.unknown') }}</p>

        <!-- Global options -->
        <template v-if="data.instance instanceof Generalization || data.instance instanceof Composition">
          <v-checkbox density="compact" :label="t('reversed')" v-model="data.instance.reversed" />
        </template>
        <template v-else-if="data.instance instanceof Association">
          <v-text-field :label="t('name')"
                        v-model.trim="data.instance.associationName"
                        :rules="[() => getError({parameter: 'associationName'}) ?? true]"
                        density="comfortable"
                        type="text" />

          <!-- Association name label offset -->
          <v-card v-if="data.instance.associationName" :title="t('label_offset')" variant="tonal" density="compact">
            <v-card-text>
              <v-text-field label="x"
                            v-model.number="data.instance.nameOffset.x"
                            density="comfortable"
                            :rules="[() => getError({parameter: 'nameOffset', child: {parameter: 'x'}}) ?? true]"
                            type="number" />

              <v-text-field label="y"
                            v-model.number="data.instance.nameOffset.y"
                            density="comfortable"
                            :rules="[() => getError({parameter: 'nameOffset', child: {parameter: 'y'}}) ?? true]"
                            type="number" />
            </v-card-text>
          </v-card>

          <v-checkbox density="compact" :label="t('show_ownership')" v-model="data.instance.showOwnership" />
          <v-checkbox density="compact" :label="t('reversed')" v-model="data.instance.reversedOwnership" />
        </template>

        <!-- Endpoints -->
        <template v-if="data.instance instanceof Association
          || data.instance instanceof Aggregation
          || data.instance instanceof Composition">

          <v-expansion-panels multiple>
            <v-expansion-panel>
              <v-expansion-panel-title :class="{
                'error-header': getError({parameter: 'startPoint'})
                  || getError({parameter: 'startName'})
                  || getError({parameter: 'startNameOffset'})
                  || getError({parameter: 'startMultiplicity'})}">
                {{ t('start_point') }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p class="error-text" v-if="getError({parameter: 'startPoint'})">{{ t(getError({parameter: 'startPoint'})  ?? 'error.unknown' ) }}</p>

                <v-text-field :label="t('name')"
                              v-model.trim="data.instance.startName"
                              :rules="[() => getError({parameter: 'startName'}) ?? true]"
                              density="comfortable"
                              type="text" />

                <!-- Start name label offset -->
                <v-card v-if="data.instance.startName" :title="t('label_offset')" variant="tonal" density="compact">
                  <v-card-text>
                    <v-text-field label="x"
                                  v-model.number="data.instance.startNameOffset.x"
                                  :rules="[() => getError({parameter: 'startNameOffset', child: {parameter: 'x'}}) ?? true]"
                                  density="comfortable"
                                  type="number" />

                    <v-text-field label="y"
                                  v-model.number="data.instance.startNameOffset.y"
                                  :rules="[() => getError({parameter: 'startNameOffset', child: {parameter: 'y'}}) ?? true]"
                                  density="comfortable"
                                  type="number" />
                  </v-card-text>
                </v-card>
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
                                  v-model.trim="data.instance.startMultiplicity.upper"
                                  :rules="[() => getError({parameter: 'startMultiplicity', child: {parameter: 'upper'}}) ?? true]"
                                  density="comfortable"
                                  type="text" />

                    <v-text-field :label="t('multiplicity_lower')"
                                  v-model.number="data.instance.startMultiplicity.lower"
                                  :rules="[() => getError({parameter: 'startMultiplicity', child: {parameter: 'lower'}}) ?? true]"
                                  density="comfortable"
                                  type="number" />
                  </v-card-text>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel>
              <v-expansion-panel-title :class="{
                'error-header': getError({parameter: 'endPoint'})
                  || getError({parameter: 'endName'})
                  || getError({parameter: 'endNameOffset'})
                  || getError({parameter: 'endMultiplicity'})}">
                {{ t('end_point') }}
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <p class="error-text" v-if="getError({parameter: 'endPoint'})">{{ t(getError({parameter: 'endPoint'}) ?? 'error.unknown') }}</p>

                <v-text-field :label="t('name')"
                              v-model.number="data.instance.endName"
                              :rules="[() => getError({parameter: 'endName'}) ?? true]"
                              density="comfortable"
                              type="text" />

                <!-- End name label offset -->
                <v-card v-if="data.instance.endName" :title="t('label_offset')" variant="tonal" density="compact">
                  <v-card-text>
                    <v-text-field label="x"
                                  v-model.number="data.instance.endNameOffset.x"
                                  :rules="[() => getError({parameter: 'endNameOffset', child: {parameter: 'x'}}) ?? true]"
                                  density="comfortable"
                                  type="number" />

                    <v-text-field label="y"
                                  v-model.number="data.instance.endNameOffset.y"
                                  :rules="[() => getError({parameter: 'endNameOffset', child: {parameter: 'x'}}) ?? true]"
                                  density="comfortable"
                                  type="number" />
                  </v-card-text>
                </v-card>

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
                                  v-model.trim="data.instance.endMultiplicity.upper"
                                  :rules="[() => getError({parameter: 'endMultiplicity', child: {parameter: 'upper'}}) ?? true]"
                                  density="comfortable"
                                  type="text" />

                    <v-text-field :label="t('multiplicity_lower')"
                                  v-model.number="data.instance.endMultiplicity.lower"
                                  :rules="[() => getError({parameter: 'endMultiplicity', child: {parameter: 'lower'}}) ?? true]"
                                  density="comfortable"
                                  type="number" />
                  </v-card-text>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
        <template v-else>
          <!-- NOTE: if multiple errors are added, this needs to be changed -->
          <p class="error-text" v-if="getError({parameter: 'startPoint'})">{{ t(getError({parameter: 'startPoint'}) ?? 'error.unknown') }}</p>
          <p class="error-text" v-else-if="getError({parameter: 'endPoint'})">{{ t(getError({parameter: 'endPoint'}) ?? 'error.unknown') }}</p>
        </template>
      </template>
      <template v-else-if="data.instance instanceof ConnectionPoint && (
        data.instance.parent instanceof Aggregation ||
        data.instance.parent instanceof Association ||
        data.instance.parent instanceof Composition)">
        <template v-if="data.instance.isStartPoint">
          <p class="error-text" v-if="getError({parameter: 'startPoint'})">{{ t(getError({parameter: 'startPoint'}) ?? 'error.unknown') }}</p>

          <v-text-field :label="t('name')"
                        v-model.trim="data.instance.parent.startName"
                        :rules="[() => getError({parameter: 'startName'}) ?? true]"
                        density="comfortable"
                        type="text" />

          <!-- Start name label offset -->
          <v-card v-if="data.instance.parent.startName" :title="t('label_offset')" variant="tonal" density="compact">
            <v-card-text>
              <v-text-field label="x"
                            v-model.number="data.instance.parent.startNameOffset.x"
                            :rules="[() => getError({parameter: 'startNameOffset', child: {parameter: 'x'}}) ?? true]"
                            density="comfortable"
                            type="number" />

              <v-text-field label="y"
                            v-model.number="data.instance.parent.startNameOffset.y"
                            :rules="[() => getError({parameter: 'startNameOffset', child: {parameter: 'y'}}) ?? true]"
                            density="comfortable"
                            type="number" />
            </v-card-text>
          </v-card>

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
                            v-model.trim="data.instance.parent.startMultiplicity.upper"
                            :rules="[() => getError({parameter: 'startMultiplicity', child: {parameter: 'upper'}}) ?? true]"
                            density="comfortable"
                            type="text" />

              <v-text-field :label="t('multiplicity_lower')"
                            v-model.number="data.instance.parent.startMultiplicity.lower"
                            :rules="[() => getError({parameter: 'startMultiplicity', child: {parameter: 'lower'}}) ?? true]"
                            density="comfortable"
                            type="number" />
            </v-card-text>
          </v-card>
        </template>
        <template v-else-if="data.instance.isEndpoint">
          <p class="error-text" v-if="getError({parameter: 'endPoint'})">{{ t(getError({parameter: 'endPoint'}) ?? 'error.unknown') }}</p>

          <v-text-field :label="t('name')"
                        v-model.trim="data.instance.parent.endName"
                        :rules="[() => getError({parameter: 'endName'}) ?? true]"
                        density="comfortable"
                        type="text" />

          <!-- End name label offset -->
          <v-card v-if="data.instance.parent.endName" :title="t('label_offset')" variant="tonal" density="compact">
            <v-card-text>
              <v-text-field label="x"
                            v-model.number="data.instance.parent.endNameOffset.x"
                            :rules="[() => getError({parameter: 'endNameOffset', child: {parameter: 'x'}}) ?? true]"
                            density="comfortable"
                            type="number" />

              <v-text-field label="y"
                            v-model.number="data.instance.parent.endNameOffset.y"
                            :rules="[() => getError({parameter: 'endNameOffset', child: {parameter: 'y'}}) ?? true]"
                            density="comfortable"
                            type="number" />
            </v-card-text>
          </v-card>

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
                            v-model.trim="data.instance.parent.endMultiplicity.upper"
                            :rules="[() => getError({parameter: 'endMultiplicity', child: {parameter: 'upper'}}) ?? true]"
                            density="comfortable"
                            type="text" />

              <v-text-field :label="t('multiplicity_lower')"
                            v-model.number="data.instance.parent.endMultiplicity.lower"
                            :rules="[() => getError({parameter: 'endMultiplicity', child: {parameter: 'lower'}}) ?? true]"
                            density="comfortable"
                            type="number" />
            </v-card-text>
          </v-card>
        </template>
      </template>
      <template v-else-if="data.instance instanceof ConnectionPoint && data.instance.parent instanceof Generalization">
        <template v-if="data.instance.isStartPoint">
          <p class="error-text" v-if="getError({parameter: 'startPoint'})">{{ t(getError({parameter: 'startPoint'}) ?? 'error.unknown') }}</p>
        </template>
        <template v-else-if="data.instance.isEndpoint">
          <p class="error-text" v-if="getError({parameter: 'endPoint'})">{{ t(getError({parameter: 'endPoint'}) ?? 'error.unknown') }}</p>
        </template>
      </template>
    </v-expansion-panel-text>
  </v-expansion-panel>
</template>