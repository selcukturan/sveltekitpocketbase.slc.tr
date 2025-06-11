<script lang="ts" module>
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import SuperDebug, { type SuperForm } from 'sveltekit-superforms';

	type Props = {
		frm: SuperForm<T>;
	};

	let { frm, ...rest }: Props = $props();

	const { form } = frm;
</script>

<SuperDebug data={$form} />
