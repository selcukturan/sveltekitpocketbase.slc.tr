<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { Toaster, createToaster, appToaster } from '$lib/components/zagjs/toast';

	const pageToaster = createToaster({ overlap: true });
</script>

<Head>
	<title>Toast - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Zag.js UI Toast</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<Toaster toaster={pageToaster}>
				<p class="p-3">Page Toast</p>
				<div class="grid w-full max-w-72 grid-cols-2 gap-2">
					<button
						class="bg-info-400 text-info-50 rounded"
						onclick={() => {
							pageToaster.info({
								title: 'Bilgi',
								description:
									'Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit.',
								action: {
									label: 'Detay',
									onClick: () => {
										pageToaster.success({ title: 'Başarılı', description: 'İşlem yapıldı.' });
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
							pageToaster.success({
								type: 'success',
								title: 'Başarılı',
								description: 'Success lorem ipsum dolor sit amet, consectetur adipisicing elit.',
								action: {
									label: 'Detay',
									onClick: () => {
										pageToaster.success({ title: 'Başarılı', description: 'İşlem yapıldı.' });
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
							pageToaster.warning({
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
							pageToaster.error({
								title: 'Hata',
								description: 'Error lorem ipsum dolor sit amet, consectetur adipisicing elit.',
								action: {
									label: 'Detay',
									onClick: () => {
										pageToaster.success({ type: 'success', title: 'Başarılı', description: 'İşlem yapıldı.' });
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
							pageToaster.create({
								type: 'info',
								title: 'Silmek istediğinize emin misiniz?',
								description: 'Loading lorem ipsum dolor sit amet, consectetur adipisicing elit.',
								closable: false,
								action: {
									label: 'İptal',
									onClick: () => {
										pageToaster.warning({ title: 'İptal', description: 'İptal edildi.' });
									}
								}
							})}
					>
						Action
					</button>

					<button
						class="bg-surface-400 text-surface-50 rounded"
						onclick={() => {
							const promise = new Promise((resolve, reject) => {
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
							});
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
							appToaster.info({
								title: 'This is a APP toast!.',
								description:
									'Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit. Info lorem ipsum dolor sit amet, consectetur adipisicing elit.',
								action: {
									label: 'Detay',
									onClick: () => {
										appToaster.success({ title: 'Başarılı', description: 'İşlem yapıldı.' });
									}
								}
							});
						}}>Info</button
					>
					<button
						class="bg-success-400 text-success-50 rounded"
						onclick={() => {
							appToaster.success({
								title: 'This is a APP toast!',
								description: 'Success lorem ipsum dolor sit amet, consectetur adipisicing elit.'
							});
						}}>Success</button
					>
					<button
						class="bg-warning-400 text-warning-50 rounded"
						onclick={() => {
							appToaster.warning({
								title: 'This is a APP toast!',
								description: 'Warning lorem ipsum dolor sit amet, consectetur adipisicing elit.'
							});
						}}>Warning</button
					>
					<button
						class="bg-error-400 text-error-50 rounded"
						onclick={() => {
							appToaster.error({
								title: 'This is a APP toast!',
								description: 'Error lorem ipsum dolor sit amet, consectetur adipisicing elit.'
							});
						}}>Error</button
					>
				</div>
			</Toaster>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Toast Footer</p>
	</Page.Footer>
</Page>
