<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import { type SuperForm } from 'sveltekit-superforms';

	type Props = {
		frm: SuperForm<T>;
	};

	let { frm, ...rest }: Props = $props();

	const { message } = frm;
</script>

{#if $message}<p>{$message}</p>{/if}
