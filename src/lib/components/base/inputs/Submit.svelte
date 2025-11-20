<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Props = HTMLButtonAttributes & {
		label?: string;
	};

	let { label = 'Submit', ...attributes }: Props = $props();
</script>

<button
	type="submit"
	{...attributes}
	class="bg-primary-200 hover:bg-primary-300 text-surface-800 m-1 cursor-pointer rounded-md p-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
>
	{label}
</button>
