import { defineConfig, globalIgnores } from 'eslint/config';
import { fixupPluginRules } from '@eslint/compat';
import eslintConfigPrettier from 'eslint-config-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import eslintPluginSvelte from 'eslint-plugin-svelte';
import eslintPluginVue from 'eslint-plugin-vue';
import sort from 'eslint-plugin-sort';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';
import tseslint from 'typescript-eslint';
import json from 'eslint-plugin-json';
import vueParser from 'vue-eslint-parser';
export default defineConfig(
    globalIgnores([
        '.nx/',
        '.yarn/',
        '**/node_modules/**',
        '**/dist/**',
        '**/fixtures/**',
        '**/coverage/**',
        '**/__snapshots__/**',
        '**/.docusaurus/**',
        '**/build/**',
        '.nx/*',
        '.yarn/*',
        'yarn.lock',
        'package-lock.json',
        'pnpm-lock.yaml',
        '**/packages/**/*.mjs',
        '**/packages/**/*.js',
        '**/docs',
        '**/hooks',
        '**/src-native',
        '**/node_modules',
        '**/platforms',
        '**/src-native',
        '**/App_Resources',
        '**/packages',
        '**/typings/objc!*',
        '**/.vscode'
    ]),
    ...tseslint.configs.recommendedTypeChecked,
    eslintPluginPrettierRecommended,
    eslintConfigPrettier,
    sort.configs['flat/recommended'],
    // base config
    {
        languageOptions: {
            parser: tseslint.parser,
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                extraFileExtensions: ['.svelte', '.vue'],
                tsconfigRootDir: import.meta.dirname,
                project: 'tsconfig.eslint.json',
                warnOnUnsupportedTypeScriptVersion: false
            },
            globals: {
                ...globals.node
            }
        },
        linterOptions: { reportUnusedDisableDirectives: 'error' },
        name: 'base-config',
        rules: {
            '@typescript-eslint/no-unsafe-declaration-merging': 'off',
            'prettier/prettier': [
                'warn',
                {
                    // parser: 'typescript'
                }
            ],
            '@typescript-eslint/restrict-template-expressions': 'off',
            '@typescript-eslint/no-unsafe-enum-comparison': 'off',
            '@typescript-eslint/no-base-to-string': 'off',
            '@typescript-eslint/unbound-method': 'off',
            'no-duplicate-imports': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-unsafe-member-access': 'off',
            '@typescript-eslint/no-unsafe-return': 'off',
            '@typescript-eslint/no-unsafe-assignment': 'off',
            '@typescript-eslint/adjacent-overload-signatures': 'off',
            '@typescript-eslint/array-type': 'error',
            '@typescript-eslint/await-thenable': 'error',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/class-name-casing': 'off',
            '@typescript-eslint/consistent-type-assertions': 'error',
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/explicit-member-accessibility': [
                'off',
                {
                    accessibility: 'explicit'
                }
            ],
            '@typescript-eslint/no-redundant-type-constituents': 'off',
            '@typescript-eslint/no-misused-promises': 'off',
            '@typescript-eslint/no-unsafe-argument': 'off',
            '@typescript-eslint/no-unsafe-call': 'off',
            '@typescript-eslint/indent': 'off',
            '@typescript-eslint/require-await': 'off',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/interface-name-prefix': 'off',
            '@typescript-eslint/member-ordering': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-floating-promises': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/no-misused-new': 'off',
            '@typescript-eslint/no-namespace': 'off',
            '@typescript-eslint/no-parameter-properties': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unnecessary-qualifier': 'error',
            '@typescript-eslint/no-unnecessary-type-assertion': 'error',
            '@typescript-eslint/no-use-before-declare': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/prefer-for-of': 'off',
            '@typescript-eslint/prefer-function-type': 'error',
            '@typescript-eslint/prefer-namespace-keyword': 'error',
            '@typescript-eslint/space-within-parens': ['off', 'never'],
            '@typescript-eslint/triple-slash-reference': 'off',
            '@typescript-eslint/unified-signatures': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-unsafe-function-type': 'off', // '@stylistic/type-annotation-spacing': 'error',
            '@typescript-eslint/prefer-promise-reject-errors': 'off',
            '@typescript-eslint/prefer-destructuring': 'off',
            // '@stylistic/semi': ['error'],
            // '@stylistic/member-delimiter-style': 'error',
            // '@stylistic/quotes': [
            //     'error',
            //     'single',
            //     {
            //         avoidEscape: true
            //     }
            // ],
            'arrow-body-style': 'error',
            'arrow-parens': ['off', 'as-needed'],
            camelcase: 'off',
            'capitalized-comments': 'off',
            complexity: 'off',
            'constructor-super': 'error',
            curly: ['error', 'multi-line'],
            'dot-notation': 'off',
            'eol-last': 'error',
            eqeqeq: ['error', 'smart'],
            'guard-for-in': 'off',
            'id-blacklist': 'off',
            'id-match': 'error',
            'sort-imports': [
                'error',
                {
                    ignoreCase: false,
                    ignoreDeclarationSort: true,
                    ignoreMemberSort: false,
                    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
                }
            ],
            'sort/destructuring-properties': ['warn', { caseSensitive: false, natural: true }],
            'sort/exports': 'off',
            'sort/export-members': 'off',
            'sort/imports': 'off',
            'sort/import-members': 'off',
            'sort/object-properties': 'off',
            'linebreak-style': 'off',
            'max-classes-per-file': 'off',
            'max-len': [
                'off',
                {
                    ignorePattern: '^import |^export {(.*?)}',
                    code: 200
                }
            ],
            'new-parens': 'off',
            'newline-per-chained-call': 'off',
            'no-bitwise': 'off',
            'no-caller': 'error',
            'no-cond-assign': 'off',
            'no-console': [
                'off',
                {
                    allow: [
                        'log',
                        'warn',
                        'dir',
                        'timeLog',
                        'assert',
                        'clear',
                        'count',
                        'countReset',
                        'group',
                        'groupEnd',
                        'table',
                        'debug',
                        'dirxml',
                        'error',
                        'groupCollapsed',
                        'Console',
                        'profile',
                        'profileEnd',
                        'timeStamp',
                        'context'
                    ]
                }
            ],
            'no-constant-condition': 'error',
            'no-control-regex': 'off',
            'no-debugger': 'error',
            'no-empty': 'off',
            'no-eval': 'off',
            'no-extra-semi': 'off',
            'no-fallthrough': 'error',
            'no-invalid-regexp': 'error',
            'no-invalid-this': 'off',
            'no-irregular-whitespace': 'off',
            'no-multiple-empty-lines': 'off',
            'no-new-wrappers': 'error',
            'no-redeclare': 'off',
            'no-regex-spaces': 'error',
            'no-return-await': 'error',
            'no-shadow': [
                'off',
                {
                    hoist: 'all'
                }
            ],
            'no-throw-literal': 'error',
            'no-trailing-spaces': 'error',
            'no-undef-init': 'error',
            'no-undef': 'off',
            'no-underscore-dangle': 'off',
            'no-unsafe-finally': 'error',
            'no-unused-expressions': [
                'error',
                {
                    allowTaggedTemplates: true,
                    allowShortCircuit: true
                }
            ],
            'no-unused-labels': 'error',
            'no-var': 'error',
            'object-shorthand': 'error',
            'one-var': ['off', 'never'],
            'prefer-arrow/prefer-arrow-functions': 'off',
            'prefer-const': 'error',
            'quote-props': 'off',
            radix: 'error',
            'space-before-function-paren': 'off',
            'spaced-comment': 'off',
            'use-isnan': 'error',
            'valid-typeof': 'off'
        }
    },
    {
        extends: [...eslintPluginSvelte.configs['flat/recommended']],
        files: ['**/*.svelte'],
        languageOptions: {
            parser: svelteParser,
            sourceType: 'module',
            ecmaVersion: 2022,
            parserOptions: {
                sourceType: 'module',
                ecmaVersion: 2022,
                parser: tseslint.parser
            }
        },
        // extends: [...eslintPluginSvelte.configs['flat/recommended']],
        processor: 'svelte/svelte',
        rules: {
            'no-undef': 'off',
            'svelte/require-each-key': 'off',
            'svelte/no-reactive-reassign': 'off',
            'svelte/sort-attributes': 'warn',
            'svelte/no-inner-declarations': 'off',
            'svelte/valid-compile': [
                'error',
                {
                    ignoreWarnings: true
                }
            ]
        },
        settings: {
            svelte: {
                ignoreWarnings: ['a11y-no-onchange', 'a11y-label-hhas-associated-control', 'illegal-attribute-character']
            }
        }
    },
    {
        files: ['*.tsx'],
        rules: {
            'react/display-name': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'react/prop-types': 'off'
        },
        extends: [
            reactPlugin.configs.flat.recommended, // This is not a plugin object, but a shareable config object
            reactPlugin.configs.flat['jsx-runtime'] // Add this if you are using React 17+
        ],
        languageOptions: {
            ...reactPlugin.configs.flat.recommended.languageOptions
        },
        settings: {
            react: {
                createClass: 'createReactClass', // Regex for Component Factory to use,
                // default to "createReactClass"
                pragma: 'React', // Pragma to use, default to "React"
                fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
                version: 'detect', // React version. "detect" automatically picks the version you have installed.
                // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
                // default to latest and warns if missing
                // It will default to "detect" in the future
                flowVersion: '0.53' // Flow version
            },
            propWrapperFunctions: [
                // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
                'forbidExtraProps',
                { property: 'freeze', object: 'Object' },
                { property: 'myFavoriteWrapper' },
                // for rules that check exact prop wrappers
                { property: 'forbidExtraProps', exact: true }
            ],
            componentWrapperFunctions: [
                // The name of any function used to wrap components, e.g. Mobx `observer` function. If this isn't set, components wrapped by these functions will be skipped.
                'observer', // `property`
                { property: 'styled' }, // `object` is optional
                { property: 'observer', object: 'Mobx' },
                { property: 'observer', object: '<pragma>' } // sets `object` to whatever value `settings.react.pragma` is set to
            ],
            formComponents: [
                // Components used as alternatives to <form> for forms, eg. <Form endpoint={ url } />
                'CustomForm',
                { name: 'Form', formAttribute: 'endpoint' }
            ],
            linkComponents: [
                // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
                'Hyperlink',
                { name: 'Link', linkAttribute: 'to' }
            ]
        }
    },
    {
        files: ['**/*.vue'],
        languageOptions: {
            parser: vueParser,
            parserOptions: {
                extraFileExtensions: ['.vue'],
                parser: tseslint.parser
                // parser: {
                //     js: 'espree',
                //     ts: tseslint.parser,
                //     '<template>': 'espree'
                // }
            }
        },
        extends: [...eslintPluginVue.configs['flat/recommended']],
        rules: {
            'vue/html-closing-bracket-newline': 'off',
            'vue/max-attributes-per-line': 'off',
            'vue/html-indent': 'off',
            'prettier/prettier': 'warn',
            'vue/custom-event-name-casing': 'off',
            'vue/multi-word-component-names': 'off'
        }
    },
    {
        files: ['**/*.ts'],
        rules: {
            'no-undef': 'off'
        }
    }
);
