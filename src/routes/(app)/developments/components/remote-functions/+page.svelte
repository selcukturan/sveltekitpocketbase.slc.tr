<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
	import { getLogs } from '$lib/remotes/testQuery.remote';
	import { page } from '$app/state';
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
			<h1>Recent posts</h1>
			<!-- 
				Boundary, uygulamanızın bazı bölümlerini 'duvarla kapatmanıza' olanak tanır. Böylece:
				- await ifadeleri ilk kez çözümlenirken işlenmesi gereken kullanıcı arayüzünü geliştirebilirsiniz.
				- Render sırasında veya efektleri çalıştırırken oluşan hataları ele alabilir ve bir hata oluştuğunda işlenmesi gereken kullanıcı arayüzünü geliştirebilirsiniz.

				Bir boundary bir hata alırsa mevcut içeriği kaldırılacaktır. (bir failed snippet veya onerror fonksiyonu veya her ikisi ile üzerinde çalışılabilir)
			-->
			<svelte:boundary>
				<ul>
					{#each await getLogs() as { id, title, content }}
						<li>
							<a href="{page.url.pathname}/{id}"
								>{`title: ${title} - content: ${content}`}</a
							>
						</li>
					{/each}
				</ul>
				<button onclick={() => getLogs().refresh()}>
					Check for new posts
				</button>
				<!--  bir `pending` snippet içeren `svelte:boundary`, `await` ifadeleri içerebilir. 
				Bu snippet, `svelte:boundary` ilk oluşturulduğunda gösterilir ve `svelte:boundary` içindeki 
				tüm `await` ifadeleri çözülene kadar görünür kalır. 
				`pending` snippet sonraki asenkron güncellemeler için gösterilmeyecektir - bunlar için $effect.pending() kullanabilirsiniz. -->
				{#snippet pending()}
					<p>pending 2...</p>
				{/snippet}
				<!--  failed snippet, boundary içinde bir hata oluştuğunda işlenecektir.
				error ve içeriği yeniden oluşturan bir reset fonksiyonu ile birlikte oluşturulur. -->
				{#snippet failed(error, reset)}
					<button onclick={reset} class="bg-error-400"> failed! reset.</button>
				{/snippet}
			</svelte:boundary>

			<a href="{page.url.pathname}/new">Create a new log</a>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Remote [query] Page Footer</p>
	</Page.Footer>
</Page>
