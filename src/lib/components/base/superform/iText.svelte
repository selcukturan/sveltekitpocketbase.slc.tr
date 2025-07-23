<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';
	import ProxyText from './ProxyText.svelte';
	import Field from './Field.svelte';

	type Props = HTMLInputAttributes & {
		frm: SuperForm<T>;
		field: FormPathLeaves<T>;
	};

	let { frm, field, ...rest }: Props = $props();

	const { value, errors, constraints } = formFieldProxy(frm, field);

	// null boş bir alanı temsil etmek için kullanılırken,
	// undefined eksik bir alanı temsil etmek için kullanılır.
	// JavaScript, bir değerin yokluğunu temsil etmenin iki farklı yolu olan garip bir dildir ve bunu kendi avantajımıza kullanabiliriz.
	// const proxyValue = stringProxy(frm, field, { empty: 'null' });

	// const valueStore = $constraints?.required ? proxyValue : value;
</script>

<Field {field} required={$constraints?.required}>
	{#snippet input(inputClass)}
		<ProxyText
			name={field}
			id={field}
			aria-invalid={$errors ? 'true' : undefined}
			bind:value={$value}
			{...$constraints}
			{...rest}
			class={inputClass}
		/>
	{/snippet}
</Field>
