<script lang="ts">
	import type { RemoteFormField } from '$app/server';
	import { Number } from '#lib/components/ui/inputs/index.js';
	import Field from './Field.svelte';
	import type { NumberValueChangeArgs, NumberProps } from '#lib/components/ui/inputs/type.js';
	import { useFormField } from './form-field.svelte.js';

	type Props = NumberProps & {
		field: RemoteFormField<number>;
		label?: string;
	};

	let { label: componentLabel, field, onValueChange: userOnValueChange, oninput: userOnInput, onblur: userOnBlur, ...restProps }: Props = $props();

	const cid = $props.id();
	const id = $derived(restProps.id || cid);

	// ######### BEGIN: Remote Form `field` attributes #########
	let attributes = $derived(field.as('number'));
	let attrAriaInvalid = $derived(attributes['aria-invalid'] || restProps['aria-invalid'] || false);
	// ######### END: Remote Form `field` attributes ###########

	// ######### BEGIN: form field (metadata, issues, label) ####
	const formField = useFormField(() => ({ name: attributes.name, issues: field.issues(), label: componentLabel }));
	// ######### END: form field (metadata, issues, label) ######

	// tam sayı → 1, ondalık sınırı → 0.01 gibi, aksi halde serbest
	let step = $derived(formField.meta.onlyInt ? 1 : formField.meta.decimals !== undefined ? 10 ** -formField.meta.decimals : 'any');

	// ######### BEGIN: handle value change ###################
	// Geçersiz metin (örn: '1-2', '5--'): tarayıcı değeri '' verir, Number bunu boş (0) sayar. Ekranda metin dururken
	// forma sessizce 0 gitmesin diye gönderilen değer gizli input'tan gelir: geçersizse 'NaN' → şema "geçerli bir sayı
	// girin" der (yazarken ve gönderirken). Görünen input'un adı yoktur.
	let numberValue = $state(0);
	let badInput = $state(false);
	const sync = (initial = false) => {
		const el = typeof document !== 'undefined' ? (document.getElementById(id) as HTMLInputElement | null) : null;
		badInput = el?.validity.badInput ?? false;
		const value = badInput ? NaN : numberValue;
		formField.track(value, initial);
		field.set(value);
	};

	// Yazarken geçersiz metin hemen hata göstermez: '123.' ya da '-' bir sonraki tuşla geçerli olabilir. Hata alandan
	// çıkınca (blur) ya da gönderimde (gizli input 'NaN') gösterilir; metin düzelince varsa hemen kalkar.
	const onValueChange = (args: NumberValueChangeArgs) => {
		numberValue = args.value;
		sync(args.initial);
		userOnValueChange?.(args);
		if (!badInput) formField.validate();
	};
	// Değer değişmeden geçerlilik değişebilir ('1-2' → tümü silinir: değer 0 → 0)
	const onInput = () => {
		const wasBad = badInput;
		sync();
		if (wasBad && !badInput) formField.validate();
	};
	const onBlur = () => {
		if (badInput) formField.validate();
	};
	// ######### END: handle value change #####################
</script>

<Field issues={formField.issues} required={formField.required} label={formField.label} {id}>
	<Number
		{id}
		min={formField.meta.min}
		max={formField.meta.max}
		{step}
		aria-invalid={attrAriaInvalid}
		{onValueChange}
		oninput={(e) => {
			onInput();
			userOnInput?.(e);
		}}
		onblur={(e) => {
			onBlur();
			userOnBlur?.(e);
		}}
		{...restProps}
		status="with-field"
		size="sm"
	/>
	<!-- Gönderilen değer (bkz. yukarı) -->
	<input type="hidden" name={attributes.name} value={badInput ? 'NaN' : String(numberValue)} />
</Field>
