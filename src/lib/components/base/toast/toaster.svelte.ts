// https://github.com/huntabyte/svelte-5-context-classes

import type { Attachment } from 'svelte/attachments';
import { getContext, onDestroy, setContext } from 'svelte';
import type { Toast, ToastTimerData } from './types';

export class Toaster {
	toasts = $state<Toast[]>([]);
	#toastTimerData = new Map<string, ToastTimerData>();

	constructor() {
		onDestroy(() => {
			// Bileşen yok edildiğinde tüm zamanlayıcıları temizle
			for (const timerData of this.#toastTimerData.values()) {
				clearTimeout(timerData.timeoutId);
			}
			this.#toastTimerData.clear();
		});
	}

	// Tüm toast'ların zamanlayıcılarını duraklatan bir metot
	readonly pauseAll = () => {
		for (const id of this.#toastTimerData.keys()) {
			this.pauseTimer(id);
		}
	};

	// Tüm toast'ların zamanlayıcılarını devam ettiren bir metot
	readonly resumeAll = () => {
		for (const id of this.#toastTimerData.keys()) {
			this.resumeTimer(id);
		}
	};

	readonly add = (data: Toast) => {
		const id = data.id || crypto.randomUUID();
		const type = data.type || 'default';

		const longDurationTypes = ['info', 'error', 'warning'];
		const defaultDuration = longDurationTypes.includes(type) ? 5000 : 2000;
		const duration = data.duration ?? defaultDuration;

		this.toasts.push({
			id,
			type,
			duration,
			...data
		});

		// Zamanlayıcıyı başlat
		if (duration > 0) {
			this.startTimer(id, duration);
		}
	};

	readonly remove = (id: string) => {
		// Önce zamanlayıcıyı temizle ve Map'ten sil
		const timerData = this.#toastTimerData.get(id);
		if (timerData) {
			clearTimeout(timerData.timeoutId);
			this.#toastTimerData.delete(id);
		}
		// Sonra toast'ı listeden kaldır
		this.toasts = this.toasts.filter((toast) => toast.id !== id);
	};

	// --- Özel Zamanlayıcı Metotları ---

	private startTimer(id: string, durationMs: number) {
		const timeoutId = setTimeout(() => {
			this.remove(id);
		}, durationMs);

		this.#toastTimerData.set(id, {
			timeoutId,
			remainingMs: durationMs,
			startedAt: Date.now()
		});
	}

	private pauseTimer(id: string) {
		const timerData = this.#toastTimerData.get(id);
		if (!timerData) return;

		// Mevcut zamanlayıcıyı iptal et
		clearTimeout(timerData.timeoutId);

		// Ne kadar süre geçtiğini hesapla ve kalan süreyi güncelle
		const elapsed = Date.now() - timerData.startedAt;
		const newRemainingMs = timerData.remainingMs - elapsed;

		// Yeni veriyi Map'e kaydet
		this.#toastTimerData.set(id, {
			...timerData,
			remainingMs: newRemainingMs > 0 ? newRemainingMs : 0
		});
	}

	private resumeTimer(id: string) {
		const timerData = this.#toastTimerData.get(id);
		if (!timerData) return;

		// Yeni bir başlangıç zamanı belirle
		const newStartedAt = Date.now();

		// Kalan süre ile yeni bir zamanlayıcı başlat
		const newTimeoutId = setTimeout(() => {
			this.remove(id);
		}, timerData.remainingMs);

		// Map'teki veriyi yeni zamanlayıcı bilgileriyle güncelle
		this.#toastTimerData.set(id, {
			...timerData,
			startedAt: newStartedAt,
			timeoutId: newTimeoutId
		});
	}

	// --- Attachment Metotları ---

	readonly attach: Attachment = (element) => {
		// element DOM'a monte edilmiştir
		// setup buraya
		if (!(element instanceof HTMLElement)) {
			throw new Error('toast must be attached to an HTMLElement');
		}

		const handlePause = (e: MouseEvent) => {
			console.log('pauseAll - handlePause');
			this.pauseAll();
		};
		const handleResume = (e: MouseEvent) => {
			console.log('resumeAll - handleResume');
			this.resumeAll();
		};

		element.addEventListener('mouseenter', handlePause);
		element.addEventListener('mouseleave', handleResume);

		return () => {
			// destroy buraya
			element.removeEventListener('mouseenter', handlePause);
			element.removeEventListener('mouseleave', handleResume);
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
