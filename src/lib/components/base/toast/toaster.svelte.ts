// https://github.com/huntabyte/svelte-5-context-classes

import type { Attachment } from 'svelte/attachments';
import { getContext, onDestroy, setContext } from 'svelte';
import type { Toast, ToastTimerData } from './types';

export class Toaster {
	toasts = $state<Toast[]>([]);
	// Haritamızı daha fazla veri tutacak şekilde güncelliyoruz
	private toastTimerData = new Map<string, ToastTimerData>();

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
	};

	// Tüm toast'ların zamanlayıcılarını devam ettiren bir metot
	readonly resumeAll = () => {
		for (const id of this.toastTimerData.keys()) {
			this.resumeTimer(id);
		}
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
		const handleMouseEnter = () => {
			this.pauseAll();
		};

		const handleMouseLeave = () => {
			this.resumeAll();
		};

		element.addEventListener('mouseenter', handleMouseEnter);
		element.addEventListener('mouseleave', handleMouseLeave);
		return () => {
			// destroy buraya
			element.removeEventListener('mouseenter', handleMouseEnter);
			element.removeEventListener('mouseleave', handleMouseLeave);
		};
	};
}

export function createToaster(id: string) {
	return setContext(id, new Toaster());
}

export function getToaster(id: string) {
	return getContext<Toaster>(id);
}
