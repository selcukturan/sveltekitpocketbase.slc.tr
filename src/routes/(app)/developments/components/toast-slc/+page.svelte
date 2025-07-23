<script lang="ts">
	import { Page, Head } from '$lib/components/templates';

	import Toasts from '$lib/components/base/toast/toasts.svelte';
	import { createToaster } from '$lib/components/base/toast/toaster.svelte';

	const toaster = createToaster('page-toaster');
	const toaster2 = createToaster('page-toaster-2');

	let title = $state('title');
	let message = $state(
		'message - lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
	);
	let titleInput = $state<HTMLInputElement>();
</script>

<Head>
	<title>SLC - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Toasts id="page-toaster" position="bottom-center" />
<Toasts id="page-toaster-2" position="bottom-right" />

<Page>
	<Page.Header>
		<p>Page Header Number</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					toaster.add(title, message);
					/* title = '';
					message = '';
					titleInput?.focus(); */
				}}
				class="flex w-1/4 flex-col gap-2"
			>
				<div class="flex flex-col gap-1">
					<label for="title">Title</label>
					<input class="rounded-md border border-gray-800" id="title" bind:this={titleInput} bind:value={title} />
				</div>

				<div class="flex flex-col gap-1">
					<label for="message">Message</label>
					<input class="rounded-md border border-gray-800" id="message" bind:value={message} />
				</div>
				<button class="rounded-md bg-gray-300 p-1"> Add toast! </button>
			</form>

			<form
				onsubmit={(e) => {
					e.preventDefault();
					toaster2.add(title, message);
					/* title = '';
					message = '';
					titleInput?.focus(); */
				}}
				class="flex w-1/4 flex-col gap-2"
			>
				<div class="flex flex-col gap-1">
					<label for="title">Title</label>
					<input class="rounded-md border border-gray-800" id="title" bind:this={titleInput} bind:value={title} />
				</div>

				<div class="flex flex-col gap-1">
					<label for="message">Message</label>
					<input class="rounded-md border border-gray-800" id="message" bind:value={message} />
				</div>
				<button class="rounded-md bg-gray-300 p-1"> Add toast! </button>
			</form>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Page Footer Number</p>
	</Page.Footer>
</Page>
