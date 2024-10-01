<script lang="ts" src="./ClassEditorPanel.ts" />
<style scoped src="./ClassEditorPanel.css" />

<template>
  <fieldset>
    <legend>Appearance</legend>
    <div class="grid-form">
      <label for="x">x: </label>
      <input id="x" type="number" v-model="data['instance'].x">

      <label for="y">y: </label>
      <input id="y" type="number" v-model="data['instance'].y">
    </div>
  </fieldset>

  <fieldset :key="renderKey">
    <legend>Details</legend>
    <div class="grid-form">
      <label for="className">Class Name: </label>
      <input id="className" type="text" v-model="data['instance'].name">
      <span v-if="getError({parameter: 'name'})" class="error" style="grid-column: span 2;">{{ getError({parameter: 'name'}) }}</span>

      <label for="classAbstract">Abstract: </label>
      <input id="classAbstract" type="checkbox" v-model="data['instance'].hasAbstractFlag">
    </div>

    <fieldset>
      <legend>Properties</legend>
      <div :id="`property${index}`" class="collapsed" v-for="(prop, index) in data['instance'].properties" :key="index">
        <div @click="onCollapseClicked('prop', index)" class="header"
             :class="{ 'error-header': getError({parameter: 'properties', index: index}) }">
          <span>{{ prop.toString() }}</span>
        </div>
        <div class="details sep">
          <div class="grid-form">
            <label :for="`propVisibility${index}`">Visibility: </label>
            <select :id="`propVisibility${index}`" v-model="prop.visibility">
              <option :value="null">--</option>
              <option :value="Visibility.PUBLIC">Public (+)</option>
              <option :value="Visibility.PRIVATE">Private (-)</option>
              <option :value="Visibility.PROTECTED">Protected (#)</option>
              <option :value="Visibility.PACKAGE">Package (~)</option>
            </select>

            <label :for="`propName${index}`">Name: </label>
            <input :id="`propName${index}`" type="text" v-model="prop.name">
            <span v-if="getError({parameter: 'properties', index: index, child: {parameter: 'name'}})"
                  class="error" style="grid-column: span 2;">
              {{ getError({parameter: 'properties', index: index, child: {parameter: 'name'} }) }}
            </span>

            <label :for="`propType${index}`">Type: </label>
            <input :id="`propType${index}`" type="text" v-model="prop.type">
            <span v-if="getError({parameter: 'properties', index: index, child: {parameter: 'type'}})"
                  class="error" style="grid-column: span 2;">
              {{ getError({parameter: 'properties', index: index, child: {parameter: 'type'} }) }}
            </span>

            <label :for="`propDefault${index}`">Default value: </label>
            <input :id="`propDefault${index}`" type="text" v-model="prop.defaultValue">
            <span v-if="getError({parameter: 'properties', index: index, child: {parameter: 'defaultValue'}})"
                  class="error" style="grid-column: span 2;">
              {{ getError({parameter: 'properties', index: index, child: {parameter: 'defaultValue'} }) }}
            </span>

            <label :for="`propStatic${index}`">Static: </label>
            <input type="checkbox" :id="`propStatic${index}`" v-model="prop.isStatic">

            <label :for="`propDerived${index}`">Derived: </label>
            <input type="checkbox" :id="`propDerived${index}`" v-model="prop.isDerived">
          </div>

          <fieldset>
            <legend>Multiplicity</legend>
            <div class="grid-form">
              <label :for="`propMultiUpper${index}`">Upper: </label>
              <input :id="`propMultiUpper${index}`" type="text" v-model="prop.multiplicity.upper">
              <span v-if="getError({parameter: 'properties', index: index, child: 
                      {parameter: 'multiplicity', child: {parameter: 'upper'}}})"
                    class="error" style="grid-column: span 2;">
                {{ getError({parameter: 'properties', index: index, child:
                  {parameter: 'multiplicity', child: {parameter: 'upper'} } }) }}
              </span>

              <label :for="`propMultiLower${index}`">Lower: </label>
              <input :id="`propMultiLower${index}`" type="number" v-model="prop.multiplicity.lower">
              <span v-if="getError({parameter: 'properties', index: index, child: 
                      {parameter: 'multiplicity', child: {parameter: 'lower'}}})"
                    class="error" style="grid-column: span 2;">
                {{ getError({parameter: 'properties', index: index, child:
                  {parameter: 'multiplicity', child: {parameter: 'lower'} } }) }}
              </span>
            </div>
          </fieldset>

          <button class="rm" @click="onRemoveClicked('prop', index)">Remove</button>
        </div>
      </div>

      <div class="grid-form">
        <label for="hasNotShownProperties">Not shown properties: </label>
        <input id="hasNotShownProperties" type="checkbox" v-model="data['instance'].isNotShownPropertiesExist">
      </div>

      <button @click="onAddClicked('prop')">Add</button>
    </fieldset>

    <fieldset>
      <legend>Operations</legend>
      <div :id="`operation${index}`" class="collapsed" v-for="(operation, index) in data['instance'].operations" :key="index">
        <div @click="onCollapseClicked('operation', index)" class="header"
             :class="{ 'error-header': getError({parameter: 'operations', index: index}) }">
          <span>{{ operation.toString() }}</span>
        </div>

        <div class="details sep">
          <div class="grid-form">
            <label :for="`operationVisibility${index}`">Visibility: </label>
            <select :id="`operationVisibility${index}`" v-model="operation.visibility">
              <option :value="null">--</option>
              <option :value="Visibility.PUBLIC">Public (+)</option>
              <option :value="Visibility.PRIVATE">Private (-)</option>
              <option :value="Visibility.PROTECTED">Protected (#)</option>
              <option :value="Visibility.PACKAGE">Package (~)</option>
            </select>

            <label :for="`operationName${index}`">Name: </label>
            <input :id="`operationName${index}`" type="text" v-model="operation.name">
            <span v-if="getError({parameter: 'operations', index: index, child: {parameter:'name'}})"
                  class="error" style="grid-column: span 2;">
              {{ getError({parameter: 'operations', index: index, child: {parameter:'name'} }) }}
            </span>

            <label :for="`operationReturnType${index}`">Return type: </label>
            <input :id="`operationReturnType${index}`" type="text" v-model="operation.returnType">
            <span v-if="getError({parameter:'operations', index:index, child:{parameter:'returnType'}})"
                  class="error" style="grid-column: span 2;">
              {{ getError({parameter:'operations', index:index, child:{parameter:'returnType'} }) }}
            </span>

            <label :for="`operationStatic${index}`">Static: </label>
            <input type="checkbox" :id="`operationStatic${index}`" v-model="operation.isStatic">

            <label :for="`operationAbstract${index}`">Abstract: </label>
            <input :id="`operationAbstract${index}`" type="checkbox" v-model="operation.isAbstract">
            <span v-if="getError({parameter:'operations', index:index, child:{parameter:'isAbstract'}})"
                  class="error" style="grid-column: span 2;">
              {{ getError({parameter:'operations', index:index, child:{parameter:'isAbstract'} }) }}
            </span>

          </div>

          <fieldset>
            <legend>Return multiplicity</legend>
            <div class="grid-form">
              <label :for="`returnMultiUpper${index}`">Upper: </label>
              <input :id="`returnMultiUpper${index}`" type="text" v-model="operation.returnMultiplicity.upper">
              <span v-if="getError({parameter: 'operations', index: index, child:
                      {parameter: 'returnMultiplicity', child: {parameter: 'upper'}}})"
                    class="error" style="grid-column: span 2;">
                {{ getError({parameter: 'operations', index: index, child:
                  {parameter: 'returnMultiplicity', child: {parameter: 'upper'} } }) }}
              </span>

              <label :for="`returnMultiLower${index}`">Lower: </label>
              <input :id="`returnMultiLower${index}`" type="number" v-model="operation.returnMultiplicity.lower">
              <span v-if="getError({parameter: 'operations', index: index, child:
                      {parameter: 'returnMultiplicity', child: {parameter: 'lower'}}})"
                    class="error" style="grid-column: span 2;">
                {{ getError({parameter: 'operations', index: index, child:
                  {parameter: 'returnMultiplicity', child: {parameter: 'lower'} } }) }}
              </span>
            </div>
          </fieldset>

          <fieldset>
            <legend>Parameters</legend>

            <div :id="`parameter${index}${pIndex}`" class="collapsed" v-for="(param, pIndex) in operation.params" :key="pIndex">
              <div @click="onCollapseClicked('param', pIndex, index)" class="header"
                   :class="{ 'error-header': getError({parameter: 'operations', index: index, child: {parameter: 'params', index: pIndex}}) }">
                <span>{{ param.toString() }}</span>
              </div>
              
              <div class="details sep">
                <div class="grid-form">
                  <label :for="`paramName${index}${pIndex}`">Name: </label>
                  <input :id="`paramName${index}${pIndex}`" type="text" v-model="param.name">
                  <span v-if="getError({parameter: 'operations', index: index, child:
                          {parameter: 'params', index: pIndex, child: {parameter: 'name'}}})"
                        class="error" style="grid-column: span 2;">
                    {{ getError({parameter: 'operations', index: index, child:
                      {parameter: 'params', index: pIndex, child: {parameter: 'name'} } }) }}
                  </span>

                  <label :for="`paramType${index}${pIndex}`">Type: </label>
                  <input :id="`paramType${index}${pIndex}`" type="text" v-model="param.type">
                  <span v-if="getError({parameter: 'operations', index: index, child:
                          {parameter: 'params', index: pIndex, child: {parameter: 'type'}}})"
                        class="error" style="grid-column: span 2;">
                    {{ getError({parameter: 'operations', index: index, child:
                      {parameter: 'params', index: pIndex, child: {parameter: 'type'} } }) }}
                  </span>


                  <label :for="`paramDefault${index}${pIndex}`">Default value: </label>
                  <input :id="`paramDefault${index}${pIndex}`" type="text" v-model="param.defaultValue">
                  <span v-if="getError({parameter: 'operations', index: index, child:
                          {parameter: 'params', index: pIndex, child: {parameter: 'defaultValue'}}})"
                        class="error" style="grid-column: span 2;">
                    {{ getError({parameter: 'operations', index: index, child:
                      {parameter: 'params', index: pIndex, child: {parameter: 'defaultValue'} } }) }}
                  </span>

                  <label :for="`paramDirection${index}${pIndex}`">Direction: </label>
                  <select :id="`paramDirection${index}${pIndex}`" v-model="param.direction">
                    <option :value="null">--</option>
                    <option value="in">in</option>
                    <option value="out">out</option>
                    <option value="inout">inout</option>
                  </select>

                  <label :for="`paramProps${index}${pIndex}`">Properties: </label>
                  <select multiple :id="`paramProps${index}${pIndex}`" v-model="param.properties">
                    <option value="ordered">ordered</option>
                    <option value="unordered">unordered</option>
                    <option value="unique">unique</option>
                    <option value="nonunique">nonunique</option>
                    <option value="sequence">sequence</option>
                  </select>
                  <span v-if="getError({parameter: 'operations', index: index, child:
                          {parameter: 'params', index: pIndex, child: {parameter: 'properties'}}})"
                        class="error" style="grid-column: span 2;">
                    {{ getError({parameter: 'operations', index: index, child:
                      {parameter: 'params', index: pIndex, child: {parameter: 'properties'} } }) }}
                  </span>
                </div>

                <fieldset>
                  <legend>Multiplicity</legend>
                  <div class="grid-form">
                    <label :for="`paramMultiUpper${index}${pIndex}`">Upper: </label>
                    <input :id="`paramMultiUpper${index}${pIndex}`" type="text" v-model="param.multiplicity.upper">
                    <span v-if="getError({parameter: 'operations', index: index, child:
                            {parameter: 'params', index: pIndex, child: 
                              {parameter: 'multiplicity', child: {parameter: 'upper'}}}})"
                          class="error" style="grid-column: span 2;">
                      {{ getError({parameter: 'operations', index: index, child:
                        {parameter: 'params', index: pIndex, child: 
                          {parameter: 'multiplicity', child: {parameter: 'upper'} } } }) }}
                    </span>

                    <label :for="`paramMultiLower${index}${pIndex}`">Lower: </label>
                    <input :id="`paramMultiLower${index}${pIndex}`" type="number" v-model="param.multiplicity.lower">
                    <span v-if="getError({parameter: 'operations', index: index, child:
                            {parameter: 'params', index: pIndex, child: 
                              {parameter: 'multiplicity', child: {parameter: 'lower'}}}})"
                          class="error" style="grid-column: span 2;">
                      {{ getError({parameter: 'operations', index: index, child:
                        {parameter: 'params', index: pIndex, child:
                          {parameter: 'multiplicity', child: {parameter: 'lower'} } } }) }}
                    </span>
                  </div>
                </fieldset>

                <button class="rm" @click="onRemoveClicked('param', pIndex, index)">Remove</button>
              </div>
            </div>

            <button @click="onAddClicked('param', index)">Add</button>
          </fieldset>

          <button class="rm" @click="onRemoveClicked('operation', index)">Remove</button>
        </div>
      </div>

      <div class="grid-form">
        <label for="hasNotShownOperations">Not shown operations: </label>
        <input id="hasNotShownOperations" type="checkbox" v-model="data['instance'].isNotShownOperationsExist">
      </div>

      <button @click="onAddClicked('operation')">Add</button>
    </fieldset>
  </fieldset>

  <button v-on:click="onSave">Save</button>
</template>