import type { SvelteHTMLElements } from 'svelte/elements';
import type { RemoteFormField } from '@sveltejs/kit';

// ######################## 1. TEMEL ATOMİK TİPLER ##################################################################################

// Değer tipini multiple durumuna göre belirleyen ana motor
export type ValueType<T extends boolean> = T extends true ? string[] : string;

// Tüm bileşenlerde ortak olan "Değer ve Multiple" ikilisi
interface SharedState<T extends boolean> {
	multiple?: T;
	value?: ValueType<T>;
}

// Picker bileşenlerinin ortak UI konfigürasyonu
interface PickerConfig {
	message?: string;
	yes?: string;
	no?: string;
	animationDuration?: number;
}

export type ResolveData<T extends boolean> = {
	confirm: boolean;
	value: ValueType<T>;
};

// ######################## 2. BİLEŞEN ÖZEL TİPLERİ (TÜRETİLMİŞ) #####################################################################

// --- Picker (En çekirdek bileşen) ---
// Sadece değerleri ve UI konfigürasyonunu alır
export type RelationPickerPropsType<T extends boolean = false> = SharedState<T> & PickerConfig;

// --- Runner (Picker'ı çalıştıran/saran yapı) ---
// Genellikle Picker ile aynı proplara sahiptir.
// Eğer ileride Runner'a özel prop gelirse buraya eklenebilir.
export type RelationPickerRunnerPropsType<T extends boolean = false> = RelationPickerPropsType<T>;

// --- Input (Ana Form Bileşeni) ---
// Hem HTML Select proplarını, hem Picker konfigürasyonunu, hem de Form alanlarını birleştirir.
export type RelationInputPropsType<T extends boolean = false> = Omit<
	SvelteHTMLElements['select'],
	'id' | 'value' | 'multiple' | 'name'
> &
	SharedState<T> &
	PickerConfig & {
		id?: string;
		name?: string;
		label?: string;
		field?: RemoteFormField<ValueType<T>>;
	};
