<script lang="ts">
	import * as select from '@zag-js/select';
	import { portal, useMachine, normalizeProps } from '@zag-js/svelte';

	const selectData = [
		{ label: 'Nigeria', value: 'NG' },
		{ label: 'Japan', value: 'JP' },
		{ label: 'Korea', value: 'KO' },
		{ label: 'Kenya', value: 'KE' },
		{ label: 'United Kingdom', value: 'UK' },
		{ label: 'Ghana', value: 'GH' },
		{ label: 'Uganda', value: 'UG' }
	];

	const collection = select.collection({
		items: selectData,
		itemToString: (item) => item.label,
		itemToValue: (item) => item.value
	});

	const id = $props.id();
	const service = useMachine(select.machine, {
		id,
		collection
	});
	const api = $derived(select.connect(service, normalizeProps));
</script>

<div {...api.getRootProps()}>
	<div {...api.getControlProps()}>
		<label {...api.getLabelProps()}>Label</label>
		<button class="form-select" {...api.getTriggerProps()}>
			{api.valueAsString || 'Select option'}
		</button>
	</div>

	<div use:portal {...api.getPositionerProps()}>
		<ul {...api.getContentProps()}>
			{#each selectData as item}
				<li {...api.getItemProps({ item })}>
					<span {...api.getItemTextProps({ item })}>{item.label}</span>
					<span {...api.getItemIndicatorProps({ item })}>✓</span>
				</li>
			{/each}
		</ul>
	</div>
</div>
