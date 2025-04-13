<script lang="ts">
	import InputDateTime from '$lib/components/inputs/InputDateTime.svelte';
	let value = $state(new Date());
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	<div class="bg-success-100 p-1">
		<h6>Tests Root Header</h6>
	</div>
	<div class="relative flex-1 overflow-x-hidden overflow-y-auto p-1">
		<InputDateTime
			bind:value
			onchange={() => {
				console.log('onchange');
			}}
			class="border-1 border-amber-600"
		/>

		<button
			onclick={() => {
				value = new Date();
			}}
		>
			Set Value
		</button>
		<div>{value}</div>
	</div>
	<div class="bg-warning-100 p-1">
		<h6>Tests Root Footer</h6>
	</div>
</div>
