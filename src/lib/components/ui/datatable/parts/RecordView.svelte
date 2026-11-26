<script lang="ts">
	import type { SvelteHTMLElements } from 'svelte/elements';
	import Value from '../Value.svelte';

	type Props = SvelteHTMLElements['dl'] & { record: Record<string, unknown> };

	let { record, class: classes, ...attributes }: Props = $props();
</script>

<!-- Kaydın tüm alanları: anahtar | değer. minmax(0,1fr): değer kolonu içeriğe göre büyüyüp yatay scroll üretmez;
     uzun değerler satır kaydırır -->
<dl
	class="grid grid-cols-[minmax(7rem,max-content)_minmax(0,1fr)] content-start gap-x-6 gap-y-3 overflow-x-hidden overflow-y-auto p-6 text-sm {classes}"
	{...attributes}
>
	{#each Object.entries(record) as [key, value] (key)}
		<dt class="text-surface-500 font-medium break-all">{key}</dt>
		<dd class="min-w-0"><Value {value} wrap /></dd>
	{/each}
</dl>
