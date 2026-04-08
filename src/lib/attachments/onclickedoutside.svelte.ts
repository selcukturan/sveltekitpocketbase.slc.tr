import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

export function clickedoutside(node: HTMLElement) {
	// cleanup/temizlik için sadece `on` fonksiyonunu da döndürebiliriz.
	const off = on(window, 'click', (event: MouseEvent) => {
		// tıkladığımız hedef, `node`un içinde değilse, `clickedoutside` olayı tetiklenir.
		if (!node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('clickedoutside', { bubbles: true, detail: event }));
		}
	});

	return () => off(); // Temizlik fonksiyonu, olay dinleyicisini kaldırır.

	/*
	const click = (event: MouseEvent) => {
		// code
	};
	window.addEventListener('click', click);
	return () => window.removeEventListener('click', click); 

	<div {@attach clickedoutside} onclickedoutside={() => console.log('x')}>test</div>
	*/
}
