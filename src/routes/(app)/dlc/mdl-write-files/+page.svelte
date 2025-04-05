<script lang="ts">
	import { enhance } from '$app/forms';
	let { data } = $props();

	// Bugünün tarihini al
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arası olduğu için +1 ekliyoruz
	const day = String(today.getDate()).padStart(2, '0');

	// YYYY-MM-DD formatında tarih oluştur
	let formattedDate = $state(`${year}-${month}-${day}`);
</script>

<div>
	<form method="POST" enctype="multipart/form-data" use:enhance>
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<label>
				Belge Tarihi
				<input type="date" name="dlcMdlDate" id="dlcMdlDate" value={formattedDate} class="w-32" />
			</label>

			<label>
				Yükleme Seç
				<select
					name="dlcMdlFilesRecord"
					id="dlcMdlFilesRecord"
					class="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50"
				>
					{#each data.resultList.items as item}
						<option value={item.id} title={item.mdlFiles.join(' | ')}>
							{`${item.created} - (${item.mdlFiles.length}) - ${item.id}`}
						</option>
					{/each}
				</select>
			</label>

			<button type="submit">Yaz</button>
		</div>
	</form>
</div>
