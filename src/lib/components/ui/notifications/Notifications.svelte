<script lang="ts">
	import { Toggler } from '#lib/components/base/toggler/index.js';
	import { Button } from '../inputs/index.js';
	import { Dialog } from '#lib/components/base/dialog/index.js';
	import { focustrap } from '#lib/attachments/index.js';

	let filter = $state<'all' | 'unread' | 'read'>('all');

	let toggl = $state<ReturnType<typeof Toggler> | null>(null);

	type Item = { id: string; title: string; body: string; read: boolean; from: string; created: string };

	const exampleBodies = [
		'Siparişiniz kargoya verildi. Takip numarası ile teslimat durumunu anlık olarak izleyebilirsiniz.',
		'Hesabınıza yeni bir cihazdan giriş yapıldı. Bu siz değilseniz lütfen şifrenizi hemen değiştirin.',
		'Haftalık rapor hazır.',
		'Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Ekip toplantısı yarın saat 10:00’a ertelendi. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir. Gündem maddeleri toplantı notlarına eklendi, katılmadan önce göz atmanız önerilir.'
	];

	let items = $state<Item[]>(
		Array.from({ length: 20 }, (_, i) => ({
			id: String(i + 1),
			title: `Bildirim ${i + 1}`,
			body: exampleBodies[i % exampleBodies.length],
			read: i % 3 === 0,
			from: 'System',
			// Örnek veri: her bildirim bir öncekinden 5 saat daha eski.
			created: new Date(Date.now() - i * 5 * 60 * 60 * 1000).toISOString()
		}))
	);

	const dateFormat = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'short', timeStyle: 'short' });
	const formatDate = (iso: string) => dateFormat.format(new Date(iso));

	const unreadCount = $derived(items.filter((item) => !item.read).length);
	const filteredItems = $derived(filter === 'all' ? items : items.filter((item) => item.read === (filter === 'read')));

	const toggleRead = (item: Item) => (item.read = !item.read);
	const remove = (id: string) => (items = items.filter((item) => item.id !== id));

	// Detay dialog'u. Popover'ın içinde durmalı: dışarıda olursa odak popover'dan çıkar ve popover kapanır.
	let dialog = $state<Dialog | null>(null);
	let selected = $state<Item | null>(null);

	const openItem = (item: Item) => {
		selected = item;
		dialog?.show();
	};
	// Okundu işaretini kapanışta koyuyoruz: "Okunmamışlar" filtresinde satır, dialog açıkken listeden düşmesin.
	const onDialogClose = () => {
		if (selected) selected.read = true;
		selected = null;
	};
</script>

{#snippet listItem(item: Item)}
	<!-- list-item -->
	<div class="hover:bg-surface-300/50 border-surface-300 flex w-full items-stretch border-t first:border-t-0">
		<!-- read status -->
		<div class="flex w-8 shrink-0 items-center justify-center">
			<span class="size-2 rounded-full {item.read ? 'bg-transparent' : 'bg-info-500'}" aria-label={item.read ? 'Okundu' : 'Okunmadı'}></span>
		</div>
		<!-- content -->
		<button type="button" onclick={() => openItem(item)} class="flex min-w-0 flex-auto cursor-pointer flex-col gap-0.5 rounded-lg p-2 text-left -outline-offset-5">
			<span class="truncate text-sm {item.read ? 'font-normal' : 'font-semibold'}">{item.title}</span>
			<span class="text-surface-500 flex items-center justify-between gap-2 text-[11px]">
				<span class="truncate">{item.from}</span>
				<time class="shrink-0" datetime={item.created}>{formatDate(item.created)}</time>
			</span>
			<span class="text-surface-600 line-clamp-2 text-xs">{item.body}</span>
		</button>
		<!-- action -->
		<div class="flex shrink-0 flex-col items-center justify-center gap-0.5 px-2 py-1">
			<button
				type="button"
				onclick={() => remove(item.id)}
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
				onclick={() => toggleRead(item)}
				class="hover:bg-surface-400/50 cursor-pointer rounded-full p-1"
				aria-label={item.read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
				title={item.read ? 'Okunmadı yap' : 'Okundu yap'}
			>
				<svg class="size-3.5" stroke="currentColor" fill={item.read ? 'none' : 'currentColor'} stroke-width="2" viewBox="0 0 24 24">
					<circle cx="12" cy="12" r="6"></circle>
				</svg>
			</button>
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
	--box-shadow="0px 25px 50px -12px var(--color-surface-200)"
	--min-height="200px"
	--max-height="min(540px, 75dvh)"
	--min-width="400px"
	--max-width="450px"
	--display="flex"
	--overflow="hidden"
>
	{#snippet trigger({ active, toggle, attr })}
		<button {...attr} class="bg-error-300 cursor-pointer touch-manipulation" class:bg-error-400={active}> Bildirimler ({unreadCount}) </button>
	{/snippet}

	{#snippet children({ close })}
		<div class="flex min-h-0 flex-auto flex-col">
			<!-- header -->
			<div class="bg-surface-200 border-surface-300 flex items-center justify-between border-b p-2">
				<h3 class="text-surface-800 text-lg font-semibold">Bildirimler</h3>
				<Button size="sm" variant="ghost" color="error" icon="close" iconOnly={true} onclick={close} class="text-surface-950!" />
			</div>
			<!-- filter -->
			<div class="bg-surface-200/75 border-surface-300 flex items-center justify-between border-b p-2">
				<!-- <input.Button variant="light" color="surface" label="Surface" /> -->
				<Button
					size="sm"
					variant={filter === 'all' ? 'light' : 'ghost'}
					color={filter === 'all' ? 'success' : 'quaternary'}
					label="Hepsi"
					onclick={() => (filter = 'all')}
				/>
				<Button
					size="sm"
					variant={filter === 'unread' ? 'light' : 'ghost'}
					color={filter === 'unread' ? 'success' : 'quaternary'}
					label="Okunmamışlar"
					onclick={() => (filter = 'unread')}
				/>
				<Button
					size="sm"
					variant={filter === 'read' ? 'light' : 'ghost'}
					color={filter === 'read' ? 'success' : 'quaternary'}
					label="Okunmuşlar"
					onclick={() => (filter = 'read')}
				/>
			</div>
			<!-- main -->
			<div class="bg-surface-100 min-h-0 flex-auto overflow-y-auto">
				{#each filteredItems as item (item.id)}
					{@render listItem(item)}
				{:else}
					<p class="text-surface-600 p-6 text-center text-sm">Bildirim yok.</p>
				{/each}
			</div>
			<!-- footer -->
			<div class="bg-surface-200 border-surface-300 flex items-center justify-between border-t p-3">
				<Button size="sm" variant="filled" color="primary" startIcon="grape" label="Tümünü Oku" onclick={close} />
				<Button size="sm" variant="filled" color="success" icon="grape" iconOnly={true} onclick={close} />
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
			<div class="text-surface-600 border-surface-200 flex items-center justify-between gap-2 border-b px-4 py-2 text-xs">
				<span class="truncate">Kimden: <span class="text-surface-900 font-medium">{selected.from}</span></span>
				<time class="shrink-0" datetime={selected.created}>{formatDate(selected.created)}</time>
			</div>
			<p class="max-h-[60dvh] overflow-y-auto p-4 text-sm whitespace-pre-line">{selected.body}</p>
			<div class="bg-surface-100 inset-shadow-surface-200 mt-2 flex items-center justify-end border-t p-3 inset-shadow-sm">
				<!-- <Button label="Sil" onclick={() => dialog?.hide(false)} variant="ghost" color="surface" /> -->

				<Button label="Kapat" variant="filled" color="surface" autofocus onclick={() => dialog?.hide(false)} />
			</div>
		</div>
	{/if}
</Dialog>
