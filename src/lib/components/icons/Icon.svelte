<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';
	import type { IconKey } from './icons.svelte';

	// Bu yöntem, 'string' türünü kabul ederken IDE'lerde sabit türler için otomatik tamamlama özelliğini korur
	type IconName = IconKey | (string & {});

	interface Props extends SVGAttributes<SVGElement> {
		name: IconName;
		size?: string | number;
		strokeWidth?: string | number;
	}

	let { name, size = 24, strokeWidth = 2, class: classes, ...restProps }: Props = $props();
</script>

<svg
	class={`${classes || ''} slc-icon`}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	{...restProps}
>
	<use href="#{name}" />
</svg>

<style>
	.slc-icon {
		display: inline-block;
		vertical-align: middle;
		flex-shrink: 0;
	}
</style>
