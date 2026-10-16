import type { RequestEvent } from '@sveltejs/kit';

/**
 * Hook'ta authRefresh() yapılmayacak remote fonksiyon adları.
 * Bunlar kullanıcı etkinliği sayılmayan arka plan istekleridir (periyodik reconnect vb.).
 * Token yenilenirse oturum hiç boşta kalmaz ve süre dolumu çalışmaz.
 * Not: Ad, remote fonksiyonun export adıdır; farklı dosyalarda aynı adı kullanmaktan kaçının.
 */
const SKIP_AUTH_REFRESH = new Set<string>(['notificationsBG', 'closeNotificationsBG']);

// Remote istek adresi: /{base}/{app_dir}/remote/{hash}/{fonksiyonAdı}[/{argüman}]
const REMOTE_NAME_PATTERN = /\/remote\/[^/]+\/([^/]+)/;

export function shouldSkipAuthRefresh(event: RequestEvent) {
	if (!event.isRemoteRequest) return false;
	// event.url değil: command/form isteklerinde SvelteKit event.url'i çağrının yapıldığı sayfanın adresine çevirir
	const name = new URL(event.request.url).pathname.match(REMOTE_NAME_PATTERN)?.[1];
	return !!name && SKIP_AUTH_REFRESH.has(name);
}
