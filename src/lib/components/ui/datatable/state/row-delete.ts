import { t } from '#lib/app/localization/index.js';
import { confirm } from '#lib/components/ui/confirm/index.js';

/**
 * Satır silme: onay sorusu, silme komutu, listeyi tazeleme, silinenleri seçimden çıkarma ve bildirim.
 *
 * @example
 * // page.remote.ts — tek komut (tek kayıt da bir elemanlı liste olarak gelir)
 * export const deleteRecords = command(deleteManySchema, async ({ ids }) => { … });
 * // +page.svelte
 * const rowDelete = dt.createRowDelete({ list, remove: deleteRecords, onSuccess: toaster.success, onError: toaster.error });
 * <dt.DataTable {list} bind:selected={list.selected} onKeyDown={rowDelete.onKeyDown}>
 *   {#snippet actions(row)} <dt.ActionButton onclick={() => rowDelete.remove([row.id])} /> {/snippet}
 *
 * - remove(ids): onay sorulur (tek kayıtta id ile, çokta sayıyla); onaylanırsa silinir.
 * - targetsOf(rowId): sağ tık menüsü için hedefler: satır seçimdeyse tüm seçim, değilse yalnızca o satır.
 * - onKeyDown: Delete tuşu seçili satırları, seçim yoksa aktif hücrenin satırını siler (DataTable onKeyDown).
 */

// Sunucu komutu (command) çağrısının döndürdüğü: .updates(...sorgular) ile tazelenecek sorgular verilir
type Command<TQuery> = (args: { ids: string[] }) => { updates: (...queries: TQuery[]) => Promise<unknown> };

export type RowDeleteOptions<TQuery> = {
	list: { updates: TQuery[]; selected: string[] };
	remove: Command<TQuery>;
	// Bildirimler (örn: toaster.success, toaster.error)
	onSuccess?: (title: string, description?: string) => void;
	onError?: (error: unknown, message?: string) => void;
};

// DataTable onKeyDown bağlamının burada gereken kısmı
type KeyInfo = { cell: { row: { id: string } } | undefined; selected: string[] };

export function createRowDelete<TQuery>({ list, remove: command, onSuccess, onError }: RowDeleteOptions<TQuery>) {
	const remove = async (ids: string[]) => {
		if (ids.length === 0) return;
		const one = ids.length === 1;
		const message = one ? t('delete_confirm_with_id', { id: ids[0] }) : t('delete_confirm_many', { count: ids.length });
		if (!(await confirm({ message, yes: t('delete'), no: t('cancel'), danger: true }))) return;
		try {
			await command({ ids }).updates(...list.updates);
			list.selected = list.selected.filter((id) => !ids.includes(id));
			onSuccess?.(t('toast_deleted_title'), one ? t('toast_deleted_description', { id: ids[0] }) : t('toast_deleted_many', { count: ids.length }));
		} catch (error) {
			onError?.(error);
		}
	};

	return {
		remove,
		targetsOf: (rowId: string) => (list.selected.includes(rowId) ? list.selected : [rowId]),
		// Yerleşik bir Delete davranışı olmadığı için preventDefault yalnızca işlenince
		onKeyDown: (e: KeyboardEvent, { cell, selected }: KeyInfo) => {
			if (e.key !== 'Delete') return;
			const ids = selected.length > 0 ? selected : cell ? [cell.row.id] : [];
			if (ids.length === 0) return;
			e.preventDefault();
			remove(ids);
		}
	};
}
