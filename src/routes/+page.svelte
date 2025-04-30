<script lang="ts">
	import { ArrowRight as IconArrowRight } from 'lucide-svelte';
	// The 'data' prop is automatically populated by SvelteKit
	// with the return value from the load function in +page.server.ts
	export let data: {
		prefixQueried?: string;
		bucket?: string;
		folders?: Array<{
		}>;
	};
	console.log(data)
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
					<IconArrowRight size={18} />
				  </button>
			</label>

		</form>
    </div>

	{#if data.folders && data.folders.length > 0}
		<div class="overflow-x-auto rounded-lg bg-white shadow">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-100">
					<tr>
						<th
							scope="col"
							class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase"
						>
							Folder (Name)
						</th>

					</tr>
				</thead>
				<tbody class="divide-y divide-gray-200 bg-white">
					{#each data.folders as folder}
						<tr class="transition-colors duration-150 hover:bg-gray-50">
							<td class="px-6 py-4 text-sm font-medium break-all whitespace-nowrap text-gray-900">
								{folder}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if data.objects}
		<div
			class="relative rounded border border-blue-400 bg-blue-100 px-4 py-3 text-blue-700"
			role="alert"
		>
			<strong class="font-bold">Info:</strong>
			<span class="block sm:inline"> No objects found in this bucket/prefix.</span>
		</div>
	{:else}
		<div
			class="relative rounded border border-yellow-400 bg-yellow-100 px-4 py-3 text-yellow-700"
			role="alert"
		>
			<strong class="font-bold">Loading:</strong>
			<span class="block sm:inline"> Fetching object list...</span>
		</div>
	{/if}
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
