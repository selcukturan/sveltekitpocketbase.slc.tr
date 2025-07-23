<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';
	import ProxyDate from './ProxyDate.svelte';
	import Field from './Field.svelte';

	type Props = HTMLInputAttributes & {
		frm: SuperForm<T>;
		field: FormPathLeaves<T>;
	};

	let { frm, field, ...rest }: Props = $props();

	const { value, errors, constraints } = formFieldProxy(frm, field);
</script>

<Field {field} required={$constraints?.required}>
	{#snippet input(inputClass)}
		<ProxyDate
			name={field}
			id={field}
			aria-invalid={$errors ? 'true' : undefined}
			bind:value={$value}
			{...$constraints}
			{...rest}
			min={$constraints?.min?.toString().slice(0, 10)}
			max={$constraints?.max?.toString().slice(0, 10)}
			class={inputClass}
		/>
	{/snippet}
</Field>
