<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formFieldProxy, stringProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	type Props = HTMLInputAttributes & {
		frm: SuperForm<T>;
		field: FormPathLeaves<T>;
	};

	let { frm, field, ...rest }: Props = $props();

	const { value, errors, constraints } = formFieldProxy(frm, field);

	const proxyValue = stringProxy(frm, field, { empty: 'undefined' });

	const valueStore = $constraints?.required ? proxyValue : value;
</script>

<label>
	{field}
	<br />
	<input
		name={field}
		type="text"
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$valueStore}
		{...$constraints}
		{...rest}
		class="bg-primary-200 text-surface-800"
	/>

	<br />
</label>
<!-- {#if $errors}<span class="invalid">{$errors}</span>{/if} -->
