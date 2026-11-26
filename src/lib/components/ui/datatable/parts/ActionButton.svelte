<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { tooltip } from '#lib/attachments/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import type { IconKey } from '#lib/components/icons/index.js';

	type Props = HTMLButtonAttributes & {
		label?: string;
		icon?: IconKey;
		size?: string;
		iconSize?: string;
	};

	let { label: labelProp, icon = 'lucide', size = '28px', iconSize = '16px', ...attributes }: Props = $props();
	const label = $derived(labelProp ?? t('action'));
</script>

<button
	type="button"
	tabindex={-1}
	aria-label={label}
	{@attach tooltip({
		text: label,
		position: 'top',
		delay: 500
	})}
	{...attributes}
	style:width={size}
	style:height={size}
	style:min-width={size}
	class="text-surface-600 hover:bg-surface-200 hover:text-surface-900 active:bg-surface-300 focus-visible:outline-primary-500 m-0 flex cursor-pointer items-center justify-center rounded-md border border-transparent bg-transparent p-1 focus-visible:outline-2 disabled:opacity-50 {attributes.class}"
>
	<Icon name={icon} size="100%" />
</button>
