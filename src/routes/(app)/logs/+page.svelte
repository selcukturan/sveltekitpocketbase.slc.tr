<script lang="ts">
	import type { PageProps } from './$types';
	const props: PageProps = $props();
</script>

<section class="flex h-full w-full flex-col overflow-hidden">
	<header class="bg-warning-200 p-1">
		<h6>LOGS HEADER - ĞÜŞİÖÇI - ğüşiöçı</h6>
	</header>
	<main class="relative flex-1 overflow-x-hidden overflow-y-auto p-1">
		<h6>LOGS PAGE PROPS</h6>
		<p>######## USER ########</p>
		<pre>{JSON.stringify(props.data.user, null, 2)}</pre>
		<p>######## COLLECTION ########</p>
		<pre>{JSON.stringify(props.data.collection, null, 2)}</pre>
		<p>######## COLLECTION TRANSFORMED ########</p>
		<pre>{JSON.stringify(props.data.transformedData, null, 2)}</pre>
		######## envTest ########
		<pre>{JSON.stringify(props.data.envTest, null, 2)}</pre>

		<div data-llm-ignore="" class="rounded-tl-card rounded-tr-card border-muted relative mt-6 border-2 bg-zinc-50 ring-transparent! dark:bg-neutral-900/50">
			<label>
				E-Posta
				<input
					id="email"
					name="email"
					placeholder="E-Posta"
					type="email"
					autocapitalize="none"
					autocomplete="email"
					autocorrect="off"
					class="h-input focus-within:border-border-input-hover focus-within:shadow-date-field-focus rounded-10px hover:border-border-input-hover border-border-input bg-background text-foreground w-[219px] border pr-2 pl-2 text-base outline-none sm:text-sm"
				/>
			</label>
		</div>
	</main>
	<footer class="bg-success-200 p-1">
		<h6>LOGS FOOTER</h6>
	</footer>
</section>
