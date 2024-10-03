import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';


export default [
    {files: ['**/*.{js,mjs,cjs,ts,vue}']},
    {files: ['**/*.js'], languageOptions: {sourceType: 'script'}},
    {languageOptions: { globals: globals.browser }},
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/essential'],
    {files: ['**/*.vue'], languageOptions: {parserOptions: {parser: tseslint.parser}}},
    {
        rules: {
            quotes: ['error', 'single'],
            indent: ['error', 4, {
                'SwitchCase': 1,
                'CallExpression': {
                    'arguments': 'first'
                },
                'FunctionDeclaration': {
                    'parameters': 'first'
                },
                'FunctionExpression': {
                    'parameters': 'first'
                }
            }],
            semi: ['error', 'always'],
            eqeqeq: ['error', 'always'],
            'vue/html-indent': ['error', 2],
            '@typescript-eslint/no-explicit-any': 'off'
        }
    },
];