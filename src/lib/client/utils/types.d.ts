// Hata mesajlarını alan adı bazında gruplayan bir format
export type FormFieldErrors = Record<string, string[] | undefined>;
export type FormErrorResponse = {
	status: number;
	errors: FormFieldErrors;
};
