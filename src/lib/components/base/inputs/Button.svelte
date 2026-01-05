<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		label?: string;
	};

	let { label = 'Button', ...attributes }: Props = $props();
</script>

<button
	type="button"
	{...attributes}
	class="bg-primary-200 hover:bg-primary-300 text-surface-800 m-1 cursor-pointer self-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
>
	{label}
</button>
