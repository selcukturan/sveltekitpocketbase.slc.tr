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

	function setFormValue(val: string | undefined) {
		value = cntrts?.required && val === '' ? undefined : val;
	}

	let proxy = {
		get pvalue(): string | undefined {
			setFormValue(inputInitialValue);
			return inputInitialValue;
		},
		set pvalue(val: string) {
			setFormValue(val);
		}
	};
</script>

<div>
	<input type="text" bind:value={proxy.pvalue} aria-invalid={errors ? 'true' : undefined} class={classes} {...attributes} />
	<Popup show={errors ? true : false}>{errors}</Popup>
</div>
