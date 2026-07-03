<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { notificationsRemote } from '$lib/remotes/notifications.remote.js';

	const notifications = notificationsRemote();
</script>

<Head>
	<title>Sistem Bildirimleri - SLC Web Applications</title>
	<meta name="description" content="SLC Gerçek Zamanlı Sistem Logları ve Bildirimleri" />
</Head>

<Page>
	<Page.Header>
		<div class="flex items-center justify-between w-full">
			<div class="space-y-1">
				<h1 class="text-2xl font-bold tracking-tight text-white">Sistem Bildirimleri</h1>
				<p class="text-sm text-zinc-400">PocketBase sys_logs koleksiyonundan anlık reaktif veri akışı</p>
			</div>
			<div class="flex items-center space-x-3">
				<!-- Bağlantı Durumu -->
				<div class="flex items-center px-3 py-1.5 rounded-full bg-zinc-800 border border-zinc-700 space-x-2 text-xs font-medium">
					<span class="relative flex h-2 w-2">
						{#if notifications.connected}
							<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
						{:else}
							<span class="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
						{/if}
					</span>
					<span class={notifications.connected ? 'text-emerald-400' : 'text-rose-400'}>
						{notifications.connected ? 'Bağlantı Aktif' : 'Bağlantı Yok'}
					</span>
				</div>

				<!-- Yeniden Bağlan Butonu -->
				<button
					onclick={() => notifications.reconnect()}
					class="cursor-pointer inline-flex items-center justify-center px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 active:scale-95 transition-all duration-200"
				>
					Bağlantıyı Yenile
				</button>
			</div>
		</div>
	</Page.Header>

	<Page.Main>
		<Page.Main.Panel>
			<div class="space-y-4">
				{#if notifications.ready}
					<div class="grid gap-3">
						{#each notifications.current as item (item.id)}
							<div
								class="group relative overflow-hidden p-4 rounded-xl bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 shadow-md hover:shadow-xl transition-all duration-300"
							>
								<!-- Log Sol Süs Çizgisi -->
								<div
									class="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-blue-500 to-indigo-600 rounded-l-xl opacity-80 group-hover:opacity-100 transition-opacity"
								></div>

								<div class="pl-2">
									<div class="flex items-start justify-between gap-4 mb-1">
										<h3 class="text-base font-semibold text-zinc-100 group-hover:text-white transition-colors">
											{item.title || 'Sistem Bildirimi'}
										</h3>
										<span class="text-xs text-zinc-500 font-mono whitespace-nowrap bg-zinc-800/80 px-2 py-0.5 rounded border border-zinc-700">
											{new Date(item.created).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
										</span>
									</div>

									{#if item.caption}
										<p class="text-sm text-zinc-400 font-medium mb-1.5">{item.caption}</p>
									{/if}

									{#if item.content}
										<p
											class="text-xs text-zinc-500 leading-relaxed font-mono bg-zinc-950/40 p-2.5 rounded-lg border border-zinc-800/80 break-all max-h-24 overflow-y-auto"
										>
											{item.content}
										</p>
									{/if}
								</div>
							</div>
						{:else}
							<div class="flex flex-col items-center justify-center p-12 text-center rounded-xl bg-zinc-900/30 border border-dashed border-zinc-800">
								<svg class="w-10 h-10 text-zinc-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="1.5"
										d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.656 48.656 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7C4.547 9.547 4.5 10.768 4.5 12s.047 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.21.138-2.43.138-3.662z"
									></path>
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
								</svg>
								<h3 class="text-sm font-semibold text-zinc-300 mb-1">Kayıt Bulunmamaktadır</h3>
								<p class="text-xs text-zinc-500 max-w-xs">Şu an için sys_logs koleksiyonunda görüntülenecek herhangi bir sistem günlüğü bulunmuyor.</p>
							</div>
						{/each}
					</div>
				{:else}
					<!-- Yükleniyor İskeleti -->
					<div class="grid gap-3 animate-pulse">
						{#each Array(3) as _, i (i)}
							<div class="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex items-start gap-4">
								<div class="w-1 h-12 bg-zinc-800 rounded"></div>
								<div class="flex-1 space-y-2">
									<div class="h-4 bg-zinc-800 rounded w-1/3"></div>
									<div class="h-3 bg-zinc-800 rounded w-2/3"></div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p class="text-zinc-500 text-xs">SLC Web Applications • Real-time Notification Engine</p>
	</Page.Footer>
</Page>
