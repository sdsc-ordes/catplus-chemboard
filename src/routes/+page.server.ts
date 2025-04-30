import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";
// Make sure the import path for $types is correct for your route
// If this is for the root route '/', it should be './$types'
// If it's for '/search', it should be './search/$types' - adjust as needed.
import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';

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

// Define the PageServerLoad function to fetch data before the page loads
export const load: PageServerLoad = async ({ params }) => {
    console.log(`Fetching folders from bucket: ${S3_BUCKET_NAME}`);

    // Define the prefix (folder path) to list within
    // Example: Use 'batch/' to list folders directly under 'batch/'
    // Example: Use '' (empty string) to list folders at the root of the bucket
    // Example: Use params if the prefix comes from the route: `${params.someParam}/`
    const prefixToList = 'batch/2024/'; // Adjust this prefix as needed

    const command = new ListObjectsV2Command({
        Bucket: S3_BUCKET_NAME,
        Prefix: prefixToList,
        Delimiter: '/', // Key to list folders
    });

    try {
        const response = await s3Client.send(command);
        console.log("S3 Response:", response); // Keep for debugging if needed


        // Extract only the common prefixes (the "folders")
        // Ensure the Prefix property is extracted correctly, it might be undefined if no folders found
        const folders = response.CommonPrefixes?.map(commonPrefix => commonPrefix.Prefix).filter(Boolean) as string[] || [];

        console.log(`Folders directly under '${prefixToList}':`, folders);

        // *** FIX: Return an object containing the folders array ***
        return {
            folders: folders, // Pass the folders array under the 'folders' key
            prefixQueried: prefixToList, // Optionally pass the prefix used for context
            bucket: S3_BUCKET_NAME, // Pass the bucket name for reference
        };

    } catch (err: any) { // Catch as 'any' or 'unknown'
        console.error("Error listing S3 folders:", err);

        // Handle specific AWS SDK v3 errors
        // Check the error structure, often `err.name` or `err.$metadata.httpStatusCode`
        if (err.name === 'NoSuchBucket' || err?.$metadata?.httpStatusCode === 404) {
            throw error(404, `Bucket not found: ${S3_BUCKET_NAME}`);
        } else if (err.name === 'AccessDenied' || err?.$metadata?.httpStatusCode === 403) {
             throw error(403, `Access denied listing bucket: ${S3_BUCKET_NAME}`);
        } else {
            // Throw a generic server error for other issues
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            throw error(500, `Failed to list folders in bucket: ${errorMessage}`);
        }
    }
};

export const actions = {
	default: async ({ cookies, request }) => {
		const data = await request.formData();
		console.log("form data", data);
	}
};
