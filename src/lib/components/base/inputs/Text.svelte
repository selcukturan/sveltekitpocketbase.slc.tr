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

	function format(raw: string) {
		return raw ?? '';
	}
	function parse(raw: string) {
		return raw ?? '';
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
		{...field.as('text')}
		bind:value={input.value}
		onchange={() => onchange?.(value)}
		class={classes}
		{...attributes}
	/>

	{#each field.issues() ?? [] as issue}
		<p class="issue">{issue.message}</p>
	{/each}
</label>
