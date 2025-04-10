export function throttle<This, Args extends unknown[], Return>(func: (this: This, ...args: Args) => Return, delay: number): ((this: This, ...args: Args) => void) & { cancel: () => void } {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	let lastExecTime = 0;
	const throttled = function (this: This, ...args: Args): void {
		const context = this;
		const currentTime = Date.now();
		const elapsedTime = currentTime - lastExecTime;
		const execute = () => {
			lastExecTime = currentTime;
			timeoutId = null;
			func.apply(context, args);
		};
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		if (elapsedTime >= delay) {
			execute();
		} else {
			timeoutId = setTimeout(execute, delay - elapsedTime);
		}
	};
	throttled.cancel = (): void => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = null;
		lastExecTime = 0;
	};
	return throttled;
}
export function debounce<This, Args extends unknown[]>(func: (this: This, ...args: Args) => void, delay: number): ((this: This, ...args: Args) => void) & { cancel: () => void } {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;
	const debounced = function (this: This, ...args: Args): void {
		const context = this;
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = setTimeout(() => {
			timeoutId = null;
			func.apply(context, args);
		}, delay);
	};
	debounced.cancel = (): void => {
		if (timeoutId) {
			clearTimeout(timeoutId);
		}
		timeoutId = null;
	};
	return debounced;
}
