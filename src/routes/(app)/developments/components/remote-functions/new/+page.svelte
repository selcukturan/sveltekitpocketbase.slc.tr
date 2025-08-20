<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { createLog } from '$lib/remotes/testQuery.remote';
	import Form from './Form.svelte';
</script>

<Head>
	<title>Remote [query] - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Remote [query]</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<h1>Create a new Log</h1>
			<Form remoteForm={createLog}>
				<label>
					<h2>Title</h2>
					<input name="title" />
				</label>

				<label>
					<h2>Write your post</h2>
					<textarea name="content"></textarea>
				</label>

				<button>Publish!</button>
			</Form>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Remote [query] Page Footer</p>
	</Page.Footer>
</Page>
