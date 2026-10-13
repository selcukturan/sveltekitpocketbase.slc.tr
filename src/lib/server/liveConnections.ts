/**
 * Açık canlı (query.live) bağlantıların sunucu tarafı kaydı.
 * SvelteKit bağlantıyı GC'ye bıraktığı için, bağlantıları biz açıkça kapatabilelim diye tutulur.
 * Not: *.remote.ts dosyaları yalnızca remote fonksiyon export edebildiği için ayrı modülde durur.
 */

const IDLE_TIMEOUT_MS = 3 * 60_000; // 3 dakika. Bu süre boyunca ping gelmezse bağlantı kapatılır
const SWEEP_INTERVAL_MS = 30_000;
const PENDING_CLOSE_TTL_MS = 30_000;

type Connection = { userId: string; close: () => void; lastSeen: number };

const connections = new Map<string, Connection>();
// Bağlantı kurulmadan önce gelen kapatma istekleri (hızlı sayfa geçişi yarışı için)
const pendingCloses = new Map<string, { userId: string; timer: ReturnType<typeof setTimeout> }>();
let sweeper: ReturnType<typeof setInterval> | null = null;

// sweeper yoksa tanımla
function ensureSweeper() {
	if (sweeper) return;
	sweeper = setInterval(() => {
		const now = Date.now();
		for (const [id, conn] of connections) {
			if (now - conn.lastSeen > IDLE_TIMEOUT_MS) {
				console.warn(`[liveConnections] Ping gelmedi, bağlantı kapatılıyor: ${id}`);
				conn.close();
				connections.delete(id);
			}
		}
		if (connections.size === 0 && sweeper) {
			clearInterval(sweeper);
			sweeper = null;
		}
	}, SWEEP_INTERVAL_MS);
	sweeper.unref?.();
}

/** Bağlantıyı kaydeder. Kapatma isteği önceden geldiyse null döner (akış hiç başlamamalı). */
export function registerConnection(id: string, userId: string, close: () => void) {
	const pending = pendingCloses.get(id);
	if (pending) {
		clearTimeout(pending.timer);
		pendingCloses.delete(id);
		if (pending.userId === userId) return null;
	}
	const entry: Connection = { userId, close, lastSeen: Date.now() };
	connections.set(id, entry);
	ensureSweeper();
	return entry;
}

export function unregisterConnection(id: string, entry: Connection) {
	if (connections.get(id) === entry) connections.delete(id);
}

/** Kullanıcıya ait tek bağlantıyı kapatır; henüz kurulmamışsa "bekleyen kapatma" olarak işaretler. */
export function closeConnection(id: string, userId: string) {
	const conn = connections.get(id);
	if (conn) {
		if (conn.userId === userId) conn.close();
		return;
	}
	const timer = setTimeout(() => pendingCloses.delete(id), PENDING_CLOSE_TTL_MS);
	timer.unref?.();
	pendingCloses.set(id, { userId, timer });
}

/** Logout vb. durumlarda kullanıcının tüm açık bağlantılarını kapatır. */
export function closeUserLiveConnections(userId: string) {
	for (const [id, conn] of connections) {
		if (conn.userId === userId) {
			conn.close();
			connections.delete(id);
		}
	}
}

/** Canlılık sinyali. Bağlantı sunucuda yoksa false döner. */
export function touchConnection(id: string, userId: string) {
	const conn = connections.get(id);
	if (!conn || conn.userId !== userId) return false;
	conn.lastSeen = Date.now();
	return true;
}
