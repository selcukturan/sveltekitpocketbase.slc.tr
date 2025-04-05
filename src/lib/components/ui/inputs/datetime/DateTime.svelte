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
		// Eğer tarihleri "YYYY-MM-DD" formatında göstermek istiyorsanız, "en-CA" kanada yerel ayarını kullanabilirsiniz.
		if (!val) {
			value = cntrts?.required ? undefined : '';
			return;
		}

		const date = new Date(val);
		if (isNaN(date.getTime())) {
			value = cntrts?.required ? undefined : '';
		} else {
			value =
				date
					.toLocaleString('en-CA', {
						timeZone: 'Europe/Istanbul',
						hour12: false,
						day: '2-digit',
						month: '2-digit',
						year: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit',
						fractionalSecondDigits: 3
					})
					.replace(',', '') + 'Z';
		}
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
	<input type="datetime-local" bind:value={proxy.pvalue} class={classes} pattern={`\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}`} {...attributes} />
	<Popup show={errors ? true : false}>{errors}</Popup>
</div>
