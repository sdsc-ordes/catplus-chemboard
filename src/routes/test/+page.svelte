<script lang="ts">
	import { page } from '$app/stores'; // To read initial URL params
	import { goto } from '$app/navigation'; // To update URL
	import { browser } from '$app/environment'; // To ensure fetch runs client-side
	import { Alert } from '@skeletonlabs/skeleton-svelte'; // For displaying messages
	import { Loader2, AlertTriangle, Info } from 'lucide-svelte'; // Icons

	// --- Component State (Svelte 5 Runes) ---
	let prefixInput = $state(''); // Input field model
	let folders = $state<string[]>([]); // Array to hold fetched folders
	let bucket = $state<string | null>(null); // Bucket name from API
	let loading = $state(false); // Loading indicator state
	let errorMessage = $state<string | null>(null); // Error message state
	let initialLoadDone = $state(false); // Track if initial load fetch has run

	// --- Type for the API response ---
	type ApiResponse = {
		folders: string[];
		prefixQueried: string;
		bucket: string;
	};

	// --- Function to fetch folders from the API route ---
	async function fetchFolders(prefixToFetch: string) {
		if (!browser) return; // Don't run fetch on server during SSR for this pattern

		loading = true;
		errorMessage = null;
		console.log(`Fetching folders for prefix: '${prefixToFetch}'`);

		try {
			// Construct the API URL with the prefix as a query parameter
			const apiUrl = `/api/s3-folders?prefix=${encodeURIComponent(prefixToFetch)}`;
			const response = await fetch(apiUrl);

			if (!response.ok) {
				// Try to get error details from the response body
				let errorDetail = `HTTP error! Status: ${response.status}`;
				try {
					const errorJson = await response.json();
					errorDetail = errorJson.message || errorDetail; // Use message from SvelteKit error helper
				} catch (e) {
					// Ignore if response body isn't JSON
				}
				throw new Error(errorDetail);
			}

			const data: ApiResponse = await response.json();
			folders = data.folders;
			bucket = data.bucket;
			// Optionally update the input field to match the queried prefix if needed
			// prefixInput = data.prefixQueried;

		} catch (err: any) {
			console.error('Error fetching S3 folders:', err);
			errorMessage = err.message || 'An unknown error occurred while fetching folders.';
			folders = []; // Clear folders on error
			bucket = null;
		} finally {
			loading = false;
			initialLoadDone = true; // Mark that at least one fetch attempt has completed
		}
	}

	// --- Handle form submission ---
	function handleSubmit() {
		// Update the URL search parameter and trigger navigation
		// This will cause the $effect below to re-run and fetch data
		const targetUrl = new URL($page.url);
		targetUrl.searchParams.set('prefix', prefixInput);
		// Use replaceState: true if you don't want browser history entries for each search
		goto(targetUrl, { replaceState: false, keepFocus: true, noScroll: true });
	}

	// --- Effect to react to URL changes and load initial data ---
	$effect(() => {
		if (!browser) return; // Ensure this only runs client-side

		// Get prefix from current URL search params
		const urlPrefix = $page.url.searchParams.get('prefix') || '';

		// Update the input field to match the URL on navigation/load
		prefixInput = urlPrefix;

		// Fetch data based on the URL prefix
		fetchFolders(urlPrefix);

		// Cleanup function if needed (not necessary for this effect)
		// return () => { console.log('Effect cleanup'); };
	});
</script>

<div class="container mx-auto p-4 font-sans md:p-8">
	<h1 class="mb-6 text-3xl font-bold">S3 Bucket Contents</h1>

	<form on:submit={handleSubmit} class="mb-6 flex items-end space-x-2">
		<label class="label grow">
			<span>S3 Prefix</span>
			<input
				name="prefix"
                class="input"
				type="text"
				placeholder="Enter S3 prefix (e.g., batch/2024/)"
				bind:value={prefixInput}
			/>
		</label>
		<button type="submit" class="btn variant-filled-primary" disabled={loading}>
			{#if loading}
				<Loader2 size={18} class="animate-spin" />
			{:else}
				<span>List Folders</span>
			{/if}
		</button>
	</form>

	{#if bucket}
		<p class="mb-4 text-surface-600 dark:text-surface-300">
			Listing folders in bucket: <code class="chip variant-soft">{bucket}</code>
			{#if prefixInput}
				<br />Prefix: <code class="chip variant-soft">{prefixInput || '/'}</code>
			{/if}
		</p>
	{/if}

	{#if loading}
		<Alert>
			<svelte:fragment slot="lead"><Loader2 size={20} class="animate-spin" /></svelte:fragment>
			<span>Loading folders...</span>
		</Alert>
	{/if}

	{#if errorMessage && !loading}
		<Alert class="variant-filled-error">
			<svelte:fragment slot="lead"><AlertTriangle size={20} /></svelte:fragment>
			<span>{errorMessage}</span>
		</Alert>
	{/if}

	{#if !loading && !errorMessage && folders.length > 0}
		<div class="overflow-x-auto rounded-lg border border-surface-300 dark:border-surface-700 shadow">
			<table class="table table-hover w-full">
				<thead>
					<tr>
						<th>Folder (Prefix)</th>
					</tr>
				</thead>
				<tbody>
					{#each folders as folder (folder)}
						<tr>
							<td class="font-mono break-all">{folder}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else if !loading && !errorMessage && initialLoadDone}
		<Alert>
			<svelte:fragment slot="lead"><Info size={20} /></svelte:fragment>
			<span>No folders found for the specified prefix.</span>
		</Alert>
	{/if}

</div>
