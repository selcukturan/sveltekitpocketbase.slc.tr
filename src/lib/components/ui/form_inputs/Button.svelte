<script lang="ts">
	import { Button } from '#lib/components/ui/inputs/index.js';
	import type { ButtonProps } from '#lib/components/ui/inputs/type';

	let { ...restProps }: ButtonProps = $props();
</script>

<Button {...restProps} />
