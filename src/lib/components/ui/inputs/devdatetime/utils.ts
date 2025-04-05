export const formatDate = (val: string, cntrts: { required: boolean }): string | undefined => {
	// Eğer tarihleri "YYYY-MM-DD" formatında göstermek istiyorsanız, "en-CA" kanada yerel ayarını kullanabilirsiniz.
	const date = new Date(val);
	if (isNaN(date.getTime())) {
		return cntrts?.required ? undefined : '';
	} else {
		return (
			date
				.toLocaleString('en-CA', {
					hour12: false,
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit',
					second: '2-digit',
					fractionalSecondDigits: 3
				})
				.replace(',', '')
				.replace(' ', 'T') + 'Z'
		);
	}
};

export const clearFormattedDate = (val: string): string => {
	return new Date(val).toISOString().slice(0, 16);
};
