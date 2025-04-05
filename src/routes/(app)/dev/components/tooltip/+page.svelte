<script lang="ts">
	/* import { DataTable } from '@/components/data-table/view'; */
	import tooltip from '$lib/actions/tooltip';
</script>

<div class="flex h-full w-full flex-col overflow-hidden">
	<div class="bg-success-100 p-1">
		<h6 use:tooltip={`Collections deded zsdasd asasd ada.`}>Tooltip</h6>
	</div>
	<div class="relative flex-1 overflow-y-auto overflow-x-hidden p-1">
		<h6 use:tooltip={{ text: 'Collections de', position: 'right' }}>Tooltip</h6>
		<pre>
			<code>
			{`<a
				href="/collections"
				class="menu-item"
				aria-label="Collections"
				use:link
				use:active={{ path: "/collections/?.*", className: "current-route" }}
				use:tooltip={{ text: "Collections", position: "right" }}
			>
				<i class="ri-database-2-line" />
			</a>`}
		</code>
	</pre>
		<div>
			<input type="text" name="test1" id="test1" use:tooltip={{ text: 'Test 1' }} />
		</div>
		<div>
			<input type="text" name="test2" id="test2" use:tooltip={{ text: 'Test 2' }} />
		</div>
		<div>
			<input type="text" name="test3" id="test3" use:tooltip={{ text: 'Test 3' }} />
		</div>
		<div>
			<input type="text" name="test4" id="test4" use:tooltip={{ text: 'Test 4', hideOnClick: true }} />
		</div>
	</div>
	<div class="bg-warning-100 p-1">
		<h6>https://github.com/pocketbase/pocketbase/blob/master/ui/src/actions/tooltip.js</h6>
	</div>
</div>
