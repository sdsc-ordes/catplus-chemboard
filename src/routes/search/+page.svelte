<script lang="ts">
	import ContentLayout from '$lib/components/ContentLayout.svelte';
	import { HeadersQleverResults  } from '$lib/types/s3Search.js';
	import DisplayResults from '$lib/components/DisplayResults.svelte';
	import SparqlSearchForm from '$lib/components/SparqlSearchForm.svelte';
	let { data } = $props();

	// Result table
	const results = data.results;
	$inspect(results)
</script>

{#snippet sidebar()}
<SparqlSearchForm
    data={data}
/>
{/snippet}

{#snippet main()}
<DisplayResults
    results={results}
	tableHeaders={HeadersQleverResults}
/>
{/snippet}

<ContentLayout {sidebar} {main} />
