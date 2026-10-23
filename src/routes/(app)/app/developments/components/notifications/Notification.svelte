<script lang="ts">
	import { Page, Head } from '#lib/components/templates/index.js';
	import { closeNotificationsBG } from '#lib/remotes/notifications.remote.js';
	import { createNotificationStream, senderLabel, formatDate, typeLabels } from '#lib/components/ui/notifications/index.js';
	import { getToaster } from '#lib/components/ui/toast/index.js';

	const toast = getToaster('app-toaster');

	// Header'daki bileşenle aynı modül; bu sayfa ayrı bir bağlantı açar. Yeni bildirim toast'ını header gösterdiği için burada yok.
	const stream = createNotificationStream({
		onError: (message) => toast.add({ type: 'error', title: 'Bildirimler', description: message })
	});
</script>

<Head>
	<title>Sistem Bildirimleri - SLC Web Applications</title>
	<meta name="description" content="SLC Gerçek Zamanlı Sistem Logları ve Bildirimleri" />
</Head>

{#snippet card(item: (typeof stream.all)[number])}
	<div
		class="group hover:bg-surface-900 relative overflow-hidden rounded-xl border p-4 transition-all duration-300 {item.read
			? 'border-surface-900 bg-surface-950/40 opacity-70 shadow-sm hover:opacity-100'
			: 'border-surface-800 bg-surface-900/60 hover:border-surface-700 shadow-md hover:shadow-xl'}"
	>
		<!-- Sol süs çizgisi -->
		<div
			class="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl opacity-80 transition-opacity group-hover:opacity-100 {item.read
				? 'bg-surface-700'
				: 'from-success-500 bg-linear-to-b to-violet-600'}"
		></div>

		<div class="pl-2">
			<div class="mb-2 flex items-start justify-between gap-4">
				<h3 class="text-base {item.read ? 'text-surface-300 decoration-surface-700 font-medium line-through' : 'text-surface-100 font-semibold'}">
					{item.title || 'Sistem Bildirimi'}
				</h3>
				<span class="border-surface-700 bg-surface-800/80 text-surface-500 rounded border px-2 py-0.5 font-mono text-xs whitespace-nowrap">
					{formatDate(item.created)}
				</span>
			</div>
			<p class="text-surface-500 mb-2 text-xs">{typeLabels[item.type] ?? item.type} · {senderLabel(item)}</p>

			{#if item.message}
				<p class="text-surface-400 mb-4 text-sm whitespace-pre-line">{item.message}</p>
			{/if}

			<div class="flex items-center gap-2">
				<button
					onclick={() => stream.toggleRead(item)}
					class="border-success-500/20 bg-success-600/10 text-success-400 hover:bg-success-600/20 inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95"
				>
					{item.read ? 'Okunmadı İşaretle' : 'Okundu İşaretle'}
				</button>
				<button
					onclick={() => stream.remove(item)}
					class="text-warning-500 hover:border-warning-500/20 hover:bg-warning-500/10 inline-flex cursor-pointer items-center gap-1.5 rounded border border-transparent px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95"
				>
					Sil
				</button>
			</div>
		</div>
	</div>
{/snippet}

<Page>
	<Page.Header>
		<div class="flex w-full items-center justify-between">
			<div class="space-y-1">
				<h1 class="text-2xl font-bold tracking-tight text-white">Sistem Bildirimleri</h1>
				<p class="text-surface-400 text-sm">PocketBase demo_notification koleksiyonundan anlık reaktif veri akışı</p>
			</div>
			<div class="flex items-center space-x-3">
				<!-- Bağlantı Durumu -->
				<div class="border-surface-700 bg-surface-800 flex items-center space-x-2 rounded-full border px-3 py-1.5 text-xs font-medium">
					<span class="relative flex h-2 w-2">
						{#if stream.connected}
							<span class="bg-success-400 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
							<span class="bg-success-500 relative inline-flex h-2 w-2 rounded-full"></span>
						{:else}
							<span class="bg-warning-500 relative inline-flex h-2 w-2 rounded-full"></span>
						{/if}
					</span>
					<span class={stream.connected ? 'text-success-400' : 'text-warning-400'}>
						{stream.connected ? 'Bağlantı Aktif' : 'Bağlantı Yok'}
					</span>
				</div>

				<!-- Bağlantı yokken de açık olmalı: akış bittiğinde (done) yeniden başlatmanın yolu budur. -->
				<button
					onclick={() => stream.reconnect()}
					class="border-surface-700 bg-surface-800 hover:bg-surface-700 inline-flex cursor-pointer items-center justify-center rounded-lg border px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 active:scale-95"
				>
					Bağlantıyı Yenile
				</button>
			</div>
		</div>
	</Page.Header>

	<Page.Main>
		<Page.Main.Panel>
			<div class="space-y-6">
				<!-- query.live durumları -->
				<div class="border-surface-800 bg-surface-900/40 space-y-1 rounded-2xl border p-5 text-sm">
					<p>connected - (Sunucuyla HTTP akışı kurulunca true, akış kapanınca false): {stream.connected}</p>
					<p>ready - (İlk veri (yield) gelince true olur): {stream.ready}</p>
					<p>done - (Sunucu tarafındaki generator kendisi bitince ya da hata verince true): {stream.done}</p>
					<p>loading - (İlk veri gelince ya da ilk bağlantı hata verince false olur): {stream.loading}</p>
				</div>

				<div class="border-surface-800 bg-surface-900/40 flex flex-wrap gap-2 rounded-2xl border p-5">
					<button
						onclick={() => stream.markAllRead()}
						class="border-success-500/20 bg-success-600/10 text-success-400 hover:bg-success-600/20 inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95"
						>Tümünü Oku</button
					>
					<button
						onclick={() => stream.removeAll()}
						class="border-success-500/20 bg-success-600/10 text-success-400 hover:bg-success-600/20 inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95"
						>Tümünü Sil</button
					>
					<!-- done: true testi. Bir kez basın; ikinci basış 30 sn'lik bekleyen kapatma bırakır ve reconnect hemen biter. -->
					<button
						onclick={() => closeNotificationsBG({ connectionId: stream.connectionId })}
						class="border-warning-500/20 bg-warning-600/10 text-warning-400 inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1.5 text-xs font-semibold"
					>
						Akışı Sunucudan Kapat (test)
					</button>
				</div>

				<!-- Hata: akış durur, son liste (varsa) görünmeye devam eder. Periyodik reconnect de yeniden dener. -->
				{#if stream.error}
					<div class="border-warning-500/30 bg-warning-500/10 text-warning-300 flex items-center justify-between gap-3 rounded-xl border p-4 text-sm">
						<span>{stream.error.message}</span>
						<button
							onclick={() => stream.reconnect()}
							class="border-warning-500/30 hover:bg-warning-500/20 cursor-pointer rounded border px-2.5 py-1.5 text-xs font-semibold active:scale-95"
						>
							Tekrar Dene
						</button>
					</div>
				{/if}

				{#if stream.ready}
					<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
						<!-- Okunmamış Bildirimler -->
						<div class="space-y-4">
							<h2 class="border-surface-850 flex items-center gap-2 border-b pb-2 text-lg font-bold text-white">
								Okunmamış Bildirimler
								<span class="bg-success-500/20 text-success-400 rounded-full px-2 py-0.5 font-mono text-xs font-bold">{stream.unread.length}</span>
							</h2>
							<div class="grid gap-3">
								{#each stream.unread as item (item.id)}
									{@render card(item)}
								{:else}
									<div class="border-surface-800 bg-surface-900/30 rounded-xl border border-dashed p-12 text-center">
										<h3 class="text-surface-300 mb-1 text-sm font-semibold">Yeni Bildirim Yok</h3>
										<p class="text-surface-500 text-xs">Harika! Tüm bildirimleri okudunuz.</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Okunmuş Bildirimler -->
						<div class="space-y-4">
							<h2 class="border-surface-850 text-surface-400 flex items-center gap-2 border-b pb-2 text-lg font-bold">
								Okunmuş Bildirimler
								<span class="bg-surface-850 text-surface-500 rounded-full px-2 py-0.5 font-mono text-xs font-bold">{stream.read.length}</span>
							</h2>
							<div class="grid gap-3">
								{#each stream.read as item (item.id)}
									{@render card(item)}
								{:else}
									<div class="border-surface-900 bg-surface-950/20 rounded-xl border border-dashed p-12 text-center">
										<h3 class="text-surface-500 text-sm font-medium">Okunmuş Bildirim Bulunmuyor</h3>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{:else if !stream.error}
					<!-- Yükleniyor İskeleti -->
					<div class="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-2">
						{#each Array(2) as _, col (col)}
							<div class="space-y-4">
								<div class="bg-surface-800 h-6 w-1/3 rounded"></div>
								{#each Array(3) as _, i (i)}
									<div class="border-surface-800 bg-surface-900/40 space-y-2 rounded-xl border p-4">
										<div class="bg-surface-800 h-4 w-1/3 rounded"></div>
										<div class="bg-surface-800 h-3 w-2/3 rounded"></div>
									</div>
								{/each}
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p class="text-surface-500 text-xs">SLC Web Applications • Real-time Notification Engine</p>
	</Page.Footer>
</Page>
