<script lang="ts">
	import DateTime from '$lib/components/ui/inputs/devdatetime/DateTime.svelte';
	import Text from '$lib/components/ui/inputs/devtext/Text.svelte';

	let datetimevalue: string | undefined = $state('');
	let value: string | undefined = $state('');
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	<div class="hidden bg-success-100 p-1">
		<h6>InputText</h6>
	</div>
	<div class="relative flex flex-1 gap-y-5 overflow-y-auto overflow-x-hidden p-1">
		<div class="flex w-1/2 flex-col gap-y-5">
			<Text bind:value placeholder="InputText" />
			<p>
				Value: {value}, Type: {typeof value}
			</p>
			<input type="text" placeholder="Native Input 1" bind:value class="max-w-xs bg-transparent" />
			<input type="text" placeholder="Native Input 2" bind:value class="max-w-xs bg-transparent" />
		</div>
		<div class="flex w-1/2 flex-col gap-y-5">
			<DateTime bind:value={datetimevalue} />
			<p>
				Value: {datetimevalue}, Type: {typeof datetimevalue}
			</p>
			<input type="datetime-local" bind:value={datetimevalue} class="max-w-xs bg-transparent" />
			<input type="datetime-local" bind:value={datetimevalue} class="max-w-xs bg-transparent" />
		</div>
	</div>
	<div class="hidden bg-warning-100 p-1">
		<h6>InputText</h6>
	</div>
</div>
