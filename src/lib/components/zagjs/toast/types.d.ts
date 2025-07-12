import * as toast from '@zag-js/toast';
import type { Snippet } from 'svelte';

export interface ToasterProps extends toast.StoreProps {
	toaster: toast.Store;
	children: Snippet;
}

export interface ToastProps extends Omit<ToasterProps, 'toaster' | 'children'> {
	newToastOptions: toast.Options;
	index: number;
	parent: toast.GroupService;
}
