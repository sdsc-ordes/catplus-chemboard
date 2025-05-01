<script lang="ts">
	// The 'data' prop is automatically populated by SvelteKit
	// with the return value from the load function in +page.server.ts
	let { data } = $props();
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import Archive from '@lucide/svelte/icons/archive';
	import FileText from '@lucide/svelte/icons/file-text';

	import { groupFilesByFolder } from '$lib/utils/folders';

	let value = $state(['archive']);
	let foldersWithFiles = groupFilesByFolder(data.files, data.folders);
</script>

<div class="container mx-auto p-4 font-sans md:p-8">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">S3 Bucket Contents</h1>
	<p class="mb-4 text-gray-600">
		Listing folders in bucket: <code class="rounded bg-gray-200 px-2 py-1 text-sm"
			>{data.bucket}</code
		>
	</p>
	<div class="card preset-filled-surface-100-800 p-6">

		<form method="POST" action="?/filter" class="space-y-4 card p-4 variant-ghost-surface">
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
				<label class="label">
					<span>From Date</span>
					<input
						name="fromDate"
						class="input"
						type="date"
						value="2024-04-16"
						required
					/>
				</label>
				<label class="label">
					<span>To Date</span>
					<input
						name="toDate"
						class="input"
						type="date"
						value="2024-04-16"
						required
					/>
				</label>
			</div>
			<div class="flex justify-end">
				<button type="submit" class="btn preset-filled-primary-500">
					<span>Filter by Date Range</span>
				</button>
			</div>
		</form>
    </div>

	  <Accordion {value} onValueChange={(e) => (value = e.value)} multiple>
		{#each foldersWithFiles as folder}
		  <Accordion.Item value={folder.prefix}>
			<!-- Control -->
			{#snippet lead()}<Archive size={24} />{/snippet}
			{#snippet control()}{folder.prefix}{/snippet}
			<!-- Panel -->
			{#snippet panel()}
				{#each folder.files as file}
				<div class="flex items-center space-x-2 py-1">
					<FileText size={16} class="text-surface-500 flex-shrink-0" />
					<span>{file.Key}</span>
				  </div>
				{/each}
			{/snippet}
		  </Accordion.Item>
		{/each}
	  </Accordion>

</div>

<svelte:head>
	<script src="https://cdn.tailwindcss.com"></script>
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
		rel="stylesheet"
	/>
	<style>
		body {
			font-family: 'Inter', sans-serif;
		}
	</style>
</svelte:head>
