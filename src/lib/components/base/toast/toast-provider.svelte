<script lang="ts">
	import ToastItem from './toast-item.svelte';
	import { setToast } from './toasts.svelte';

	const { id, children }: { id: string; children: any } = $props();
	const api = setToast(id);
</script>

{@render children?.()}

{#each api.getPlacements() as placement}
	<div {...api.getGroupProps({ placement })}>
		{#each api.getToastsByPlacement(placement) as toast (toast.id)}
			<ToastItem actor={toast} />
		{/each}
	</div>
{/each}
