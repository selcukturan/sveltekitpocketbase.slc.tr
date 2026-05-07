<script lang="ts">
	import { icons } from './icons.svelte';
	import Icon from './Icon.svelte';
</script>

<div class="flex flex-wrap gap-4">
	{#each Object.values(icons) as icon (icon)}
		<div class="flex flex-col items-center justify-center">
			<Icon name={icon} />
			<span>{icon}</span>
		</div>
	{/each}
</div>
