export type Toast = {
	id: string;
	title: string;
	message: string;
};

// Her bir toast'ın zamanlayıcı verilerini tutmak için bir tip tanımı
export type ToastTimerData = {
	timeoutId: ReturnType<typeof setTimeout>;
	remainingMs: number;
	startedAt: number;
};
