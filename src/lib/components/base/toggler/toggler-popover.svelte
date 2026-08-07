<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import type { Snippet } from 'svelte';
	import { on } from 'svelte/events';

	type Placement = `${'top' | 'bottom'}-${'start' | 'center' | 'end'}` | `${'left' | 'right'}-${'start' | 'center' | 'end'}`;

	type Props = Omit<SvelteHTMLElements['div'], 'children'> & {
		id?: string;
		placement?: Placement;
		matchTriggerWidth?: boolean;
		trigger?: Snippet<
			[
				{
					active: boolean;
					toggle: () => void;
					open: () => void;
					close: () => void;
					attr: {
						type: 'button';
						id: string;
						popovertarget: string;
						style: string;
					};
				}
			]
		>;
		children?: Snippet<[{ close: () => void }]>;
	};

	const uid = $props.id();

	let { id = uid, placement = 'bottom-start', matchTriggerWidth = false, class: classes = '', trigger, children, ...rest }: Props = $props();

	let active = $state(false);
	let popoverEl = $state<HTMLDivElement | null>(null);
	const popovertarget = $derived(`${id}-popover`);
	const anchorname = $derived(`--${id}-anchor`);
	const attr = $derived({
		type: 'button' as const,
		style: 'anchor-name:var(--anchor)',
		id,
		popovertarget,
		'aria-expanded': active,
		'aria-haspopup': 'true' as const
	});

	export const toggle = () => popoverEl?.togglePopover();
	export const open = () => !active && popoverEl?.showPopover();
	export const close = () => active && popoverEl?.hidePopover();
	export const states = {
		get active() {
			return active;
		}
	};

	const popoverEvents = (node: HTMLElement) => {
		const destroyToggle = on(node, 'toggle', (e: ToggleEvent) => {
			active = e.newState === 'open';
		});

		return () => {
			destroyToggle();
		};
	};
</script>

<div class="container" style:--anchor={anchorname}>
	<!-- Trigger -->
	{@render trigger?.({ active, toggle, open, close, attr })}

	<!-- Popover -->
	<div
		bind:this={popoverEl}
		id={popovertarget}
		popover="auto"
		{@attach popoverEvents}
		class="popover {placement} {classes}"
		class:match-width={matchTriggerWidth}
		{...rest}
	>
		{@render children?.({ close })}
	</div>
</div>

<style>
	.container {
		display: inline-block;
	}

	.popover {
		position-anchor: var(--anchor);

		/* reset */
		inset: auto;
		position: fixed;
		margin: 0;
		padding: 0;
		box-sizing: border-box;
		background: transparent;
		border: none;
		outline: none;

		/* size */
		min-width: min(var(--min-width, anchor-size(width)), 100%);
		width: max-content;
		max-width: min(calc(100% - var(--gutter, 5px) * 2), var(--max-width, 100vw));

		min-height: var(--min-height, auto);
		height: max-content;
		max-height: min(calc(100% - var(--gutter, 5px) * 2), var(--max-height, 100dvh));

		overflow: auto;

		border: var(--border, solid 1px color-mix(in srgb, currentColor 80%, white 20%));
		border-radius: var(--border-radius, 10px);
		background-color: var(--background-color, color-mix(in srgb, currentColor 1%, white 99%));
		box-shadow: var(--box-shadow, 0 8px 24px rgb(0 0 0 / 0.12));
	}

	/* .popover:popover-open {
		display: grid;
		grid-template-rows: minmax(0, 1fr);
	} */

	.popover.match-width {
		width: min(anchor-size(width), 100%);
		min-width: 0;
	}

	/* --- CSS Anchor Positioning --- */

	/* Alt/üst yönler */
	.bottom-start,
	.bottom-center,
	.bottom-end,
	.top-start,
	.top-center,
	.top-end {
		position-try-fallbacks:
			flip-block,
			flip-block flip-inline;
		/* position-try-order: most-block-size; */
	}

	/* Sol/sağ yönler — bunlarda flip-inline gerekir */
	.left-start,
	.left-center,
	.left-end,
	.right-start,
	.right-center,
	.right-end {
		position-try-fallbacks:
			flip-inline,
			flip-inline flip-block;
		/* position-try-order: most-inline-size; */
	}

	/* Alt yönler: anchor'ın altında, üstünde boşluk */
	.bottom-start {
		position-area: block-end span-inline-end;
		margin-block: var(--gutter, 5px);
	}
	.bottom-center {
		position-area: block-end span-all;
		margin-block: var(--gutter, 5px);
	}
	.bottom-end {
		position-area: block-end span-inline-start;
		margin-block: var(--gutter, 5px);
	}

	/* Üst yönler: anchor'ın üstünde, altında boşluk */
	.top-start {
		position-area: block-start span-inline-end;
		margin-block: var(--gutter, 5px);
	}
	.top-center {
		position-area: block-start span-all;
		margin-block: var(--gutter, 5px);
	}
	.top-end {
		position-area: block-start span-inline-start;
		margin-block: var(--gutter, 5px);
	}

	/* Sol yönler: anchor'ın solunda, sağında boşluk */
	.left-start {
		position-area: inline-start span-block-end;
		margin-inline: var(--gutter, 5px);
	}
	.left-center {
		position-area: inline-start span-all;
		margin-inline: var(--gutter, 5px);
	}
	.left-end {
		position-area: inline-start span-block-start;
		margin-inline: var(--gutter, 5px);
	}

	/* Sağ yönler: anchor'ın sağında, solunda boşluk */
	.right-start {
		position-area: inline-end span-block-end;
		margin-inline: var(--gutter, 5px);
	}
	.right-center {
		position-area: inline-end span-all;
		margin-inline: var(--gutter, 5px);
	}
	.right-end {
		position-area: inline-end span-block-start;
		margin-inline: var(--gutter, 5px);
	}
</style>
