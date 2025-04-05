<script lang="ts">
	let { name, size = 20, class: classes }: { name: string; size?: string | number; class?: string } = $props();
</script>

<svg class={`${classes || ''} slc-icon`} width={size} height={size}>
	<use xlink:href="#{name}" />
</svg>

<style lang="postcss">
	.slc-icon {
		position: relative;
		overflow: hidden;
		vertical-align: middle;
		-o-object-fit: contain;
		object-fit: contain;
		-webkit-transform-origin: center center;
		transform-origin: center center;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
		fill: none;
	}
</style>
