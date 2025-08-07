export type Toast = {
	id?: string;
	type?: 'default' | 'info' | 'success' | 'warning' | 'error' | 'loading';
	title?: string;
	description?: string;
	closable?: boolean;
	duration?: number;
	action?: {
		label: string;
		onClick: (id: string) => void;
	};
};

export type Toaster = {
	id: string;
	position?: 'top-center' | 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-left';
};

// Her bir toast'ın zamanlayıcı verilerini tutmak için bir tip tanımı
export type ToastTimerData = {
	timeoutId: ReturnType<typeof setTimeout>;
	remainingMs: number;
	startedAt: number;
};
