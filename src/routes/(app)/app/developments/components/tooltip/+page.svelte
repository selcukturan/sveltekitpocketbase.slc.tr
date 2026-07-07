<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { tooltip } from '$lib/attachments';

	let content = $state('This is a SLC attachment tooltip');
	let userSelected = $state('top');
</script>

<Head>
	<title>Tooltip - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Tooltip Page Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<input bind:value={content} class="border" />
			<label>
				<input type="radio" name="position0" value="top" bind:group={userSelected} />top
			</label>
			<label>
				<input type="radio" name="position1" value="bottom" bind:group={userSelected} />bottom
			</label>
			<label>
				<input type="radio" name="position2" value="left" bind:group={userSelected} />left
			</label>
			<label>
				<input type="radio" name="position3" value="right" bind:group={userSelected} />right
			</label>
			<div class="flex h-96 w-96 flex-col items-center justify-center">
				<span {@attach tooltip({ text: content, position: userSelected })}> Hover Me </span>
			</div>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Tooltip Page Footer</p>
	</Page.Footer>
</Page>
