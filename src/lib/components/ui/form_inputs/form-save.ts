import { t } from '#lib/app/localization/index.js';

/**
 * Form kaydetme: gönderim, sorguları tazeleme, drawer'ı kapatma ve bildirim. form.enhance'e verilir:
 *
 * @example
 * // Drawer'daki tablo formu: listeyi tazeler, kaydedince drawer'ı onay sormadan kapatır
 * const save = formInput.createFormSave({ list, drawer, onSuccess: toaster.success, onError: toaster.error });
 * // Sayfa içinde açık kalan form: drawer yok, tazelenecek sorgu elle verilir
 * const save = formInput.createFormSave({ updates: () => [getSettings()], onSuccess: toaster.success, onError: toaster.error });
 *
 * <Form {...form.preflight(schema).enhance(save)} />
 *
 * - Doğrulama geçmezse (submit false): alan hataları inputların altında; ayrıca onError(null, 'invalid_data').
 * - Başarılıysa: drawer?.closeClean() ve onSuccess('toast_saved_title', 'toast_saved_description').
 * - Sunucu hatası fırlarsa: onError(error).
 */

// form.enhance'in verdiği submit: .updates(...sorgular) ile tazelenecek sorgular verilir
type Submit<TQuery> = () => { updates: (...queries: TQuery[]) => Promise<boolean> };

export type FormSaveOptions<TQuery> = {
	// Tazelenecek sorgular: list (list.updates) ya da updates (gönderim anında çağrılır)
	list?: { updates: TQuery[] };
	updates?: () => TQuery[];
	// Kaydedince onay sormadan kapatılır (createHashDrawer)
	drawer?: { closeClean: () => void };
	// Bildirimler (örn: toaster.success, toaster.error)
	onSuccess?: (title: string, description?: string) => void;
	onError?: (error: unknown, message?: string) => void;
};

export function createFormSave<TQuery>({ list, updates, drawer, onSuccess, onError }: FormSaveOptions<TQuery>) {
	return async ({ submit }: { submit: Submit<TQuery> }) => {
		try {
			const queries = list ? list.updates : (updates?.() ?? []);
			if (!(await submit().updates(...queries))) return onError?.(null, t('invalid_data'));
			drawer?.closeClean();
			onSuccess?.(t('toast_saved_title'), t('toast_saved_description'));
		} catch (error) {
			onError?.(error);
		}
	};
}
