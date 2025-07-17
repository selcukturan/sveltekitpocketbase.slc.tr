<script lang="ts">
	import { Page, Head } from '$lib/components/templates';
</script>

<Head>
	<title>Tree - SLC Web Applications</title>
	<meta name="description" content="SLC Web Applications" />
</Head>

<Page>
	<Page.Header>
		<p>Tree Page Header</p>
	</Page.Header>
	<Page.Main>
		<Page.Main.Panel>
			<ul class="slc-left-menu">
				<li class="slc-left-menu-root">
					<input type="checkbox" id="cb1" /><label for="cb1" tabindex="-1">Level 1</label>
					<ul>
						<li>
							<input type="checkbox" id="cb2" /><label for="cb2">Level 2-A</label>
							<ul>
								<li>
									<label class="slc-menu-action" for="" tabindex="-1">Level 3-A</label>
								</li>
								<li>
									<label class="slc-menu-action" for="" tabindex="-1">Level 3-B</label>
								</li>
							</ul>
						</li>
						<li>
							<input type="checkbox" id="cb3" /><label for="cb3">Level 2-B</label>
							<ul>
								<li>
									<input type="checkbox" id="cb5" /><label for="cb5">Level 3-A</label>
									<ul>
										<li>
											<label class="slc-menu-action" for="" tabindex="-1">Level 4-A</label>
										</li>
										<li>
											<label class="slc-menu-action" for="" tabindex="-1">Level 4-B</label>
										</li>
										<li>
											<label class="slc-menu-action" for="" tabindex="-1">Level 4-C</label>
										</li>
										<li>
											<label class="slc-menu-action" for="" tabindex="-1">Level 4-D</label>
										</li>
									</ul>
								</li>
								<li>
									<input type="checkbox" id="cb6" /><label for="cb6">Level 3-B</label>
									<ul>
										<li>
											<label class="slc-menu-action" for="" tabindex="-1">Level 4-A</label>
										</li>
										<li>
											<label class="slc-menu-action" for="" tabindex="-1">Level 4-B</label>
										</li>
									</ul>
								</li>
								<li>
									<input type="checkbox" id="cb7" /><label for="cb7">Level 3-C</label>
									<ul>
										<li>
											<label class="slc-menu-action" for="" tabindex="-1">Level 4-A</label>
										</li>
										<li>
											<label class="slc-menu-action" for="" tabindex="-1">Level 4-B</label>
										</li>
										<li>
											<label class="slc-menu-action" for="" tabindex="-1">Level 4-C</label>
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li>
							<input type="checkbox" id="cb4" /><label for="cb4">Level 2-C</label>
							<ul>
								<li>
									<label class="slc-menu-action" for="" tabindex="-1">Level 3-A</label>
								</li>
							</ul>
						</li>
					</ul>
				</li>
			</ul>
		</Page.Main.Panel>
	</Page.Main>
	<Page.Footer>
		<p>Tree Page Footer</p>
	</Page.Footer>
</Page>

<style>
	ul.slc-left-menu {
		list-style-type: none;
		/* margin-top: 10px; */
	}

	.slc-left-menu label {
		-webkit-tap-highlight-color: transparent;
		background-color: transparent;
		border-radius: 8px;
		/* border-top-right-radius: 8px;
    border-bottom-right-radius: 8px; */
		padding: 10px 25px;
		cursor: pointer;
		color: var(--color-surface-600);
		display: block;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
		/* transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms; */
	}

	.slc-left-menu label:hover {
		background-color: color-mix(in oklab, var(--color-quaternary-300) 20%, transparent);
	}

	.slc-left-menu li {
		margin-left: 11px;
		padding: 0px;
		border-left: 1px solid var(--color-surface-300);
		border-left-style: dashed;
		position: relative;
	}

	.slc-left-menu .slc-left-menu-root {
		margin-left: 0px;
		border-left: 0px solid red;
	}

	.slc-left-menu input[type='checkbox'] {
		display: none;
	}

	.slc-left-menu input[type='checkbox'] ~ ul {
		display: none;
		opacity: 0;
		overflow: hidden;
		white-space: nowrap;
	}

	.slc-left-menu input[type='checkbox']:checked ~ ul {
		display: block;
		opacity: 1;
	}

	.slc-left-menu input[type='checkbox'] + label:before {
		border-right: 2px solid;
		content: '';
		width: 0px;
		height: 8px;
		top: 15px;
		left: 10px;
		display: inline-block;
		position: absolute;
		-moz-transform: rotate(135deg);
		-o-transform: rotate(135deg);
		-webkit-transform: rotate(135deg);
		transform: rotate(135deg);
		/* color: red; */
		-webkit-transition: transform 0.2s ease;
		-moz-transition: transform 0.2s ease;
		-o-transition: transform 0.2s ease;
		transition: transform 0.2s ease;
	}

	.slc-left-menu input[type='checkbox'] + label:after {
		border-right: 2px solid;
		content: '';
		width: 0px;
		height: 8px;
		top: 20px;
		left: 10px;
		display: inline-block;
		position: absolute;
		-moz-transform: rotate(45deg);
		-o-transform: rotate(45deg);
		-webkit-transform: rotate(45deg);
		transform: rotate(45deg);
		/* color: red; */
		-webkit-transition: transform 0.2s ease;
		-moz-transition: transform 0.2s ease;
		-o-transition: transform 0.2s ease;
		transition: transform 0.2s ease;
	}

	.slc-left-menu input[type='checkbox']:checked + label:before {
		border-right: 2px solid;
		content: '';
		width: 0px;
		height: 8px;
		top: 17px;
		left: 15px;
		display: inline-block;
		position: absolute;
		-moz-transform: rotate(225deg);
		-o-transform: rotate(225deg);
		-webkit-transform: rotate(225deg);
		transform: rotate(225deg);
		/* color: red; */
		-webkit-transition: transform 0.2s ease;
		-moz-transition: transform 0.2s ease;
		-o-transition: transform 0.2s ease;
		transition: transform 0.2s ease;
	}

	.slc-left-menu input[type='checkbox']:checked + label:after {
		border-right: 2px solid;
		content: '';
		width: 0px;
		height: 8px;
		top: 17px;
		left: 10px;
		display: inline-block;
		position: absolute;
		-moz-transform: rotate(135deg);
		-o-transform: rotate(135deg);
		-webkit-transform: rotate(135deg);
		transform: rotate(135deg);
		/* color: red; */
		-webkit-transition: transform 0.2s ease;
		-moz-transition: transform 0.2s ease;
		-o-transition: transform 0.2s ease;
		transition: transform 0.2s ease;
	}

	.slc-left-menu label.slc-menu-action:before {
		content: '';
		width: 4px;
		height: 4px;
		top: 20px;
		left: 10px;
		border-radius: 50%;
		background-color: #919eab;
		display: inline-block;
		position: absolute;
		transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
	}

	.slc-left-menu label.slc-menu-action:hover:before {
		content: '';
		width: 4px;
		height: 4px;
		top: 20px;
		left: 10px;
		border-radius: 50%;
		background-color: var(--color-secondary-400);
		display: inline-block;
		position: absolute;
		transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
		transform: scale(2);
	}
</style>
