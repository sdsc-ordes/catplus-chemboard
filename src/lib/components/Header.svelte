<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { base } from '$app/paths';
	import Paperclip from '@lucide/svelte/icons/paperclip';
	import Calendar from '@lucide/svelte/icons/calendar';
	import Home from '@lucide/svelte/icons/home';
	import Database from '@lucide/svelte/icons/database';
	import CircleUser from '@lucide/svelte/icons/circle-user';
	import Search from '@lucide/svelte/icons/search';
</script>

<AppBar classes="flex items-left">
	{#snippet lead()}
	    <a href="{base}/" class="flex items-center mx-4 gap-x-2"><Home size={20} />Home</a>
	    <a href="{base}/search" class="flex items-center mx-4 gap-x-2"><Search size={20} />Search</a>
		<a href="{base}/data" class="flex items-center mx-4 gap-x-2"><Database size={20} />Data</a>
	{/snippet}
	{#snippet trail()}
		<Paperclip size={20} />
		<Calendar size={20} />
		<CircleUser size={20} />
	{/snippet}
	<span>CAT+ Chemboard</span>
</AppBar>