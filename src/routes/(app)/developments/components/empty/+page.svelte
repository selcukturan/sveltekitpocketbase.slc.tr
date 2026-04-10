<script lang="ts">
	import { Toggler } from '$lib/components/base/toggler';
</script>

<div class="container">
	<Toggler placement="top-start" contentClasses="border-1 border-red-500 bg-warning-100 shadow-lg z-5000">
		{#snippet trigger({ toggle })}
			<button onclick={toggle}>top-start</button>
		{/snippet}
		{#snippet children({ close })}
			<div class="menu">
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>Profil</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>Profil</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>Profil</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>Profil</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>Profil</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxYYYYYY</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
			</div>
		{/snippet}
	</Toggler>

	<Toggler placement="top-end" contentClasses="border-1 border-red-500 bg-warning-100 shadow-lg z-50">
		{#snippet trigger({ toggle })}
			<button onclick={toggle}>top-end</button>
		{/snippet}
		{#snippet children({ close })}
			<div class="menu">
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>Profil</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
			</div>
		{/snippet}
	</Toggler>

	<Toggler placement="top-center" contentClasses="border-1 border-red-500 bg-warning-100 shadow-lg z-50">
		{#snippet trigger({ toggle })}
			<button onclick={toggle}>top-center</button>
		{/snippet}
		{#snippet children({ close })}
			<div class="menu">
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>Profil</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
			</div>
		{/snippet}
	</Toggler>

	<Toggler placement="bottom-start" contentClasses="border-1 border-red-500 bg-warning-100 shadow-lg z-50">
		{#snippet trigger({ toggle })}
			<button onclick={toggle}>bottom-start</button>
		{/snippet}
		{#snippet children({ close })}
			<div class="menu">
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>Profil</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
			</div>
		{/snippet}
	</Toggler>

	<Toggler placement="bottom-end" contentClasses="border-1 border-red-500 bg-warning-100 shadow-lg z-50">
		{#snippet trigger({ toggle })}
			<button onclick={toggle}>bottom-end</button>
		{/snippet}
		{#snippet children({ close })}
			<div class="menu">
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>Profil</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
			</div>
		{/snippet}
	</Toggler>

	<Toggler placement="bottom-center" contentClasses="border-1 border-red-500 bg-warning-100 shadow-lg z-50">
		{#snippet trigger({ toggle })}
			<button onclick={toggle}>bottom-center</button>
		{/snippet}
		{#snippet children({ close })}
			<div class="menu">
				<button
					onclick={() => {
						alert('Profil');
						close();
					}}>Profil</button
				>
				<button
					onclick={() => {
						alert('Çıkış');
						close();
					}}>Çıkış</button
				>
			</div>
		{/snippet}
	</Toggler>
</div>

<style>
	.container {
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 50px;
	}

	.menu {
		display: flex;
		flex-direction: column;
		min-width: 120px;
	}
	.menu button {
		padding: 10px;
		border: none;
		background: none;
		text-align: left;
		cursor: pointer;
	}
	.menu button:hover {
		background: var(--color-surface-400);
	}
</style>
