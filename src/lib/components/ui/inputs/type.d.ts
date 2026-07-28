import type { SvelteHTMLElements } from 'svelte/elements';
import { Collections } from '$lib/types/pocketbase-types';
import type { IconName } from '$lib/components/icons/Icon.svelte';
import type { Snippet } from 'svelte';

// ################# BEGIN Text.svelte Props ###############################
export type TextValueChangeArgs = { value: string; beforeValue: string; initial: boolean };
export type TextProps = Omit<SvelteHTMLElements['input'], 'type' | 'value' | 'size'> & {
	type?: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url';
	value?: string;
	status?: 'default' | 'success' | 'error' | 'warning' | 'info';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	dev?: boolean;
	onValueChange?: ({ value, beforeValue, initial }: TextValueChangeArgs) => void;
};
// ################# END Text.svelte Props ###############################

// ################# BEGIN Textarea.svelte Props ###############################
export type TextareaValueChangeArgs = { value: string; beforeValue: string; initial: boolean };
export type TextareaProps = Omit<SvelteHTMLElements['textarea'], 'value' | 'size'> & {
	value?: string;
	status?: 'default' | 'success' | 'error' | 'warning' | 'info';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	dev?: boolean;
	onValueChange?: ({ value, beforeValue, initial }: TextareaValueChangeArgs) => void;
};
// ################# END Textarea.svelte Props ###############################

// ################# BEGIN Select.svelte Props ###############################
type SelectBasePropsType = {
	placement?: 'top' | 'bottom';
	required?: boolean;
	options: {
		value: string;
		label: string;
	}[];
	id?: string;
	name?: string;
	class?: string;
	triggerClass?: string;
	listboxClass?: string;
	optionClass?: string;
	disabled?: boolean;
	readonly?: boolean;
	escClose?: boolean;
	deSelectText?: string;
};

export type SelectValueTypeChoice<T extends boolean> = T extends true ? string[] : string;

export type SelectValueChangeArgs<T extends boolean> = {
	value: SelectValueTypeChoice<T>;
	beforeValue: SelectValueTypeChoice<T>;
	initial: boolean;
};

export type SelectPropsType<Tmultiple extends boolean> = SelectBasePropsType & {
	multiple?: Tmultiple;
	value?: SelectValueTypeChoice<Tmultiple>;
	onValueChange?: (args: SelectValueChangeArgs<Tmultiple>) => void;
};
// ################# END Select.svelte Props ###############################

// ################# BEGIN Relation.svelte Props ###############################
export type RelationValueTypeChoice<T extends boolean> = T extends true ? string[] : string;
export type RelationResolveData = { confirm: boolean };

export type RelationValueChangeArgs<T extends boolean> = {
	value: RelationValueTypeChoice<T>;
	beforeValue: RelationValueTypeChoice<T>;
	initial: boolean;
};

export type RelationPropsType<Tmultiple extends boolean> = {
	collection: Exclude<`${Collections}`, `_${string}`>;
	id?: string;
	name?: string;
	label?: string;
	message?: string;
	yes?: string;
	no?: string;
	class?: string;
	animationDuration?: number;
	multiple?: Tmultiple;
	value?: RelationValueTypeChoice<Tmultiple>;
	defaultSearch?: string;
	disabled?: boolean;
	readonly?: boolean;
	onValueChange?: (args: RelationValueChangeArgs<Tmultiple>) => void;
};
// ################# END Relation.svelte Props ###############################

// ################# BEGIN Number.svelte Props ###############################
export type NumberValueChangeArgs = { value: number; beforeValue: number; initial: boolean };

export type NumberProps = Omit<SvelteHTMLElements['input'], 'type' | 'value' | 'size'> & {
	value?: number;
	status?: 'default' | 'success' | 'error' | 'warning' | 'info';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	dev?: boolean;
	autoChangeDecimalSeparator?: boolean;
	onValueChange?: ({ value, beforeValue, initial }: NumberValueChangeArgs) => void;
};
// ################# END Number.svelte Props ###############################

export type HiddenValueChangeArgs = { value: string | number | boolean; beforeValue: string | number | boolean; initial: boolean };

export type HiddenProps = Omit<SvelteHTMLElements['input'], 'type' | 'value'> & {
	value?: string | number | boolean;
	onValueChange?: (args: HiddenValueChangeArgs) => void;
};

// ################# BEGIN File.svelte Props ###############################
export type FileValueTypeChoice<T extends boolean> = T extends true ? string[] : string;
export type FileFileTypeChoice<T extends boolean> = T extends true ? File[] : File | undefined;

export type FileValueChangeArgs<T extends boolean> = {
	value: FileValueTypeChoice<T>;
	beforeValue: FileValueTypeChoice<T>;
	initial: boolean;
	selectedFiles: FileFileTypeChoice<T>;
	beforeSelectedFiles: FileFileTypeChoice<T>;
	deletedFileNames: FileValueTypeChoice<T>;
};

export type FileDisplayType = {
	name: string;
	uploaded: boolean;
	deleted: boolean;
	size?: number;
	fileObj?: File;
};
// Dışarıdan sadece `value` değeri güncellenebilir. (veritabanından gelen kayıtlı dosya isimleri)
// Yeni dosyalar (selectedFiles) yalnızca bileşen içerisinden kullanıcı etkileşimiyle (Gözat butonu veya sürükle-bırak yöntemiyle) eklenebilir.
export type FilePropsType<Tmultiple extends boolean> = {
	multiple?: Tmultiple;
	value?: FileValueTypeChoice<Tmultiple>; // database dosya isimleri
	id?: string;
	name?: string;
	accept?: string;
	maxSize?: number; // Bytes cinsinden limit (örn: 5 * 1024 * 1024)
	maxCount?: number; // Maksimum dosya sayısı
	class?: string;
	selectedFiles?: File[]; // yerel seçilen dosyalar
	disabled?: boolean;
	readonly?: boolean;
	onValueChange?: (args: FileValueChangeArgs<Tmultiple>) => void;
	onFilesChange?: (files: File[]) => void;
};
// ################# END File.svelte Props ###############################

// ################# BEGIN Datetime.svelte Props ###############################
export type DatetimeValueChangeArgs = { value: string; beforeValue: string; initial: boolean };

export type DatetimeProps = Omit<SvelteHTMLElements['input'], 'type' | 'value' | 'size'> & {
	value?: string;
	status?: 'default' | 'success' | 'error' | 'warning' | 'info';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	dev?: boolean;
	onValueChange?: ({ value, beforeValue, initial }: DatetimeValueChangeArgs) => void;
};
// ################# END Datetime.svelte Props ###############################

// ################# BEGIN Date.svelte Props ###############################
export type DateValueChangeArgs = { value: string; beforeValue: string; initial: boolean };

export type DateProps = Omit<SvelteHTMLElements['input'], 'type' | 'value' | 'size'> & {
	value?: string;
	status?: 'default' | 'success' | 'error' | 'warning' | 'info';
	size?: 'sm' | 'md' | 'lg';
	disabled?: boolean;
	dev?: boolean;
	onValueChange?: ({ value, beforeValue, initial }: DateValueChangeArgs) => void;
};
// ################# END Date.svelte Props ###############################

// ################# BEGIN Button.svelte Props ###############################
type ButtonVariant = 'filled' | 'light' | 'ghost';
type ButtonColor = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'surface' | 'success' | 'warning' | 'error' | 'info';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<SvelteHTMLElements['button'], 'type'> & {
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
	label?: string;
	startIcon?: IconName;
	endIcon?: IconName;
	icon?: IconName;
	iconOnly?: boolean;
	type?: 'button' | 'submit' | 'reset';
	children?: Snippet;
};
// ################# END Button.svelte Props ###############################

// ################# BEGIN Bool.svelte Props ###############################
export type BoolValueChangeArgs = { value: boolean; beforeValue: boolean; initial: boolean };
export type BoolProps = Omit<SvelteHTMLElements['button'], 'type' | 'value' | 'checked'> & {
	value?: boolean;
	text?: string;
	id?: string;
	name?: string;
	disabled?: boolean;
	readonly?: boolean;
	onValueChange?: (args: BoolValueChangeArgs) => void;
};
// ################# END Bool.svelte Props ###############################
