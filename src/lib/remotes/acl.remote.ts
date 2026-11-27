import { query } from '$app/server';
import { checkAuthenticated } from '#lib/remotes/guarded.remote.js';
import { getAcl } from '#lib/server/acl.js';

// İstemcinin yetki bilgisi: kaynaklar (menü, sayfa eşleştirme) ve etkin izinler. Menü buildAccessMenu ile, sayfa
// koruması canAccessPage ile, düğmeler can ile bundan çizilir. Bu yalnızca arayüzdür; asıl kontrol her remote
// fonksiyondaki requirePermission'dır.
export const getMyAccess = query(async () => {
	await checkAuthenticated(); // 🔒
	return await getAcl();
});
