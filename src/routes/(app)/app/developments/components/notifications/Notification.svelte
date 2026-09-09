<script lang="ts">
	import { onMount } from 'svelte';
	import { Page, Head } from '#lib/components/templates/index.js';
	import { notificationsRemote, updateNotificationReadStatus, createNotification, deleteNotification } from '#lib/remotes/notifications.remote.js';

	const notifications = notificationsRemote();
	// void notifications.then;

	let titleInput = $state('');
	let messageInput = $state('');

	let addCount = $state(0);
	let deleteCount = $state(0);

	function getTodayDateString() {
		const d = new Date();
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	}

	onMount(() => {
		const storedDate = localStorage.getItem('notif_date');
		const today = getTodayDateString();

		if (storedDate !== today) {
			localStorage.setItem('notif_date', today);
			localStorage.setItem('notif_add_count', '0');
			localStorage.setItem('notif_delete_count', '0');
			addCount = 0;
			deleteCount = 0;
		} else {
			addCount = parseInt(localStorage.getItem('notif_add_count') || '0', 10);
			deleteCount = parseInt(localStorage.getItem('notif_delete_count') || '0', 10);
		}
	});

	function updateLocalStorage() {
		localStorage.setItem('notif_add_count', addCount.toString());
		localStorage.setItem('notif_delete_count', deleteCount.toString());
	}

	function checkAddPermission() {
		if (addCount >= 5) {
			alert('Günlük bildirim ekleme limitiniz (5) doldu!');
			return false;
		}

		if (!titleInput.trim()) {
			alert('Lütfen bir başlık girin.');
			return false;
		}
		return true;
	}

	function onAddSuccess() {
		addCount += 1;
		updateLocalStorage();
		titleInput = '';
		messageInput = '';
	}

	function checkDeletePermission() {
		const remainingDeleteRights = addCount - deleteCount;
		if (remainingDeleteRights <= 0) {
			alert('Silme hakkınız doldu! Sadece bugün eklediğiniz bildirim sayısı kadar silme yapabilirsiniz.');
			return false;
		}

		if (!confirm('Bu bildirimi kalıcı olarak silmek istediğinize emin misiniz?')) {
			return false;
		}
		return true;
	}

	function onDeleteSuccess() {
		deleteCount += 1;
		updateLocalStorage();
	}

	async function toggleRead(id: string, currentReadStatus: boolean) {
		await updateNotificationReadStatus({ id, read: !currentReadStatus });
	}
</script>

<Head>
	<title>Sistem Bildirimleri - SLC Web Applications</title>
	<meta name="description" content="SLC Gerçek Zamanlı Sistem Logları ve Bildirimleri" />
</Head>

<Page>
	<Page.Header>
		<div class="flex w-full items-center justify-between">
			<div class="space-y-1">
				<h1 class="text-2xl font-bold tracking-tight text-white">Sistem Bildirimleri</h1>
				<p class="text-sm text-zinc-400">PocketBase demo_notification koleksiyonundan anlık reaktif veri akışı</p>
			</div>
			<div class="flex items-center space-x-3">
				<!-- Bağlantı Durumu -->
				<div class="flex items-center space-x-2 rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium">
					<span class="relative flex h-2 w-2">
						{#if notifications.connected}
							<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
							<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
						{:else}
							<span class="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
						{/if}
					</span>
					<span class={notifications.connected ? 'text-emerald-400' : 'text-rose-400'}>
						{notifications.connected ? 'Bağlantı Aktif' : 'Bağlantı Yok'}
					</span>
				</div>

				<!-- Yeniden Bağlan Butonu -->
				<button
					disabled={!notifications.connected}
					onclick={() => notifications.reconnect()}
					class="inline-flex cursor-pointer items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 px-3.5 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:bg-zinc-700 active:scale-95"
				>
					Bağlantıyı Yenile
				</button>
			</div>
		</div>
	</Page.Header>

	<Page.Main>
		<Page.Main.Panel>
			<div class="space-y-6">
				<!-- Test Bildirim Ekleme Paneli -->
				<form
					{...createNotification.enhance(async ({ submit }) => {
						if (!checkAddPermission()) return;
						if (await submit()) {
							onAddSuccess();
						}
					})}
					class="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
				>
					<div class="flex flex-col justify-between gap-3 border-b border-zinc-800 pb-3 sm:flex-row sm:items-center">
						<div>
							<h2 class="text-md font-bold text-white">Test Bildirimi Gönder</h2>
							<p class="text-xs text-zinc-500">PocketBase veritabanına test bildirimi kaydı ekleyin.</p>
						</div>

						<!-- Limit Göstergeleri -->
						<div class="flex items-center gap-3">
							<div class="bg-zinc-850 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300">
								Günlük Ekleme: <span class="font-mono font-bold text-indigo-400">{5 - addCount}/5</span>
							</div>
							<div class="bg-zinc-850 rounded-lg border border-zinc-800 px-3 py-1.5 text-xs text-zinc-300">
								Kalan Silme Hakkı: <span class="font-mono font-bold text-rose-400">{addCount - deleteCount}</span>
							</div>
						</div>
					</div>

					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div class="space-y-1">
							<label for="notif-title" class="text-xs font-semibold text-zinc-400">Bildirim Başlığı</label>
							<input
								id="notif-title"
								type="text"
								name="title"
								bind:value={titleInput}
								placeholder="Örn: Yeni Sipariş Bildirimi"
								class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-600 transition-colors focus:border-zinc-700 focus:outline-hidden"
							/>
						</div>
						<div class="space-y-1">
							<label for="notif-message" class="text-xs font-semibold text-zinc-400">Bildirim Detayı</label>
							<input
								id="notif-message"
								type="text"
								name="message"
								bind:value={messageInput}
								placeholder="Örn: 1092 nolu siparişiniz oluşturuldu."
								class="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2 text-sm text-white placeholder-zinc-600 transition-colors focus:border-zinc-700 focus:outline-hidden"
							/>
						</div>
					</div>

					<div class="flex justify-end pt-2">
						<button
							type="submit"
							disabled={addCount >= 5}
							class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:bg-indigo-500 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
						>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
							</svg>
							Bildirim Ekle ({5 - addCount} Kalan)
						</button>
					</div>
				</form>

				{#if notifications.ready}
					<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
						<!-- Okunmamış Bildirimler Kolonu -->
						<div class="space-y-4">
							<div class="border-zinc-850 flex items-center justify-between border-b pb-2">
								<h2 class="flex items-center gap-2 text-lg font-bold text-white">
									Okunmamış Bildirimler
									<span class="rounded-full bg-indigo-500/20 px-2 py-0.5 font-mono text-xs font-bold text-indigo-400">
										{notifications.current.unread.length}
									</span>
								</h2>
							</div>

							<div class="grid gap-3">
								{#each notifications.current.unread as item (item.id)}
									<div
										class="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 shadow-md transition-all duration-300 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-xl"
									>
										<!-- Log Sol Süs Çizgisi -->
										<div
											class="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl bg-linear-to-b from-indigo-500 to-violet-600 opacity-80 transition-opacity group-hover:opacity-100"
										></div>

										<div class="pl-2">
											<div class="mb-2 flex items-start justify-between gap-4">
												<h3 class="text-base font-semibold text-zinc-100 transition-colors group-hover:text-white">
													{item.title || 'Sistem Bildirimi'}
												</h3>
												<span class="rounded border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 font-mono text-xs whitespace-nowrap text-zinc-500">
													{new Date(item.created).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
												</span>
											</div>

											{#if item.message}
												<p class="mb-4 text-sm text-zinc-400">{item.message}</p>
											{/if}

											<div class="flex items-center justify-between gap-2">
												<!-- Silme Formu -->
												<!-- <form
													{...deleteNotification.enhance(async ({ submit }) => {
														if (!checkDeletePermission()) return;
														if (await submit()) {
															onDeleteSuccess();
														}
													})}
												>
													<input type="hidden" name="id" value={item.id} />
													<button
														type="submit"
														disabled={addCount - deleteCount <= 0}
														class="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-rose-500/10 text-rose-500 border border-transparent hover:border-rose-500/20 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
														title="Kayıt Sil"
													>
														<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
														Sil
													</button>
												</form>
 -->
												<!-- Okundu Butonu -->
												<button
													onclick={() => toggleRead(item.id, false)}
													class="inline-flex cursor-pointer items-center gap-1.5 rounded border border-indigo-500/20 bg-indigo-600/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-400 transition-all duration-200 hover:bg-indigo-600/20 active:scale-95"
												>
													<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
													</svg>
													Okundu İşaretle
												</button>
											</div>
										</div>
									</div>
								{:else}
									<div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-12 text-center">
										<svg class="mb-3 h-10 w-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<h3 class="mb-1 text-sm font-semibold text-zinc-300">Yeni Bildirim Yok</h3>
										<p class="max-w-xs text-xs text-zinc-500">Harika! Tüm bildirimleri okudunuz.</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Okunmuş Bildirimler Kolonu -->
						<div class="space-y-4">
							<div class="border-zinc-850 flex items-center justify-between border-b pb-2">
								<h2 class="flex items-center gap-2 text-lg font-bold text-zinc-400">
									Okunmuş Bildirimler
									<span class="bg-zinc-850 rounded-full px-2 py-0.5 font-mono text-xs font-bold text-zinc-500">
										{notifications.current.read.length}
									</span>
								</h2>
							</div>

							<div class="grid gap-3">
								{#each notifications.current.read as item (item.id)}
									<div
										class="group hover:border-zinc-850 relative overflow-hidden rounded-xl border border-zinc-900 bg-zinc-950/40 p-4 opacity-70 shadow-sm transition-all duration-300 hover:bg-zinc-900 hover:opacity-100"
									>
										<!-- Log Sol Süs Çizgisi -->
										<div class="absolute top-0 bottom-0 left-0 w-1 rounded-l-xl bg-zinc-700 opacity-60 transition-opacity group-hover:opacity-100"></div>

										<div class="pl-2">
											<div class="mb-2 flex items-start justify-between gap-4">
												<h3 class="text-base font-medium text-zinc-300 line-through decoration-zinc-700 transition-colors group-hover:text-zinc-200">
													{item.title || 'Sistem Bildirimi'}
												</h3>
												<span class="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 font-mono text-xs whitespace-nowrap text-zinc-600">
													{new Date(item.created).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
												</span>
											</div>

											{#if item.message}
												<p class="mb-4 text-sm text-zinc-500 line-through decoration-zinc-800">{item.message}</p>
											{/if}

											<div class="flex items-center justify-between gap-2">
												<!-- Silme Formu -->
												<!-- <form
													{...deleteNotification.enhance(async ({ submit }) => {
														if (!checkDeletePermission()) return;
														if (await submit()) {
															onDeleteSuccess();
														}
													})}
												>
													<input type="hidden" name="id" value={item.id} />
													<button
														type="submit"
														disabled={addCount - deleteCount <= 0}
														class="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded hover:bg-rose-500/10 text-rose-500 border border-transparent hover:border-rose-500/20 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all duration-200"
														title="Kayıt Sil"
													>
														<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path
																stroke-linecap="round"
																stroke-linejoin="round"
																stroke-width="2"
																d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
															/>
														</svg>
														Sil
													</button>
												</form> -->

												<!-- Okunmadı Butonu -->
												<button
													onclick={() => toggleRead(item.id, true)}
													class="border-zinc-750 inline-flex cursor-pointer items-center gap-1.5 rounded border bg-zinc-800/60 px-2.5 py-1.5 text-xs font-semibold text-zinc-400 transition-all duration-200 hover:bg-zinc-800 active:scale-95"
												>
													<svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
													</svg>
													Okunmadı İşaretle
												</button>
											</div>
										</div>
									</div>
								{:else}
									<div class="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-900 bg-zinc-950/20 p-12 text-center">
										<h3 class="text-sm font-medium text-zinc-500">Okunmuş Bildirim Bulunmuyor</h3>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{:else}
					<!-- Yükleniyor İskeleti -->
					<div class="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-2">
						<div class="space-y-4">
							<div class="h-6 w-1/3 rounded bg-zinc-800"></div>
							<div class="grid gap-3">
								{#each Array(3) as _, i (i)}
									<div class="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
										<div class="h-12 w-1 rounded bg-zinc-800"></div>
										<div class="flex-1 space-y-2">
											<div class="h-4 w-1/3 rounded bg-zinc-800"></div>
											<div class="h-3 w-2/3 rounded bg-zinc-800"></div>
										</div>
									</div>
								{/each}
							</div>
						</div>
						<div class="space-y-4">
							<div class="h-6 w-1/3 rounded bg-zinc-800"></div>
							<div class="grid gap-3">
								{#each Array(2) as _, i (i)}
									<div class="flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
										<div class="h-12 w-1 rounded bg-zinc-800"></div>
										<div class="flex-1 space-y-2">
											<div class="h-4 w-1/3 rounded bg-zinc-800"></div>
											<div class="h-3 w-2/3 rounded bg-zinc-800"></div>
										</div>
									</div>
								{/each}
							</div>
						</div>
					</div>
				{/if}
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p class="text-xs text-zinc-500">SLC Web Applications • Real-time Notification Engine</p>
	</Page.Footer>
</Page>

<!-- {#await notifications}{/await} -->
