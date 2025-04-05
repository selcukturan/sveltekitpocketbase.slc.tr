<script lang="ts">
	import { normalizeProps, useActor } from '@zag-js/svelte';
	import * as toast from '@zag-js/toast';
	import { Icon } from '$lib/components/icons';

	const { actor }: { actor: toast.Service } = $props();

	const [snapshot, send] = useActor(actor);
	const api = $derived(toast.connect(snapshot, send, normalizeProps));
</script>

<div {...api.getRootProps()}>
	<span {...api.getGhostBeforeProps()}></span>
	<div class="flex h-full items-center">
		<div class="pr-2">
			{#if api.type === 'info'}
				<Icon name="info" />
			{:else if api.type === 'error'}
				<Icon name="circle-x" />
			{:else if api.type === 'success'}
				<Icon name="circle-check" />
			{:else if api.type === 'warning'}
				<Icon name="circle-alert" />
			{:else if api.type === 'loading'}
				<div class="animate-spin">
					<Icon name="loader" />
				</div>
			{:else}
				<Icon name="circle" />
			{/if}
		</div>
		<div class="flex-1">
			<h3 {...api.getTitleProps()} class="text-sm font-bold">{api.title}</h3>
			<p {...api.getDescriptionProps()}>{api.description}</p>
		</div>
		<div>
			<!-- `api.action?.label` => normalde buradan ulaşılması lazım. surum bug'i olabilir. kontrol et. -->
			{#if snapshot?.context?.action?.label}
				<button
					type="button"
					class:action-info-btn={api.type === 'info'}
					class:action-success-btn={api.type === 'success'}
					class:action-warning-btn={api.type === 'warning'}
					class:action-error-btn={api.type === 'error'}
					class:action-loading-btn={api.type === 'loading'}
					{...api.getActionTriggerProps()}>{snapshot?.context?.action?.label}</button
				>
			{/if}
		</div>
		<div class="self-start">
			<button
				type="button"
				class:close-info-btn={api.type === 'info'}
				class:close-success-btn={api.type === 'success'}
				class:close-warning-btn={api.type === 'warning'}
				class:close-error-btn={api.type === 'error'}
				class:close-loading-btn={api.type === 'loading'}
				{...api.getCloseTriggerProps()}
				onclick={api.dismiss}
				aria-label="Kapat"
			>
				<Icon name="close" size="16px" />
			</button>
		</div>
	</div>
	<span {...api.getGhostAfterProps()}></span>
</div>

<style lang="postcss">
	[data-scope='toast'][data-part='root'] {
		@apply w-full break-words rounded-sm border p-2 shadow-lg sm:w-[420px];
		/* [overflow-wrap:anywhere] */
	}
	[data-scope='toast'][data-part='root'] {
		@apply z-[var(--z-index)] h-[var(--height)] opacity-[var(--opacity)] [scale:var(--scale)] [translate:var(--x)_var(--y)] [will-change:translate,opacity,scale];
	}
	[data-scope='toast'][data-part='root'] {
		@apply [transition-timing-function:cubic-bezier(0.21,1.02,0.73,1)] [transition:translate_400ms,scale_400ms,opacity_400ms];
	}
	[data-scope='toast'][data-part='root'][data-state='closed'] {
		@apply [transition-timing-function:cubic-bezier(0.06,0.71,0.55,1)] [transition:translate_400ms,scale_400ms,opacity_200ms];
	}
	[data-scope='toast'][data-part='root'][data-type='info'] {
		@apply border-info-token-600 bg-info-token-400 text-info-token-950;
	}
	[data-scope='toast'][data-part='root'][data-type='error'] {
		@apply border-error-token-600 bg-error-token-400 text-error-token-950;
	}
	[data-scope='toast'][data-part='root'][data-type='success'] {
		@apply border-success-token-600 bg-success-token-400 text-success-token-950;
	}
	[data-scope='toast'][data-part='root'][data-type='warning'] {
		@apply border-warning-token-600 bg-warning-token-400 text-warning-token-950;
	}
	[data-scope='toast'][data-part='root'][data-type='loading'] {
		@apply border-surface-token-600 bg-surface-token-400 text-surface-token-950;
	}
	/* action-trigger */
	[data-scope='toast'][data-part='action-trigger'] {
		@apply mx-2 rounded-sm px-2 py-1;
	}
	.action-info-btn {
		@apply border border-info-token-600 bg-info-token-500/50 hover:bg-info-token-500 active:bg-info-token-300/80;
	}
	.action-success-btn {
		@apply border border-success-token-600 bg-success-token-500/50 hover:bg-success-token-500 active:bg-success-token-300/80;
	}
	.action-warning-btn {
		@apply border border-warning-token-600 bg-warning-token-500/50 hover:bg-warning-token-500 active:bg-warning-300/80;
	}
	.action-error-btn {
		@apply border border-error-token-600 bg-error-token-500/50 hover:bg-error-token-500 active:bg-error-300/80;
	}
	.action-loading-btn {
		@apply border border-surface-token-600 bg-surface-token-500/50 hover:bg-surface-token-500 active:bg-surface-300/80;
	}
	/* close-trigger */
	[data-scope='toast'][data-part='close-trigger'] {
		@apply inline-flex h-6 w-6 transform cursor-pointer select-none items-center justify-center rounded-full text-center align-middle leading-none;
	}
	.close-info-btn {
		@apply border border-info-token-600 bg-info-token-300/50 hover:bg-info-token-300 active:bg-info-token-300/80;
	}
	.close-success-btn {
		@apply border border-success-token-600 bg-success-token-300/50 hover:bg-success-token-300 active:bg-success-token-300/80;
	}
	.close-warning-btn {
		@apply border border-warning-token-600 bg-warning-token-300/50 hover:bg-warning-token-300 active:bg-warning-token-300/80;
	}
	.close-error-btn {
		@apply border border-error-token-600 bg-error-token-300/50 hover:bg-error-token-300 active:bg-error-token-300/80;
	}
	.close-loading-btn {
		@apply border border-surface-token-600 bg-surface-token-300/50 hover:bg-surface-token-300 active:bg-surface-token-300/80;
	}
	/* Overlap'in arkasinda kalan ve tasma ihtimali olan uzun metinler icin toast'lara `overflow-hidden` uygular */
	[data-scope='toast'][data-part='root'][data-sibling][data-overlap] {
		@apply overflow-hidden;
	}
</style>
