<script lang="ts">
	import { Select, type WithoutChildren } from 'bits-ui';

	type Props = WithoutChildren<Select.RootProps> & {
		placeholder?: string;
		items: { value: string; label: string; disabled?: boolean }[];
		contentProps?: WithoutChildren<Select.ContentProps>;
		// any other specific component props if needed
	};

	let { value = $bindable(), items, contentProps, placeholder = 'Select an item', ...restProps }: Props = $props();

	const selectedLabel = $derived(items.find((item) => item.value === value)?.label);
</script>

<!--
TypeScript Discriminated Unions + destructing (required for "bindable") do not
get along, so we shut typescript up by casting `value` to `never`, however,
from the perspective of the consumer of this component, it will be typed appropriately.
-
TypeScript Discriminated Unions + destructing ("bindable" için gereklidir)
anlaşamaz, bu nedenle `value` değerini `never` değerine dönüştürerek typescript'i sustururuz, ancak
bu bileşenin tüketicisinin bakış açısından, uygun şekilde yazılacaktır.
-->
<Select.Root bind:value={value as never} {...restProps}>
	<Select.Trigger
		class="data-placeholder:text-surface-800/50 bg-surface-100 inline-flex h-12 w-72 touch-none items-center border select-none"
		aria-label="Select"
	>
		{selectedLabel ? selectedLabel : placeholder}
	</Select.Trigger>
	<Select.Portal>
		<Select.Content
			{...contentProps}
			class="bg-surface-100 z-50 h-96 max-h-128 min-h-10 w-72 min-w-10 overflow-x-hidden overflow-y-auto border shadow-sm select-none"
			sideOffset={1}
		>
			{#each items as { value, label, disabled } (value)}
				<Select.Item
					{value}
					{label}
					{disabled}
					class="data-highlighted:bg-error-200 data-selected:bg-warning-200 flex h-10 w-full items-center py-3 pr-1.5 pl-5 capitalize outline-hidden select-none data-disabled:opacity-50"
				>
					{#snippet children({ selected })}
						{selected ? '✅' : ''}
						{label}
					{/snippet}
				</Select.Item>
			{/each}
		</Select.Content>
	</Select.Portal>
</Select.Root>
