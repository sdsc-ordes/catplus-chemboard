import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

// Default timezone if none is specified in the URL
const DEFAULT_TIMEZONE = 'UTC';

export const load: PageServerLoad = async ({ fetch, url }) => {
    // Get timezone from URL search parameter, or use default
    const timezone = url.searchParams.get('tz') || DEFAULT_TIMEZONE;
    console.log(`Load: Using timezone: ${timezone}`);

    // Fetch the current timestamp
    // Note: Fetching it here means it's fetched *once* per page load/navigation
    const response = await fetch('/api/now'); // Fetches from our simple API route
    const now = await response.json();

    return {
        now: now as number, // Assert type if needed
        timezone: timezone, // Return the timezone being used
    };
};

export const actions: Actions = {
    update: async ({ request, url }) => {
        console.log("Action: update running");
        const formData = await request.formData();
        const timezone = formData.get('timezone'); // Use 'timezone' matching the input name

        // Basic validation
        if (!timezone || typeof timezone !== 'string') {
            return fail(400, { error: 'Timezone is required.', missing: true });
        }

        console.log("Action: Timezone selected:", timezone);

        // Redirect back to the current page, but set the 'tz' search parameter
        const targetUrl = new URL(url);
        targetUrl.searchParams.set('tz', timezone);

        // Throw redirect - this causes the browser to navigate to the new URL,
        // which in turn causes the `load` function to run again with the new parameter.
        throw redirect(303, targetUrl.toString());
    }
};

