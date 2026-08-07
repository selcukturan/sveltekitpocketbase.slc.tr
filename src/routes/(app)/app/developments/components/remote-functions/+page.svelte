<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { TogglerPopover as Toggler } from '$lib/components/base/toggler'; // Bileşeninizi import ettiğiniz yer

	// Test edilecek tüm placement kombinasyonları
	const placements = [
		'top-start',
		'top-center',
		'top-end',
		'bottom-start',
		'bottom-center',
		'bottom-end',
		'left-start',
		'left-center',
		'left-end',
		'right-start',
		'right-center',
		'right-end'
	] as const;

	let toggl = $state<ReturnType<typeof Toggler> | null>(null);
	let pointerType = $state('init');
</script>

<Head>
	<title>Remote [command] - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Remote [command]</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<main class="test-container">
				<h1>Popover Toggler - Placement Test Showcase</h1>
				<p class="subtitle">Her yön kombinasyonunun konumlanmasını ve genişlik davranışını aşağıdaki testlerden kontrol edebilirsiniz.</p>

				<!-- Section 1: 12 Yön Hizalama Gridi -->
				<section class="card">
					<h2>1. Yön Kombinasyonları (Placement Matrix)</h2>
					<div class="grid-layout">
						{#each placements as placement, i (i)}
							<div class="test-item">
								<Toggler {placement} --min-height="200px" --max-height="400px" --min-width="320px" --max-width="600px">
									{#snippet trigger({ active, attr })}
										<button {...attr} class="btn" class:active>
											{placement}
										</button>
									{/snippet}

									{#snippet children({ close })}
										<ul class="my-select-menu">
											<li><button onclick={close}>İstanbul</button></li>
											<li><button onclick={close}>Ankara</button></li>
											<li><button onclick={close}>İzmir</button></li>
											<li><button onclick={close}>Bursa</button></li>
											<li><button onclick={close}>Antalya</button></li>
											<li><button onclick={close}>İstanbul</button></li>
											<li><button onclick={close}>Ankara</button></li>
											<li><button onclick={close}>İzmir</button></li>
											<li><button onclick={close}>Bursa</button></li>
											<li><button onclick={close}>Antalya</button></li>
											<li><button onclick={close}>İstanbul</button></li>
											<li><button onclick={close}>Ankara</button></li>
											<li><button onclick={close}>İzmir</button></li>
											<li><button onclick={close}>Bursa</button></li>
											<li><button onclick={close}>Antalya</button></li>
											<li><button onclick={close}>İstanbul</button></li>
											<li><button onclick={close}>Ankara</button></li>
											<li><button onclick={close}>İzmir</button></li>
											<li><button onclick={close}>Bursa</button></li>
											<li><button onclick={close}>Antalya</button></li>
											<li><button onclick={close}>İstanbul</button></li>
											<li><button onclick={close}>Ankara</button></li>
											<li><button onclick={close}>İzmir</button></li>
											<li><button onclick={close}>Bursa</button></li>
											<li><button onclick={close}>Antalya</button></li>
										</ul>
									{/snippet}
								</Toggler>
							</div>
						{/each}
					</div>
				</section>

				<!-- Section 2: Genişlik & Özel Durum Testleri -->
				<section class="card">
					<h2>2. Genişlik ve State Eşitleme Testleri</h2>
					<div class="flex-layout">
						<!-- Tetikleyici Genişliği Eşitleme (matchTriggerWidth) -->
						<div class="test-box h-96">
							<h3>Match Trigger Width</h3>
							<p>Popover genişliği, tetikleyici butonun genişliği ile birebir eşleşmeli.</p>

							<Toggler placement="bottom-start" matchTriggerWidth={true}>
								{#snippet trigger({ toggle, attr })}
									<button {...attr} class="btn btn-wide"> Geniş Tetikleyici Buton (matchTriggerWidth=true) </button>
								{/snippet}

								{#snippet children({ close })}
									<div class="popover-body">
										<p>Bu popover butona tam oturmalı!</p>
										<button class="btn-sm" onclick={close}>Tamam</button>
									</div>
								{/snippet}
							</Toggler>
						</div>

						<!-- Dışarıdan State Kontrolü (External State Control) -->
						<div class="test-box">
							<h3>Dış State Kontrolü</h3>
							<p>Dışarıdaki bir state (`active`) değiştiğinde Popover senkronize olmalı.</p>

							<div style="margin-bottom: 1rem;">
								<button
									class="btn btn-secondary"
									onpointerdown={(e: PointerEvent) => {
										pointerType = e.pointerType; // 'touch', 'mouse', 'pen'
									}}
									onclick={(e: MouseEvent) => {
										if (e.detail === 0) pointerType = 'keyboard';

										if (pointerType === 'mouse' && toggl?.states.active) return;
										if (pointerType === 'touch' && toggl?.states.active) return;
										toggl?.toggle();
									}}
								>
									{toggl?.states.active ? 'Dışarıdan Kapat' : 'Dışarıdan Aç'}
								</button>
								<div class="flex gap-2 py-2">
									<span class="badge">State: {toggl?.states.active ? 'AÇIK' : 'KAPALI'}</span>
									<span class="badge">Pointer Type: {pointerType}</span>
								</div>
							</div>

							<Toggler bind:this={toggl} placement="bottom-end">
								{#snippet trigger({ active, toggle, attr })}
									<button {...attr} class="btn" class:active>
										Menü ({active ? 'Açık' : 'Kapalı'})
									</button>
								{/snippet}

								{#snippet children({ close })}
									<div class="popover-body">
										<p>Bu menü dışarıdaki bir butonla da açılıp kapatılabilir.</p>
										<button class="btn-sm" onclick={close}>İçeriden Kapat</button>
									</div>
								{/snippet}
							</Toggler>
						</div>
					</div>
				</section>
			</main>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p class="flex-1">Remote [command] Page Footer</p>
	</Page.Footer>
</Page>

<style>
	.my-select-menu {
		margin: 0;
		padding: 4px;
		list-style: none;
		/* overflow-y: auto;
		scrollbar-gutter: stable; */
	}
	.my-select-menu li button {
		width: 100%;
		padding: 8px 16px;
		text-align: left;
		background: none;
		border: none;
		cursor: pointer;
	}
	.my-select-menu li button:hover {
		background: #f1f5f9;
	}

	.test-container {
		max-width: 1100px;
		margin: 0 auto;
	}

	h1 {
		font-size: 1.875rem;
		font-weight: 700;
		margin-bottom: 0.5rem;
	}

	.subtitle {
		color: #64748b;
		margin-bottom: 2rem;
	}

	.card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 12px;
		padding: 1.5rem;
		margin-bottom: 2rem;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	}

	.card h2 {
		font-size: 1.25rem;
		margin-top: 0;
		margin-bottom: 1.5rem;
		border-bottom: 1px solid #f1f5f9;
		padding-bottom: 0.75rem;
	}

	/* Grid Layout */
	.grid-layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 3.5rem 2rem; /* Yön popover'larının çakışmaması için yeterli dikey boşluk */
		padding: 2rem 1rem;
	}

	.test-item {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	/* Flex Layout */
	.flex-layout {
		display: flex;
		flex-wrap: wrap;
		gap: 2rem;
	}

	.test-box {
		flex: 1;
		min-width: 300px;
		background: #f8fafc;
		padding: 1.25rem;
		border-radius: 8px;
		border: 1px solid #e2e8f0;
	}

	.test-box h3 {
		margin-top: 0;
		font-size: 1rem;
	}

	.test-box p {
		font-size: 0.875rem;
		color: #64748b;
	}

	/* Buton Stilleri */
	.btn {
		background: #0284c7;
		color: white;
		border: none;
		padding: 0.6rem 1rem;
		font-weight: 500;
		border-radius: 16px;
		cursor: pointer;
		transition: background-color 0.15s ease;
	}

	.btn:hover {
		background: #0369a1;
	}

	.btn.active {
		background: #0f172a;
	}

	.btn-wide {
		width: 100%;
	}

	.btn-secondary {
		background: #64748b;
	}

	.btn-secondary:hover {
		background: #475569;
	}

	.btn-sm {
		background: #ef4444;
		color: white;
		border: none;
		padding: 0.3rem 0.6rem;
		font-size: 0.75rem;
		border-radius: 4px;
		cursor: pointer;
		margin-top: 0.5rem;
	}

	.btn-sm:hover {
		background: #dc2626;
	}

	/* Popover İçeriği Görsel Stili */
	.popover-body {
		background: red;
		padding: 0.875rem;
		font-size: 0.875rem;
	}

	.badge {
		display: inline-block;
		margin-left: 0.5rem;
		font-size: 0.75rem;
		font-weight: 600;
		padding: 0.2rem 0.5rem;
		background: #e2e8f0;
		border-radius: 4px;
	}
</style>
