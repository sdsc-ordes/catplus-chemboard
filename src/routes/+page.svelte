<script lang="ts">
	// The 'data' prop is automatically populated by SvelteKit
	// with the return value from the load function in +page.server.ts
	let { data } = $props();
	console.log(data);
	import { Accordion } from '@skeletonlabs/skeleton-svelte';
	import Archive from '@lucide/svelte/icons/archive';

	let value = $state(['archive']);
</script>

<div class="container mx-auto p-4 font-sans md:p-8">
	<h1 class="mb-6 text-3xl font-bold text-gray-800">S3 Bucket Contents</h1>
	<p class="mb-4 text-gray-600">
		Listing folders in bucket: <code class="rounded bg-gray-200 px-2 py-1 text-sm"
			>{data.bucket}</code
		>
	</p>
	<div class="card preset-filled-surface-100-800 p-6">

		<form method="POST" class="space-y-6">
			<label class="label">
				<span>S3 Path</span>
				<input
					name="name"
					class="input space-y-4"
					type="text"
					placeholder="Enter S3 path"
					required
					bind:value={data.prefixQueried}
				/>
				<button type="submit" class="btn preset-filled-primary-500">
					<span>Filter by Prefix</span>
				  </button>
			</label>

		</form>
    </div>

	  <Accordion {value} onValueChange={(e) => (value = e.value)} multiple>
		{#each data.folders as folder}
		<Accordion.Item value="{folder}">
		  <!-- Control -->
		  {#snippet lead()}<Archive size={24} />{/snippet}
		  {#snippet control()}{folder}{/snippet}
		  <!-- Panel -->
		  {#snippet panel()}{folder}{/snippet}
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
