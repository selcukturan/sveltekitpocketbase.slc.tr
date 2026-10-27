import type { RemoteFormIssue } from '$app/server';
import { t, type TranslationParams } from '#lib/app/localization/index.js';
import type { InputMeta } from '#lib/app/schemas/inputs/meta.js';
import { getFormInputsContext } from './context.svelte';
import { parseNamePath } from './utils.js';
import { formatBytes } from '#lib/utils/input-helper.js';

type FormFieldSource = {
	name?: string; // Remote Form `field.as(...)` name: 'b:alan/remoteId/formFunction'
	issues?: RemoteFormIssue[];
	label?: string;
	shadowSuffixes?: string[]; // gölge alanlar (örn: File '_Plus', '_Minus'); hataları bu alanda gösterilir
};

/**
 * Remote Form `name` yolundan şemadaki alan adını çıkarır.
 * 'n:sayi/..' → 'sayi', 'b:onay/..' → 'onay', 'dosyalar[]/..' → 'dosyalar'
 */
export function fieldKeyFromName(name?: string) {
	return parseNamePath(name)
		.pathFieldName.replace(/^[nb]:/, '')
		.replace(/\[\]$/, '');
}

// Hata mesajlarındaki {min}, {max} gibi parametreler için meta'nın yalnızca metin/sayı değerleri kullanılır
function metaParams(meta: InputMeta): TranslationParams {
	const params: TranslationParams = {};
	for (const [k, val] of Object.entries(meta)) {
		if (typeof val === 'string' || typeof val === 'number') params[k] = val;
	}
	if (meta.maxSize !== undefined) params.maxSizeText = formatBytes(meta.maxSize); // "1 MB"
	return params;
}

/**
 * Sarmalayıcıların (form_inputs) ortak işleri:
 * şema anahtarı, metadata, zorunluluk, label yedeği, çevrilmiş hatalar, context verisi ve doğrulama.
 * Bileşen başlatılırken çağrılmalıdır (context okur).
 */
export function useFormField(source: () => FormFieldSource) {
	const context = getFormInputsContext();

	// Gölge alanlar şema tipinde ayrı anahtar olduğundan genel erişim için tip gevşetilir
	const shadowField = (shadowKey: string) =>
		(context.props.form.fields as unknown as Record<string, { allIssues(): RemoteFormIssue[] | undefined } | undefined>)[shadowKey];

	const name = $derived(source().name ?? '');
	const key = $derived(fieldKeyFromName(name));
	const meta = $derived<InputMeta>((context.getValibotMetadata(key)?.slc as InputMeta | undefined) ?? { required: false });
	const label = $derived(source().label || key || 'no_label');
	const issues = $derived.by(() => {
		const params = metaParams(meta);
		const shadowIssues = (source().shadowSuffixes ?? []).flatMap((suffix) => shadowField(key + suffix)?.allIssues() ?? []);
		return [...(source().issues ?? []), ...shadowIssues].map((issue) => ({ ...issue, message: t(issue.message, params, issue.message) }));
	});

	return {
		get name() {
			return name;
		},
		get key() {
			return key;
		},
		get meta() {
			return meta;
		},
		get required() {
			return meta.required;
		},
		get label() {
			return label;
		},
		get issues() {
			return issues;
		},
		// Form context'ine ilk/güncel değeri yazar (isChanged hesabı için)
		track(value: unknown, initial: boolean) {
			if (!key) return;
			if (initial) context.initialData.set(key, value);
			context.currentData.set(key, value);
		},
		validate() {
			context.props.form.validate({ preflightOnly: true, all: false });
		}
	};
}
