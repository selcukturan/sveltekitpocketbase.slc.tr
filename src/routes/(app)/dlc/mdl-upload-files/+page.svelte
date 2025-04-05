<script lang="ts">
	import { enhance } from '$app/forms';
	import { FileUpload } from '$lib/components/ui/file-upload';
</script>

<div>
	<form method="POST" enctype="multipart/form-data" use:enhance>
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<button type="submit">Yükle</button>
			<FileUpload name="mdlFiles" />
		</div>
	</form>
</div>
