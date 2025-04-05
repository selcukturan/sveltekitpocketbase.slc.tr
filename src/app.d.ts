import { Auth } from '$lib/server/auth';

declare global {
	namespace App {
		interface Error {
			message: string;
			errorId: string;
		}
		interface Locals {
			auth: Auth;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
