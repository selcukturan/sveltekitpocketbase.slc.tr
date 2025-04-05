<script lang="ts">
	import type { Props } from './types';
	import { formatDate, clearFormattedDate } from './utils';

	let { value = $bindable(undefined), class: classes, ...attributes }: Props = $props();

	let inputElement: HTMLInputElement | null = null;
	const cntrts: { required: boolean } = { required: true };

	const handleOnInput = (e: Event) => {
		// Tum `input` degisikliklerini `value`'ya yazar
		const target = e.target as HTMLInputElement;
		value = formatDate(target.value, cntrts);
	};

	const handleInputValue = (value: Props['value']) => {
		// Tum `value` degisikliklerini `input`a yazar
		const currentValue = value ? clearFormattedDate(value) : '';
		if (inputElement?.value !== currentValue) return currentValue;
	};
</script>

<div>
	<input
		type="datetime-local"
		bind:this={inputElement}
		value={handleInputValue(value)}
		oninput={handleOnInput}
		class={classes}
		pattern={`\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}`}
		{...attributes}
	/>
	Input Value {`=>`}
	{value}
	{`=>`} typeof {typeof value}
</div>
