<script lang="ts">
	import { getGlobalContext } from '$lib/client/app/global.svelte';
	import tooltip from '$lib/client/actions/tooltip';

	const global = getGlobalContext();
</script>

<div class="flex h-96 w-96 flex-col items-center justify-center">
	<span use:tooltip={{ text: 'This is a SLC tooltip.', position: global.isMobileBreakpoint ? 'bottom' : 'right' }}>SLC WEB</span>
</div>
