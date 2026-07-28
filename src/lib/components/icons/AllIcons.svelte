<script lang="ts">
	import { icons, type IconKey } from './icons.svelte';
	import Icon from './Icon.svelte';

	const iconKeys = Object.keys(icons) as IconKey[];
</script>

<div class="flex flex-wrap gap-4">
	{#each iconKeys as iconKey (iconKey)}
		<div class="flex flex-col items-center justify-center">
			<Icon name={iconKey} />
			<span>{iconKey}</span>
		</div>
	{/each}
</div>
