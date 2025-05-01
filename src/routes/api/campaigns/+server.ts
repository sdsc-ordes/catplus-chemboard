import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Import necessary environment variables securely
import { AWS_REGION, S3_BUCKET_NAME } from "$env/static/private";

// Basic check for essential configuration
if (!AWS_REGION || !S3_BUCKET_NAME) {
	console.error("API Route: Missing required S3 configuration (AWS_REGION or S3_BUCKET_NAME)");
	// Throwing here will prevent the server from starting correctly if misconfigured
	throw new Error("Server configuration error: S3 settings missing.");
}

// Instantiate the S3 Client (reuse if possible, or create instance here)
const s3Client = new S3Client({
	region: AWS_REGION,
	// Credentials should be handled by the environment
});

// Define the GET request handler for this API route
export const GET: RequestHandler = async ({ url }) => {
	console.log(`API Route: Fetching folders from bucket: ${S3_BUCKET_NAME}`);

	// Read the prefix from the URL query parameters (?prefix=...)
	let prefixToList = url.searchParams.get('prefix') || '';

	// Optional: Ensure prefix ends with '/' if not empty
	if (prefixToList && !prefixToList.endsWith('/')) {
		prefixToList += '/';
	}

	console.log(`API Route: Listing folders with prefix: '${prefixToList}'`);

	const command = new ListObjectsV2Command({
		Bucket: S3_BUCKET_NAME,
		Prefix: prefixToList,
		Delimiter: '/', // Key to list folders
	});

	try {
		const response = await s3Client.send(command);

		// Extract only the common prefixes (the "folders")
		const folders = response.CommonPrefixes?.map(commonPrefix => commonPrefix.Prefix).filter(Boolean) as string[] || [];

		console.log(`API Route: Found folders under '${prefixToList}':`, folders.length);

		// Return the folders and the queried prefix as JSON response
		return json({
			folders: folders,
			prefixQueried: prefixToList,
			bucket: S3_BUCKET_NAME // Include bucket if the client needs it
		});

	} catch (err: any) {
		console.error("API Route: Error listing S3 folders:", err);

		// Handle specific AWS SDK v3 errors and return appropriate HTTP errors
		if (err.name === 'NoSuchBucket' || err?.$metadata?.httpStatusCode === 404) {
			throw error(404, `Bucket not found: ${S3_BUCKET_NAME}`);
		} else if (err.name === 'AccessDenied' || err?.$metadata?.httpStatusCode === 403) {
			throw error(403, `Access denied listing bucket: ${S3_BUCKET_NAME}`);
		} else {
			const errorMessage = err instanceof Error ? err.message : 'Unknown error';
			// Return a generic server error response
			throw error(500, `Failed to list folders in bucket: ${errorMessage}`);
		}
	}
};
