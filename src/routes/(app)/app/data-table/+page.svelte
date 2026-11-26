<script lang="ts">
	// DataTable'ın en temel hali: başlık, veri ve footer satırları açıkça yazılmış (snippet'ler).
	// Snippet'ler verilmeseydi tablo aynı şeyi kendisi çizerdi: <dt.DataTable {list} {columns} {footers} />
	// Veri kaynağı Simple CRUD sayfasının remote fonksiyonları.
	import { t } from '#lib/app/localization/index.js';
	import { Page, Head } from '#lib/components/templates/index.js';
	import * as dt from '#lib/components/ui/datatable/index.js';
	import { TABLE } from '../grapes/crud/simple/page.shared';
	import { getList } from '../grapes/crud/simple/page.remote';

	const list = dt.createList(getList, TABLE.listParamsSchema); // filtre + sayfalama + sıralama + sorgu

	type Item = Awaited<ReturnType<typeof getList>>['items'][number];
	const columns: dt.Column<Item>[] = [
		{ field: 'id', label: 'dt_id', width: 'minmax(50px,1fr)' },
		{ field: 'text_required', label: 'dt_text_required', width: 'minmax(50px,1fr)' },
		{ field: 'text_optional', label: 'dt_text_optional', width: 'minmax(50px,1fr)' },
		{ field: 'number_optional', label: 'number_optional', type: 'number', width: '130px' },
		{ field: 'date_optional', label: 'date_optional', type: 'date', width: '130px' },
		{ field: 'bool_optional', label: 'bool_optional', type: 'bool', width: '120px' },
		{ field: 'updated', label: 'updated', type: 'datetime', width: '170px' }
	];

	// Footer: kısayollar yüklü satırlardan (bu sayfa) hesaplanır; diğer değerler metin olarak gösterilir
	const footers: dt.Footer<Item>[] = [
		{ text_optional: 'Toplam', number_optional: 'sum(2)', date_optional: 'count()' },
		{ text_optional: 'Ortalama', number_optional: 'avg(2)' }
	];
</script>

<Head>
	<title>Data Table - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Main>
		<Page.Main.Table>
			<!-- <dt.DataTable {list} {columns} {footers} /> -->

			<!-- OR -->

			<dt.DataTable {list} {columns} {footers}>
				{#snippet headerRow(hr)}
					<dt.HeaderRow {hr}>
						{#snippet headerCell(hc)}
							<!-- Etiket çevrilir; çeviri yoksa etiketin kendisi görünür -->
							{@const label = String(hc.label ?? hc.col.data.field)}
							<dt.HeaderCell {hr} {hc}>{t(label, undefined, label)}</dt.HeaderCell>
						{/snippet}
					</dt.HeaderRow>
				{/snippet}

				{#snippet dataRow(dr)}
					<dt.DataRow {dr}>
						{#snippet dataCell(dc)}
							<!-- Değer kolon tipine göre biçimlenir; düzenlerken DataCell içeriğin yerine düzenleyiciyi çizer -->
							<dt.DataCell {dr} {dc}>
								<dt.Value value={dc.value} type={dc.col.data.type} />
							</dt.DataCell>
						{/snippet}
					</dt.DataRow>
				{/snippet}

				{#snippet footerRow(fr)}
					<dt.FooterRow {fr}>
						{#snippet footerCell(fc)}
							<!-- İçerik verilmez: sum(2), avg(2), count() kısayollarını FooterCell hesaplar -->
							<dt.FooterCell {fr} {fc} />
						{/snippet}
					</dt.FooterRow>
				{/snippet}
			</dt.DataTable>
		</Page.Main.Table>
	</Page.Main>
</Page>
