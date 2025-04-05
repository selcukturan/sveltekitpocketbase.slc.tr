import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		ignores: ['eslint.config.js', 'svelte.config.js'],

		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	// PocketBase hooks için özel kurallar
	{
		files: ['**/.slc-development/pocketbase/**/*.js', '**/.slc-local/pocketbase/**/*.js', '**/.slc-production/pocketbase/**/*.js'],
		languageOptions: {
			ecmaVersion: 5,
			sourceType: 'script',
		},
		rules: {
			'no-var': 'off',
			'prefer-const': 'off',
			'prefer-template': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/triple-slash-reference': 'off',
			'no-undef': 'off'
		}
	}
);
