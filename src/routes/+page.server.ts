// Example in src/routes/some-route/+page.server.ts
import type { PageServerLoad } from './$types';
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


// Define the Actions object
export const actions: Actions = {
	// Default action handles the form submission
	default: async ({ request, url }) => {
		const formData = await request.formData();
		console.log("Form data received:", formData);
		// Get the prefix from the form input.
		// IMPORTANT: Ensure your form input has name="prefix"
		//const prefix = formData.get('prefix');

		// Basic validation
		//if (!prefix || typeof prefix !== 'string') {
		//	return fail(400, { error: 'Prefix is required.', missing: true });
		//}

		//console.log("Form submitted with prefix:", prefix);

		// Redirect back to the same page, but add/update the 'prefix' search parameter
		// This will cause the `load` function to re-run with the new prefix
		//const targetUrl = new URL(url); // Get current URL
		//targetUrl.searchParams.set('prefix', prefix); // Set the prefix parameter

		// Use 'throw redirect' to perform the redirect
		//throw redirect(303, targetUrl.toString());
	}
};
