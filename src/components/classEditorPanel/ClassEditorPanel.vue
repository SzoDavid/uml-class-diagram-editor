<script lang="ts" src="./ClassEditorPanel.ts" />
<style scoped src="./ClassEditorPanel.css" />

<template>
  <fieldset>
    <legend class="capitalized">{{ t("appearance") }}</legend>
    <div class="grid-form">
      <label for="x">x</label>
      <input id="x" type="number" v-model="data.instance.x">

      <label for="y">y</label>
      <input id="y" type="number" v-model="data.instance.y">
    </div>
  </fieldset>

  <fieldset :key="renderKey">
    <legend class="capitalized">{{ t("detail", 2) }}</legend>
    <div class="grid-form">
      <label for="className" class="capitalized">{{ t("name") }}</label>
      <input id="className" type="text" v-model="data.instance.name">
      <span v-if="getError({parameter: 'name'})" class="error capitalized" style="grid-column: span 2;">{{ t(getError({parameter: 'name'})) }}</span>

      <template v-if="data.instance instanceof ClassNode">
        <label for="classAbstract" class="capitalized">{{ t("abstract") }}</label>
        <input id="classAbstract" type="checkbox" v-model="data.instance.hasAbstractFlag">

        <label for="classStereotype" class="capitalized">{{ t("class_stereotype.name") }}</label>
        <select id="classStereotype" v-model="data.instance.stereotype">
          <option :value="undefined">--</option>
          <option :value="ClassStereotype.AUXILIARY" class="capitalized">{{ t("class_stereotype.auxiliary") }}</option>
          <option :value="ClassStereotype.FOCUS" class="capitalized">{{ t("class_stereotype.focus") }}</option>
          <option :value="ClassStereotype.IMPLEMENTATION_CLASS" class="capitalized">{{ t("class_stereotype.implementation_class") }}</option>
          <option :value="ClassStereotype.METACLASS" class="capitalized">{{ t("class_stereotype.metaclass") }}</option>
          <option :value="ClassStereotype.TYPE" class="capitalized">{{ t("class_stereotype.type") }}</option>
          <option :value="ClassStereotype.UTILITY" class="capitalized">{{ t("class_stereotype.utility") }}</option>
        </select>
      </template>
    </div>

    <fieldset>
      <legend class="capitalized">{{ t('class_property', 2) }}</legend>
      <div :id="`property${index}`" class="collapsed" v-for="(prop, index) in data.instance.properties" :key="index">
        <div @click="onCollapseClicked('prop', index)" class="header"
             :class="{ 'error-header': getError({parameter: 'properties', index: index}) }">
          <span>
            <span>{{ prop.prefix }}</span>
            <span :class="{underlined: prop.isStatic}">{{ prop.text }}</span>
            <span>{{ prop.postfix }}</span>
          </span>
        </div>
        <div class="details sep">
          <div class="grid-form">
            <label :for="`propVisibility${index}`" class="capitalized">{{ t("visibility.name") }}</label>
            <select :id="`propVisibility${index}`" v-model="prop.visibility">
              <option :value="null">--</option>
              <option :value="Visibility.PUBLIC" class="capitalized">{{ t("visibility.public") }} (+)</option>
              <option :value="Visibility.PRIVATE" class="capitalized">{{ t("visibility.private") }} (-)</option>
              <option :value="Visibility.PROTECTED" class="capitalized">{{ t("visibility.protected") }} (#)</option>
              <option :value="Visibility.PACKAGE" class="capitalized">{{ t("visibility.package") }} (~)</option>
            </select>

            <label :for="`propName${index}`" class="capitalized">{{ t("name") }}</label>
            <input :id="`propName${index}`" type="text" v-model="prop.name">
            <span v-if="getError({parameter: 'properties', index: index, child: {parameter: 'name'}})"
                  class="error capitalized" style="grid-column: span 2;">
              {{ t(getError({parameter: 'properties', index: index, child: {parameter: 'name'} })) }}
            </span>

            <label :for="`propType${index}`" class="capitalized">{{ t("type") }}</label>
            <input :id="`propType${index}`" type="text" v-model="prop.type">
            <span v-if="getError({parameter: 'properties', index: index, child: {parameter: 'type'}})"
                  class="error capitalized" style="grid-column: span 2;">
              {{ t(getError({parameter: 'properties', index: index, child: {parameter: 'type'} })) }}
            </span>

            <label :for="`propDefault${index}`" class="capitalized">{{ t("default_value") }}</label>
            <input :id="`propDefault${index}`" type="text" v-model="prop.defaultValue">
            <span v-if="getError({parameter: 'properties', index: index, child: {parameter: 'defaultValue'}})"
                  class="error capitalized" style="grid-column: span 2;">
              {{ t(getError({parameter: 'properties', index: index, child: {parameter: 'defaultValue'} })) }}
            </span>

            <template v-if="data.instance instanceof ClassNode && data.instance.stereotype !== ClassStereotype.UTILITY">
              <label :for="`propStatic${index}`" class="capitalized">{{ t("static_type") }}</label>
              <input type="checkbox" :id="`propStatic${index}`" v-model="prop.isStatic">
            </template>

            <label :for="`propDerived${index}`" class="capitalized">{{ t("derived") }}</label>
            <input type="checkbox" :id="`propDerived${index}`" v-model="prop.isDerived">

            <label :for="`propRedefines${index}`" class="capitalized">{{ t("redefines") }}</label>
            <input :id="`propRedefines${index}`" type="text" v-model="prop.redefines">

            <label :for="`propSubsets${index}`" class="capitalized">{{ t("subsets") }}</label>
            <input :id="`propSubsets${index}`" type="text" v-model="prop.subsets">

            <label :for="`propModifiers${index}`" class="capitalized">{{ t("modifier", 2) }}</label>
            <select :id="`propModifiers${index}`" v-model="prop.modifiers" multiple>
              <option value="id">id</option>
              <option value="readonly">readonly</option>
              <option value="unique">unique</option>
              <option value="nonunique">nonunique</option>
              <option value="sequence">sequence</option>
              <option value="union">union</option>
            </select>
          </div>

          <fieldset>
            <legend class="capitalized">{{ t("multiplicity") }}</legend>
            <div class="grid-form">
              <label :for="`propMultiUpper${index}`" class="capitalized">{{ t("multiplicity_upper") }}</label>
              <input :id="`propMultiUpper${index}`" type="text" v-model="prop.multiplicity.upper">
              <span v-if="getError({parameter: 'properties', index: index, child: 
                      {parameter: 'multiplicity', child: {parameter: 'upper'}}})"
                    class="error capitalized" style="grid-column: span 2;">
                {{ t(getError({parameter: 'properties', index: index, child:
                  {parameter: 'multiplicity', child: {parameter: 'upper'} } })) }}
              </span>

              <label :for="`propMultiLower${index}`" class="capitalized">{{ t("multiplicity_lower") }}</label>
              <input :id="`propMultiLower${index}`" type="number" v-model="prop.multiplicity.lower">
              <span v-if="getError({parameter: 'properties', index: index, child: 
                      {parameter: 'multiplicity', child: {parameter: 'lower'}}})"
                    class="error capitalized" style="grid-column: span 2;">
                {{ t(getError({parameter: 'properties', index: index, child:
                  {parameter: 'multiplicity', child: {parameter: 'lower'} } })) }}
              </span>
            </div>
          </fieldset>

          <button class="rm capitalized" @click="onRemoveClicked('prop', index)" >{{ t("remove") }}</button>
        </div>
      </div>

      <div class="grid-form">
        <label for="hasNotShownProperties" class="capitalized">{{ t("not_shown_properties") }}</label>
        <input id="hasNotShownProperties" type="checkbox" v-model="data.instance.isNotShownPropertiesExist">
      </div>

      <button @click="onAddClicked('prop')" class="capitalized">{{ t("add") }}</button>
    </fieldset>

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
            <label :for="`operationVisibility${index}`" class="capitalized">{{ t("visibility.name") }}</label>
            <select :id="`operationVisibility${index}`" v-model="operation.visibility">
              <option :value="null">--</option>
              <option :value="Visibility.PUBLIC" class="capitalized">{{ t("visibility.public") }} (+)</option>
              <option :value="Visibility.PRIVATE" class="capitalized">{{ t("visibility.private") }} (-)</option>
              <option :value="Visibility.PROTECTED" class="capitalized">{{ t("visibility.protected") }} (#)</option>
              <option :value="Visibility.PACKAGE" class="capitalized">{{ t("visibility.package") }} (~)</option>
            </select>

            <label :for="`operationName${index}`" class="capitalized">{{ t("name") }}</label>
            <input :id="`operationName${index}`" type="text" v-model="operation.name">
            <span v-if="getError({parameter: 'operations', index: index, child: {parameter:'name'}})"
                  class="error capitalized" style="grid-column: span 2;">
              {{ t(getError({parameter: 'operations', index: index, child: {parameter:'name'} })) }}
            </span>

            <label :for="`operationReturnType${index}`" class="capitalized">{{ t("return_type") }}</label>
            <input :id="`operationReturnType${index}`" type="text" v-model="operation.returnType">
            <span v-if="getError({parameter:'operations', index:index, child:{parameter:'returnType'}})"
                  class="error capitalized" style="grid-column: span 2;">
              {{ t(getError({parameter:'operations', index:index, child:{parameter:'returnType'} })) }}
            </span>

            <template v-if="data.instance instanceof ClassNode && data.instance.stereotype !== ClassStereotype.UTILITY">
              <label :for="`operationStatic${index}`" class="capitalized">{{ t("static_type") }}</label>
              <input type="checkbox" :id="`operationStatic${index}`" v-model="operation.isStatic">

              <label :for="`operationAbstract${index}`" class="capitalized">{{ t("abstract") }}</label>
              <input :id="`operationAbstract${index}`" type="checkbox" v-model="operation.isAbstract">
              <span v-if="getError({parameter:'operations', index:index, child:{parameter:'isAbstract'}})"
                    class="error capitalized" style="grid-column: span 2;">
                {{ t(getError({parameter:'operations', index:index, child:{parameter:'isAbstract'} })) }}
              </span>
            </template>

            <label :for="`operationRedefines${index}`" class="capitalized">{{ t("redefines") }}</label>
            <input :id="`operationRedefines${index}`" type="text" v-model="operation.redefines">

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

  <button v-on:click="onSave" class="capitalized">{{ t("save") }}</button>
</template>