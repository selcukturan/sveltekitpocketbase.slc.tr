import type { LayoutServerLoad } from './$types';

// Herkese açık tanıtım sayfası (/). Önceden /app'e yönlendiriyordu; artık oturum açmış kullanıcıya "Uygulamaya git",
// açmamış olana "Demoyu dene" (giriş) gösterilir.
export const load: LayoutServerLoad = ({ locals }) => {
	return { loggedIn: Boolean(locals.user?.id) };
};
