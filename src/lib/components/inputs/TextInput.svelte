<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { formFieldProxy, type SuperForm, type FormPathLeaves } from 'sveltekit-superforms';

	type Props = HTMLInputAttributes & {
		frm: SuperForm<T>;
		field: FormPathLeaves<T>;
	};

	let { frm, field, ...rest }: Props = $props();

	const { value, errors, constraints } = formFieldProxy(frm, field);
</script>

<label>
	{field}<br />
	<input name={field} type="text" aria-invalid={$errors ? 'true' : undefined} bind:value={$value} {...$constraints} {...rest} />
</label>
{#if $errors}<span class="invalid">{$errors}</span>{/if}
