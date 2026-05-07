<script lang="ts">
	import '$lib/css/app.css';
	import { Icons } from '$lib/components/icons';

	let { children } = $props();
</script>

<Icons />

{@render children?.()}
