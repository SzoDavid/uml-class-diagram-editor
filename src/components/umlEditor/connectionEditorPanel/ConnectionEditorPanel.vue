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
                <v-text-field :label="t('multiplicity_upper')"
                              v-model="data.instance.startMultiplicity.upper"
                              :rules="[() => t(getError({parameter: 'startMultiplicity', child: {parameter: 'upper'}})) ?? true]"
                              type="text" />

                <v-text-field :label="t('multiplicity_lower')"
                              v-model="data.instance.startMultiplicity.lower"
                              :rules="[() => t(getError({parameter: 'startMultiplicity', child: {parameter: 'lower'}})) ?? true]"
                              type="number" />
              </v-card>
            </v-card-text>
          </v-card>

          <!-- End point -->
          <v-card :title="t('end_point')" variant="outlined">
            <v-card-text>
              <v-text-field :label="t('name')"
                            v-model="data.instance.endName"
                            :rules="[() => t(getError({parameter: 'endName'})) ?? true]"
                            type="text" />

              <template v-if="data.instance instanceof Aggregation">
                <v-checkbox :label="t('shared')" v-model="data.instance.isEndShared" />
              </template>
              <template v-else-if="data.instance instanceof Association">
                <v-select :label="t('navigability.title')" v-model="data.instance.endNavigability" :items="[
                  { title: t('navigability.unspecified'), value: AssociationNavigability.UNSPECIFIED },
                  { title: t('navigability.navigable'), value: AssociationNavigability.NAVIGABLE },
                  { title: t('navigability.unnavigable'), value: AssociationNavigability.UNNAVIGABLE }
                ]" />
              </template>

              <v-card :title="t('multiplicity')" variant="outlined">
                <v-text-field :label="t('multiplicity_upper')"
                              v-model="data.instance.endMultiplicity.upper"
                              :rules="[() => t(getError({parameter: 'endMultiplicity', child: {parameter: 'upper'}})) ?? true]"
                              type="text" />

                <v-text-field :label="t('multiplicity_lower')"
                              v-model="data.instance.endMultiplicity.lower"
                              :rules="[() => t(getError({parameter: 'endMultiplicity', child: {parameter: 'lower'}})) ?? true]"
                              type="number" />
              </v-card>
            </v-card-text>
          </v-card>
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
                        type="text" />

          <template v-if="data.instance.parent instanceof Aggregation">
            <v-checkbox :label="t('shared')" v-model="data.instance.parent.isStartShared" />
          </template>
          <template v-else-if="data.instance.parent instanceof Association">
            <v-select :label="t('navigability.title')" v-model="data.instance.parent.startNavigability" :items="[
              { title: t('navigability.unspecified'), value: AssociationNavigability.UNSPECIFIED },
              { title: t('navigability.navigable'), value: AssociationNavigability.NAVIGABLE },
              { title: t('navigability.unnavigable'), value: AssociationNavigability.UNNAVIGABLE }
            ]" />
          </template>

          <v-card :title="t('multiplicity')" variant="outlined">
            <v-card-text>
              <v-text-field :label="t('multiplicity_upper')"
                            v-model="data.instance.parent.startMultiplicity.upper"
                            :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'startMultiplicity', child: {parameter: 'upper'}}})) ?? true]"
                            type="text" />

              <v-text-field :label="t('multiplicity_lower')"
                            v-model="data.instance.parent.startMultiplicity.lower"
                            :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'startMultiplicity', child: {parameter: 'lower'}}})) ?? true]"
                            type="number" />
            </v-card-text>
          </v-card>
        </template>
        <template v-else-if="data.instance.isEndpoint">
          <v-text-field :label="t('name')"
                        v-model="data.instance.parent.endName"
                        :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'endName'}})) ?? true]"
                        type="text" />

          <template v-if="data.instance.parent instanceof Aggregation">
            <v-checkbox :label="t('shared')" v-model="data.instance.parent.isEndShared" />
          </template>
          <template v-else-if="data.instance.parent instanceof Association">
            <v-select :label="t('navigability.title')" v-model="data.instance.parent.endNavigability" :items="[
              { title: t('navigability.unspecified'), value: AssociationNavigability.UNSPECIFIED },
              { title: t('navigability.navigable'), value: AssociationNavigability.NAVIGABLE },
              { title: t('navigability.unnavigable'), value: AssociationNavigability.UNNAVIGABLE }
            ]" />
          </template>

          <v-card :title="t('multiplicity')" variant="outlined">
            <v-card-text>
              <v-text-field :label="t('multiplicity_upper')"
                            v-model="data.instance.parent.endMultiplicity.upper"
                            :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'endMultiplicity', child: {parameter: 'upper'}}})) ?? true]"
                            type="text" />

              <v-text-field :label="t('multiplicity_lower')"
                            v-model="data.instance.parent.endMultiplicity.lower"
                            :rules="[() => t(getError({parameter: 'parent', child: {parameter: 'endMultiplicity', child: {parameter: 'lower'}}})) ?? true]"
                            type="number" />
            </v-card-text>
          </v-card>
        </template>
      </template>
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-btn @click="onSave">{{ t("save") }}</v-btn>
</template>