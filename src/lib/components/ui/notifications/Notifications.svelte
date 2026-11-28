<script lang="ts">
	import { t } from '#lib/app/localization/index.js';
	import { Toggler } from '#lib/components/base/toggler/index.js';
	import { Dialog } from '#lib/components/base/dialog/index.js';
	import { focustrap, tooltip } from '#lib/attachments/index.js';
	import { getToaster } from '#lib/components/ui/toast/index.js';
	import { Icon, type IconKey } from '#lib/components/icons/index.js';
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
				title: t('notif_title'),
				description: items.length === 1 ? items[0].title : t('notif_new_count', { count: items.length }),
				action: { label: t('notif_open'), onClick: () => openFromToast(items) }
			}),
		onError: (message) => toast.add({ type: 'error', title: t('notif_title'), description: t(message, undefined, message) })
	});

	let filter = $state<'all' | 'unread' | 'read'>('all');
	const filteredItems = $derived(filter === 'all' ? stream.all : filter === 'unread' ? stream.unread : stream.read);
	const emptyText = $derived(filter === 'unread' ? t('notif_empty_unread') : filter === 'read' ? t('notif_empty_read') : t('notif_empty_all'));
	const readingAll = $derived(stream.isPending(PENDING_READ_ALL));
	const removingAll = $derived(stream.isPending(PENDING_REMOVE_ALL));
	const reconnecting = $derived(stream.isPending(PENDING_RECONNECT));
	const badge = $derived(stream.unread.length > 99 ? '99+' : String(stream.unread.length));

	const removeAll = () => {
		if (confirm(t('notif_remove_all_confirm'))) stream.removeAll();
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

<!-- Görünüm: panel ve detay penceresi açılır yüzey rengindedir (--slc-system-bg-surface: açıkta surface-50, koyuda bir kat
     açık surface-100). Okunmamış: solda marka renginde nokta ve kalın başlık. Satır eylemleri her zaman görünür (dokunmatik). -->
{#snippet typeTag(item: NotificationItem)}
	<span class="bg-surface-200 text-surface-700 shrink-0 rounded px-1.5 py-px text-[10px] font-medium">
		{typeLabels[item.type] ? t(typeLabels[item.type]) : item.type}
	</span>
{/snippet}

{#snippet spinner()}
	<Icon name="loader" size={16} class="animate-spin" />
{/snippet}

{#snippet rowAction(icon: IconKey, label: string, onclick: () => void, danger = false)}
	<button
		type="button"
		{onclick}
		class="text-surface-500 hover:bg-surface-200 inline-flex size-7 cursor-pointer items-center justify-center rounded-md {danger
			? 'hover:text-error-600'
			: 'hover:text-surface-900'}"
		aria-label={label}
		title={label}
	>
		<Icon name={icon} size={16} />
	</button>
{/snippet}

{#snippet listItem(item: NotificationItem)}
	{@const busy = stream.isPending(item.id)}
	<div class="hover:bg-surface-200/60 border-surface-200 flex w-full items-stretch gap-1 border-t px-2 py-1 transition-colors first:border-t-0">
		<!-- okunma durumu -->
		<div class="flex w-4 shrink-0 justify-center pt-3.5">
			<span class="size-2 rounded-full {item.read ? 'bg-transparent' : 'bg-primary-500'}" aria-label={item.read ? t('notif_status_read') : t('notif_status_unread')}
			></span>
		</div>
		<!-- içerik -->
		<button type="button" onclick={() => openItem(item)} class="flex min-w-0 flex-auto cursor-pointer flex-col gap-1 rounded-md px-1 py-2 text-left">
			<span class="text-surface-950 truncate text-sm {item.read ? 'font-normal' : 'font-semibold'}">{item.title}</span>
			<span class="text-surface-500 flex items-center gap-2 text-[11px]">
				{@render typeTag(item)}
				<span class="min-w-0 flex-auto truncate">{senderLabel(item)}</span>
				<time class="shrink-0 tabular-nums" datetime={item.created}>{formatDate(item.created)}</time>
			</span>
			<span class="text-surface-600 line-clamp-2 text-xs">{item.message}</span>
		</button>
		<!-- eylemler: işlem sürerken tek gösterge (aria-busy ile ekran okuyucuya da bildirilir) -->
		<div class="flex shrink-0 flex-col items-center justify-center gap-0.5" aria-busy={busy}>
			{#if busy}
				<span class="text-surface-500 inline-flex size-7 items-center justify-center" role="status" aria-label={t('in_progress')}>{@render spinner()}</span>
			{:else}
				{@render rowAction(item.read ? 'circle' : 'check', item.read ? t('notif_mark_unread') : t('notif_mark_read'), () => stream.toggleRead(item))}
				{@render rowAction('close', t('remove_item_aria', { name: item.title }), () => stream.remove(item), true)}
			{/if}
		</div>
	</div>
{/snippet}

{#snippet filterButton(value: typeof filter, label: string, count: number)}
	<button
		type="button"
		onclick={() => (filter = value)}
		aria-pressed={filter === value}
		class="text-surface-600 hover:text-surface-950 aria-pressed:bg-surface-50 aria-pressed:text-surface-950 dark:aria-pressed:bg-surface-300 inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium aria-pressed:shadow-sm"
	>
		{label}
		<span class="bg-surface-300/70 text-surface-700 rounded-full px-1.5 text-[10px] tabular-nums">{count}</span>
	</button>
{/snippet}

<Toggler
	bind:this={toggl}
	animation={false}
	style="margin-inline: var(--gutter, 5px);"
	placement="bottom-end"
	--border="1px solid var(--color-surface-300)"
	--border-radius="12px"
	--min-height="200px"
	--max-height="min(560px, 80dvh)"
	--min-width="min(400px, calc(100vw - 10px))"
	--max-width="420px"
	--display="flex"
	--overflow="hidden"
>
	{#snippet trigger({ attr })}
		<!-- Zil + okunmamış rozeti (okunmamış yoksa rozet yok). Sektör standardı kırmızı rozet + beyaz rakam (iOS, Android, Slack,
		     GitHub). Koyu zeminde parlak kırmızı ışıldar ve rakamı yutar (özellikle OLED): koyu temada bir ton koyu kırmızı,
		     kalın ve biraz büyük rakam; zemin rengi halka rozeti zilden ayırır. -->
		<button
			{...attr}
			class="slc-icon-button touch-manipulation"
			aria-label={stream.unread.length ? `${t('notif_title')} (${t('notif_unread_count', { count: badge })})` : t('notif_title')}
			{@attach tooltip(t('notif_title'))}
		>
			<Icon name="bell" size={20} />
			{#if stream.unread.length}
				<span
					class="bg-error-token-600 dark:bg-error-token-700 ring-surface-50 text-surface-token-50 pointer-events-none absolute top-0.5 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[11px] leading-none font-bold tabular-nums ring-2"
					aria-hidden="true"
				>
					{badge}
				</span>
			{/if}
		</button>
	{/snippet}

	{#snippet children({ close })}
		<div class="flex min-h-0 flex-auto flex-col">
			<!-- başlık -->
			<div class="flex items-center justify-between gap-2 px-4 pt-3 pb-2">
				<h3 class="text-surface-950 flex items-center gap-2 text-base font-semibold">
					{t('notif_title')}
					<!-- Canlı bağlantı: bağlıyken yeşil ve dalgalanan, değilken kırmızı ve sabit -->
					<span
						class="relative flex size-2"
						role="status"
						aria-label={stream.connected ? t('notif_live_on') : t('notif_live_off')}
						title={stream.connected ? t('notif_live_on') : t('notif_live_off')}
					>
						{#if stream.connected}
							<span class="bg-success-500 absolute inline-flex size-full animate-ping rounded-full opacity-75 motion-reduce:animate-none"></span>
						{/if}
						<span class="relative inline-flex size-2 rounded-full {stream.connected ? 'bg-success-500' : 'bg-error-500'}"></span>
					</span>
				</h3>
				<button type="button" onclick={close} class="slc-icon-button size-8" aria-label={t('close')} title={t('close')}>
					<Icon name="close" size={18} />
				</button>
			</div>
			<!-- filtre (bölümlü düğme) -->
			<div class="px-3 pb-2">
				<div class="bg-surface-200/70 dark:bg-surface-50 flex gap-1 rounded-lg p-0.5">
					{@render filterButton('all', t('notif_filter_all_label'), stream.all.length)}
					{@render filterButton('unread', t('notif_filter_unread_label'), stream.unread.length)}
					{@render filterButton('read', t('notif_filter_read_label'), stream.read.length)}
				</div>
			</div>
			<!-- hata: akış durur, son liste (varsa) görünmeye devam eder; periyodik reconnect de yeniden dener -->
			{#if stream.error}
				<div class="border-error-300 bg-error-50 text-error-800 mx-3 mb-2 flex items-center justify-between gap-2 rounded-lg border px-3 py-2 text-xs">
					<span>{t(stream.error.message, undefined, stream.error.message)}</span>
					<button type="button" class="hover:bg-error-100 cursor-pointer rounded-md px-2 py-1 font-semibold" onclick={() => stream.reconnect()}>{t('retry')}</button>
				</div>
			{/if}
			<!-- liste -->
			<div class="border-surface-200 min-h-0 flex-auto overflow-y-auto border-t">
				{#if stream.ready}
					{#each filteredItems as item (item.id)}
						{@render listItem(item)}
					{:else}
						<div class="text-surface-500 flex flex-col items-center gap-2 p-8 text-center text-sm">
							<Icon name="inbox" size={28} />
							{emptyText}
						</div>
					{/each}
				{:else if !stream.error}
					<!-- yükleniyor -->
					<div class="animate-pulse">
						{#each Array(4) as _, i (i)}
							<div class="border-surface-200 flex flex-col gap-1.5 border-t py-3 pr-3 pl-8 first:border-t-0">
								<div class="bg-surface-200 h-3.5 w-1/3 rounded"></div>
								<div class="bg-surface-200 h-2.5 w-1/2 rounded"></div>
								<div class="bg-surface-200 h-2.5 w-5/6 rounded"></div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
			<!-- alt çubuk. İşlem sürerken ikon dönen yükleme göstergesine dönüşür; `disabled` toggler'da popover'ı kapatmaz. -->
			<div class="border-surface-200 flex items-center justify-between gap-2 border-t px-2 py-2">
				<button
					type="button"
					class="text-primary-700 hover:bg-primary-100 inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50"
					aria-busy={readingAll}
					disabled={readingAll || !stream.unread.length}
					onclick={() => stream.markAllRead()}
				>
					<Icon name={readingAll ? 'loader' : 'check_check'} size={16} class={readingAll ? 'animate-spin' : ''} />
					{t('notif_read_all')}
				</button>
				<span class="text-surface-500 hidden text-[11px] sm:inline">{t('notif_last_100')}</span>
				<div class="flex items-center">
					<button
						type="button"
						class="slc-icon-button size-8 disabled:cursor-not-allowed disabled:opacity-50"
						aria-busy={reconnecting}
						disabled={reconnecting}
						title={t('reconnect')}
						aria-label={t('reconnect')}
						onclick={() => stream.reconnect()}
					>
						<Icon name={reconnecting ? 'loader' : 'refresh'} size={16} class={reconnecting ? 'animate-spin' : ''} />
					</button>
					<button
						type="button"
						class="slc-icon-button hover:text-error-600 size-8 disabled:cursor-not-allowed disabled:opacity-50"
						aria-busy={removingAll}
						disabled={removingAll || !stream.all.length}
						title={t('notif_remove_all')}
						aria-label={t('notif_remove_all')}
						onclick={removeAll}
					>
						<Icon name={removingAll ? 'loader' : 'delete'} size={16} class={removingAll ? 'animate-spin' : ''} />
					</button>
				</div>
			</div>
		</div>
	{/snippet}
</Toggler>

<!-- detay penceresi -->
<Dialog
	bind:this={dialog}
	onClose={onDialogClose}
	{@attach focustrap}
	class="border-surface-300 m-auto w-11/12 max-w-lg rounded-xl border bg-(--slc-system-bg-surface) shadow-2xl"
>
	{#if selected}
		<div class="flex flex-col">
			<div class="flex items-start justify-between gap-3 px-5 pt-4 pb-3">
				<h4 class="text-surface-950 min-w-0 text-base font-semibold break-words">{selected.title}</h4>
				<button type="button" onclick={() => dialog?.hide(false)} class="slc-icon-button -mt-1 -mr-2 size-8" aria-label={t('close')} title={t('close')}>
					<Icon name="close" size={18} />
				</button>
			</div>
			<div class="text-surface-500 border-surface-200 flex items-center gap-2 border-b px-5 pb-3 text-xs">
				{@render typeTag(selected)}
				<span class="min-w-0 flex-auto truncate">{t('notif_from')} <span class="text-surface-800 font-medium">{senderLabel(selected)}</span></span>
				<time class="shrink-0 tabular-nums" datetime={selected.created}>{formatDate(selected.created)}</time>
			</div>
			<p class="text-surface-800 max-h-[60dvh] overflow-y-auto px-5 py-4 text-sm leading-relaxed whitespace-pre-line">{selected.message}</p>
			<div class="border-surface-200 flex items-center justify-end border-t px-5 py-3">
				<button type="button" class="slc-btn-outline h-9" onclick={() => dialog?.hide(false)}>{t('close')}</button>
			</div>
		</div>
	{/if}
</Dialog>
