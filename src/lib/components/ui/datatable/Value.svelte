<script lang="ts" module>
	import type { ColumnType } from './types.js';

	// PocketBase tarih biçimi: '2026-11-17 10:20:30.123Z' (boşluklu) ya da ISO 'T'
	const DATETIME_RE = /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}/;
	const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

	/**
	 * Tip verilmediyse değerden tahmin eder.
	 * Not: Çalışma anında yalnızca JS değeri görülür. Boş metin, ID ya da '5' gibi metinler 'text' sayılır;
	 * kesin sonuç için kolona `type` verin.
	 */
	export function inferType(value: unknown): Exclude<ColumnType, 'actions' | 'select'> {
		if (typeof value === 'boolean') return 'bool';
		if (typeof value === 'number') return 'number';
		if (Array.isArray(value)) return 'list';
		if (value !== null && typeof value === 'object') return 'json';
		if (typeof value === 'string') {
			if (DATE_RE.test(value)) return 'date';
			if (DATETIME_RE.test(value)) return 'datetime';
		}
		return 'text';
	}

	const isEmpty = (value: unknown) => value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0);

	// PocketBase '2026-11-17 10:20:30.123Z' → Date (Safari boşluklu biçimi okuyamaz)
	const toDate = (value: unknown) => {
		const d = new Date(String(value).replace(' ', 'T'));
		return Number.isNaN(d.getTime()) ? undefined : d;
	};
</script>

<script lang="ts">
	import { getSelectedLang } from '#lib/app/localization/index.js';
	import { numberFormat, dateFormat, DATETIME } from './format.js';

	// wrap: false → tablo hücresi (tek satır, taşan kısım …); true → detay görünümü (satır kaydırır, liste etiket olur)
	let { value, type, wrap = false }: { value: unknown; type?: ColumnType; wrap?: boolean } = $props();

	const kind = $derived(type && type !== 'actions' && type !== 'select' ? type : inferType(value));
	const locale = $derived(getSelectedLang());

	const text = $derived.by(() => {
		if (isEmpty(value)) return '';
		switch (kind) {
			case 'number':
				return typeof value === 'number' ? numberFormat(locale).format(value) : String(value);
			case 'date': {
				const d = toDate(value);
				return d ? dateFormat(locale).format(d) : String(value);
			}
			case 'datetime': {
				const d = toDate(value);
				return d ? dateFormat(locale, DATETIME).format(d) : String(value);
			}
			case 'list':
				return Array.isArray(value) ? value.join(', ') : String(value);
			case 'json':
				return JSON.stringify(value, null, wrap ? 2 : undefined);
			default:
				return String(value);
		}
	});
</script>

{#if kind === 'bool'}
	<span class={value ? 'text-success-600' : 'text-surface-400'} aria-label={String(Boolean(value))}>{value ? '✓' : '—'}</span>
{:else if !wrap}
	<!-- Tablo hücresi: boş ve dolu aynı span (satır geri dönüşümünde dal değişip düğüm yeniden kurulmasın) -->
	<span class={['block min-w-0 truncate', text === '' && 'text-surface-400']} title={text || undefined}>{text || '—'}</span>
{:else if text === ''}
	<span class="text-surface-400">—</span>
{:else if kind === 'list' && Array.isArray(value)}
	<span class="flex flex-wrap gap-1">
		{#each value as item, i (i)}
			<span class="bg-surface-200 text-surface-800 max-w-full rounded px-1.5 py-0.5 text-xs break-all">{String(item)}</span>
		{/each}
	</span>
{:else if kind === 'json'}
	<pre class="bg-surface-100 max-h-60 overflow-auto rounded p-2 text-xs break-all whitespace-pre-wrap">{text}</pre>
{:else}
	<span class="block [overflow-wrap:anywhere] break-words whitespace-pre-wrap">{text}</span>
{/if}
