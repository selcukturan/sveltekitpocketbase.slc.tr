<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import { type Snippet } from 'svelte';
	import { fly } from 'svelte/transition';

	type Props = Tooltip.RootProps & {
		trigger: Snippet;
		children: Snippet;
		triggerProps?: Tooltip.TriggerProps;
		contentProps?: Tooltip.ContentProps;
	};

	let { trigger, children, triggerProps = {}, contentProps = {}, open = $bindable(false), ...rootProps }: Props = $props();
</script>

<Tooltip.Root bind:open {...rootProps}>
	<Tooltip.Trigger {...triggerProps}>
		{@render trigger?.()}
	</Tooltip.Trigger>
	<Tooltip.Portal>
		<Tooltip.Content sideOffset={8} forceMount {...contentProps} class="z-999999">
			{#snippet child({ wrapperProps, props, open })}
				{#if open}
					<div {...wrapperProps}>
						<div {...props} transition:fly={{ y: 3, duration: 150 }}>
							<div class="bg-surface-950 text-surface-50 rounded-sm px-1.5 py-1 text-sm font-semibold">
								{@render children?.()}
							</div>
						</div>
					</div>
				{/if}
			{/snippet}
		</Tooltip.Content>
	</Tooltip.Portal>
</Tooltip.Root>
