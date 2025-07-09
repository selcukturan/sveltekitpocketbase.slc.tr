<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';
	import ProxyDateTime from './ProxyDateTime.svelte';

	type Props = HTMLInputAttributes & {
		frm: SuperForm<T>;
		field: FormPathLeaves<T>;
	};

	let { frm, field, ...rest }: Props = $props();

	const { value, errors, constraints } = formFieldProxy(frm, field);
</script>

<label>
	{field}
	<br />
	<ProxyDateTime
		name={field}
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...rest}
		min={$constraints?.min?.toString().slice(0, 16)}
		max={$constraints?.max?.toString().slice(0, 16)}
		class="bg-primary-200 text-surface-800"
	/>
	<br />
</label>
<!-- {#if $errors}<span class="invalid">{$errors}</span>{/if} -->
