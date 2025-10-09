<script lang="ts" generics="TData extends Record<string, unknown>">
	import { ScrollState, AnimationFrames, ElementSize } from 'runed';

	let { results }: { results: TData[] } = $props();

	let el = $state<HTMLElement>();

	const size = new ElementSize(() => el);
	const scroll = new ScrollState({ element: () => el });

	let throttledY = $state(0); // trigger
	let fpsLimit = $state(60);
	let frames = $state(0);
	let delta = $state(0);
	const animation = new AnimationFrames(
		(args) => {
			frames++;
			delta = args.delta;
			throttledY = scroll.y;
		},
		{ fpsLimit: () => fpsLimit }
	);

	let virtualData = $derived.by(() => {
		const y = throttledY; // trigger
		const overscan = 10;
		const rawData = results; // trigger
		const totalRows = rawData.length; // trigger
		const rowHeight = 35;
		const clientHeight = size.height; // trigger
		const startIndex = Math.max(0, Math.floor(y / rowHeight) - overscan);
		const endIndex = Math.min(totalRows - 1, Math.floor((y + clientHeight) / rowHeight) + overscan);

		const processedData: {
			data: TData;
			originalIndex: number;
		}[] = [];

		for (let i = startIndex; i <= endIndex; i++) {
			const row = rawData[i];
			if (row) {
				processedData.push({ data: row, originalIndex: i });
			}
		}

		return processedData;
	});
</script>

<div
	style="overflow: hidden;
    contain: inline-size;
    width: 100%;
    height: 100%;"
>
	<div
		bind:this={el}
		role="grid"
		style:overflow="auto"
		style:grid-template-rows={`repeat(1, 35px) repeat(1000, 35px) repeat(1, 35px)`}
		style:grid-template-columns={`minmax(75px, 1fr) minmax(75px, 1fr) minmax(75px, 1fr)
					minmax(75px, 1fr) minmax(75px, 1fr) minmax(75px, 1fr) minmax(75px,1fr)`}
		style={`display: grid;
            block-size: 100%;
            contain: content;
            content-visibility: auto;
            box-sizing: border-box;
            overflow: auto;
            background-color: var(--color-surface-50);`}
	>
		<div role="row" style:display="contents">
			<div role="columnheader" style:position="sticky" style:top={0} style:background="var(--color-surface-200)">
				index
			</div>
			<div role="columnheader" style:position="sticky" style:top={0} style:background="var(--color-surface-200)">
				id
			</div>
			<div role="columnheader" style:position="sticky" style:top={0} style:background="var(--color-surface-200)">
				producer
			</div>
			<div role="columnheader" style:position="sticky" style:top={0} style:background="var(--color-surface-200)">
				province
			</div>
			<div role="columnheader" style:position="sticky" style:top={0} style:background="var(--color-surface-200)">
				grape
			</div>
			<div role="columnheader" style:position="sticky" style:top={0} style:background="var(--color-surface-200)">
				price
			</div>
			<div role="columnheader" style:position="sticky" style:top={0} style:background="var(--color-surface-200)">
				quantity
			</div>
			<div role="columnheader" style:position="sticky" style:top={0} style:background="var(--color-surface-200)">
				amount
			</div>
		</div>

		{#each virtualData as rowWrapper, virtualIndex (rowWrapper.data.id)}
			{@const data = rowWrapper.data}
			{@const originalIndex = rowWrapper.originalIndex}
			{@const rowStart = originalIndex + 2}
			{@const background = originalIndex % 2 === 0 ? 'var(--color-surface-100)' : 'var(--color-surface-50)'}

			<div role="row" style:display="contents">
				<div role="cell" style:grid-row-start={rowStart} style:background style:grid-column={`1 / 2`}>
					{originalIndex}
				</div>
				<div role="cell" style:grid-row-start={rowStart} style:background style:grid-column={`2 / 3`}>
					{data.id}
				</div>
				<div role="cell" style:grid-row-start={rowStart} style:background style:grid-column={`3 / 4`}>
					{data.producer}
				</div>
				<div role="cell" style:grid-row-start={rowStart} style:background style:grid-column={`4 / 5`}>
					{data.province}
				</div>
				<div role="cell" style:grid-row-start={rowStart} style:background style:grid-column={`5 / 6`}>
					{data.grape}
				</div>
				<div role="cell" style:grid-row-start={rowStart} style:background style:grid-column={`6 / 7`}>
					{data.price}
				</div>
				<div role="cell" style:grid-row-start={rowStart} style:background style:grid-column={`7 / 8`}>
					{data.quantity}
				</div>
				<div role="cell" style:grid-row-start={rowStart} style:background style:grid-column={`8 / 9`}>
					{data.amount}
				</div>
			</div>
		{/each}
		<div role="row" style:display="contents">
			<div
				role="columnheader"
				style:position="sticky"
				style:bottom={0}
				style:background="var(--color-surface-200)"
				style:grid-row-start={1002}
				style:grid-column={`1 / 2`}
			>
				<div>
					fps: {fpsLimit} / {animation.fps.toFixed(0)}
				</div>
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:bottom={0}
				style:background="var(--color-surface-200)"
				style:grid-row-start={1002}
				style:grid-column={`2 / 3`}
			>
				<div>
					delta: 16.67 / {delta.toFixed(2)}
				</div>
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:bottom={0}
				style:background="var(--color-surface-200)"
				style:grid-row-start={1002}
				style:grid-column={`3 / 4`}
			>
				<div>frames: {frames}</div>
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:bottom={0}
				style:background="var(--color-surface-200)"
				style:grid-row-start={1002}
				style:grid-column={`4 / 5`}
			>
				<div>province</div>
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:bottom={0}
				style:background="var(--color-surface-200)"
				style:grid-row-start={1002}
				style:grid-column={`5 / 6`}
			>
				<div>grape</div>
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:bottom={0}
				style:background="var(--color-surface-200)"
				style:grid-row-start={1002}
				style:grid-column={`6 / 7`}
			>
				<div>price</div>
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:bottom={0}
				style:background="var(--color-surface-200)"
				style:grid-row-start={1002}
				style:grid-column={`7 / 8`}
			>
				<div>quantity</div>
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:bottom={0}
				style:background="var(--color-surface-200)"
				style:grid-row-start={1002}
				style:grid-column={`8 / 9`}
			>
				<div>amount</div>
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:bottom={0}
				style:background="var(--color-surface-200)"
				style:grid-row-start={1002}
				style:grid-column={`7 / 8`}
			>
				<div>quantity</div>
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:bottom={0}
				style:background="var(--color-surface-200)"
				style:grid-row-start={1002}
				style:grid-column={`8 / 9`}
			>
				<div>amount</div>
			</div>
		</div>
	</div>
</div>
