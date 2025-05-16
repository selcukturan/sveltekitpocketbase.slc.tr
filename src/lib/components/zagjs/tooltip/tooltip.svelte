<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import { type Snippet } from 'svelte';

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
		{@render trigger()}
	</Tooltip.Trigger>
	<Tooltip.Portal>
		<Tooltip.Content {...contentProps}>
			<Tooltip.Arrow />
			{@render children()}
		</Tooltip.Content>
	</Tooltip.Portal>
</Tooltip.Root>
