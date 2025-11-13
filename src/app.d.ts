import type { TypedPocketBase } from '$lib/types/pocketbase-types';
import type { AuthRecord } from 'pocketbase';
import { CustomAuthStore } from '$lib/server/pb';

declare global {
	namespace App {
		interface Error {
			type: 'pb' | 'general';
			errorId: string;
			message: string;
		}
		interface Locals {
			pb: TypedPocketBase;
			auth: CustomAuthStore;
			user: AuthRecord;
		}
		interface PageState {
			message?: string;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
