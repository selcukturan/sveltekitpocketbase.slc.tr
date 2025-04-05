<script lang="ts">
	import { getToast } from '$lib/components/base/toast';
	const toast = getToast();

	function testHandleAction() {
		alert('Action clicked');
	}
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	<div class="bg-success-100 p-1">
		<h6>Toast</h6>
	</div>

	<div class="relative flex-1 overflow-y-auto overflow-x-hidden p-1">
		<button
			onclick={() =>
				toast.create({
					type: 'info',
					title: 'Bilgi',
					description: 'Info lorem ipsum dolor sit amet, consectetur adipisicing elit.',
					action: {
						label: 'Detay',
						onClick: () => {
							toast.create({ type: 'success', title: 'Başarılı', description: 'İşlem yapıldı.' });
						}
					}
				})}
			style="background-color:#5499e8;color:#cee2f8;padding:5px;margin:5px;"
		>
			info
		</button>
		<button
			onclick={() =>
				toast.create({
					type: 'success',
					title: 'Başarılı',
					description: 'Success lorem ipsum dolor sit amet, consectetur adipisicing elit.',
					action: {
						label: 'Detay',
						onClick: () => {
							toast.create({ type: 'success', title: 'Başarılı', description: 'İşlem yapıldı.' });
						}
					}
				})}
			style="background-color:#32ad84;color:#c4eedc;padding:5px;margin:5px;"
		>
			success
		</button>
		<button
			onclick={() =>
				toast.create({
					type: 'warning',
					title: 'Uyarı',
					description: 'Warning lorem ipsum dolor sit amet, consectetur adipisicing elit.',
					action: {
						label: 'Detay',
						onClick: () => {
							toast.create({ type: 'success', title: 'Başarılı', description: 'İşlem yapıldı.' });
						}
					}
				})}
			style="background-color:#ff944d;color:#ffd4b8;padding:5px;margin:5px;"
		>
			warning
		</button>
		<button
			onclick={() =>
				toast.create({
					type: 'error',
					title: 'Hata',
					description: 'Error lorem ipsum dolor sit amet, consectetur adipisicing elit.',
					action: {
						label: 'Detay',
						onClick: () => {
							toast.create({ type: 'success', title: 'Başarılı', description: 'İşlem yapıldı.' });
						}
					}
				})}
			style="background-color:#e34562;color:#f7cad2;padding:5px;margin:5px;"
		>
			error
		</button>
		<button
			onclick={() =>
				toast.create({
					type: 'loading',
					title: 'İşleminiz yapılıyor',
					description: 'Loading lorem ipsum dolor sit amet, consectetur adipisicing elit.',
					action: {
						label: 'İptal',
						onClick: () => {
							toast.create({ type: 'success', title: 'Başarılı', description: 'İptal edildi.' });
						}
					}
				})}
		>
			Action
		</button>
		<button
			onclick={() => {
				const promise = new Promise((resolve, reject) => {
					setTimeout(() => {
						resolve('Success');
					}, 3000);
				});
				toast.promise(promise, {
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
	<div class="bg-warning-100 p-1">
		<h6>https://github.com/pocketbase/pocketbase/blob/master/ui/src/components/base/Toasts.svelte</h6>
	</div>
</div>
