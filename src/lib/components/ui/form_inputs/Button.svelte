<script lang="ts">
	import { Button } from '$lib/components/ui/inputs';
	import type { ButtonProps } from '$lib/components/ui/inputs/type';

	let { ...restProps }: ButtonProps = $props();
</script>

<Button {...restProps} />
