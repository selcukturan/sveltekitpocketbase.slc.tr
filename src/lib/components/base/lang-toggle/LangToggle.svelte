<script lang="ts">
	import { t, getSelectedLang, setSelectedLang } from '$lib/app/localization.svelte';
	import { tooltip } from '$lib/attachments';
</script>

<button
	onclick={() => setSelectedLang(getSelectedLang() === 'tr' ? 'en' : 'tr')}
	class="cursor-pointer"
	{@attach tooltip(getSelectedLang() === 'tr' ? t('change_language_english') : t('change_language_turkish'))}
>
	<div class="flag-container">
		{#if getSelectedLang() === 'tr'}
			<!-- Türkiye (TR) -->
			<svg class="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" preserveAspectRatio="none">
				<rect width="1200" height="800" fill="#E30A17" />
				<circle cx="425" cy="400" r="200" fill="#fff" />
				<circle cx="475" cy="400" r="160" fill="#E30A17" />
				<polygon points="583.3,400 710.9,441.4 632,332.9 632,467.1 710.9,358.6" fill="#fff" />
			</svg>
		{:else}
			<!-- Birleşik Krallık (EN) -->
			<svg class="flag-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" preserveAspectRatio="none">
				<rect width="60" height="30" fill="#012169" />
				<path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" />
				<path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" stroke-width="4" />
				<path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" />
				<path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6" />
			</svg>
		{/if}
	</div>
</button>

<style>
	.flag-container {
		display: flex;
		align-items: center;
	}

	.flag-icon {
		width: 40px;
		height: 22px;
		object-fit: cover;
		border-radius: 4px;
		border: 2px solid var(--color-surface-300);
		display: block;
	}
	.flag-icon:hover {
		border-color: var(--color-surface-400);
	}
</style>
