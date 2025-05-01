import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
// Adjust the import path for $types based on your route structure
import type { PageServerLoad, Actions } from './$types';
import { error, redirect, fail } from '@sveltejs/kit'; // Added redirect and fail

// Import necessary environment variables securely
import { AWS_REGION, S3_BUCKET_NAME } from "$env/static/private";

// Basic check for essential configuration
if (!AWS_REGION || !S3_BUCKET_NAME) {
	console.error("Missing required S3 configuration (AWS_REGION or S3_BUCKET_NAME)");
	throw new Error("Server configuration error: S3 settings missing.");
}

// Instantiate the S3 Client
const s3Client = new S3Client({
	region: AWS_REGION,
	// Credentials should be handled by the environment (IAM role, env vars, etc.)
});

// Define the PageServerLoad function to fetch data based on URL parameters
export const load: PageServerLoad = async ({ url }) => { // Use url from the event
	console.log(`Fetching folders from bucket: ${S3_BUCKET_NAME}`);

	// Read the prefix from the URL query parameters (?prefix=...)
	// Default to empty string ('') for root listing if parameter is absent
	let prefixToList = url.searchParams.get('prefix') || '';

	// Optional: Ensure prefix ends with '/' if not empty (adjust if needed)
	if (prefixToList && !prefixToList.endsWith('/')) {
		prefixToList += '/';
	}

	//console.log(`Listing folders with prefix: '${prefixToList}'`);

	const command = new ListObjectsV2Command({
		Bucket: S3_BUCKET_NAME,
		Prefix: prefixToList,
		Delimiter: '/', // Key to list folders
	});

	try {
		const response = await s3Client.send(command);
		// console.log("S3 Response:", response);

		// Extract only the common prefixes (the "folders")
		const folders = response.CommonPrefixes?.map(commonPrefix => commonPrefix.Prefix).filter(Boolean) as string[] || [];

		//console.log(`Folders directly under '${prefixToList}':`, folders);

		// Return data needed by the page, including the prefix used
		return {
			folders: folders,
			prefixQueried: prefixToList, // Pass the actual prefix used back to the page
			bucket: S3_BUCKET_NAME,
		};

	} catch (err: any) {
		console.error("Error listing S3 folders:", err);
		// Handle specific AWS SDK v3 errors
		if (err.name === 'NoSuchBucket' || err?.$metadata?.httpStatusCode === 404) {
			throw error(404, `Bucket not found: ${S3_BUCKET_NAME}`);
		} else if (err.name === 'AccessDenied' || err?.$metadata?.httpStatusCode === 403) {
			throw error(403, `Access denied listing bucket: ${S3_BUCKET_NAME}`);
		} else {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			throw error(500, `Failed to list folders in bucket: ${errorMessage}`);
		}
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
		const prefix = formData.get('prefix');

		// Basic validation
		if (!prefix || typeof prefix !== 'string') {
			return fail(400, { error: 'Prefix is required.', missing: true });
		}

		console.log("Form submitted with prefix:", prefix);

		// Redirect back to the same page, but add/update the 'prefix' search parameter
		// This will cause the `load` function to re-run with the new prefix
		const targetUrl = new URL(url); // Get current URL
		targetUrl.searchParams.set('prefix', prefix); // Set the prefix parameter

		// Use 'throw redirect' to perform the redirect
		throw redirect(303, targetUrl.toString());
	}
};
