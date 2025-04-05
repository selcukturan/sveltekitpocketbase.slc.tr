import type { HandleClientError } from '@sveltejs/kit';

export const handleError: HandleClientError = () => {
	return {
		message: 'Whoops!',
		errorId: '#SLC-1'
	};
};
