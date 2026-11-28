// Girdilerin ortak görünümü (Text, Textarea, Number, Date, Datetime, Select tetikleyicisi, File, Relation).
// Form alanı kutusuyla (.slc-field, s07_base.css) aynı dil: açık zemin, kenarlık, üzerine gelince koyulaşan kenarlık,
// odakta marka renginde kenarlık ve halka. Durum renkleri yalnızca kenarlık ve halkada; metin her durumda okunur.
const focus = 'focus:outline-none focus-visible:outline-none focus:ring-3';

export const inputClasses = {
	// Temel yapı, hizalama, tipografi ve genel durumlar
	base: 'm-0 block w-full min-w-0 transition-colors disabled:cursor-not-allowed disabled:opacity-50',

	// Durum (variant): kenarlık ve odak halkası rengi
	variants: {
		default: `bg-(--slc-input-bg) text-surface-950 placeholder-surface-400 border border-surface-300 hover:border-surface-400 focus:border-primary-500 focus:ring-primary-500/20 ${focus}`,
		success: `bg-(--slc-input-bg) text-surface-950 placeholder-surface-400 border border-success-500 focus:ring-success-500/20 ${focus}`,
		error: `bg-(--slc-input-bg) text-surface-950 placeholder-surface-400 border border-error-500 focus:ring-error-500/20 ${focus}`,
		warning: `bg-(--slc-input-bg) text-surface-950 placeholder-surface-400 border border-warning-500 focus:ring-warning-500/20 ${focus}`,
		info: `bg-(--slc-input-bg) text-surface-950 placeholder-surface-400 border border-info-500 focus:ring-info-500/20 ${focus}`,
		// Form alanı kutusunun (.slc-field) içinde: kutu çerçeveyi ve odağı çizer, girdi saydam
		'with-field': 'outline-none focus-visible:outline-none bg-transparent text-surface-950 placeholder-surface-400'
	},

	// Boyut (padding, yazı boyutu, köşe)
	sizes: {
		sm: 'px-3 py-1.5 text-sm rounded-lg',
		md: 'px-3 py-2 text-sm rounded-lg',
		lg: 'px-4 py-2.5 text-base rounded-lg'
	}
};
