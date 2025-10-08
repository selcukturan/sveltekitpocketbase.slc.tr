<script lang="ts">
	import { ScrollState, AnimationFrames, ElementSize } from 'runed';
	import { getFullList } from '$lib/remotes/tabulator.remote';

	let promise = $derived(getFullList(''));
	let filter = $derived(await promise);
	let data = $derived(filter.items);

	let el = $state<HTMLElement>();
	let behavior = $state('smooth');
	const scroll = new ScrollState({
		element: () => el,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any -- for some reason ScrollBehavior is not defined
		behavior: () => behavior as any
	});

	// --- YENİ EKLENEN KISIM BAŞLANGICI ---
	const size = new ElementSize(() => el);
	// 1. scroll.y'yi doğrudan kullanmak yerine, bu değişkeni AnimationFrames ile güncelleyeceğiz.
	let throttledY = $state(0);
	let frames = $state(0);
	let fpsLimit = $state(60); // Varsayılan bir FPS limiti belirleyelim.
	let delta = $state(0);
	// 2. AnimationFrames'in geri çağırma fonksiyonunu güncelliyoruz.
	// Her animasyon karesinde, o anki scroll.y değerini throttledY'ye atar.
	const animation = new AnimationFrames(
		(args) => {
			// scroll.y'nin en güncel değerini throttledY'ye atayarak güncellemeyi tetikliyoruz.
			frames++;
			throttledY = scroll.y;
			delta = args.delta;
		},
		{ fpsLimit: () => fpsLimit }
	);

	// Animasyonun sayfa yüklendiğinde otomatik başlamasını sağlar.
	/* $effect(() => {
		animation.start();
	}); */

	// --- YENİ EKLENEN KISIM SONU ---

	// 3. virtualData'yı 'scroll.y' yerine 'throttledY'den türetiyoruz.
	// Bu sayede, bu pahalı hesaplama sadece throttledY değiştiğinde,
	// yani belirlediğimiz FPS limitinde çalışır.
	let virtualData = $derived.by(() => {
		const overscan = 10; // Görünür alandan önce ve sonra kaç satır yükleneceğini belirler
		const rawData = data;
		const totalRows = rawData.length;
		const rowHeight = 35;
		const clientHeight = size.height || 0;
		const startIndex = Math.max(
			0,
			Math.floor(throttledY / rowHeight) - overscan
		);
		const endIndex = Math.min(
			totalRows - 1,
			Math.floor((throttledY + clientHeight) / rowHeight) + overscan
		);

		const processedData: {
			data: (typeof rawData)[number];
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
	style="    overflow: hidden;
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
			<div
				role="columnheader"
				style:position="sticky"
				style:top={0}
				style:background="var(--color-surface-200)"
			>
				index
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:top={0}
				style:background="var(--color-surface-200)"
			>
				id
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:top={0}
				style:background="var(--color-surface-200)"
			>
				producer
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:top={0}
				style:background="var(--color-surface-200)"
			>
				province
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:top={0}
				style:background="var(--color-surface-200)"
			>
				grape
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:top={0}
				style:background="var(--color-surface-200)"
			>
				price
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:top={0}
				style:background="var(--color-surface-200)"
			>
				quantity
			</div>
			<div
				role="columnheader"
				style:position="sticky"
				style:top={0}
				style:background="var(--color-surface-200)"
			>
				amount
			</div>
		</div>

		{#each virtualData as rowWrapper, ri (rowWrapper.data.id)}
			{@const data = rowWrapper.data}
			{@const index = rowWrapper.originalIndex}
			{@const rowStart = index + 2}
			{@const background =
				index % 2 === 0
					? 'var(--color-surface-100)'
					: 'var(--color-surface-50)'}

			<div role="row" style:display="contents">
				<div
					role="cell"
					style:grid-row-start={rowStart}
					style:background
					style:grid-column={`1 / 2`}
				>
					{index}
				</div>
				<div
					role="cell"
					style:grid-row-start={rowStart}
					style:background
					style:grid-column={`2 / 3`}
				>
					{data.id}
				</div>
				<div
					role="cell"
					style:grid-row-start={rowStart}
					style:background
					style:grid-column={`3 / 4`}
				>
					{data.producer}
				</div>
				<div
					role="cell"
					style:grid-row-start={rowStart}
					style:background
					style:grid-column={`4 / 5`}
				>
					{data.province}
				</div>
				<div
					role="cell"
					style:grid-row-start={rowStart}
					style:background
					style:grid-column={`5 / 6`}
				>
					{data.grape}
				</div>
				<div
					role="cell"
					style:grid-row-start={rowStart}
					style:background
					style:grid-column={`6 / 7`}
				>
					{data.price}
				</div>
				<div
					role="cell"
					style:grid-row-start={rowStart}
					style:background
					style:grid-column={`7 / 8`}
				>
					{data.quantity}
				</div>
				<div
					role="cell"
					style:grid-row-start={rowStart}
					style:background
					style:grid-column={`8 / 9`}
				>
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
