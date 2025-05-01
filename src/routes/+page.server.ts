// Example in src/routes/some-route/+page.server.ts
import type { PageServerLoad, Actions } from './$types';

import { redirect, fail } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals, url }) => {
    const prefix = url.searchParams.get('prefix') || 'batch/2024/05/16/';

    try {
        // Access the S3 utilities from locals
        const folders = await locals.s3.listFolders(prefix);
		const files = await locals.s3.listFiles(prefix);

        return {
			files: files,
            folders: folders,
            prefixQueried: prefix,
            bucket: locals.s3.bucketName,
        };
    } catch (err) {
        console.error("Error using S3 locals:", err);
        throw error(500, "Failed to access S3 data");
    }
};


export const actions: Actions = {
	// Use a named action matching your form's 'action' attribute
	// Or use 'default' if the form doesn't specify an action name
	filter: async ({ request, url }) => {
		const formData = await request.formData();
		const fromDate = formData.get('fromDate');
		const toDate = formData.get('toDate');
		console.log("formData", formData);

		// --- Validation (Basic Example) ---
		if (!fromDate || typeof fromDate !== 'string') {
			// Return a failure state if 'fromDate' is missing or not a string
			// The 'fail' function prevents the redirect and returns data to the 'form' prop
			return fail(400, { error: 'From Date is required.', missingFrom: true, toDate });
		}
		if (!toDate || typeof toDate !== 'string') {
			// Return a failure state if 'toDate' is missing or not a string
			return fail(400, { error: 'To Date is required.', missingTo: true, fromDate });
		}

		// Optional: Add more robust date format validation here if needed
		// e.g., using a regex or a date parsing library.
		const datePattern = /^\d{4}\/\d{2}\/\d{2}$/; // Matches YYYY/MM/DD
        if (!datePattern.test(fromDate) || !datePattern.test(toDate)) {
            return fail(400, { error: 'Dates must be in YYYY/MM/DD format.', fromDate, toDate });
        }

		console.log(`Action: Filtering from ${fromDate} to ${toDate}`);

		// --- Construct Redirect URL ---
		// Create a URL object based on the current page's URL
		const targetUrl = new URL(url);

		// Set the desired search parameters
		targetUrl.searchParams.set('date-from', fromDate);
		targetUrl.searchParams.set('date-to', toDate);

		// Clear any previous 'prefix' parameter if it exists from other actions/loads
        targetUrl.searchParams.delete('prefix');

		console.log("Target URL for redirect:", targetUrl.toString());

		// --- Redirect ---
		// Use status 303 (See Other) for POST -> GET redirect pattern
		throw redirect(303, targetUrl.toString());
	}
	// Add other actions if needed
};
