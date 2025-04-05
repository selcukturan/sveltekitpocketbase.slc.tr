<script lang="ts">
	import { enhance } from '$app/forms';
	import { writeFile, utils } from 'xlsx';

	let { data } = $props();

	function getFileName() {
		const today = new Date();
		const year = `${today.getFullYear()}`.substring(2, 4);
		const month = String(today.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arası olduğu için +1 ekliyoruz
		const day = String(today.getDate()).padStart(2, '0');
		const hour = String(today.getHours()).padStart(2, '0');
		const minute = String(today.getMinutes()).padStart(2, '0');
		const second = String(today.getSeconds()).padStart(2, '0');
		return `${year}${month}${day}${hour}${minute}${second}_mdl_import_template.xlsx`;
	}
</script>

<div>
	<form
		method="POST"
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success' && result.data) {
					const xData = result.data.records;
					const data = Array.isArray(xData) ? xData : [];
					const worksheet = utils.json_to_sheet(data, { cellDates: true, UTC: true }); // tarih formati icin: dateNF: 'dd/mm/yyyy'
					const workbook = utils.book_new();
					worksheet['!cols'] = [
						{ wch: 4 },
						{ wch: 4 },
						{ wch: 4 },
						{ wch: 20 },
						{ wch: 11 },
						{ wch: 11 },
						{ wch: 8 },
						{ wch: 17 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 63 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 47 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 14 },
						{ wch: 8 },
						{ wch: 13 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 8 },
						{ wch: 17 }
					];
					data.forEach((item, index) => {
						const value = worksheet[`T${index + 2}`].v;
						const price = value ? value : 0;
						worksheet[`T${index + 2}`] = { t: 'n', f: `_xlfn.ROUND((${price}/(U${index + 2}/100+1)),2)` };
					});
					utils.book_append_sheet(workbook, worksheet, 'template');
					writeFile(workbook, getFileName());
				} else {
					alert("Bir hata oluştu. Lütfen console.log'a bakın.");
					console.log(result);
				}
			};
		}}
	>
		<div class="grid w-full max-w-sm items-center gap-1.5">
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
			<button type="submit">İndir</button>
		</div>
	</form>
</div>
