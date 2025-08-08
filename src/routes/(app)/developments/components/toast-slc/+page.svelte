<script lang="ts">
	import { Page, Head } from '$lib/components/templates';

	import { Toasts, createToaster, getToaster } from '$lib/components/base/toast';

	const appToaster = getToaster('app-toaster');
	const pageToaster = createToaster({
		id: 'page-toaster',
		position: 'bottom-center'
	});
</script>

<Head>
	<title>SLC - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Toasts id="page-toaster" />

<Page>
	<Page.Header>
		<p>Zag.js UI Toast</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<p class="p-3">Page Toast</p>
			<div class="grid w-full max-w-72 grid-cols-2 gap-2">
				<button
					class="bg-info-400 text-info-50 rounded"
					onclick={() => {
						pageToaster.add({
							type: 'info',
							title: 'Bilgi',
							description:
								'Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit.',
							action: {
								label: 'Detay',
								onClick: () => {
									console.log('onClick');
								}
							}
						});
					}}
				>
					Info
				</button>
				<button
					class="bg-success-400 text-success-50 rounded"
					onclick={() => {
						pageToaster.add({
							type: 'success',
							title: 'Başarılı',
							description: 'Success lorem ipsum dolor sit amet.',
							action: {
								label: 'Detay',
								onClick: () => {
									console.log('onClick');
								}
							}
						});
					}}
				>
					Success
				</button>
				<button
					class="bg-warning-400 text-warning-50 rounded"
					onclick={() => {
						pageToaster.add({
							type: 'warning',
							title: 'Uyarı',
							description: 'Warning lorem ipsum dolor sit amet.',
							closable: false
						});
					}}
				>
					Warning
				</button>
				<button
					class="bg-error-400 text-error-50 rounded"
					onclick={() => {
						pageToaster.add({
							type: 'error',
							title: 'Hata',
							description: 'Error lorem ipsum dolor sit amet, consectetur adipisicing elit.',
							action: {
								label: 'Detay',
								onClick: () => {
									console.log('onClick');
								}
							}
						});
					}}
				>
					Error
				</button>

				<button
					class="bg-surface-400 text-surface-50 rounded"
					onclick={() =>
						pageToaster.add({
							type: 'info',
							title: 'Silmek istediğinize emin misiniz?',
							description: 'Loading lorem ipsum dolor sit amet, consectetur adipisicing elit.',
							closable: false,
							action: {
								label: 'İptal',
								onClick: () => {
									console.log('onClick');
								}
							}
						})}
				>
					Action
				</button>

				<button
					class="bg-surface-400 text-surface-50 rounded"
					onclick={() => {
						pageToaster.add({
							type: 'info',
							title: 'Silmek istediğinize emin misiniz?',
							description: 'Loading lorem ipsum dolor sit amet, consectetur adipisicing elit.',
							duration: 0,
							closable: true,
							action: {
								label: 'İptal',
								onClick: () => {
									console.log('onClick');
								}
							}
						});
					}}
				>
					Duration 0
				</button>
				<button
					class="bg-surface-400 text-surface-50 rounded"
					onclick={() => {
						console.log('onClick');
						/* const promise = new Promise((resolve, reject) => {
							setTimeout(() => {
								resolve('Success');
							}, 3000);
						});
						pageToaster.promise(promise, {
							loading: {
								title: 'Yükleniyor',
								description: 'Lütfen bekleyin...'
							},
							success: (data) => ({
								title: 'Başarılı',
								description: 'İşleminiz tamamlandı'
							}),
							error: (err) => ({
								title: 'Hata',
								description: 'Bir hata oluştu'
							})
						}); */
					}}
				>
					Promise
				</button>
			</div>
			<p class="p-3">App Toast</p>
			<div class="grid w-full max-w-72 grid-cols-2 gap-2">
				<button
					class="bg-info-400 text-info-50 rounded"
					onclick={() => {
						appToaster.add({
							type: 'info',
							title: 'This is a APP toast!.',
							description:
								'Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit.',
							action: {
								label: 'Detay',
								onClick: (id) => {
									appToaster.remove(id);
								}
							}
						});
					}}>Info</button
				>
				<button
					class="bg-success-400 text-success-50 rounded"
					onclick={() => {
						appToaster.add({
							type: 'success',
							title: 'This is a APP toast!',
							description: 'Success lorem ipsum dolor sit amet, consectetur adipisicing elit.'
						});
					}}>Success</button
				>
				<button
					class="bg-warning-400 text-warning-50 rounded"
					onclick={() => {
						appToaster.add({
							type: 'warning',
							title: 'This is a APP toast!',
							description: 'Warning lorem ipsum dolor sit amet, consectetur adipisicing elit.'
						});
					}}>Warning</button
				>
				<button
					class="bg-error-400 text-error-50 rounded"
					onclick={() => {
						appToaster.add({
							type: 'error',
							title: 'This is a APP toast!',
							description: 'Error lorem ipsum dolor sit amet, consectetur adipisicing elit.'
						});
					}}>Error</button
				>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Toast Footer</p>
	</Page.Footer>
</Page>
