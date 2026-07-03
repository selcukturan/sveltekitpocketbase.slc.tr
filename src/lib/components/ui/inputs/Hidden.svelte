<script lang="ts">
	import type { HiddenProps, HiddenValueChangeArgs } from './type';

	let { value = $bindable(''), onValueChange, ...rest }: HiddenProps = $props();

	// ############################### BEGIN ONVALUECHANGE HANDLER ###############################
	const triggerChange = ({ value, beforeValue, initial }: HiddenValueChangeArgs) => {
		onValueChange?.({ value, beforeValue, initial });
	};
	// ############################### END ONVALUECHANGE HANDLER ###############################

	// ############################### BEGIN PROXY ###############################
	let first = true;
	let lastValue = value;
	const proxy = {
		get value() {
			const currentValue = value;
			if (first) {
				first = false;
				const tempBefore = lastValue;
				lastValue = currentValue;
				triggerChange({ value: currentValue, beforeValue: tempBefore, initial: true });
			} else if (currentValue !== lastValue) {
				const tempBefore = lastValue;
				lastValue = currentValue;
				triggerChange({ value: currentValue, beforeValue: tempBefore, initial: false });
			}
			return currentValue;
		},
		set value(v) {
			if (v !== value) {
				const tempBefore = lastValue;
				value = v;
				lastValue = value;
				triggerChange({ value, beforeValue: tempBefore, initial: false });
			}
		}
	};
	// ############################### END PROXY ###############################
</script>

<input type="hidden" bind:value={proxy.value} {...rest} />
