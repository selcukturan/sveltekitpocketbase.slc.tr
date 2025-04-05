<script lang="ts">
	import { DateTimeDev } from '$lib/components/ui/inputs';

	let value = $state('2000-09-13T21:00:00.000Z');
</script>

<br />

<DateTimeDev bind:value />

<br />

<DateTimeDev bind:value />

<br />

<div>Page Value {`=>`} {value} {`=>`} typeof {typeof value}</div>

<br />

<button
	onclick={() => {
		value = '1985-05-27T09:00:00.000Z';
	}}>Set</button
>
