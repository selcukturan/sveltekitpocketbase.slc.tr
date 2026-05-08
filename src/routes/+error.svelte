<script lang="ts">
	import { page } from '$app/state';

	const emojis = {
		404: '😮‍💨',
		500: '😮‍💨'
	} as const;
</script>

<h1>{page.status} {page.error?.message ?? 'An unknown error occurred'}</h1>
<span style="font-size: 10em">
	{emojis[page.status as keyof typeof emojis] ?? emojis[500]}
</span>
