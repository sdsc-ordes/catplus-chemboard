<script lang="ts">
    let { data, form } = $props<{
        data: { now: number; timezone: string }; // Expect 'now' and 'timezone' from load
        form?: { success?: boolean; error?: string; missing?: boolean }; // Type for potential form action result (e.g., from fail)
    }>();
</script>

<h1>Select time zone</h1>

<p>Current Time ({data.timezone}):</p>
<p>
	{new Intl.DateTimeFormat([], {
		timeStyle: 'full',
		timeZone: data.timezone
	}).format(new Date(data.now))}
</p>

<form method="POST" action="?/update" class="mt-4">
    <label class="label">
        <span>Select Timezone:</span>
        <select name="timezone" id="timezone-select" class="select mt-1">
            <option value="" disabled selected={!data.timezone || data.timezone === 'UTC'}>-- Select --</option>
            <option value="America/New_York" selected={data.timezone === 'America/New_York'}>New York</option>
            <option value="Europe/London" selected={data.timezone === 'Europe/London'}>London</option>
            <option value="Europe/Paris" selected={data.timezone === 'Europe/Paris'}>Paris</option>
            <option value="Asia/Tokyo" selected={data.timezone === 'Asia/Tokyo'}>Tokyo</option>
            <option value="UTC" selected={data.timezone === 'UTC'}>UTC</option>
        </select>
    </label>
    <button type="submit" class="btn variant-filled-primary mt-2">
        <span>Update Timezone</span>
    </button>
</form>

{#if form?.error}
    <p class="mt-2 text-error-500">Error: {form.error}</p>
{/if}

{#if form?.success}
    <p>Successfully updated timezone</p>
{/if}
