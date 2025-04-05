<script lang="ts" src="./ClassifierEditorPanel.ts" />
<style scoped src="./ClassifierEditorPanel.css" />

<template>
    <v-expansion-panel :title="t('appearance')">
        <v-expansion-panel-text>
            <v-text-field
                label="x"
                v-model.number="data.instance.x"
                density="comfortable"
                type="number"
            />
            <v-text-field
                label="y"
                v-model.number="data.instance.y"
                density="comfortable"
                type="number"
            />
        </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel :title="t('detail', 2)">
        <v-expansion-panel-text>
            <v-text-field
                :label="t('name')"
                v-model.trim="data.instance.name"
                :rules="[() => getError({ parameter: 'name' }) ?? true]"
                density="comfortable"
                type="text"
            />

            <template v-if="data.instance instanceof ClassNode">
                <v-checkbox
                    density="compact"
                    :label="t('abstract')"
                    v-model="data.instance.hasAbstractFlag"
                />

                <v-select
                    :label="t('class_stereotype.name')"
                    density="comfortable"
                    v-model="data.instance.stereotype"
                    :items="[
                        { title: '--', value: null },
                        {
                            title: t('class_stereotype.auxiliary'),
                            value: ClassStereotype.AUXILIARY,
                        },
                        {
                            title: t('class_stereotype.focus'),
                            value: ClassStereotype.FOCUS,
                        },
                        {
                            title: t('class_stereotype.implementation_class'),
                            value: ClassStereotype.IMPLEMENTATION_CLASS,
                        },
                        {
                            title: t('class_stereotype.metaclass'),
                            value: ClassStereotype.METACLASS,
                        },
                        {
                            title: t('class_stereotype.type'),
                            value: ClassStereotype.TYPE,
                        },
                        {
                            title: t('class_stereotype.utility'),
                            value: ClassStereotype.UTILITY,
                        },
                    ]"
                />
            </template>
        </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel :title="t('class_property', 2)">
        <v-expansion-panel-text>
            <v-expansion-panels multiple>
                <v-expansion-panel
                    :id="`property${index}`"
                    v-for="(prop, index) in data.instance.properties"
                    :key="index"
                >
                    <v-expansion-panel-title
                        :class="{
                            'error-header':
                                getError({
                                    parameter: 'properties',
                                    index: index,
                                }) !== null,
                        }"
                    >
                        <span>
                            <span>{{ prop.prefix }}</span>
                            <span :class="{ underlined: prop.isStatic }">
                                {{ prop.text }}
                            </span>
                            <span>{{ prop.postfix }}</span>
                        </span>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <template
                            v-if="!(data.instance instanceof DataTypeNode)"
                        >
                            <v-select
                                :label="t('visibility.name')"
                                v-model="prop.visibility"
                                density="comfortable"
                                :items="[
                                    { title: '--', value: null },
                                    {
                                        title: t('visibility.public'),
                                        value: Visibility.PUBLIC,
                                    },
                                    {
                                        title: t('visibility.private'),
                                        value: Visibility.PRIVATE,
                                    },
                                    {
                                        title: t('visibility.protected'),
                                        value: Visibility.PROTECTED,
                                    },
                                    {
                                        title: t('visibility.package'),
                                        value: Visibility.PACKAGE,
                                    },
                                ]"
                            />
                        </template>

                        <v-text-field
                            :label="t('name')"
                            v-model.trim="prop.name"
                            :rules="[
                                () =>
                                    getError({
                                        parameter: 'properties',
                                        index: index,
                                        child: { parameter: 'name' },
                                    }) ?? true,
                            ]"
                            density="comfortable"
                            type="text"
                        />

                        <v-text-field
                            :label="t('type')"
                            v-model.trim="prop.type"
                            :rules="[
                                () =>
                                    getError({
                                        parameter: 'properties',
                                        index: index,
                                        child: { parameter: 'type' },
                                    }) ?? true,
                            ]"
                            density="comfortable"
                            type="text"
                        />

                        <v-text-field
                            :label="t('default_value')"
                            v-model.trim="prop.defaultValue"
                            :rules="[
                                () =>
                                    getError({
                                        parameter: 'properties',
                                        index: index,
                                        child: { parameter: 'defaultValue' },
                                    }) ?? true,
                            ]"
                            density="comfortable"
                            type="text"
                        />

                        <template
                            v-if="
                                data.instance instanceof ClassNode &&
                                data.instance.stereotype !==
                                    ClassStereotype.UTILITY
                            "
                        >
                            <v-checkbox
                                density="compact"
                                :label="t('static_type')"
                                v-model="prop.isStatic"
                            />
                        </template>

                        <v-checkbox
                            density="compact"
                            :label="t('derived')"
                            v-model="prop.isDerived"
                        />

                        <v-text-field
                            :label="t('redefines')"
                            v-model.trim="prop.redefines"
                            :rules="[
                                () =>
                                    getError({
                                        parameter: 'properties',
                                        index: index,
                                        child: { parameter: 'redefines' },
                                    }) ?? true,
                            ]"
                            density="comfortable"
                            type="text"
                        />

                        <v-text-field
                            :label="t('subsets')"
                            v-model.trim="prop.subsets"
                            :rules="[
                                () =>
                                    getError({
                                        parameter: 'properties',
                                        index: index,
                                        child: { parameter: 'subsets' },
                                    }) ?? true,
                            ]"
                            density="comfortable"
                            type="text"
                        />

                        <v-select
                            :label="t('modifier', 2)"
                            v-model="prop.modifiers"
                            density="comfortable"
                            multiple
                            chips
                            :items="[
                                { title: t('modifiers.id'), value: 'id' },
                                {
                                    title: t('modifiers.readonly'),
                                    value: 'readonly',
                                },
                                {
                                    title: t('modifiers.unique'),
                                    value: 'unique',
                                },
                                {
                                    title: t('modifiers.nonunique'),
                                    value: 'nonunique',
                                },
                                {
                                    title: t('modifiers.sequence'),
                                    value: 'sequence',
                                },
                                { title: t('modifiers.union'), value: 'union' },
                            ]"
                            :rules="[
                                () =>
                                    getError({
                                        parameter: 'properties',
                                        index: index,
                                        child: { parameter: 'modifiers' },
                                    }) ?? true,
                            ]"
                        />

                        <v-card
                            :title="t('multiplicity')"
                            variant="tonal"
                            density="compact"
                        >
                            <v-card-text>
                                <v-text-field
                                    :label="t('multiplicity_upper')"
                                    v-model.trim="prop.multiplicity.upper"
                                    :rules="[
                                        () =>
                                            getError({
                                                parameter: 'properties',
                                                index: index,
                                                child: {
                                                    parameter: 'multiplicity',
                                                    child: {
                                                        parameter: 'upper',
                                                    },
                                                },
                                            }) ?? true,
                                    ]"
                                    density="comfortable"
                                    type="text"
                                />

                                <v-text-field
                                    :label="t('multiplicity_lower')"
                                    v-model.number="prop.multiplicity.lower"
                                    :rules="[
                                        () =>
                                            getError({
                                                parameter: 'properties',
                                                index: index,
                                                child: {
                                                    parameter: 'multiplicity',
                                                    child: {
                                                        parameter: 'lower',
                                                    },
                                                },
                                            }) ?? true,
                                    ]"
                                    density="comfortable"
                                    type="number"
                                />
                            </v-card-text>
                        </v-card>

                        <v-btn
                            block
                            class="rm"
                            @click="onRemoveClicked('prop', index)"
                        >
                            {{ t('remove') }}
                        </v-btn>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>

            <v-btn
                density="compact"
                block
                @click="onAddClicked('prop')"
                icon="mdi-plus"
                rounded="0"
            ></v-btn>

            <v-checkbox
                density="compact"
                :label="t('not_shown_properties')"
                v-model="data.instance.isNotShownPropertiesExist"
            />
        </v-expansion-panel-text>
    </v-expansion-panel>
    <v-expansion-panel :title="t('operation', 2)">
        <v-expansion-panel-text>
            <v-expansion-panels multiple>
                <v-expansion-panel
                    :id="`operation${index}`"
                    v-for="(operation, index) in data.instance.operations"
                    :key="index"
                >
                    <v-expansion-panel-title
                        :class="{
                            'error-header':
                                getError({
                                    parameter: 'operations',
                                    index: index,
                                }) !== null,
                        }"
                    >
                        <span>
                            <span>{{ operation.prefix }}</span>
                            <span :class="{ underlined: operation.isStatic }">
                                {{ operation.text }}
                            </span>
                            <span>{{ operation.postfix }}</span>
                        </span>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                        <template
                            v-if="!(data.instance instanceof DataTypeNode)"
                        >
                            <v-select
                                :label="t('visibility.name')"
                                v-model="operation.visibility"
                                density="comfortable"
                                :items="[
                                    { title: '--', value: null },
                                    {
                                        title: t('visibility.public'),
                                        value: Visibility.PUBLIC,
                                    },
                                    {
                                        title: t('visibility.private'),
                                        value: Visibility.PRIVATE,
                                    },
                                    {
                                        title: t('visibility.protected'),
                                        value: Visibility.PROTECTED,
                                    },
                                    {
                                        title: t('visibility.package'),
                                        value: Visibility.PACKAGE,
                                    },
                                ]"
                            />
                        </template>

                        <v-text-field
                            :label="t('name')"
                            v-model.trim="operation.name"
                            :rules="[
                                () =>
                                    getError({
                                        parameter: 'operations',
                                        index: index,
                                        child: { parameter: 'name' },
                                    }) ?? true,
                            ]"
                            density="comfortable"
                            type="text"
                        />

                        <v-text-field
                            :label="t('return_type')"
                            v-model.trim="operation.returnType"
                            :rules="[
                                () =>
                                    getError({
                                        parameter: 'operations',
                                        index: index,
                                        child: { parameter: 'returnType' },
                                    }) ?? true,
                            ]"
                            density="comfortable"
                            type="text"
                        />

                        <template
                            v-if="
                                data.instance instanceof ClassNode &&
                                data.instance.stereotype !==
                                    ClassStereotype.UTILITY
                            "
                        >
                            <v-checkbox
                                density="compact"
                                :label="t('static_type')"
                                v-model="operation.isStatic"
                            />

                            <v-checkbox
                                :label="t('abstract')"
                                v-model="operation.isAbstract"
                                :rules="[
                                    () =>
                                        getError({
                                            parameter: 'operations',
                                            index: index,
                                            child: { parameter: 'isAbstract' },
                                        }) ?? true,
                                ]"
                                density="compact"
                            />

                            <v-text-field
                                :label="t('redefines')"
                                v-model.trim="operation.redefines"
                                :rules="[
                                    () =>
                                        getError({
                                            parameter: 'operations',
                                            index: index,
                                            child: { parameter: 'redefines' },
                                        }) ?? true,
                                ]"
                                density="comfortable"
                                type="text"
                            />
                        </template>

                        <v-select
                            :label="t('property', 2)"
                            v-model="operation.properties"
                            density="comfortable"
                            multiple
                            chips
                            :items="[
                                {
                                    title: t('properties.query'),
                                    value: 'query',
                                },
                                {
                                    title: t('properties.ordered'),
                                    value: 'ordered',
                                },
                                {
                                    title: t('properties.unique'),
                                    value: 'unique',
                                },
                            ]"
                            :rules="[
                                () =>
                                    getError({
                                        parameter: 'operations',
                                        index: index,
                                        child: { parameter: 'properties' },
                                    }) ?? true,
                            ]"
                        />

                        <v-card
                            :title="t('return_multiplicity')"
                            variant="tonal"
                            density="compact"
                        >
                            <v-card-text>
                                <v-text-field
                                    :label="t('multiplicity_upper')"
                                    v-model.trim="
                                        operation.returnMultiplicity.upper
                                    "
                                    :rules="[
                                        () =>
                                            getError({
                                                parameter: 'operations',
                                                index: index,
                                                child: {
                                                    parameter:
                                                        'returnMultiplicity',
                                                    child: {
                                                        parameter: 'upper',
                                                    },
                                                },
                                            }) ?? true,
                                    ]"
                                    density="comfortable"
                                    type="text"
                                />

                                <v-text-field
                                    :label="t('multiplicity_lower')"
                                    v-model.number="
                                        operation.returnMultiplicity.lower
                                    "
                                    :rules="[
                                        () =>
                                            getError({
                                                parameter: 'operations',
                                                index: index,
                                                child: {
                                                    parameter:
                                                        'returnMultiplicity',
                                                    child: {
                                                        parameter: 'lower',
                                                    },
                                                },
                                            }) ?? true,
                                    ]"
                                    density="comfortable"
                                    type="number"
                                />
                            </v-card-text>
                        </v-card>

                        <p>{{ t('parameter', 2) }}</p>

                        <v-expansion-panels multiple>
                            <v-expansion-panel
                                :id="`parameter${index}${pIndex}`"
                                v-for="(param, pIndex) in operation.params"
                                :key="pIndex"
                            >
                                <v-expansion-panel-title
                                    :class="{
                                        'error-header':
                                            getError({
                                                parameter: 'operations',
                                                index: index,
                                                child: {
                                                    parameter: 'params',
                                                    index: pIndex,
                                                },
                                            }) !== null,
                                    }"
                                >
                                    <span>{{ param.toString() }}</span>
                                </v-expansion-panel-title>
                                <v-expansion-panel-text>
                                    <v-text-field
                                        :label="t('name')"
                                        v-model.trim="param.name"
                                        :rules="[
                                            () =>
                                                getError({
                                                    parameter: 'operations',
                                                    index: index,
                                                    child: {
                                                        parameter: 'params',
                                                        index: pIndex,
                                                        child: {
                                                            parameter: 'name',
                                                        },
                                                    },
                                                }) ?? true,
                                        ]"
                                        density="comfortable"
                                        type="text"
                                    />

                                    <v-text-field
                                        :label="t('type')"
                                        v-model.trim="param.type"
                                        :rules="[
                                            () =>
                                                getError({
                                                    parameter: 'operations',
                                                    index: index,
                                                    child: {
                                                        parameter: 'params',
                                                        index: pIndex,
                                                        child: {
                                                            parameter: 'type',
                                                        },
                                                    },
                                                }) ?? true,
                                        ]"
                                        density="comfortable"
                                        type="text"
                                    />

                                    <v-text-field
                                        :label="t('default_value')"
                                        v-model.trim="param.defaultValue"
                                        :rules="[
                                            () =>
                                                getError({
                                                    parameter: 'properties',
                                                    index: index,
                                                    child: {
                                                        parameter:
                                                            'defaultValue',
                                                    },
                                                }) ?? true,
                                        ]"
                                        density="comfortable"
                                        type="text"
                                    />

                                    <v-select
                                        :label="t('direction')"
                                        v-model="param.direction"
                                        density="comfortable"
                                        :items="[
                                            { title: '--', value: null },
                                            {
                                                title: t('directions.in'),
                                                value: 'in',
                                            },
                                            {
                                                title: t('directions.out'),
                                                value: 'out',
                                            },
                                            {
                                                title: t('directions.inout'),
                                                value: 'inout',
                                            },
                                        ]"
                                    />

                                    <v-select
                                        :label="t('property', 2)"
                                        v-model="param.properties"
                                        density="comfortable"
                                        multiple
                                        chips
                                        :items="[
                                            {
                                                title: t('properties.ordered'),
                                                value: 'ordered',
                                            },
                                            {
                                                title: t(
                                                    'properties.unordered',
                                                ),
                                                value: 'unordered',
                                            },
                                            {
                                                title: t('properties.unique'),
                                                value: 'unique',
                                            },
                                            {
                                                title: t(
                                                    'properties.nonunique',
                                                ),
                                                value: 'nonunique',
                                            },
                                            {
                                                title: t('properties.sequence'),
                                                value: 'sequence',
                                            },
                                        ]"
                                        :rules="[
                                            () =>
                                                getError({
                                                    parameter: 'operations',
                                                    index: index,
                                                    child: {
                                                        parameter: 'params',
                                                        index: pIndex,
                                                        child: {
                                                            parameter:
                                                                'properties',
                                                        },
                                                    },
                                                }) ?? true,
                                        ]"
                                    />

                                    <v-card
                                        :title="t('multiplicity')"
                                        variant="tonal"
                                        density="compact"
                                    >
                                        <v-card-text>
                                            <v-text-field
                                                :label="t('multiplicity_upper')"
                                                v-model.trim="
                                                    param.multiplicity.upper
                                                "
                                                :rules="[
                                                    () =>
                                                        getError({
                                                            parameter:
                                                                'operations',
                                                            index: index,
                                                            child: {
                                                                parameter:
                                                                    'params',
                                                                index: pIndex,
                                                                child: {
                                                                    parameter:
                                                                        'multiplicity',
                                                                    child: {
                                                                        parameter:
                                                                            'upper',
                                                                    },
                                                                },
                                                            },
                                                        }) ?? true,
                                                ]"
                                                density="comfortable"
                                                type="text"
                                            />

                                            <v-text-field
                                                :label="t('multiplicity_lower')"
                                                v-model.number="
                                                    param.multiplicity.lower
                                                "
                                                :rules="[
                                                    () =>
                                                        getError({
                                                            parameter:
                                                                'operations',
                                                            index: index,
                                                            child: {
                                                                parameter:
                                                                    'params',
                                                                index: pIndex,
                                                                child: {
                                                                    parameter:
                                                                        'multiplicity',
                                                                    child: {
                                                                        parameter:
                                                                            'lower',
                                                                    },
                                                                },
                                                            },
                                                        }) ?? true,
                                                ]"
                                                density="comfortable"
                                                type="number"
                                            />
                                        </v-card-text>
                                    </v-card>

                                    <v-btn
                                        block
                                        class="rm"
                                        @click="
                                            onRemoveClicked(
                                                'param',
                                                pIndex,
                                                index,
                                            )
                                        "
                                    >
                                        {{ t('remove') }}
                                    </v-btn>
                                </v-expansion-panel-text>
                            </v-expansion-panel>
                        </v-expansion-panels>

                        <v-btn
                            density="compact"
                            block
                            @click="onAddClicked('param', index)"
                            icon="mdi-plus"
                            rounded="0"
                        ></v-btn>

                        <v-btn
                            block
                            class="rm"
                            @click="onRemoveClicked('operation', index)"
                        >
                            {{ t('remove') }}
                        </v-btn>
                    </v-expansion-panel-text>
                </v-expansion-panel>
            </v-expansion-panels>

            <v-btn
                density="compact"
                block
                @click="onAddClicked('operation')"
                icon="mdi-plus"
                rounded="0"
            ></v-btn>

            <v-checkbox
                density="compact"
                :label="t('not_shown_operations')"
                v-model="data.instance.isNotShownOperationsExist"
            />
        </v-expansion-panel-text>
    </v-expansion-panel>
</template>
