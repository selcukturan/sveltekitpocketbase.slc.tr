<script lang="ts">
	import { Toggler } from '#lib/components/base/toggler/index.js';
	import { Button } from '../inputs/index.js';
	import { Dialog } from '#lib/components/base/dialog/index.js';
	import { focustrap } from '#lib/attachments/index.js';
	import { getToaster } from '#lib/components/ui/toast/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import {
		createNotificationStream,
		typeLabels,
		senderLabel,
		formatDate,
		PENDING_READ_ALL,
		PENDING_REMOVE_ALL,
		PENDING_RECONNECT,
		type NotificationItem
	} from './notifications.svelte.js';

	const toast = getToaster('app-toaster');
	let toggl = $state<ReturnType<typeof Toggler> | null>(null);

	// Toast'taki "Aç": tek yeni bildirimde doğrudan detayını açar, birden fazlasında okunmamışlar listesini gösterir.
	const openFromToast = (items: NotificationItem[]) => {
		if (items.length === 1) {
			openItem(items[0]);
		} else {
			filter = 'unread';
			toggl?.open();
		}
	};

	const stream = createNotificationStream({
		onNew: (items) =>
			toast.add({
				type: 'info',
				title: 'Bildirimler',
				description: items.length === 1 ? items[0].title : `${items.length} yeni bildiriminiz var.`,
				action: { label: 'Aç', onClick: () => openFromToast(items) }
			}),
		onError: (message) => toast.add({ type: 'error', title: 'Bildirimler', description: message })
	});

	let filter = $state<'all' | 'unread' | 'read'>('all');
	const filteredItems = $derived(filter === 'all' ? stream.all : filter === 'unread' ? stream.unread : stream.read);
	const emptyText = $derived(filter === 'unread' ? 'Okunmamış bildirim yok.' : filter === 'read' ? 'Okunmuş bildirim yok.' : 'Bildirim yok.');
	const readingAll = $derived(stream.isPending(PENDING_READ_ALL));
	const removingAll = $derived(stream.isPending(PENDING_REMOVE_ALL));
	const reconnecting = $derived(stream.isPending(PENDING_RECONNECT));
	const badge = $derived(stream.unread.length > 99 ? '99+' : String(stream.unread.length));

	const removeAll = () => {
		if (confirm('Tüm bildirimler listenizden kaldırılacak. Emin misiniz?')) stream.removeAll();
	};

	// Detay dialog'u. Popover'ın içinde durmalı: dışarıda olursa odak popover'dan çıkar ve popover kapanır.
	// Canlı akış her güncellemede yeni nesneler gönderir; seçili kayıt id ile tutulur ve listeden türetilir.
	// Dialog açıkken kayıt listeden çıkarsa (ör. başka sekmede silindi) son görülen hali gösterilir.
	let dialog = $state<Dialog | null>(null);
	let selectedId = $state<string | null>(null);
	let lastSelected = $state<NotificationItem | null>(null);
	const selected = $derived(stream.all.find((n) => n.id === selectedId) ?? lastSelected);

	const openItem = (item: NotificationItem) => {
		selectedId = item.id;
		lastSelected = item;
		dialog?.show();
	};
	// Okundu işaretini kapanışta koyuyoruz: "Okunmamışlar" filtresinde satır, dialog açıkken listeden düşmesin.
	const onDialogClose = () => {
		if (selected) stream.markRead(selected);
		selectedId = null;
		lastSelected = null;
	};
</script>

{#snippet typeTag(item: NotificationItem)}
	<span class="bg-surface-200 text-surface-700 shrink-0 rounded px-1.5 py-px text-[10px] font-medium">{typeLabels[item.type] ?? item.type}</span>
{/snippet}

{#snippet spinner()}
	<Icon name="loader" size={14} class="animate-spin" />
{/snippet}

{#snippet listItem(item: NotificationItem)}
	{@const busy = stream.isPending(item.id)}
	<!-- list-item -->
	<div class="hover:bg-surface-300/50 border-surface-300 flex w-full items-stretch border-t first:border-t-0">
		<!-- read status -->
		<div class="flex w-8 shrink-0 items-center justify-center">
			<span class="size-2 rounded-full {item.read ? 'bg-transparent' : 'bg-info-500'}" aria-label={item.read ? 'Okundu' : 'Okunmadı'}></span>
		</div>
		<!-- content -->
		<button type="button" onclick={() => openItem(item)} class="flex min-w-0 flex-auto cursor-pointer flex-col gap-0.5 rounded-lg p-2 text-left -outline-offset-5">
			<span class="truncate text-sm {item.read ? 'font-normal' : 'font-semibold'}">{item.title}</span>
			<span class="text-surface-500 flex items-center gap-2 text-[11px]">
				{@render typeTag(item)}
				<span class="min-w-0 flex-auto truncate">{senderLabel(item)}</span>
				<time class="shrink-0" datetime={item.created}>{formatDate(item.created)}</time>
			</span>
			<span class="text-surface-600 line-clamp-2 text-xs">{item.message}</span>
		</button>
		<!-- action: işlem sürerken iki düğme yerine tek gösterge (aria-busy ile ekran okuyucuya da bildirilir) -->
		<div class="flex w-8 shrink-0 flex-col items-center justify-center gap-0.5 py-1" aria-busy={busy}>
			{#if busy}
				<span class="text-surface-500 p-1" role="status" aria-label="İşlem sürüyor">{@render spinner()}</span>
			{:else}
				<button
					type="button"
					onclick={() => stream.remove(item)}
					class="hover:bg-surface-400/50 cursor-pointer rounded-full p-1"
					aria-label="{item.title} kaldır"
					title="Kaldır"
				>
					<svg class="size-3.5" stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path>
					</svg>
				</button>
				<button
					type="button"
					onclick={() => stream.toggleRead(item)}
					class="hover:bg-surface-400/50 cursor-pointer rounded-full p-1"
					aria-label={item.read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
					title={item.read ? 'Okunmadı yap' : 'Okundu yap'}
				>
					<svg class="size-3.5" stroke="currentColor" fill={item.read ? 'none' : 'currentColor'} stroke-width="2" viewBox="0 0 24 24">
						<circle cx="12" cy="12" r="6"></circle>
					</svg>
				</button>
			{/if}
		</div>
	</div>
{/snippet}

<Toggler
	bind:this={toggl}
	animation={false}
	style="margin-inline: var(--gutter, 5px);"
	placement="bottom-center"
	--border="1px solid var(--color-surface-300)"
	--border-radius="6px"
	--background-color="var(--color-surface-50)"
	--box-shadow="0px 25px 50px -12px var(--color-surface-100)"
	--min-height="200px"
	--max-height="min(540px, 75dvh)"
	--min-width="400px"
	--max-width="450px"
	--display="flex"
	--overflow="hidden"
>
	{#snippet trigger({ active, attr })}
		<button {...attr} class="bg-error-300 cursor-pointer touch-manipulation" class:bg-error-400={active}> Bildirimler ({badge}) </button>
	{/snippet}

	{#snippet children({ close })}
		<div class="flex min-h-0 flex-auto flex-col">
			<!-- header -->
			<div class="bg-surface-200 border-surface-300 flex items-center justify-between border-b p-2">
				<h3 class="text-surface-800 flex items-center gap-2 text-lg font-semibold">
					Bildirimler
					<!-- Canlı bağlantı: bağlıyken yeşil ve dalgalanan, değilken kırmızı ve sabit -->
					<span
						class="relative flex size-2.5"
						role="status"
						aria-label={stream.connected ? 'Canlı bağlantı aktif' : 'Canlı bağlantı yok'}
						title={stream.connected ? 'Canlı bağlantı aktif' : 'Canlı bağlantı yok'}
					>
						{#if stream.connected}
							<span class="bg-success-500 absolute inline-flex size-full animate-ping rounded-full motion-reduce:animate-none"></span>
						{/if}
						<span class="relative inline-flex size-2.5 rounded-full {stream.connected ? 'bg-success-500' : 'bg-error-500'}"></span>
					</span>
				</h3>
				<Button size="sm" variant="ghost" color="error" icon="close" iconOnly={true} onclick={close} class="text-surface-950!" />
			</div>
			<!-- filter -->
			<div class="bg-surface-200/75 border-surface-300 flex items-center justify-between border-b p-2">
				<Button
					size="sm"
					variant={filter === 'all' ? 'light' : 'ghost'}
					color={filter === 'all' ? 'success' : 'quaternary'}
					label="Hepsi ({stream.all.length})"
					onclick={() => (filter = 'all')}
				/>
				<Button
					size="sm"
					variant={filter === 'unread' ? 'light' : 'ghost'}
					color={filter === 'unread' ? 'success' : 'quaternary'}
					label="Okunmamışlar ({stream.unread.length})"
					onclick={() => (filter = 'unread')}
				/>
				<Button
					size="sm"
					variant={filter === 'read' ? 'light' : 'ghost'}
					color={filter === 'read' ? 'success' : 'quaternary'}
					label="Okunmuşlar ({stream.read.length})"
					onclick={() => (filter = 'read')}
				/>
			</div>
			<!-- error: akış durur, son liste (varsa) görünmeye devam eder; periyodik reconnect de yeniden dener -->
			{#if stream.error}
				<div class="bg-error-100 text-error-800 border-surface-300 flex items-center justify-between gap-2 border-b px-3 py-2 text-xs">
					<span>{stream.error.message}</span>
					<Button size="sm" variant="ghost" color="error" label="Tekrar Dene" onclick={() => stream.reconnect()} />
				</div>
			{/if}
			<!-- main -->
			<div class="bg-surface-100 min-h-0 flex-auto overflow-y-auto">
				{#if stream.ready}
					{#each filteredItems as item (item.id)}
						{@render listItem(item)}
					{:else}
						<p class="text-surface-600 p-6 text-center text-sm">{emptyText}</p>
					{/each}
				{:else if !stream.error}
					<!-- loading skeleton -->
					<div class="animate-pulse">
						{#each Array(4) as _, i (i)}
							<div class="border-surface-300 flex flex-col gap-1.5 border-t py-3 pr-3 pl-8 first:border-t-0">
								<div class="bg-surface-300 h-3.5 w-1/3 rounded"></div>
								<div class="bg-surface-300 h-2.5 w-1/2 rounded"></div>
								<div class="bg-surface-300 h-2.5 w-5/6 rounded"></div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
			<!-- footer -->
			<!-- İşlem sürerken ikon dönen yükleme göstergesine dönüşür; `disabled` toggler'da popover'ı kapatmaz. -->
			<div class="bg-surface-200 border-surface-300 flex items-center justify-between gap-2 border-t p-3">
				<Button
					size="sm"
					variant="filled"
					color="primary"
					startIcon={readingAll ? 'loader' : 'circle_check'}
					label="Tümünü Oku"
					class={readingAll ? '[&_svg]:animate-spin' : ''}
					aria-busy={readingAll}
					disabled={readingAll || !stream.unread.length}
					onclick={() => stream.markAllRead()}
				/>
				<div class="flex items-center gap-1">
					<span class="text-surface-500 text-[11px]">Sadece son 100 bildirim</span>
				</div>
				<div class="flex items-center gap-1">
					<Button
						size="sm"
						variant="filled"
						color="surface"
						icon={reconnecting ? 'loader' : 'update'}
						iconOnly={true}
						class={reconnecting ? '[&_svg]:animate-spin' : ''}
						aria-busy={reconnecting}
						disabled={reconnecting}
						title="Yeniden bağlan"
						aria-label="Yeniden bağlan"
						onclick={() => stream.reconnect()}
					/>
					<Button
						size="sm"
						variant="filled"
						color="error"
						icon={removingAll ? 'loader' : 'delete'}
						iconOnly={true}
						class={removingAll ? '[&_svg]:animate-spin' : ''}
						aria-busy={removingAll}
						disabled={removingAll || !stream.all.length}
						title="Tümünü kaldır"
						aria-label="Tümünü kaldır"
						onclick={removeAll}
					/>
				</div>
			</div>
		</div>
	{/snippet}
</Toggler>

<!-- detail dialog -->
<Dialog
	bind:this={dialog}
	onClose={onDialogClose}
	{@attach focustrap}
	class="border-surface-300 bg-surface-50 shadow-surface-200 m-auto w-11/12 max-w-lg rounded-md border shadow-2xl"
>
	{#if selected}
		<div class="flex flex-col">
			<div class="bg-surface-100 inset-shadow-surface-200 flex items-center justify-between gap-2 border-b p-3 inset-shadow-sm">
				<h4 class="truncate font-semibold">{selected.title}</h4>
				<Button size="sm" variant="ghost" color="error" icon="close" iconOnly={true} onclick={() => dialog?.hide(false)} class="text-surface-950!" />
			</div>
			<div class="text-surface-600 border-surface-200 flex items-center gap-2 border-b px-4 py-2 text-xs">
				{@render typeTag(selected)}
				<span class="min-w-0 flex-auto truncate">Kimden: <span class="text-surface-900 font-medium">{senderLabel(selected)}</span></span>
				<time class="shrink-0" datetime={selected.created}>{formatDate(selected.created)}</time>
			</div>
			<p class="max-h-[60dvh] overflow-y-auto p-4 text-sm whitespace-pre-line">{selected.message}</p>
			<div class="bg-surface-100 inset-shadow-surface-200 mt-2 flex items-center justify-end border-t p-3 inset-shadow-sm">
				<Button label="Kapat" variant="filled" color="surface" autofocus onclick={() => dialog?.hide(false)} />
			</div>
		</div>
	{/if}
</Dialog>
