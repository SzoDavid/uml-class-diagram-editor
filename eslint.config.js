import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import * as eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
    { files: ['**/*.{js,mjs,cjs,ts,vue}'] },
    { files: ['**/*.js'], languageOptions: { sourceType: 'script' } },
    { languageOptions: { globals: globals.browser } },
    pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    ...pluginVue.configs['flat/essential'],
    {
        files: ['**/*.vue'],
        languageOptions: { parserOptions: { parser: tseslint.parser } },
    },
    { ignores: ['dist/*', 'coverage/*'] },
    {
        rules: {
            quotes: ['error', 'single'],
            indent: [
                'error',
                4,
                {
                    SwitchCase: 1,
                    CallExpression: {
                        arguments: 'first',
                    },
                    FunctionDeclaration: {
                        parameters: 'first',
                    },
                    FunctionExpression: {
                        parameters: 'first',
                    },
                },
            ],
            semi: ['error', 'always'],
            eqeqeq: ['error', 'always'],
            'vue/html-indent': ['error', 2],
            '@typescript-eslint/no-explicit-any': 'off',
        },
        plugins: {
            prettier: eslintPluginPrettierRecommended,
        },
    },
];
