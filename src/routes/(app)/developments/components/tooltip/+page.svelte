<script lang="ts">
	import { Tooltip } from '$lib/components/bits/tooltip';
	import { getGlobalContext } from '$lib/client/app/global.svelte';

	let global = getGlobalContext();
</script>

<div class="flex h-96 w-96 flex-col items-center justify-center">
	<Tooltip contentProps={{ side: global.isMobileBreakpoint ? 'bottom' : 'right' }}>
		{#snippet trigger()}Bits UI{/snippet}
		This is a Bits UI tooltip.
	</Tooltip>
</div>
