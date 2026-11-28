<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- href'ler menü verisinden gelen uygulama içi tam yollar */
	import { goto } from '$app/navigation';
	import type { Attachment } from 'svelte/attachments';
	import { t } from '#lib/app/localization/index.js';
	import { Icon } from '#lib/components/icons/index.js';
	import { searchMenu, type MenuSearchEntry } from '#lib/app/menu/search.js';

	// Menüde arama (Ctrl+K / ⌘K ya da üst çubuktaki düğme). Native <dialog> (showModal): odak içeride kalır, Esc ve
	// dışarı tıklama kapatır, kapanınca odak açan öğeye döner. WAI combobox kalıbı: arama kutusu (role=combobox) odakta
	// kalır, ↑ ↓ ile listede (role=listbox) gezilir (aria-activedescendant), Enter seçili sayfayı açar.
	// Liste kullanıcının menüsüdür: erişemediği sayfa hiç görünmez (app/menu/search.ts).
	let { entries }: { entries: MenuSearchEntry[] } = $props();

	const id = $props.id();
	let dialog = $state<HTMLDialogElement>();
	let input = $state<HTMLInputElement>();
	let query = $state('');
	let active = $state(0);

	const results = $derived(searchMenu(entries, query));
	const optionId = (i: number) => `${id}-option-${i}`;

	export const open = () => {
		query = '';
		active = 0;
		dialog?.showModal();
		input?.focus();
	};
	const close = () => dialog?.close();

	async function choose(entry: MenuSearchEntry | undefined) {
		if (!entry) return;
		close();
		await goto(entry.href);
	}

	function onkeydown(e: KeyboardEvent) {
		const last = results.length - 1;
		switch (e.key) {
			case 'ArrowDown':
				e.preventDefault();
				active = active >= last ? 0 : active + 1;
				break;
			case 'ArrowUp':
				e.preventDefault();
				active = active <= 0 ? last : active - 1;
				break;
			case 'Home':
			case 'End':
				if (!e.ctrlKey) return; // metin içinde başa/sona gitme kutunun kendi davranışı
				e.preventDefault();
				active = e.key === 'Home' ? 0 : last;
				break;
			case 'Enter':
				e.preventDefault();
				void choose(results[active]);
				break;
		}
	}

	// Klavyeyle seçilen sonuç görünür alana kaydırılır
	const intoView =
		(selected: boolean): Attachment<HTMLElement> =>
		(node) => {
			if (selected) node.scrollIntoView({ block: 'nearest' });
		};

	// Dışarı (backdrop'a) tıklama: hedef dialog'un kendisiyse içerik dışıdır
	const onclick = (e: MouseEvent) => {
		if (e.target === dialog) close();
	};
</script>

<dialog bind:this={dialog} class="slc-palette" aria-label={t('menu_search')} {onclick}>
	<div class="flex max-h-[min(32rem,80dvh)] flex-col overflow-hidden rounded-xl bg-(--slc-system-bg-surface)">
		<div class="border-surface-200 flex items-center gap-2 border-b px-4">
			<Icon name="search" size={18} class="text-surface-500 shrink-0" />
			<input
				bind:this={input}
				bind:value={query}
				oninput={() => (active = 0)}
				{onkeydown}
				type="text"
				role="combobox"
				aria-label={t('menu_search')}
				aria-expanded="true"
				aria-controls="{id}-listbox"
				aria-autocomplete="list"
				aria-activedescendant={results.length ? optionId(active) : undefined}
				placeholder={t('menu_search_placeholder')}
				autocomplete="off"
				spellcheck="false"
				class="text-surface-900 h-12 min-w-0 flex-1 bg-transparent outline-none"
			/>
		</div>
		<ul id="{id}-listbox" role="listbox" aria-label={t('menu_search')} class="min-h-0 flex-1 overflow-y-auto p-2">
			{#each results as entry, i (entry.id)}
				<!-- Fare: üzerine gelince seçili olur, tıklayınca açılır; klavye odağı arama kutusunda kalır -->
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<li
					id={optionId(i)}
					role="option"
					aria-selected={i === active}
					class="slc-palette-option"
					onmousemove={() => (active = i)}
					onclick={() => choose(entry)}
					{@attach intoView(i === active)}
				>
					<span class="text-surface-950 truncate">{entry.title}</span>
					{#if entry.path.length}<span class="text-surface-600 truncate text-xs">{entry.path.join(' › ')}</span>{/if}
				</li>
			{:else}
				<li role="presentation" class="text-surface-500 px-3 py-6 text-center text-sm">{t('menu_search_empty')}</li>
			{/each}
		</ul>
		<div class="border-surface-200 text-surface-500 hidden gap-4 border-t px-4 py-2 text-xs sm:flex">
			<span><kbd>↑</kbd> <kbd>↓</kbd> {t('menu_search_move')}</span>
			<span><kbd>Enter</kbd> {t('menu_search_open')}</span>
			<span><kbd>Esc</kbd> {t('close')}</span>
		</div>
	</div>
</dialog>

<style>
	.slc-palette {
		margin: 12dvh auto auto;
		padding: 0;
		border: 0;
		width: min(36rem, calc(100vw - 2rem));
		max-width: none;
		background: transparent;
		/* Kenarlık temaya göre (surface-300 koyu temada orta ton): koyu zeminde pencere arka plandan ayrışır */
		outline: 1px solid var(--color-surface-300);
		box-shadow: 0 16px 48px -8px rgb(0 0 0 / 0.4);
		border-radius: 0.75rem;
	}
	/* Arka plan: açık temada sayfa hafifçe kararır; koyu temada sayfa zaten koyu olduğu için daha çok karartılır ki
	   pencere (surface-50) öne çıksın */
	.slc-palette::backdrop {
		background-color: rgb(0 0 0 / 0.35);
	}
	:global(.dark) .slc-palette::backdrop {
		background-color: rgb(0 0 0 / 0.7);
	}
	:global(.dark) .slc-palette {
		box-shadow: 0 16px 48px -8px rgb(0 0 0 / 0.9);
	}
	.slc-palette-option {
		display: flex;
		flex-direction: column;
		gap: 0.125rem;
		padding: 0.5rem 0.75rem;
		border-radius: 0.5rem;
		cursor: pointer;
	}
	/* Seçili: hafif marka tonu + solda marka şeridi. Tam dolu primary-100 koyu temada kahveye dönüyor, gri yol metni
	   üzerinde okunmuyordu; bu ton her iki temada metni (surface-950 / surface-600) okunur bırakır. */
	.slc-palette-option[aria-selected='true'] {
		background-color: color-mix(in oklab, var(--color-primary-500) 14%, transparent);
		box-shadow: inset 3px 0 0 var(--color-primary-500);
	}
	kbd {
		padding: 0 0.25rem;
		border: 1px solid var(--color-surface-300);
		border-radius: 0.25rem;
		font-family: inherit;
	}
</style>
