import type { ActionFailure } from '@sveltejs/kit';

/**
 * handleError fonksiyonundan dönen `fail` içindeki veri yapısı.
 */
export type AppErrorData = {
	isPbError: boolean;
	message: string;
	data: Record<string, any>;
};

/**
 * Uygulama genelinde kullanılacak olan standart ActionFailure tipimiz.
 */
export type AppActionFailure = ActionFailure<AppErrorData>;
