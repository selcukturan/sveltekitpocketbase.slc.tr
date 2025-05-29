<script lang="ts">
	import { getForm } from './forms.svelte';

	let { class: classes }: { class?: string } = $props();

	// Get Context
	const ctx = getForm();
	console.log('iTextbox', ctx.test);
</script>

<input type="text" class={classes} />
