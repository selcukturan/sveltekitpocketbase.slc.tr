<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { tooltip } from '$lib/attachments';

	type Props = HTMLButtonAttributes & {
		label?: string;
		icon?: string;
		size?: string;
		iconSize?: string;
	};

	let { label = 'Action', icon = 'ri-file-line', size = '28px', iconSize = '16px', ...attributes }: Props = $props();
</script>

<button
	type="button"
	{@attach tooltip({
		text: label,
		position: 'top',
		delay: 500
	})}
	{...attributes}
	style:width={size}
	style:height={size}
	style:min-width={size}
	class="bg-surface-200 hover:bg-surface-300 text-surface-800 m-0 flex cursor-pointer items-center justify-center rounded-full border border-transparent p-0 transition-all disabled:opacity-50 {attributes.class}"
>
	<i class="{icon} leading-none" style:font-size={iconSize}></i>
</button>
