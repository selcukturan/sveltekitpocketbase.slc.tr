import type { PageServerLoad } from './$types';
import utils from '$lib/utils';

export const load = (async ({ locals }) => {
	console.log(utils.turkishLowerCase('ğüşiöç ĞÜŞİÖÇ iİ ıI'));

	return {
		user: 'locals.user'
	};
}) satisfies PageServerLoad;
