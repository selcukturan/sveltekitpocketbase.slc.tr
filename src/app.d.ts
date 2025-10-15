import type { TypedPocketBase } from '$lib/types/pocketbase-types';
import type { AuthRecord } from 'pocketbase';
import { CustomAuthStore } from '$lib/server/pb';

declare global {
	namespace App {
		interface Error {
			message: string;
			errorId: string;
		}
		interface Locals {
			pb: TypedPocketBase;
			auth: CustomAuthStore;
			user: AuthRecord | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
