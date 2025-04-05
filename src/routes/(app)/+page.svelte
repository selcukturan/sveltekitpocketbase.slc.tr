<script lang="ts">
	const { data } = $props();
</script>

<section class="flex h-full w-full flex-col overflow-hidden">
	<header class="bg-warning-200 p-1">
		<h6>DASHBOARD HEADER</h6>
	</header>
	<main class="relative flex-1 overflow-y-auto overflow-x-hidden p-1">
		<h6>DASHBOARD CONTENT</h6>
		<pre>{JSON.stringify(data, null, 2)}</pre>
	</main>
	<footer class="bg-success-200 p-1">
		<h6>DASHBOARD FOOTER</h6>
	</footer>
</section>
