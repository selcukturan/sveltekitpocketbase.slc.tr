<script lang="ts">
	import { Boundary } from '$lib/components/base/boundary';
	import '$lib/css/app.css';
	let { children } = $props();
</script>

<Boundary>
	{@render children?.()}
</Boundary>
