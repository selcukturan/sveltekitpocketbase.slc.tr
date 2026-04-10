<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value'> & {
		value: string;
		field?: RemoteFormField<string>;
	};
	// ######################## PROPS ###################################################################################################
	let { value, field, ...attributes }: Props = $props();
	// ######################## VARIABLES ###############################################################################################

	let inputAttributes = $derived(field ? field.as('hidden', value) : { type: 'hidden' });
</script>

<input {...inputAttributes} {...attributes} />

<!-- 
{#each field?.issues() ?? [] as issue}
	<p class="issue">{issue.message}</p>
{/each} 
-->
