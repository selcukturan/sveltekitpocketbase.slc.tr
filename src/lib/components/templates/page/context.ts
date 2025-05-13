import { createContext } from '$lib/client/utils/create-context';
import type { PageTemplateType } from './types';

export const [setContext, getContext, key] = createContext<PageTemplateType>({
	pageTitle: 'SLC'
});
