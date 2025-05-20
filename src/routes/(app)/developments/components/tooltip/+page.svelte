<script lang="ts">
	import { Tooltip } from '$lib/components/zagjs/tooltip';
	import { getGlobalContext } from '$lib/client/app/global.svelte';

	let global = getGlobalContext();
	let openState = $state(false);
</script>

<div class="flex h-96 w-96 flex-col items-center justify-center">
	<Tooltip open={openState} onOpenChange={(e) => (openState = e.open)} positioning={{ placement: global.isMobileBreakpoint ? 'bottom' : 'right' }} openDelay={0} closeDelay={0}>
		{#snippet trigger()}Hover Me{/snippet}
		{#snippet content()}This is a tooltip.{/snippet}
	</Tooltip>
</div>
