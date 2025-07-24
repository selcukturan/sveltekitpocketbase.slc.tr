// https://github.com/huntabyte/svelte-5-context-classes

import type { Attachment } from 'svelte/attachments';
import { getContext, onDestroy, setContext } from 'svelte';
import type { Toast, ToastTimerData } from './types';

export class Toaster {
	toasts = $state<Toast[]>([]);
	// Haritamızı daha fazla veri tutacak şekilde güncelliyoruz
	private toastTimerData = new Map<string, ToastTimerData>();
	private _isPaused: boolean = false;

	constructor() {
		onDestroy(() => {
			// Bileşen yok edildiğinde tüm zamanlayıcıları temizle
			for (const timerData of this.toastTimerData.values()) {
				clearTimeout(timerData.timeoutId);
			}
			this.toastTimerData.clear();
		});
	}

	// Tüm toast'ların zamanlayıcılarını duraklatan bir metot
	readonly pauseAll = () => {
		for (const id of this.toastTimerData.keys()) {
			this.pauseTimer(id);
		}
		this._isPaused = true;
	};

	// Tüm toast'ların zamanlayıcılarını devam ettiren bir metot
	readonly resumeAll = () => {
		for (const id of this.toastTimerData.keys()) {
			this.resumeTimer(id);
		}
		this._isPaused = false;
	};

	readonly add = (title: string, message: string, durationMs = 5000) => {
		const id = crypto.randomUUID();
		this.toasts.push({
			id,
			title,
			message
		});

		// Zamanlayıcıyı başlat
		this.startTimer(id, durationMs);
	};

	readonly remove = (id: string) => {
		// Önce zamanlayıcıyı temizle ve Map'ten sil
		const timerData = this.toastTimerData.get(id);
		if (timerData) {
			clearTimeout(timerData.timeoutId);
			this.toastTimerData.delete(id);
		}
		// Sonra toast'ı listeden kaldır
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	};

	// --- Özel Zamanlayıcı Metotları ---

	private startTimer(id: string, durationMs: number) {
		const timeoutId = setTimeout(() => {
			this.remove(id);
		}, durationMs);

		this.toastTimerData.set(id, {
			timeoutId,
			remainingMs: durationMs,
			startedAt: Date.now()
		});
	}

	private pauseTimer(id: string) {
		const timerData = this.toastTimerData.get(id);
		if (!timerData) return;

		// Mevcut zamanlayıcıyı iptal et
		clearTimeout(timerData.timeoutId);

		// Ne kadar süre geçtiğini hesapla ve kalan süreyi güncelle
		const elapsed = Date.now() - timerData.startedAt;
		const newRemainingMs = timerData.remainingMs - elapsed;

		// Yeni veriyi Map'e kaydet
		this.toastTimerData.set(id, {
			...timerData,
			remainingMs: newRemainingMs > 0 ? newRemainingMs : 0
		});
	}

	private resumeTimer(id: string) {
		const timerData = this.toastTimerData.get(id);
		if (!timerData) return;

		// Yeni bir başlangıç zamanı belirle
		const newStartedAt = Date.now();

		// Kalan süre ile yeni bir zamanlayıcı başlat
		const newTimeoutId = setTimeout(() => {
			this.remove(id);
		}, timerData.remainingMs);

		// Map'teki veriyi yeni zamanlayıcı bilgileriyle güncelle
		this.toastTimerData.set(id, {
			...timerData,
			startedAt: newStartedAt,
			timeoutId: newTimeoutId
		});
	}

	// --- Attachment Metotları ---

	readonly attach: Attachment = (element) => {
		// element DOM'a monte edilmiştir
		// setup buraya
		const handleInteractionStart = () => {
			console.log('handleInteractionStart called');
			this.pauseAll();
		};

		const handleMouseLeave = () => {
			console.log('handleMouseLeave called');
			this.resumeAll();
		};

		const handleDocumentInteraction = (event: MouseEvent | TouchEvent) => {
			if (!this._isPaused) return;

			// Eğer fare toast'ın dışında ise tüm toast'ların zamanlayıcılarını devam ettir
			if (!element.contains(event.target as Node)) {
				console.log('handleDocumentInteraction called');
				this.resumeAll();
			}
		};

		element.addEventListener('mouseenter', handleInteractionStart);
		element.addEventListener('touchstart', handleInteractionStart, { passive: true });
		element.addEventListener('mouseleave', handleMouseLeave);
		document.addEventListener('click', handleDocumentInteraction);

		return () => {
			// destroy buraya
			element.removeEventListener('mouseenter', handleInteractionStart);
			element.removeEventListener('touchstart', handleInteractionStart);
			element.removeEventListener('mouseleave', handleMouseLeave);
			document.removeEventListener('click', handleDocumentInteraction);
		};
	};
}

export function createToaster(id: string) {
	return setContext(id, new Toaster());
}

export function getToaster(id: string) {
	const toasterInstance = getContext<ReturnType<typeof createToaster>>(id);
	if (!toasterInstance) {
		throw new Error('Toaster context not found. Make sure you have called createToaster in an ancestor component.');
	}
	return toasterInstance;
}
