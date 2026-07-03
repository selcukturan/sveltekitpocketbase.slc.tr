<script lang="ts" generics="Tmultiple extends boolean = false">
	import { SvelteMap } from 'svelte/reactivity';
	import { fade, slide } from 'svelte/transition';
	import { on } from 'svelte/events';
	import { inputClasses } from './common';
	import type { FilePropsType, FileDisplayType, FileFileTypeChoice, FileValueTypeChoice } from './type';

	let {
		multiple = false as Tmultiple,
		value = $bindable((multiple ? [] : '') as FileValueTypeChoice<Tmultiple>),
		accept = '*',
		maxSize = Infinity,
		maxCount = Infinity,
		id,
		name,
		class: classes = '',
		selectedFiles = $bindable([] as File[]),
		disabled = false,
		readonly = false,
		onValueChange,
		onFilesChange
	}: FilePropsType<Tmultiple> = $props();

	let inputElement: HTMLInputElement | undefined = $state();
	let isDragging = $state(false);
	let errorText = $state<string | null>(null);

	const valueMap = new SvelteMap<string, FileDisplayType>();

	const displayFiles = $derived([...valueMap.values()]);

	const deletedFileNames = $derived.by(() => {
		const deleted = [...valueMap.values()].filter((f) => f.uploaded && f.deleted).map((f) => f.name);
		if (multiple) {
			return deleted as FileValueTypeChoice<Tmultiple>;
		} else {
			return (deleted[0] ?? '') as FileValueTypeChoice<Tmultiple>;
		}
	});

	const getMapNotDeletedFiles = (): FileValueTypeChoice<Tmultiple> => {
		const activeFiles = [...valueMap.values()].filter((f) => !f.deleted).map((f) => f.name);
		if (multiple) {
			return activeFiles as FileValueTypeChoice<Tmultiple>;
		} else {
			return (activeFiles[0] ?? '') as FileValueTypeChoice<Tmultiple>;
		}
	};

	const getSelectedFiles = (filesArray: File[]): FileFileTypeChoice<Tmultiple> => {
		if (multiple) {
			return filesArray as FileFileTypeChoice<Tmultiple>;
		} else {
			return filesArray[0] as FileFileTypeChoice<Tmultiple>;
		}
	};

	// Bayt formatlayıcı (Örn: 1048576 -> "1.00 MB")
	function formatBytes(bytes: number, decimals = 2) {
		if (bytes === 0 || bytes === Infinity) return '0 Bytes';
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	}

	// Dosyaları doğrulayıp ekleyen ana fonksiyon
	const handleFilesAdded = (fileList: FileList | File[] | null) => {
		if (!fileList) return;
		errorText = null;

		const filesArray = Array.from(fileList);

		// 1. Accept format doğrulaması
		const acceptedFiles = filesArray.filter((file) => {
			if (!accept || accept === '*' || accept === '*/*') return true;

			const mimeType = file.type.toLowerCase();
			const extension = '.' + file.name.split('.').pop()?.toLowerCase();
			const acceptList = accept.split(',').map((s) => s.trim().toLowerCase());

			return acceptList.some((rule) => {
				if (rule.startsWith('.')) {
					return extension === rule;
				} else if (rule.endsWith('/*')) {
					const baseType = rule.replace('/*', '');
					return mimeType.startsWith(baseType);
				} else {
					return mimeType === rule;
				}
			});
		});

		if (acceptedFiles.length < filesArray.length) {
			errorText = 'Bazı dosyalar kabul edilmeyen formatta olduğu için eklenmedi.';
		}

		if (acceptedFiles.length === 0) {
			triggerErrorClear();
			return;
		}

		// 2. Boyut (maxSize) doğrulaması
		const sizeOkFiles = acceptedFiles.filter((file) => {
			if (file.size > maxSize) {
				errorText = `"${file.name}" boyutu çok büyük. Maksimum limit: ${formatBytes(maxSize)}`;
				return false;
			}
			return true;
		});

		if (sizeOkFiles.length === 0) {
			triggerErrorClear();
			return;
		}

		// 3. Adet (maxCount) doğrulaması ve ekleme
		if (!multiple) {
			// Tekli seçim
			valueMap.clear();
			const file = sizeOkFiles[0];
			valueMap.set(file.name, {
				name: file.name,
				uploaded: false,
				deleted: false,
				size: file.size,
				fileObj: file
			});
		} else {
			// Çoklu seçim
			const currentActiveCount = [...valueMap.values()].filter((f) => !f.deleted).length;
			const allowedToAdd = maxCount - currentActiveCount;

			if (allowedToAdd <= 0) {
				errorText = `Maksimum dosya limitine ulaşıldı (${maxCount} adet).`;
				triggerErrorClear();
				return;
			}

			const filesToAdd = sizeOkFiles.slice(0, allowedToAdd);
			if (sizeOkFiles.length > allowedToAdd) {
				errorText = `En fazla ${maxCount} dosya ekleyebilirsiniz. Sınırı aşan dosyalar eklenmedi.`;
			}

			filesToAdd.forEach((file) => {
				if (!valueMap.has(file.name)) {
					valueMap.set(file.name, {
						name: file.name,
						uploaded: false,
						deleted: false,
						size: file.size,
						fileObj: file
					});
				}
			});
		}

		syncChanges();
		triggerErrorClear();
	};

	// Değişiklikleri senkronize et
	const syncChanges = () => {
		const beforeValue = lastValue;
		value = getMapNotDeletedFiles();
		lastValue = value;

		const beforeSelected = lastSelectedFiles;
		selectedFiles = [...valueMap.values()].filter((f) => !f.uploaded && !f.deleted && f.fileObj).map((f) => f.fileObj!) as File[];
		lastSelectedFiles = selectedFiles;

		onValueChange?.({
			value: $state.snapshot(value) as FileValueTypeChoice<Tmultiple>,
			beforeValue: $state.snapshot(beforeValue) as FileValueTypeChoice<Tmultiple>,
			initial: false,
			selectedFiles: getSelectedFiles($state.snapshot(selectedFiles)),
			beforeSelectedFiles: getSelectedFiles($state.snapshot(beforeSelected)),
			deletedFileNames: $state.snapshot(deletedFileNames) as FileValueTypeChoice<Tmultiple>
		});
		onFilesChange?.($state.snapshot(selectedFiles));
	};

	// Hata mesajını temizleme zamanlayıcısı
	const triggerErrorClear = () => {
		if (errorText) {
			setTimeout(() => {
				errorText = null;
			}, 4000);
		}
	};

	// Dosya kaldırma
	function removeFile(nameToDelete: string) {
		const item = valueMap.get(nameToDelete);
		if (!item) return;

		if (item.uploaded) {
			valueMap.set(nameToDelete, { ...item, deleted: true });
		} else {
			valueMap.delete(nameToDelete);
		}

		syncChanges();
	}

	// Dosyayı geri alma
	function restoreFile(nameToRestore: string) {
		const item = valueMap.get(nameToRestore);
		if (!item) return;

		if (multiple) {
			const currentActiveCount = [...valueMap.values()].filter((f) => !f.deleted).length;
			if (currentActiveCount >= maxCount) {
				errorText = `Maksimum dosya limitini (${maxCount} adet) aşacağı için geri alınamadı.`;
				triggerErrorClear();
				return;
			}
		} else {
			valueMap.forEach((val, key) => {
				if (key !== nameToRestore) valueMap.delete(key);
			});
		}

		valueMap.set(nameToRestore, { ...item, deleted: false });
		syncChanges();
	}

	// Sürükle-bırak olayları ve tıklama dinleyicisi
	const dropzoneEvents = (node: HTMLElement) => {
		const destroyClick = on(node, 'click', () => {
			if (disabled || readonly) return;
			inputElement?.click();
		});

		const destroyDragOver = on(node, 'dragover', (e: DragEvent) => {
			e.preventDefault();
			if (disabled || readonly) return;
			isDragging = true;
		});

		const destroyDragLeave = on(node, 'dragleave', () => {
			if (disabled || readonly) return;
			isDragging = false;
		});

		const destroyDrop = on(node, 'drop', (e: DragEvent) => {
			e.preventDefault();
			if (disabled || readonly) return;
			isDragging = false;
			if (e.dataTransfer?.files) {
				handleFilesAdded(e.dataTransfer.files);
			}
		});

		return () => {
			destroyClick();
			destroyDragOver();
			destroyDragLeave();
			destroyDrop();
		};
	};

	// ############################### BEGIN PROXY ###############################
	let first = true;
	let lastValue = value; // Son tetiklenen değeri takip eden değişken
	let lastSelectedFiles = selectedFiles; // Son tetiklenen dosyaları takip eden değişken
	const proxy = {
		get files() {
			const currentVal = value;
			const mapActive = getMapNotDeletedFiles();
			const areEqual =
				Array.isArray(currentVal) && Array.isArray(mapActive)
					? currentVal.length === mapActive.length && currentVal.every((v, i) => v === mapActive[i])
					: currentVal === mapActive;

			if (first) {
				first = false;

				// 1. Initial values from value prop (uploaded files)
				const initialValues = Array.isArray(currentVal) ? currentVal : currentVal ? [currentVal] : [];
				initialValues.forEach((fileName) => {
					if (fileName) {
						valueMap.set(fileName, {
							name: fileName,
							uploaded: true,
							deleted: false
						});
					}
				});

				// 2. Initial selected files from selectedFiles prop (unuploaded local files)
				if (Array.isArray(selectedFiles)) {
					selectedFiles.forEach((file) => {
						if (file && file.name) {
							valueMap.set(file.name, {
								name: file.name,
								uploaded: false,
								deleted: false,
								size: file.size,
								fileObj: file
							});
						}
					});
				}

				const initialNotDeleted = getMapNotDeletedFiles();
				// Sync the initial value prop to include any preloaded selectedFiles
				value = initialNotDeleted;
				lastValue = initialNotDeleted;
				lastSelectedFiles = selectedFiles;

				onValueChange?.({
					value: $state.snapshot(initialNotDeleted) as FileValueTypeChoice<Tmultiple>,
					beforeValue: $state.snapshot(initialNotDeleted) as FileValueTypeChoice<Tmultiple>,
					initial: true,
					selectedFiles: getSelectedFiles($state.snapshot(selectedFiles)),
					beforeSelectedFiles: getSelectedFiles($state.snapshot(selectedFiles)),
					deletedFileNames: $state.snapshot(deletedFileNames) as FileValueTypeChoice<Tmultiple>
				});
				onFilesChange?.($state.snapshot(selectedFiles));
			} else if (!areEqual) {
				// Dışarıdan value değişimi
				const tempBefore = lastValue;
				const beforeSelected = lastSelectedFiles;
				valueMap.clear();
				const valuesToSet = Array.isArray(currentVal) ? currentVal : currentVal ? [currentVal] : [];
				valuesToSet.forEach((fileName) => {
					if (fileName) {
						valueMap.set(fileName, {
							name: fileName,
							uploaded: true,
							deleted: false
						});
					}
				});
				selectedFiles = [];
				lastValue = currentVal;
				lastSelectedFiles = [];
				onValueChange?.({
					value: $state.snapshot(currentVal) as FileValueTypeChoice<Tmultiple>,
					beforeValue: $state.snapshot(tempBefore) as FileValueTypeChoice<Tmultiple>,
					initial: false,
					selectedFiles: getSelectedFiles([]),
					beforeSelectedFiles: getSelectedFiles($state.snapshot(beforeSelected)),
					deletedFileNames: $state.snapshot(deletedFileNames) as FileValueTypeChoice<Tmultiple>
				});
				onFilesChange?.([]);
			} else {
				// Value dışarıdan değişmediyse selectedFiles değişmiş mi kontrol et
				const localFiles = [...valueMap.values()].filter((f) => !f.uploaded && !f.deleted && f.fileObj).map((f) => f.fileObj!);
				const filesAreEqual = selectedFiles.length === localFiles.length && selectedFiles.every((file, index) => file === localFiles[index]);

				if (!filesAreEqual) {
					// Dışarıdan selectedFiles değişimi
					// Yüklenen dosyaları tut, yüklenmemiş diğer dosyaları kaldır
					valueMap.forEach((val, key) => {
						if (!val.uploaded) {
							valueMap.delete(key);
						}
					});

					// selectedFiles'tan tüm dosyaları ekle
					selectedFiles.forEach((file) => {
						valueMap.set(file.name, {
							name: file.name,
							uploaded: false,
							deleted: false,
							size: file.size,
							fileObj: file
						});
					});

					const tempBefore = lastValue;
					const beforeSelected = lastSelectedFiles;
					value = getMapNotDeletedFiles();
					lastValue = value;
					lastSelectedFiles = selectedFiles;

					onValueChange?.({
						value: $state.snapshot(value) as FileValueTypeChoice<Tmultiple>,
						beforeValue: $state.snapshot(tempBefore) as FileValueTypeChoice<Tmultiple>,
						initial: false,
						selectedFiles: getSelectedFiles($state.snapshot(selectedFiles)),
						beforeSelectedFiles: getSelectedFiles($state.snapshot(beforeSelected)),
						deletedFileNames: $state.snapshot(deletedFileNames) as FileValueTypeChoice<Tmultiple>
					});
					onFilesChange?.($state.snapshot(selectedFiles));
				}
			}

			// selectedFiles'tan bir FileList oluştur
			const dt = new DataTransfer();
			selectedFiles.forEach((file) => dt.items.add(file));
			return dt.files;
		},
		set files(v: FileList | null) {
			if (v) {
				handleFilesAdded(v);
			}
		}
	};
	// ############################### END PROXY ###############################

	// ######### BEGIN: preventDefaultClick handlers ###########
	const preventDefaultClick = (node: HTMLElement) => {
		return on(node, 'click', (e: MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
		});
	};
	// ######### END: preventDefaultClick handlers #############
</script>

<div class="flex flex-col gap-4 {classes}">
	<!-- Sürükle Bırak Alanı -->
	<button
		{id}
		type="button"
		class="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center select-none w-full
			{isDragging ? 'border-primary-500 bg-primary-100/30' : inputClasses.variants.default}
			{disabled ? 'disabled:cursor-not-allowed disabled:opacity-50' : ''}
			{readonly ? 'opacity-80' : ''}
			{!disabled && !readonly ? 'cursor-pointer' : 'cursor-default'}"
		disabled={disabled || readonly}
		{@attach dropzoneEvents}
	>
		<!-- Cloud Upload SVG -->
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			stroke-width="1.5"
			stroke="currentColor"
			class="h-10 w-10 text-surface-400 mb-3 transition-colors duration-200 {isDragging ? 'text-primary-500' : ''}"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
			/>
		</svg>

		<span class="block text-sm font-medium text-surface-700">
			{#if multiple}
				Dosyaları buraya sürükleyin veya <span class="text-primary-500 font-semibold underline">Gözatın</span>
			{:else}
				Dosyayı buraya sürükleyin veya <span class="text-primary-500 font-semibold underline">Gözatın</span>
			{/if}
		</span>

		<!-- Açıklayıcı Alt Bilgiler -->
		<span class="mt-1.5 flex flex-wrap justify-center gap-x-2 gap-y-0.5 text-xs text-surface-500">
			{#if accept && accept !== '*'}
				<span>Format: <code class="bg-surface-100 rounded px-1 text-[11px] font-semibold text-surface-700">{accept}</code></span>
			{/if}
			{#if maxSize !== Infinity}
				<span>• Maksimum: <span class="font-medium">{formatBytes(maxSize)}</span></span>
			{/if}
			{#if maxCount !== Infinity && multiple}
				<span>• En Fazla: <span class="font-medium">{maxCount} Adet</span></span>
			{/if}
		</span>
	</button>

	<!-- Gizli Dosya Seçme Elemanı -->
	<input type="file" {multiple} {accept} {name} bind:files={proxy.files} bind:this={inputElement} class="sr-only" tabindex={-1} aria-hidden={true} />

	<!-- Hata Bildirimi -->
	{#if errorText}
		<div
			transition:slide={{ duration: 200 }}
			class="flex items-center gap-2 rounded-lg bg-error-50 px-3 py-2 text-xs font-semibold text-error-700 border border-error-100"
		>
			<!-- Warning SVG -->
			<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-4.5 w-4.5 shrink-0">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
			</svg>
			<span>{errorText}</span>
		</div>
	{/if}

	<!-- Dosya Listesi -->
	{#if displayFiles.length > 0}
		<div class="flex flex-col gap-1.5" {@attach preventDefaultClick} transition:fade={{ duration: 150 }}>
			{#each displayFiles as file (file.name)}
				<div
					transition:slide={{ duration: 150 }}
					class="group relative flex items-center justify-between gap-3 rounded-lg border border-surface-200 bg-white p-2.5 transition-all duration-150 hover:bg-surface-50/50
						{file.deleted ? 'opacity-40 line-through bg-surface-50 border-surface-150' : ''}"
				>
					<div class="flex flex-1 items-center gap-2.5 min-w-0">
						<!-- File Icon SVG -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							class="h-5 w-5 shrink-0 text-surface-400 group-hover:text-primary-500 transition-colors"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
							/>
						</svg>

						<div class="flex flex-col min-w-0">
							<p class="text-sm font-medium text-surface-800 truncate leading-tight">{file.name}</p>
							{#if file.size !== undefined}
								<span class="text-[11px] text-surface-500 font-normal mt-0.5 leading-none">{formatBytes(file.size)}</span>
							{/if}
						</div>
					</div>

					<div class="flex items-center gap-2 shrink-0">
						<!-- Durum Rozetleri -->
						{#if !file.deleted}
							<span
								class="rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase leading-normal border
									{file.uploaded ? 'bg-surface-100 border-surface-200 text-surface-600' : 'bg-primary-50 border-primary-100 text-primary-600'}"
							>
								{file.uploaded ? 'Kayıtlı' : 'Yeni'}
							</span>
						{/if}

						<!-- Eylem Butonları -->
						{#if !disabled && !readonly}
							{#if file.deleted}
								<button
									type="button"
									class="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-500 hover:text-primary-600 px-2 py-1 transition-colors"
									onclick={() => restoreFile(file.name)}
								>
									<!-- Undo SVG -->
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-3.5 w-3.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
									</svg>
									Geri Al
								</button>
							{:else}
								<button
									type="button"
									class="rounded-md p-1.5 text-surface-400 hover:bg-error-50 hover:text-error-600 transition-colors"
									onclick={() => removeFile(file.name)}
									aria-label="Dosyayı kaldır"
								>
									<!-- Trash/X SVG -->
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="h-4.5 w-4.5">
										<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							{/if}
						{/if}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
