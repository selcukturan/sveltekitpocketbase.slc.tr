<script lang="ts">
	import { t } from '$lib/app/localization';
	import { Page, Head } from '$lib/components/templates';
	import * as input from '$lib/components/ui/inputs';
	import { inputClasses } from '$lib/components/ui/inputs/common';

	let textInput = $state('initial value');
	let textInputOnChangeValue = $state('');
	let textInputBeforeValue = $state('');
	let textInputOnChangeValueCount = $state(0);
	let textInputIsInitial = $state(true);

	let textareaValue = $state('initial textarea value');
	let textareaOnChangeValue = $state('');
	let textareaOnChangeBeforeValue = $state('');
	let textareaOnChangeValueCount = $state(0);
	let textareaIsInitial = $state(true);

	let numberInput = $state(128);
	let numberInputOnChangeValue = $state(0);
	let numberInputOnChangeBeforeValue = $state(0);
	let numberInputOnChangeValueCount = $state(0);
	let numberInputIsInitial = $state(true);

	let datetimeInput = $state('2024-11-17 18:45:00.000Z');
	let datetimeInputOnChangeValue = $state('');
	let datetimeInputOnChangeBeforeValue = $state('');
	let datetimeInputOnChangeValueCount = $state(0);
	let datetimeInputIsInitial = $state(true);

	let dateInput = $state('2024-11-13 00:00:00.000Z');
	let dateInputOnChangeValue = $state('');
	let dateInputOnChangeBeforeValue = $state('');
	let dateInputOnChangeValueCount = $state(0);
	let dateInputIsInitial = $state(true);

	let selectSingleValue: string = $state('b');
	let selectSingleOnChangeValue: string | string[] = $state('');
	let selectSingleOnChangeBeforeValue: string | string[] = $state('');
	let selectSingleOnChangeValueCount = $state(0);
	let selectSingleIsInitial = $state(true);

	let selectMultiValue: string[] = $state(['b', 'c']);
	let selectMultiOnChangeValue: string | string[] = $state([]);
	let selectMultiOnChangeBeforeValue: string | string[] = $state([]);
	let selectMultiOnChangeValueCount = $state(0);
	let selectMultiIsInitial = $state(true);

	const shadowInputClasses = `${inputClasses.base} ${inputClasses.variants['default']} ${inputClasses.sizes['md']}`;

	const selectOptions = [
		{ label: 'a', value: 'a' },
		{ label: 'b', value: 'b' },
		{ label: 'c', value: 'c' },
		{ label: 'd', value: 'd' },
		{ label: 'e', value: 'e' },
		{ label: 'f', value: 'f' },
		{ label: 'g', value: 'g' },
		{ label: 'h', value: 'h' },
		{ label: 'i', value: 'i' },
		{ label: 'j', value: 'j' },
		{ label: 'k', value: 'k' },
		{ label: 'l', value: 'l' },
		{ label: 'm', value: 'm' },
		{ label: 'n', value: 'n' },
		{ label: 'o', value: 'o' },
		{ label: 'p', value: 'p' },
		{ label: 'q', value: 'q' },
		{ label: 'r', value: 'r' },
		{ label: 's', value: 's' },
		{ label: 't', value: 't' },
		{ label: 'u', value: 'u' },
		{ label: 'v', value: 'v' },
		{ label: 'w', value: 'w' },
		{ label: 'x', value: 'x' },
		{ label: 'y', value: 'y' },
		{ label: 'z', value: 'z' }
	];

	function random_value(type: 'integer' | 'decimal'): number;
	function random_value(type: 'boolean'): boolean;
	function random_value(type: 'text' | 'text_date' | 'text_date_time' | 'single_select'): string;
	function random_value(type: 'multi_select'): string[];
	function random_value(
		type: 'integer' | 'decimal' | 'text' | 'boolean' | 'text_date' | 'text_date_time' | 'multi_select' | 'single_select'
	): string | number | boolean | string[] {
		switch (type) {
			case 'integer':
				return Math.floor(Math.random() * 100);
			case 'decimal':
				return Math.random() * 100;
			case 'text':
				return Math.random().toString(36).substring(2, 15);
			case 'boolean':
				return Math.random() > 0.5;
			case 'text_date': {
				const start = new Date(2020, 0, 1).getTime();
				const end = new Date(2030, 0, 1).getTime();
				const randomDate = new Date(start + Math.random() * (end - start));
				return `${randomDate.toISOString().split('T')[0]} 00:00:00.000Z`;
			}
			case 'text_date_time': {
				const start = new Date(2020, 0, 1).getTime();
				const end = new Date(2030, 0, 1).getTime();
				const randomDate = new Date(start + Math.random() * (end - start));
				const isoString = randomDate.toISOString().replace('T', ' ');
				return `${isoString.slice(0, 16)}:00.000Z`;
			}
			case 'multi_select': {
				return selectOptions.filter(() => Math.random() > 0.5).map((o) => o.value);
			}
			case 'single_select': {
				return selectOptions[Math.floor(Math.random() * selectOptions.length)].value;
			}
		}
	}
	// ################### BEGIN File Variables ###################
	// Tekli dosya seçimi durumları
	let singleValue = $state<string>('');
	let singleSelectedFiles = $state<File[]>([]);
	let singleBeforeValue = $state<string>('');
	let singleOnChangeCount = $state(0);
	let singleIsInitial = $state(true);

	// Çoklu dosya seçimi durumları
	let multiValue = $state<string[]>([]);
	let multiSelectedFiles = $state<File[]>([]);
	let multiBeforeValue = $state<string[]>([]);
	let multiOnChangeCount = $state(0);
	let multiIsInitial = $state(true);

	// Rastgele değer üretebilmek için veya ilk değer atamak için
	let preloadedValue = $state<string>('ornek-dosya-1.pdf');
	let preloadedMultiValue = $state<string[]>(['eski-dosya.png', 'sertifika.pdf']);
	// ################### END File Variables ###################

	// ################### BEGIN Relation Variables ###################
	let relationSingleValue = $state<string>('');
	let relationSingleBeforeValue = $state<string>('');
	let relationSingleOnChangeCount = $state(0);
	let relationSingleIsInitial = $state(true);

	let relationMultiValue = $state<string[]>([]);
	let relationMultiBeforeValue = $state<string[]>([]);
	let relationMultiOnChangeCount = $state(0);
	let relationMultiIsInitial = $state(true);

	let preloadedRelationSingleValue = $state<string>('cq1gn5si46ouenc');
	let preloadedRelationMultiValue = $state<string[]>(['zcojn5spf0p81rx', 'jk4tray3vzpk2mx']);
	// ################### END Relation Variables ###################

	// ################### BEGIN Bool Variables ###################
	let boolValue = $state<boolean>(false);
	let boolOnChangeValue = $state<boolean>(false);
	let boolBeforeValue = $state<boolean>(false);
	let boolOnChangeCount = $state(0);
	let boolIsInitial = $state(true);
	// ################### END Bool Variables ###################
</script>

<Head>
	<title>Test Inputs - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Test Inputs</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel boundary>
			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Text.svelte</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.Text
							bind:value={textInput}
							placeholder="component input"
							onValueChange={(data) => {
								textInputOnChangeValue = data.value;
								textInputBeforeValue = data.beforeValue;
								textInputIsInitial = data.initial;
								textInputOnChangeValueCount += 1;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="mb-1 block font-semibold">Aktif Değer (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(textInput)}</code>
							</p>
							<p>
								<span class="mb-1 block font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(textInputBeforeValue)}</code>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{textInputIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{textInputOnChangeValueCount}</span>
							</p>
						</div>

						<div class="flex flex-col gap-2 border-t pt-2">
							<input type="text" bind:value={textInput} placeholder="bind:value" class="border-surface-300 rounded border p-2" />
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									textInput = random_value('text');
								}}
							>
								Rastgele Değer
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									textInput = '';
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Textarea.svelte</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.Textarea
							bind:value={textareaValue}
							placeholder="component input"
							onValueChange={(data) => {
								textareaOnChangeValue = data.value;
								textareaOnChangeBeforeValue = data.beforeValue;
								textareaIsInitial = data.initial;
								textareaOnChangeValueCount += 1;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="mb-1 block font-semibold">Aktif Değer (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(textareaValue)}</code>
							</p>
							<p>
								<span class="mb-1 block font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all"
									>{JSON.stringify(textareaOnChangeBeforeValue)}</code
								>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{textareaIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{textareaOnChangeValueCount}</span>
							</p>
						</div>

						<div class="flex flex-col gap-2 border-t pt-2">
							<textarea bind:value={textareaValue} placeholder="bind:value" class="border-surface-300 rounded border p-2"></textarea>
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									textareaValue = `${random_value('text')} ${random_value('text')} ${random_value('text')}`;
								}}
							>
								Rastgele Değer
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									textareaValue = '';
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Number.svelte</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.Number
							bind:value={numberInput}
							placeholder="component input"
							onValueChange={(data) => {
								numberInputOnChangeValue = data.value;
								numberInputOnChangeBeforeValue = data.beforeValue;
								numberInputIsInitial = data.initial;
								numberInputOnChangeValueCount += 1;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="mb-1 block font-semibold">Aktif Değer (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(numberInput)}</code>
							</p>
							<p>
								<span class="mb-1 block font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all"
									>{JSON.stringify(numberInputOnChangeBeforeValue)}</code
								>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{numberInputIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{numberInputOnChangeValueCount}</span>
							</p>
						</div>

						<div class="flex flex-col gap-2 border-t pt-2">
							<input.Number bind:value={numberInput} placeholder="bind:value" class="border-surface-300! border! bg-transparent!" />
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									numberInput = random_value('integer');
								}}
							>
								Rastgele Değer
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									numberInput = 0;
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Select.svelte</span>
					<span class="text-secondary-600">[Single]</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.Select
							deSelectText={`-- ${t('select_deselect')} --`}
							options={selectOptions}
							bind:value={selectSingleValue}
							onValueChange={(data) => {
								selectSingleOnChangeValue = data.value;
								selectSingleOnChangeBeforeValue = data.beforeValue;
								selectSingleIsInitial = data.initial;
								selectSingleOnChangeValueCount += 1;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="mb-1 block font-semibold">Aktif Değer (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(selectSingleValue)}</code>
							</p>
							<p>
								<span class="mb-1 block font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all"
									>{JSON.stringify(selectSingleOnChangeBeforeValue)}</code
								>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{selectSingleIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{selectSingleOnChangeValueCount}</span>
							</p>
						</div>

						<div class="flex flex-col gap-2 border-t pt-2">
							<select bind:value={selectSingleValue} class="border-surface-300 rounded border p-2">
								<option value="">{`-- ${t('select_deselect')} --`}</option>
								{#each selectOptions as option, i (i)}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									selectSingleValue = random_value('single_select');
								}}
							>
								Rastgele Değer
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									selectSingleValue = '';
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Select.svelte</span>
					<span class="text-secondary-600">[Multiple]</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.Select
							multiple
							deSelectText={`-- ${t('select_deselect')} --`}
							options={selectOptions}
							bind:value={selectMultiValue}
							onValueChange={(data) => {
								selectMultiOnChangeValue = data.value;
								selectMultiOnChangeBeforeValue = data.beforeValue;
								selectMultiIsInitial = data.initial;
								selectMultiOnChangeValueCount += 1;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="mb-1 block font-semibold">Aktif Değer (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(selectMultiValue)}</code>
							</p>
							<p>
								<span class="mb-1 block font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all"
									>{JSON.stringify(selectMultiOnChangeBeforeValue)}</code
								>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{selectMultiIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{selectMultiOnChangeValueCount}</span>
							</p>
						</div>

						<div class="flex flex-col gap-2 border-t pt-2">
							<select bind:value={selectMultiValue} multiple class="border-surface-300 rounded border p-2">
								{#each selectOptions as option, i (i)}
									<option value={option.value}>{option.label}</option>
								{/each}
							</select>
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									selectMultiValue = random_value('multi_select');
								}}
							>
								Rastgele Değer
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									selectMultiValue = [];
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Datetime.svelte</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.Datetime
							bind:value={datetimeInput}
							placeholder="component input"
							onValueChange={(data) => {
								datetimeInputOnChangeValue = data.value;
								datetimeInputOnChangeBeforeValue = data.beforeValue;
								datetimeInputIsInitial = data.initial;
								datetimeInputOnChangeValueCount += 1;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="mb-1 block font-semibold">Aktif Değer (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(datetimeInput)}</code>
							</p>
							<p>
								<span class="mb-1 block font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all"
									>{JSON.stringify(datetimeInputOnChangeBeforeValue)}</code
								>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{datetimeInputIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{datetimeInputOnChangeValueCount}</span>
							</p>
						</div>

						<div class="flex flex-col gap-2 border-t pt-2">
							<input.Datetime bind:value={datetimeInput} class="border-surface-300! border! bg-transparent!" />
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									datetimeInput = random_value('text_date_time');
								}}
							>
								Rastgele Değer
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									datetimeInput = '';
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Date.svelte</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.Date
							bind:value={dateInput}
							placeholder="component input"
							onValueChange={(data) => {
								dateInputOnChangeValue = data.value;
								dateInputOnChangeBeforeValue = data.beforeValue;
								dateInputIsInitial = data.initial;
								dateInputOnChangeValueCount += 1;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="mb-1 block font-semibold">Aktif Değer (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(dateInput)}</code>
							</p>
							<p>
								<span class="mb-1 block font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all"
									>{JSON.stringify(dateInputOnChangeBeforeValue)}</code
								>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{dateInputIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{dateInputOnChangeValueCount}</span>
							</p>
						</div>

						<div class="flex flex-col gap-2 border-t pt-2">
							<input.Date bind:value={dateInput} class="border-surface-300! border! bg-transparent!" />
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									dateInput = random_value('text_date');
								}}
							>
								Rastgele Değer
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									dateInput = '';
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>
			<hr class="border-surface-200 my-8" />
			<!-- Tekli Seçim Testi -->
			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">File.svelte</span>
					<span class="text-secondary-600">[Single]</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.File
							accept=".png,.jpg,.jpeg,.pdf"
							maxSize={2 * 1024 * 1024}
							bind:value={singleValue}
							bind:selectedFiles={singleSelectedFiles}
							onValueChange={(data) => {
								singleOnChangeCount++;
								singleBeforeValue = data.beforeValue;
								singleIsInitial = data.initial;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="font-semibold">Aktif Dosya Değeri (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5">{JSON.stringify(singleValue)}</code>
							</p>
							<p>
								<span class="font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5">{JSON.stringify(singleBeforeValue)}</code>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{singleIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{singleOnChangeCount}</span>
							</p>
							<div>
								<span class="mb-1 block font-semibold">Seçili Ham File Nesneleri (selectedFiles):</span>
								{#if singleSelectedFiles.length > 0}
									<ul class="border-surface-200 text-surface-800 list-inside list-disc space-y-1 rounded border bg-white p-2">
										{#each singleSelectedFiles as file, idx (idx)}
											<li>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
										{/each}
									</ul>
								{:else}
									<span class="text-surface-400 italic">Hiç yeni dosya seçilmedi.</span>
								{/if}
							</div>
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									singleValue = preloadedValue;
								}}
							>
								Varsayılan Yükle ("{preloadedValue}")
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									singleValue = '';
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<!-- Çoklu Seçim Testi -->
			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">File.svelte</span>
					<span class="text-secondary-600">[Multiple]</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.File
							multiple
							accept="*"
							maxSize={5 * 1024 * 1024}
							maxCount={3}
							bind:value={multiValue}
							bind:selectedFiles={multiSelectedFiles}
							onValueChange={(data) => {
								multiOnChangeCount++;
								multiBeforeValue = data.beforeValue;
								multiIsInitial = data.initial;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="mb-1 block font-semibold">Aktif Dosya Değeri (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(multiValue)}</code>
							</p>
							<p>
								<span class="mb-1 block font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(multiBeforeValue)}</code>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{multiIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{multiOnChangeCount}</span>
							</p>
							<div>
								<span class="mb-1 block font-semibold">Seçili Ham File Nesneleri (selectedFiles):</span>
								{#if multiSelectedFiles.length > 0}
									<ul class="border-surface-200 text-surface-800 list-inside list-disc space-y-1 rounded border bg-white p-2">
										{#each multiSelectedFiles as file, idx (idx)}
											<li>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
										{/each}
									</ul>
								{:else}
									<span class="text-surface-400 italic">Hiç yeni dosya seçilmedi.</span>
								{/if}
							</div>
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									multiValue = [...preloadedMultiValue];
								}}
							>
								Varsayılanları Yükle
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									multiValue = [];
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<!-- Tekli Seçim Testi (Relation) -->
			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Relation.svelte</span>
					<span class="text-secondary-600">[Single]</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.Relation
							collection="demo_relation_input_single"
							label="Single Relation"
							bind:value={relationSingleValue}
							onValueChange={(data) => {
								relationSingleOnChangeCount++;
								relationSingleBeforeValue = data.beforeValue;
								relationSingleIsInitial = data.initial;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="mb-1 block font-semibold">Aktif Değer (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(relationSingleValue)}</code>
							</p>
							<p>
								<span class="mb-1 block font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all"
									>{JSON.stringify(relationSingleBeforeValue)}</code
								>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{relationSingleIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{relationSingleOnChangeCount}</span>
							</p>
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									relationSingleValue = preloadedRelationSingleValue;
								}}
							>
								Varsayılanları Yükle
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									relationSingleValue = '';
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<!-- Çoklu Seçim Testi (Relation) -->
			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Relation.svelte</span>
					<span class="text-secondary-600">[Multiple]</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.Relation
							multiple
							collection="demo_relation_input_multiple"
							label="Multiple Relation"
							bind:value={relationMultiValue}
							onValueChange={(data) => {
								relationMultiOnChangeCount++;
								relationMultiBeforeValue = data.beforeValue;
								relationMultiIsInitial = data.initial;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="mb-1 block font-semibold">Aktif Değer (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all">{JSON.stringify(relationMultiValue)}</code>
							</p>
							<p>
								<span class="mb-1 block font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5 break-all"
									>{JSON.stringify(relationMultiBeforeValue)}</code
								>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{relationMultiIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{relationMultiOnChangeCount}</span>
							</p>
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									relationMultiValue = [...preloadedRelationMultiValue];
								}}
							>
								Varsayılanları Yükle
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									relationMultiValue = [];
								}}
							>
								Temizle
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<!-- Bool.svelte Testi -->
			<div class="flex flex-col gap-4">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Bool.svelte</span>
					Component Test
				</h4>
				<div class="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
					<div class="flex flex-col gap-2">
						<span class="text-surface-700 text-sm font-medium">Component Input</span>
						<input.Bool
							bind:value={boolValue}
							text="Rahatsız Etmeyin (Do not disturb)"
							onValueChange={(data) => {
								boolOnChangeValue = data.value;
								boolBeforeValue = data.beforeValue;
								boolIsInitial = data.initial;
								boolOnChangeCount++;
							}}
						/>
					</div>

					<div class="border-surface-200 bg-surface-50/50 space-y-3 rounded-xl border p-4 text-xs">
						<h5 class="text-surface-700 text-[10px] font-bold tracking-wider uppercase">Bağlı State ve Detaylar</h5>

						<div class="text-surface-600 grid grid-cols-1 gap-2">
							<p>
								<span class="font-semibold">Aktif Değer (value):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5">{JSON.stringify(boolValue)}</code>
							</p>
							<p>
								<span class="font-semibold">Önceki Değer (beforeValue):</span>
								<code class="border-surface-200 text-surface-800 rounded border bg-white px-1.5 py-0.5">{JSON.stringify(boolBeforeValue)}</code>
							</p>
							<p>
								<span class="font-semibold">İlk Yükleme mi (initial):</span>
								<span class="text-surface-800 font-bold">{boolIsInitial}</span>
							</p>
							<p>
								<span class="font-semibold">Değişim Sayısı (onChangeCount):</span>
								<span class="text-surface-800 font-bold">{boolOnChangeCount}</span>
							</p>
						</div>

						<div class="border-surface-200 flex gap-2 border-t pt-2">
							<button
								type="button"
								class="bg-primary-50 text-primary-600 hover:bg-primary-100 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									boolValue = !boolValue;
								}}
							>
								Değeri Değiştir (Toggle)
							</button>
							<button
								type="button"
								class="bg-surface-200 text-surface-700 hover:bg-surface-300 cursor-pointer rounded-md px-2.5 py-1.5 text-xs font-semibold transition-colors"
								onclick={() => {
									boolValue = false;
								}}
							>
								Temizle (False)
							</button>
						</div>
					</div>
				</div>
			</div>

			<hr class="border-surface-200 my-8" />

			<!-- Button.svelte Testi -->
			<div class="flex flex-col gap-6">
				<h4 class="text-lg font-semibold">
					<span class="text-primary-400">Button.svelte</span>
					Component Test
				</h4>

				<div class="space-y-6">
					<!-- Varyantlar & Renkler (Filled) -->
					<div class="space-y-2">
						<h5 class="text-surface-700 text-sm font-semibold">Filled Variant</h5>
						<div class="flex flex-wrap items-center gap-2">
							<input.Button variant="filled" color="primary" label="Primary" />
							<input.Button variant="filled" color="secondary" label="Secondary" />
							<input.Button variant="filled" color="tertiary" label="Tertiary" />
							<input.Button variant="filled" color="quaternary" label="Quaternary" />
							<input.Button variant="filled" color="surface" label="Surface" />
							<input.Button variant="filled" color="success" label="Success" />
							<input.Button variant="filled" color="warning" label="Warning" />
							<input.Button variant="filled" color="error" label="Error" />
							<input.Button variant="filled" color="info" label="Info" />
						</div>
					</div>

					<!-- Varyantlar & Renkler (Light) -->
					<div class="space-y-2">
						<h5 class="text-surface-700 text-sm font-semibold">Light Variant (Default)</h5>
						<div class="flex flex-wrap items-center gap-2">
							<input.Button variant="light" color="primary" label="Primary" />
							<input.Button variant="light" color="secondary" label="Secondary" />
							<input.Button variant="light" color="tertiary" label="Tertiary" />
							<input.Button variant="light" color="quaternary" label="Quaternary" />
							<input.Button variant="light" color="surface" label="Surface" />
							<input.Button variant="light" color="success" label="Success" />
							<input.Button variant="light" color="warning" label="Warning" />
							<input.Button variant="light" color="error" label="Error" />
							<input.Button variant="light" color="info" label="Info" />
						</div>
					</div>

					<!-- Varyantlar & Renkler (Ghost) -->
					<div class="space-y-2">
						<h5 class="text-surface-700 text-sm font-semibold">Ghost Variant</h5>
						<div class="flex flex-wrap items-center gap-2">
							<input.Button variant="ghost" color="primary" label="Primary" />
							<input.Button variant="ghost" color="secondary" label="Secondary" />
							<input.Button variant="ghost" color="tertiary" label="Tertiary" />
							<input.Button variant="ghost" color="quaternary" label="Quaternary" />
							<input.Button variant="ghost" color="surface" label="Surface" />
							<input.Button variant="ghost" color="success" label="Success" />
							<input.Button variant="ghost" color="warning" label="Warning" />
							<input.Button variant="ghost" color="error" label="Error" />
							<input.Button variant="ghost" color="info" label="Info" />
						</div>
					</div>

					<!-- Boyutlar (Sizes) -->
					<div class="space-y-2">
						<h5 class="text-surface-700 text-sm font-semibold">Sizes</h5>
						<div class="flex flex-wrap items-center gap-4">
							<input.Button size="sm" variant="filled" color="primary" label="Small (sm)" />
							<input.Button size="md" variant="filled" color="primary" label="Medium (md)" />
							<input.Button size="lg" variant="filled" color="primary" label="Large (lg)" />
						</div>
					</div>

					<!-- İkonlar (Icons) -->
					<div class="space-y-2">
						<h5 class="text-surface-700 text-sm font-semibold">Icon Combinations ("grape" Icon)</h5>
						<div class="flex flex-wrap items-center gap-4">
							<input.Button variant="filled" color="primary" startIcon="grape" label="Start Icon" />
							<input.Button variant="filled" color="secondary" endIcon="grape" label="End Icon" />
							<input.Button variant="light" color="tertiary" icon="grape" iconOnly={true} />
							<input.Button variant="ghost" color="error" startIcon="grape" label="Ghost with Icon" />
							<input.Button size="sm" variant="filled" color="success" icon="grape" iconOnly={true} />
							<input.Button size="lg" variant="filled" color="warning" icon="grape" iconOnly={true} />
						</div>
					</div>

					<!-- Durumlar (Disabled vb.) -->
					<div class="space-y-2">
						<h5 class="text-surface-700 text-sm font-semibold">States (Disabled)</h5>
						<div class="flex flex-wrap items-center gap-2">
							<input.Button variant="filled" color="primary" disabled label="Filled Disabled" />
							<input.Button variant="light" color="secondary" disabled label="Light Disabled" />
							<input.Button variant="ghost" color="tertiary" disabled label="Ghost Disabled" />
						</div>
					</div>
				</div>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Inputs Page Footer</p>
	</Page.Footer>
</Page>
