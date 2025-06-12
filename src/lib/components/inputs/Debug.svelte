<script lang="ts" module>
	/**
	 * Bu blok içindeki kod, tarayıcı veya sunucu Debug.svelte dosyasını ilk kez yüklediğinde sadece bir kez çalışır.
	 * Bu blokta tanımlanan şeyler, o bileşenin tüm örnekleri arasında paylaşılır.
	 */
	type T = Record<string, unknown>;
</script>

<script lang="ts" generics="T extends Record<string, unknown>">
	import SuperDebug, { type SuperForm } from 'sveltekit-superforms';

	type Props = {
		label?: string;
		frm: SuperForm<T>;
	};

	let { label, frm }: Props = $props();

	const { form } = frm;
</script>

<SuperDebug data={$form} {label} />
