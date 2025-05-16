import * as toast from '@zag-js/toast';

export interface ToasterProps extends toast.StoreProps {
	toaster: toast.Store;
}

export interface ToastProps extends Omit<ToasterProps, 'toaster'> {
	newToastOptions: toast.Options;
	index: number;
	parent: toast.GroupService;
}
