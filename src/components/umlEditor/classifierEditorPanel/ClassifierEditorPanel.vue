<script lang="ts" src="./ClassifierEditorPanel.ts" />
<style scoped src="./ClassifierEditorPanel.css" />

<template>
  <v-expansion-panel :title="t('appearance')">
    <v-expansion-panel-text>
      <v-text-field label="x" v-model="data.instance.x" type="number" density="comfortable" />
      <v-text-field label="y" v-model="data.instance.y" type="number" density="comfortable" />
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-expansion-panel :title="t('detail', 2)">
    <v-expansion-panel-text>
      <v-text-field :label="t('name')"
                    v-model="data.instance.name"
                    :rules="[() => getError({parameter: 'name'}) ?? true]"
                    density="comfortable"
                    type="text" />

      <template v-if="data.instance instanceof ClassNode">
        <v-checkbox density="compact" :label="t('abstract')" v-model="data.instance.hasAbstractFlag" />

        <v-select :label="t('class_stereotype.name')" density="comfortable" v-model="data.instance.stereotype" :items="[
          { title: '--', value: null },
          { title: t('class_stereotype.auxiliary'), value: ClassStereotype.AUXILIARY },
          { title: t('class_stereotype.focus'), value: ClassStereotype.FOCUS },
          { title: t('class_stereotype.implementation_class'), value: ClassStereotype.IMPLEMENTATION_CLASS },
          { title: t('class_stereotype.metaclass'), value: ClassStereotype.METACLASS },
          { title: t('class_stereotype.type'), value: ClassStereotype.TYPE },
          { title: t('class_stereotype.utility'), value: ClassStereotype.UTILITY },
        ]" />
      </template>
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-expansion-panel :title="t('class_property', 2)">
    <v-expansion-panel-text>
      <v-expansion-panels multiple>
        <v-expansion-panel :id="`property${index}`" v-for="(prop, index) in data.instance.properties" :key="index">
          <v-expansion-panel-title :class="{ 'error-header': getError({parameter: 'properties', index: index}) !== null }">
            <span>{{ prop.prefix }}</span>
            <span :class="{underlined: prop.isStatic}">{{ prop.text }}</span>
            <span>{{ prop.postfix }}</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <template v-if="!(data.instance instanceof DataTypeNode)">
              <v-select :label="t('visibility.name')" v-model="prop.visibility" density="comfortable" :items="[
                { title: '--', value: null },
                { title: t('visibility.public'), value: Visibility.PUBLIC },
                { title: t('visibility.private'), value: Visibility.PRIVATE },
                { title: t('visibility.protected'), value: Visibility.PROTECTED },
                { title: t('visibility.package'), value: Visibility.PACKAGE }
              ]" />
            </template>

            <v-text-field :label="t('name')"
                          v-model="prop.name"
                          :rules="[() => getError({parameter: 'properties', index: index, child: {parameter: 'name'}}) ?? true]"
                          density="comfortable"
                          type="text" />

            <v-text-field :label="t('type')"
                          v-model="prop.type"
                          :rules="[() => getError({parameter: 'properties', index: index, child: {parameter: 'type'}}) ?? true]"
                          density="comfortable"
                          type="text" />

            <v-text-field :label="t('default_value')"
                          v-model="prop.defaultValue"
                          :rules="[() => getError({parameter: 'properties', index: index, child: {parameter: 'defaultValue'}}) ?? true]"
                          density="comfortable"
                          type="text" />

            <template v-if="data.instance instanceof ClassNode && data.instance.stereotype !== ClassStereotype.UTILITY">
              <v-checkbox density="compact" :label="t('static_type')" v-model="prop.isStatic" />
            </template>

            <v-checkbox density="compact" :label="t('derived')" v-model="prop.isDerived" />

            <v-text-field :label="t('redefines')"
                          v-model="prop.redefines"
                          :rules="[() => getError({parameter: 'properties', index: index, child: {parameter: 'redefines'}}) ?? true]"
                          density="comfortable"
                          type="text" />

            <v-text-field :label="t('subsets')"
                          v-model="prop.subsets"
                          :rules="[() => getError({parameter: 'properties', index: index, child: {parameter: 'subsets'}}) ?? true]"
                          density="comfortable"
                          type="text" />
            
            <v-select :label="t('modifier', 2)" v-model="prop.modifiers" density="comfortable" multiple chips :items="[
              { title: t('modifiers.id'), value: 'id' },
              { title: t('modifiers.readonly'), value: 'readonly' },
              { title: t('modifiers.unique'), value: 'unique' },
              { title: t('modifiers.nonunique'), value: 'nonunique' },
              { title: t('modifiers.sequence'), value: 'sequence' },
              { title: t('modifiers.union'), value: 'union' }
            ]" />

            <v-card :title="t('multiplicity')" variant="tonal" density="compact">
              <v-card-text>
                <v-text-field :label="t('multiplicity_upper')"
                              v-model="prop.multiplicity.upper"
                              :rules="[() => getError({ parameter: 'properties', index: index, child:
                                { parameter: 'multiplicity', child: { parameter: 'upper' }}}) ?? true]"
                              density="comfortable"
                              type="text" />

                <v-text-field :label="t('multiplicity_lower')"
                              v-model="prop.multiplicity.lower"
                              :rules="[() => getError({ parameter: 'properties', index: index, child:
                                { parameter: 'multiplicity', child: { parameter: 'upper' }}}) ?? true]"
                              density="comfortable"
                              type="number" />
              </v-card-text>
            </v-card>

            <v-btn block class="rm" @click="onRemoveClicked('prop', index)">{{ t('remove') }}</v-btn>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-btn density="compact" block @click="onAddClicked('prop')" icon="mdi-plus" rounded="0"></v-btn>

      <v-checkbox density="compact" :label="t('not_shown_properties')" v-model="data.instance.isNotShownPropertiesExist" />
    </v-expansion-panel-text>
  </v-expansion-panel>
  <v-expansion-panel :title="t('operation', 2)">
    <v-expansion-panel-text>
      <v-expansion-panels multiple>
        <v-expansion-panel :id="`operation${index}`" v-for="(operation, index) in data.instance.operations" :key="index">
          <v-expansion-panel-title :class="{ 'error-header': getError({parameter: 'operations', index: index}) !== null }">
            <span>{{ operation.prefix }}</span>
            <span :class="{underlined: operation.isStatic}">{{ operation.text }}</span>
            <span>{{ operation.postfix }}</span>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <template v-if="!(data.instance instanceof DataTypeNode)">
              <v-select :label="t('visibility.name')" v-model="operation.visibility" density="comfortable" :items="[
                { title: '--', value: null },
                { title: t('visibility.public'), value: Visibility.PUBLIC },
                { title: t('visibility.private'), value: Visibility.PRIVATE },
                { title: t('visibility.protected'), value: Visibility.PROTECTED },
                { title: t('visibility.package'), value: Visibility.PACKAGE }
              ]" />
            </template>

            <v-text-field :label="t('name')"
                          v-model="operation.name"
                          :rules="[() => getError({parameter: 'operations', index: index, child: {parameter: 'name'}}) ?? true]"
                          density="comfortable"
                          type="text" />

            <v-text-field :label="t('return_type')"
                          v-model="operation.returnType"
                          :rules="[() => getError({parameter: 'operations', index: index, child: {parameter: 'returnType'}}) ?? true]"
                          density="comfortable"
                          type="text" />

            <template v-if="data.instance instanceof ClassNode && data.instance.stereotype !== ClassStereotype.UTILITY">
              <v-checkbox density="compact" :label="t('static_type')" v-model="operation.isStatic" />

              <v-checkbox :label="t('abstract')"
                          v-model="operation.isAbstract"
                          :rules="[() => getError({parameter:'operations', index:index, child:{parameter:'isAbstract'}}) ?? true]"
                          density="compact" />

              <v-text-field :label="t('redefines')"
                            v-model="operation.redefines"
                            :rules="[() => getError({parameter: 'operations', index: index, child: {parameter: 'redefines'}}) ?? true]"
                            density="comfortable"
                            type="text" />
            </template>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-expansion-panel-text>
  </v-expansion-panel>
  <fieldset>
    <legend class="capitalized">{{ t("detail", 2) }}</legend>

    <fieldset>
      <legend>Operations</legend>
      <div :id="`operation${index}`" class="collapsed" v-for="(operation, index) in data.instance.operations" :key="index">
        <div @click="onCollapseClicked('operation', index)" class="header"
             :class="{ 'error-header': getError({parameter: 'operations', index: index}) }">
          <span>
            <span>{{ operation.prefix }}</span>
            <span :class="{underlined: operation.isStatic}">{{ operation.text }}</span>
            <span>{{ operation.postfix }}</span>
          </span>
        </div>

        <div class="details sep">
          <div class="grid-form">

            <label :for="`operationProperties${index}`" class="capitalized">{{ t("property", 2) }}</label>
            <select :id="`operationProperties${index}`" v-model="operation.properties" multiple>
              <option value="query">query</option>
              <option value="ordered">ordered</option>
              <option value="unique">unique</option>
            </select>
            <span v-if="getError({parameter:'operations', index:index, child:{parameter:'properties'}})"
                  class="error capitalized" style="grid-column: span 2;">
              {{ t(getError({parameter:'operations', index:index, child:{parameter:'properties'} })) }}
            </span>
          </div>

          <fieldset>
            <legend class="capitalized">{{ t("return_multiplicity") }}</legend>
            <div class="grid-form">
              <label :for="`returnMultiUpper${index}`" class="capitalized">{{ t("multiplicity_upper") }}</label>
              <input :id="`returnMultiUpper${index}`" type="text" v-model="operation.returnMultiplicity.upper">
              <span v-if="getError({parameter: 'operations', index: index, child:
                      {parameter: 'returnMultiplicity', child: {parameter: 'upper'}}})"
                    class="error capitalized" style="grid-column: span 2;">
                {{ t(getError({parameter: 'operations', index: index, child:
                  {parameter: 'returnMultiplicity', child: {parameter: 'upper'} } })) }}
              </span>

              <label :for="`returnMultiLower${index}`" class="capitalized">{{ t("multiplicity_lower") }}</label>
              <input :id="`returnMultiLower${index}`" type="number" v-model="operation.returnMultiplicity.lower">
              <span v-if="getError({parameter: 'operations', index: index, child:
                      {parameter: 'returnMultiplicity', child: {parameter: 'lower'}}})"
                    class="error capitalized" style="grid-column: span 2;">
                {{ t(getError({parameter: 'operations', index: index, child:
                  {parameter: 'returnMultiplicity', child: {parameter: 'lower'} } })) }}
              </span>
            </div>
          </fieldset>

          <fieldset>
            <legend class="capitalized">{{ t("parameter", 2) }}</legend>

            <div :id="`parameter${index}${pIndex}`" class="collapsed" v-for="(param, pIndex) in operation.params" :key="pIndex">
              <div @click="onCollapseClicked('param', pIndex, index)" class="header"
                   :class="{ 'error-header': getError({parameter: 'operations', index: index, child: {parameter: 'params', index: pIndex}}) }">
                <span>{{ param.toString() }}</span>
              </div>

              <div class="details sep">
                <div class="grid-form">
                  <label :for="`paramName${index}${pIndex}`" class="capitalized">{{ t("name") }}</label>
                  <input :id="`paramName${index}${pIndex}`" type="text" v-model="param.name">
                  <span v-if="getError({parameter: 'operations', index: index, child:
                          {parameter: 'params', index: pIndex, child: {parameter: 'name'}}})"
                        class="error capitalized" style="grid-column: span 2;">
                    {{ t(getError({parameter: 'operations', index: index, child:
                      {parameter: 'params', index: pIndex, child: {parameter: 'name'} } })) }}
                  </span>

                  <label :for="`paramType${index}${pIndex}`" class="capitalized">{{ t("type") }}</label>
                  <input :id="`paramType${index}${pIndex}`" type="text" v-model="param.type">
                  <span v-if="getError({parameter: 'operations', index: index, child:
                          {parameter: 'params', index: pIndex, child: {parameter: 'type'}}})"
                        class="error capitalized" style="grid-column: span 2;">
                    {{ t(getError({parameter: 'operations', index: index, child:
                      {parameter: 'params', index: pIndex, child: {parameter: 'type'} } })) }}
                  </span>


                  <label :for="`paramDefault${index}${pIndex}`" class="capitalized">{{ t("default_value") }}</label>
                  <input :id="`paramDefault${index}${pIndex}`" type="text" v-model="param.defaultValue">
                  <span v-if="getError({parameter: 'operations', index: index, child:
                          {parameter: 'params', index: pIndex, child: {parameter: 'defaultValue'}}})"
                        class="error capitalized" style="grid-column: span 2;">
                    {{ t(getError({parameter: 'operations', index: index, child:
                      {parameter: 'params', index: pIndex, child: {parameter: 'defaultValue'} } })) }}
                  </span>

                  <label :for="`paramDirection${index}${pIndex}`" class="capitalized">{{ t("direction") }}</label>
                  <select :id="`paramDirection${index}${pIndex}`" v-model="param.direction">
                    <option :value="null">--</option>
                    <option value="in">in</option>
                    <option value="out">out</option>
                    <option value="inout">inout</option>
                  </select>

                  <label :for="`paramProps${index}${pIndex}`" class="capitalized">{{ t("property", 2) }}</label>
                  <select multiple :id="`paramProps${index}${pIndex}`" v-model="param.properties">
                    <option value="ordered">ordered</option>
                    <option value="unordered">unordered</option>
                    <option value="unique">unique</option>
                    <option value="nonunique">nonunique</option>
                    <option value="sequence">sequence</option>
                  </select>
                  <span v-if="getError({parameter: 'operations', index: index, child:
                          {parameter: 'params', index: pIndex, child: {parameter: 'properties'}}})"
                        class="error capitalized" style="grid-column: span 2;">
                    {{ t(getError({parameter: 'operations', index: index, child:
                      {parameter: 'params', index: pIndex, child: {parameter: 'properties'} } })) }}
                  </span>
                </div>

                <fieldset>
                  <legend class="capitalized">{{ t("multiplicity") }}</legend>
                  <div class="grid-form">
                    <label :for="`paramMultiUpper${index}${pIndex}`" class="capitalized">{{ t("multiplicity_upper") }}</label>
                    <input :id="`paramMultiUpper${index}${pIndex}`" type="text" v-model="param.multiplicity.upper">
                    <span v-if="getError({parameter: 'operations', index: index, child:
                            {parameter: 'params', index: pIndex, child: 
                              {parameter: 'multiplicity', child: {parameter: 'upper'}}}})"
                          class="error" style="grid-column: span 2;">
                      {{ t(getError({parameter: 'operations', index: index, child:
                        {parameter: 'params', index: pIndex, child:
                          {parameter: 'multiplicity', child: {parameter: 'upper'} } } })) }}
                    </span>

                    <label :for="`paramMultiLower${index}${pIndex}`" class="capitalized">{{ t("multiplicity_lower") }}</label>
                    <input :id="`paramMultiLower${index}${pIndex}`" type="number" v-model="param.multiplicity.lower">
                    <span v-if="getError({parameter: 'operations', index: index, child:
                            {parameter: 'params', index: pIndex, child: 
                              {parameter: 'multiplicity', child: {parameter: 'lower'}}}})"
                          class="error" style="grid-column: span 2;">
                      {{ t(getError({parameter: 'operations', index: index, child:
                        {parameter: 'params', index: pIndex, child:
                          {parameter: 'multiplicity', child: {parameter: 'lower'} } } })) }}
                    </span>
                  </div>
                </fieldset>

                <button class="rm capitalized" @click="onRemoveClicked('param', pIndex, index)">{{ t("remove") }}</button>
              </div>
            </div>

            <button @click="onAddClicked('param', index)" class="capitalized">{{ t("add") }}</button>
          </fieldset>

          <button class="rm capitalized" @click="onRemoveClicked('operation', index)">{{ t("remove") }}</button>
        </div>
      </div>

      <div class="grid-form">
        <label for="hasNotShownOperations" class="capitalized">{{ t("not_shown_operations") }}</label>
        <input id="hasNotShownOperations" type="checkbox" v-model="data.instance.isNotShownOperationsExist">
      </div>

      <button @click="onAddClicked('operation')" class="capitalized">{{ t("add") }}</button>
    </fieldset>
  </fieldset>

  <button @click="onSave" class="capitalized">{{ t("save") }}</button>
</template>