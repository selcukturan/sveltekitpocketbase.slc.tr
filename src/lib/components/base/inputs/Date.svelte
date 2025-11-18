<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value' | 'oninput' | 'onchange'> & {
		value?: string;
		label?: string;
		oninput?: (value: string) => void;
		onchange?: (value: string) => void;
		field: RemoteFormField<string>;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(''), label, oninput, onchange, field, class: classes, ...attributes }: Props = $props();

	// "2025-11-21T10:00:00.000Z" -> "2025-11-21"
	function format(isoString: string) {
		if (!isoString) return '';
		return isoString.slice(0, 10);
	}
	// "2025-11-21" -> "2025-11-21T00:00:00.000Z"
	function parse(localDateTime: string) {
		if (!localDateTime) return ''; // Input boşsa boş döndür.
		// Olası zaman dilimi belirsizliklerini önlemek amacıyla,
		// UTC gece yarısı olarak ayrıştırıldığından emin olmak için saat ve UTC göstergesi eklenir.
		return new Date(`${localDateTime}T00:00:00.000Z`).toISOString();
	}

	const input = {
		currentValue: undefined as string | undefined,
		get value() {
			if (this.currentValue === undefined) {
				this.currentValue = format(value); // initial input value
				oninput?.(value);
			}
			return this.currentValue;
		},
		set value(val) {
			this.currentValue = val;
			value = parse(this.currentValue);
			oninput?.(value);
		}
	};
</script>

<label>
	<h2>{label}</h2>
	<input
		{...field.as('date')}
		bind:value={input.value}
		onchange={() => onchange?.(value)}
		class={classes}
		{...attributes}
	/>

	{#each field.issues() ?? [] as issue}
		<p class="issue">{issue.message}</p>
	{/each}
</label>
