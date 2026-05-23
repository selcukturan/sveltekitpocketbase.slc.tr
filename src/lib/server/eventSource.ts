/**
 * Node.js için Hafif ve Bağımsız EventSource Polyfill
 * Harici paket bağımlılığını ortadan kaldırır ve yerleşik Stream API kullanır.
 */
class SimpleEventSource {
	private url: string;
	private controller: AbortController;
	private listeners: Record<string, ((e: unknown) => void)[]> = {};
	public onerror: ((err: unknown) => void) | null = null;
	public onmessage: ((e: unknown) => void) | null = null;
	public readyState: number = 0; // 0 = CONNECTING, 1 = OPEN, 2 = CLOSED

	constructor(url: string) {
		this.url = url;
		this.controller = new AbortController();
		this.readyState = 0;
		console.log(`[SimpleEventSource] Yeni bağlantı başlatılıyor: ${url}`);
		this.connect();
	}

	private async connect() {
		try {
			const response = await fetch(this.url, {
				headers: {
					Accept: 'text/event-stream',
					'Cache-Control': 'no-cache'
				},
				signal: this.controller.signal
			});

			if (!response.ok || !response.body) {
				throw new Error(`SSE bağlantı hatası: ${response.statusText}`);
			}

			this.readyState = 1; // OPEN
			console.log(`[SimpleEventSource] SSE bağlantısı başarılı: ${this.url}`);
			const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
			let buffer = '';
			let event = 'message';
			let data = '';
			let id = '';

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;

				buffer += value;
				const lines = buffer.split(/\r\n|\r|\n/);
				buffer = lines.pop() || '';

				for (const line of lines) {
					// : keepalive kontrolü
					if (line.startsWith(':')) {
						continue;
					}
					// Boş satır kontrolü (Bu mesaj bitti, artık istemciye teslim edebilirsin)
					if (line === '') {
						console.log(`[SimpleEventSource] Mesaj alındı - Event: ${event}, ID: ${id || 'yok'}`);
						const eventObj = {
							type: event,
							data: data,
							lastEventId: id,
							id: id,
							origin: new URL(this.url).origin
						};
						// Eğer olay standart bir mesaj ise doğrudan onmessage callback'ini tetikleriz.
						if (event === 'message' && this.onmessage) {
							this.onmessage(eventObj);
						}
						// PocketBase SDK'sının dinlediği özel olaylar (Örn: PB_CONNECT veya sys_logs/*) varsa, o olaya kayıtlı tüm dinleyicileri (listeners) tetikleyerek veriyi teslim ederiz.
						const listeners = this.listeners[event] || [];
						for (const listener of listeners) {
							listener(eventObj);
						}
						// Sıfırlama (Reset): Bir sonraki gelecek mesajın verileri eskisyle karışmasın diye
						event = 'message';
						data = '';
						id = '';
						continue;
					}
					
					// Anahtar-Değer Ayrıştırma
					const colonIndex = line.indexOf(':');
					let field = line;
					let val = '';
					if (colonIndex !== -1) {
						field = line.slice(0, colonIndex);
						val = line.slice(colonIndex + 1);
						if (val.startsWith(' ')) {
							val = val.slice(1);
						}
					}
					
					//  Verilerin Biriktirilmesi
					if (field === 'event') {
						event = val;
					} else if (field === 'data') {
						data = data ? data + '\n' + val : val;
					} else if (field === 'id') {
						id = val;
					}
				}
			}
		} catch (err: unknown) {
			if (err instanceof Error && err.name === 'AbortError') {
				console.log(`[SimpleEventSource] SSE bağlantısı iptal edildi: ${this.url}`);
				return;
			}
			this.readyState = 2; // CLOSED
			console.error(`[SimpleEventSource] SSE hatası (${this.url}):`, err);
			if (this.onerror) {
				this.onerror(err);
			}
		}
	}

	addEventListener(event: string, listener: (e: unknown) => void) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}
		this.listeners[event].push(listener);
	}

	removeEventListener(event: string, listener: (e: unknown) => void) {
		if (!this.listeners[event]) return;
		this.listeners[event] = this.listeners[event].filter((l) => l !== listener);
	}

	close() {
		this.readyState = 2; // CLOSED
		console.log(`[SimpleEventSource] SSE bağlantısı kapatılıyor: ${this.url}`);
		this.controller.abort();
	}
}

globalThis.EventSource = SimpleEventSource as unknown as typeof globalThis.EventSource;
console.log(`[SimpleEventSource] SimpleEventSource polyfill global olarak ZORLA enjekte edildi.`);
