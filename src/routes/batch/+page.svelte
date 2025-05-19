<script lang="ts">
	import { page as routePage } from '$app/state';
	import ContentLayout from '$lib/components/ContentLayout.svelte';
	import DisplayResults from '$lib/components/DisplayResults.svelte';
	import S3SearchForm from '$lib/components/S3SearchForm.svelte';
	import type { CampaignResult } from '$lib/types/campaign.js';
	import { HeadersS3Results} from '$lib/types/s3Search.js';

	// Get prefix from parameters
	let prefix = routePage.url.searchParams.get('prefix') || 'batch/';

	// get props from data loader
	let { data } = $props();
	const results: CampaignResult[] = data.results;
</script>

{#snippet sidebar()}
<S3SearchForm
    prefix={prefix}
/>
{/snippet}

{#snippet main()}
<DisplayResults
    results={results}
	tableHeaders={HeadersS3Results}
/>
{/snippet}

<ContentLayout {sidebar} {main} />
