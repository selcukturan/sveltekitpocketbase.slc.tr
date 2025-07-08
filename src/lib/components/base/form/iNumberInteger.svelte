<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';
	import ProxyNumberInteger from './ProxyNumberInteger.svelte';

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
	<ProxyNumberInteger
		name={field}
		aria-invalid={$errors ? 'true' : undefined}
		bind:value={$value}
		{...$constraints}
		{...rest}
		class="bg-primary-200 text-surface-800"
	/>

	<br />
</label>
<!-- {#if $errors}<span class="invalid">{$errors}</span>{/if} -->
