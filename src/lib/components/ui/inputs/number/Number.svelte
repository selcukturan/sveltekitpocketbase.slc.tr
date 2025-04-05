<script lang="ts">
	import Popup from '../common/Popup.svelte';
	import type { Props } from './types';

	let {
		value = $bindable(undefined),
		label,
		class: classes,
		variant = undefined,
		size = undefined,
		errors,
		constraints,
		...attributes
	}: Props = $props();

	const inputInitialValue = value;
	const cntrts = constraints;
	/* $effect(() => {cntrts = constraints;}); */

	function setFormValue(val: number | undefined) {
		value = cntrts?.required && val === 0 ? undefined : val;
	}

	let proxy = {
		get pvalue(): number | undefined {
			setFormValue(inputInitialValue);
			return inputInitialValue;
		},
		set pvalue(val: number) {
			setFormValue(val);
		}
	};
</script>

<div>
	<input type="number" bind:value={proxy.pvalue} class={classes} {...attributes} />
	<Popup show={errors ? true : false}>{errors}</Popup>
</div>
