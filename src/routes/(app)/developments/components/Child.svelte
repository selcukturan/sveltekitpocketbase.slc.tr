<script>
	import { getContext } from 'svelte';

	const counter = getContext('counter');
</script>

<p>{counter.count}</p>
