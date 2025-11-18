<script lang="ts">
	// ######################## IMPORTS #################################################################################################
	import type { RemoteFormField } from '@sveltejs/kit';
	import type { HTMLInputAttributes } from 'svelte/elements';
	// ######################## PROPS TYPE ##############################################################################################
	type Props = Omit<HTMLInputAttributes, 'value' | 'oninput' | 'onchange'> & {
		value?: number;
		label?: string;
		oninput?: (value: number) => void;
		onchange?: (value: number) => void;
		field: RemoteFormField<number>;
	};
	// ######################## PROPS ###################################################################################################
	let { value = $bindable(0), label, oninput, onchange, field, class: classes, ...attributes }: Props = $props();

	// Dışarıdan gelen number tipindeki değeri input'ta gösterilecek string'e çevirir.
	function format(raw: number): string {
		// Eğer değer null, undefined veya NaN ise boş string döndür.
		if (raw == null || isNaN(raw)) {
			return '';
		}
		return String(raw);
	}

	// Input'tan gelen string değeri number tipine çevirir.
	function parse(raw: string): number {
		// Eğer input boşsa veya sayıya dönüştürülemiyorsa 0 döndür.
		const parsed = parseFloat(raw);
		return isNaN(parsed) ? 0 : parsed; // Boş string ('') parseFloat ile NaN olur, bu da 0 döndürür.
	}

	const input = {
		currentValue: undefined as string | undefined,
		get value() {
			if (this.currentValue === undefined) {
				this.currentValue = format(value);
				oninput?.(value);
			}
			return this.currentValue;
		},
		set value(val: string) {
			this.currentValue = val;
			value = parse(val);
			oninput?.(value);
		}
	};
</script>

<label>
	<h2>{label}</h2>
	<input
		{...field.as('number')}
		bind:value={input.value}
		onchange={() => onchange?.(value)}
		class={classes}
		{...attributes}
	/>

	{#each field.issues() ?? [] as issue}
		<p class="issue">{issue.message}</p>
	{/each}
</label>
