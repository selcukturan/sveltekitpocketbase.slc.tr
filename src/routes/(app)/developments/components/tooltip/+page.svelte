<script lang="ts">
	import { Tooltip as TooltipZag } from '$lib/components/zagjs/tooltip';
	import { Tooltip as TooltipBits } from '$lib/components/bits/tooltip';
	import { getGlobalContext } from '$lib/client/app/global.svelte';

	let global = getGlobalContext();
	let openState = $state(false);
</script>

<div class="flex h-96 w-96 flex-col items-center justify-center">
	<TooltipZag
		open={openState}
		onOpenChange={(e) => (openState = e.open)}
		positioning={{ placement: global.isMobileBreakpoint ? 'bottom' : 'right' }}
		openDelay={0}
		closeDelay={0}
		arrow={true}
	>
		{#snippet trigger()}Zag.js{/snippet}
		{#snippet content()}This is a Zag.js tooltip.{/snippet}
	</TooltipZag>
	<TooltipBits contentProps={{ side: global.isMobileBreakpoint ? 'bottom' : 'right' }}>
		{#snippet trigger()}Bits UI{/snippet}
		This is a Bits UI tooltip.
	</TooltipBits>
</div>
