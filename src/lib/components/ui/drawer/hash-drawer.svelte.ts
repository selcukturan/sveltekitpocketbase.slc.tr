import { t } from '#lib/app/localization/index.js';
import { setParams, getParam } from '#lib/utils/hash-url-helper.js';
import { watchUrlHash } from '#lib/attachments/index.js';
import { confirm } from '#lib/components/ui/confirm/index.js';
import type Drawer from './Drawer.svelte';

/**
 * URL hash'ine bağlı drawer durumu: `#cmd=update&id=abc`
 *
 * - Hash tek doğruluk kaynağıdır: geri tuşu, yenileme ve paylaşılan link aynı drawer'ı açar.
 * - `show('update', id)` hash'i yazar; drawer hash'i izleyip kendini açar.
 * - Kapatırken formda kaydedilmemiş değişiklik varsa onay sorulur.
 *
 * @example
 * const drawer = createHashDrawer();
 * <Drawer bind:this={drawer.ref} {@attach drawer.watch} onBeforeClose={drawer.beforeClose}>
 *   {#if drawer.cmd === 'create'} ... <Form onIsChange={drawer.setChanged}> ... {/if}
 * </Drawer>
 */
export class HashDrawer {
	ref = $state<Drawer | undefined>(undefined);
	cmd = $state('');
	id = $state('');
	isChanged = $state(false);

	// id gerektirmeyen komutlar (diğerleri id yoksa açılmaz)
	readonly #noIdCommands: string[];

	constructor({ noIdCommands = ['create'] }: { noIdCommands?: string[] } = {}) {
		this.#noIdCommands = noIdCommands;
	}

	readonly watch = watchUrlHash((hash) => {
		this.cmd = getParam('cmd', hash) || '';
		this.id = getParam('id', hash) || '';
		if (this.cmd && (this.id || this.#noIdCommands.includes(this.cmd))) this.ref?.open();
	});

	readonly show = (cmd: string, id = '') => setParams({ cmd, id });

	readonly close = () => this.ref?.close();

	readonly setChanged = (value: boolean) => {
		this.isChanged = value;
	};

	// Kaydedildikten sonra onay sormadan kapat
	readonly closeClean = () => {
		this.isChanged = false;
		this.close();
	};

	readonly beforeClose = async () => {
		if (this.isChanged && !(await confirm({ message: t('unsaved_changes_confirm'), yes: t('yes'), no: t('no') }))) return false;
		this.isChanged = false;
		setParams({ cmd: '', id: '' });
		return true;
	};
}

export const createHashDrawer = (options?: ConstructorParameters<typeof HashDrawer>[0]) => new HashDrawer(options);
