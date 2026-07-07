<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { getGlobalContext } from '$lib/app/global.svelte';
	const global = getGlobalContext();
</script>

<Head>
	<title>Developments - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Application Tailwind v4 Theme System</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<div class="flex h-full w-full flex-col overflow-hidden">
				<div class="relative flex-1 overflow-x-hidden overflow-y-auto p-1">
					<div class="p-4">
						<div class="p-4">isMobileBreakpoint: {global.isMobileBreakpoint}</div>
						<!-- <div class="p-4">
				<button type="button" onclick={() => localStorage.removeItem('slc:splitpane')}>Clear localStorage</button>
			</div> -->
						<div class="p-4">
							<span class="slc-screen-test bg-error-500 sm:bg-info-500 md:bg-success-500 lg:bg-warning-500 h-3 w-3"></span>
							<span>{@html `< ====== >`}</span>
							<span class="bg-error-500 h-3 w-3">mobile</span>
							<span class="bg-info-500 h-3 w-3">sm</span>
							<span class="bg-success-500 h-3 w-3">md</span>
							<span class="bg-warning-500 h-3 w-3">lg</span>
						</div>

						<span class="text-surface-950 p-4">surface (Slate)</span>
						<div class="border-surface-950 m-4 flex flex-row border text-sm">
							<div class="bg-surface-50 text-surface-950 p-4 whitespace-nowrap">50</div>
							<div class="bg-surface-100 text-surface-900 p-4 whitespace-nowrap">100</div>
							<div class="bg-surface-200 text-surface-900 p-4 whitespace-nowrap">200</div>
							<div class="bg-surface-300 text-surface-900 p-4 whitespace-nowrap">300</div>
							<div class="bg-surface-400 text-surface-900 p-4 whitespace-nowrap">400</div>
							<div class="bg-surface-500 text-surface-950 p-4 whitespace-nowrap">500</div>
							<div class="bg-surface-600 text-surface-100 p-4 whitespace-nowrap">600</div>
							<div class="bg-surface-700 text-surface-100 p-4 whitespace-nowrap">700</div>
							<div class="bg-surface-800 text-surface-100 p-4 whitespace-nowrap">800</div>
							<div class="bg-surface-900 text-surface-100 p-4 whitespace-nowrap">900</div>
							<div class="bg-surface-950 text-surface-50 p-4 whitespace-nowrap">950</div>
						</div>

						<span class="text-primary-950 p-4">primary (Brand - Vintage Primary)</span>
						<div class="border-primary-950 m-4 flex flex-row border text-sm">
							<div class="bg-primary-50 text-primary-950 p-4 whitespace-nowrap">50</div>
							<div class="bg-primary-100 text-primary-900 p-4 whitespace-nowrap">100</div>
							<div class="bg-primary-200 text-primary-800 p-4 whitespace-nowrap">200</div>
							<div class="bg-primary-300 text-primary-800 p-4 whitespace-nowrap">300</div>
							<div class="bg-primary-400 text-primary-800 p-4 whitespace-nowrap">400</div>
							<div class="bg-primary-500 text-primary-950 p-4 whitespace-nowrap">500</div>
							<div class="bg-primary-600 text-primary-200 p-4 whitespace-nowrap">600</div>
							<div class="bg-primary-700 text-primary-200 p-4 whitespace-nowrap">700</div>
							<div class="bg-primary-800 text-primary-200 p-4 whitespace-nowrap">800</div>
							<div class="bg-primary-900 text-primary-100 p-4 whitespace-nowrap">900</div>
							<div class="bg-primary-950 text-primary-50 p-4 whitespace-nowrap">950</div>
						</div>

						<span class="text-secondary-950 p-4">secondary (Accent - Vintage Secondary)</span>
						<div class="border-secondary-950 m-4 flex flex-row border text-sm">
							<div class="bg-secondary-50 text-secondary-950 p-4 whitespace-nowrap">50</div>
							<div class="bg-secondary-100 text-secondary-900 p-4 whitespace-nowrap">100</div>
							<div class="bg-secondary-200 text-secondary-800 p-4 whitespace-nowrap">200</div>
							<div class="bg-secondary-300 text-secondary-800 p-4 whitespace-nowrap">300</div>
							<div class="bg-secondary-400 text-secondary-800 p-4 whitespace-nowrap">400</div>
							<div class="bg-secondary-500 text-secondary-950 p-4 whitespace-nowrap">500</div>
							<div class="bg-secondary-600 text-secondary-200 p-4 whitespace-nowrap">600</div>
							<div class="bg-secondary-700 text-secondary-200 p-4 whitespace-nowrap">700</div>
							<div class="bg-secondary-800 text-secondary-200 p-4 whitespace-nowrap">800</div>
							<div class="bg-secondary-900 text-secondary-100 p-4 whitespace-nowrap">900</div>
							<div class="bg-secondary-950 text-secondary-50 p-4 whitespace-nowrap">950</div>
						</div>

						<span class="text-tertiary-950 p-4">tertiary (Accent - Vintage Tertiary)</span>
						<div class="border-tertiary-950 m-4 flex flex-row border text-sm">
							<div class="bg-tertiary-50 text-tertiary-950 p-4 whitespace-nowrap">50</div>
							<div class="bg-tertiary-100 text-tertiary-900 p-4 whitespace-nowrap">100</div>
							<div class="bg-tertiary-200 text-tertiary-800 p-4 whitespace-nowrap">200</div>
							<div class="bg-tertiary-300 text-tertiary-800 p-4 whitespace-nowrap">300</div>
							<div class="bg-tertiary-400 text-tertiary-800 p-4 whitespace-nowrap">400</div>
							<div class="bg-tertiary-500 text-tertiary-950 p-4 whitespace-nowrap">500</div>
							<div class="bg-tertiary-600 text-tertiary-200 p-4 whitespace-nowrap">600</div>
							<div class="bg-tertiary-700 text-tertiary-200 p-4 whitespace-nowrap">700</div>
							<div class="bg-tertiary-800 text-tertiary-200 p-4 whitespace-nowrap">800</div>
							<div class="bg-tertiary-900 text-tertiary-100 p-4 whitespace-nowrap">900</div>
							<div class="bg-tertiary-950 text-tertiary-50 p-4 whitespace-nowrap">950</div>
						</div>

						<span class="text-quaternary-950 p-4">quaternary (Yellow)</span>
						<div class="border-quaternary-950 m-4 flex flex-row border text-sm">
							<div class="bg-quaternary-50 text-quaternary-950 p-4 whitespace-nowrap">50</div>
							<div class="bg-quaternary-100 text-quaternary-900 p-4 whitespace-nowrap">100</div>
							<div class="bg-quaternary-200 text-quaternary-800 p-4 whitespace-nowrap">200</div>
							<div class="bg-quaternary-300 text-quaternary-800 p-4 whitespace-nowrap">300</div>
							<div class="bg-quaternary-400 text-quaternary-800 p-4 whitespace-nowrap">400</div>
							<div class="bg-quaternary-500 text-quaternary-950 p-4 whitespace-nowrap">500</div>
							<div class="bg-quaternary-600 text-quaternary-200 p-4 whitespace-nowrap">600</div>
							<div class="bg-quaternary-700 text-quaternary-200 p-4 whitespace-nowrap">700</div>
							<div class="bg-quaternary-800 text-quaternary-200 p-4 whitespace-nowrap">800</div>
							<div class="bg-quaternary-900 text-quaternary-100 p-4 whitespace-nowrap">900</div>
							<div class="bg-quaternary-950 text-quaternary-50 p-4 whitespace-nowrap">950</div>
						</div>

						<span class="text-info-950 p-4">info (Blue)</span>
						<div class="border-info-950 m-4 flex flex-row border text-sm">
							<div class="bg-info-50 text-info-950 p-4 whitespace-nowrap">50</div>
							<div class="bg-info-100 text-info-900 p-4 whitespace-nowrap">100</div>
							<div class="bg-info-200 text-info-800 p-4 whitespace-nowrap">200</div>
							<div class="bg-info-300 text-info-800 p-4 whitespace-nowrap">300</div>
							<div class="bg-info-400 text-info-800 p-4 whitespace-nowrap">400</div>
							<div class="bg-info-500 text-info-950 p-4 whitespace-nowrap">500</div>
							<div class="bg-info-600 text-info-200 p-4 whitespace-nowrap">600</div>
							<div class="bg-info-700 text-info-200 p-4 whitespace-nowrap">700</div>
							<div class="bg-info-800 text-info-200 p-4 whitespace-nowrap">800</div>
							<div class="bg-info-900 text-info-100 p-4 whitespace-nowrap">900</div>
							<div class="bg-info-950 text-info-50 p-4 whitespace-nowrap">950</div>
						</div>

						<span class="text-success-950 p-4">success (Lime)</span>
						<div class="border-success-950 m-4 flex flex-row border text-sm">
							<div class="bg-success-50 text-success-950 p-4 whitespace-nowrap">50</div>
							<div class="bg-success-100 text-success-900 p-4 whitespace-nowrap">100</div>
							<div class="bg-success-200 text-success-800 p-4 whitespace-nowrap">200</div>
							<div class="bg-success-300 text-success-800 p-4 whitespace-nowrap">300</div>
							<div class="bg-success-400 text-success-800 p-4 whitespace-nowrap">400</div>
							<div class="bg-success-500 text-success-950 p-4 whitespace-nowrap">500</div>
							<div class="bg-success-600 text-success-200 p-4 whitespace-nowrap">600</div>
							<div class="bg-success-700 text-success-200 p-4 whitespace-nowrap">700</div>
							<div class="bg-success-800 text-success-200 p-4 whitespace-nowrap">800</div>
							<div class="bg-success-900 text-success-100 p-4 whitespace-nowrap">900</div>
							<div class="bg-success-950 text-success-50 p-4 whitespace-nowrap">950</div>
						</div>

						<span class="text-warning-950 p-4">warning (Amber)</span>
						<div class="border-warning-950 m-4 flex flex-row border text-sm">
							<div class="bg-warning-50 text-warning-950 p-4 whitespace-nowrap">50</div>
							<div class="bg-warning-100 text-warning-900 p-4 whitespace-nowrap">100</div>
							<div class="bg-warning-200 text-warning-800 p-4 whitespace-nowrap">200</div>
							<div class="bg-warning-300 text-warning-800 p-4 whitespace-nowrap">300</div>
							<div class="bg-warning-400 text-warning-800 p-4 whitespace-nowrap">400</div>
							<div class="bg-warning-500 text-warning-950 p-4 whitespace-nowrap">500</div>
							<div class="bg-warning-600 text-warning-200 p-4 whitespace-nowrap">600</div>
							<div class="bg-warning-700 text-warning-200 p-4 whitespace-nowrap">700</div>
							<div class="bg-warning-800 text-warning-200 p-4 whitespace-nowrap">800</div>
							<div class="bg-warning-900 text-warning-100 p-4 whitespace-nowrap">900</div>
							<div class="bg-warning-950 text-warning-50 p-4 whitespace-nowrap">950</div>
						</div>

						<span class="text-error-950 p-4">error (Red)</span>
						<div class="border-error-950 m-4 flex flex-row border text-sm">
							<div class="bg-error-50 text-error-950 p-4 whitespace-nowrap">50</div>
							<div class="bg-error-100 text-error-900 p-4 whitespace-nowrap">100</div>
							<div class="bg-error-200 text-error-800 p-4 whitespace-nowrap">200</div>
							<div class="bg-error-300 text-error-800 p-4 whitespace-nowrap">300</div>
							<div class="bg-error-400 text-error-800 p-4 whitespace-nowrap">400</div>
							<div class="bg-error-500 text-error-950 p-4 whitespace-nowrap">500</div>
							<div class="bg-error-600 text-error-200 p-4 whitespace-nowrap">600</div>
							<div class="bg-error-700 text-error-200 p-4 whitespace-nowrap">700</div>
							<div class="bg-error-800 text-error-200 p-4 whitespace-nowrap">800</div>
							<div class="bg-error-900 text-error-100 p-4 whitespace-nowrap">900</div>
							<div class="bg-error-950 text-error-50 p-4 whitespace-nowrap">950</div>
						</div>
					</div>
				</div>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<!-- <Page.Footer>Footer</Page.Footer> -->
</Page>
