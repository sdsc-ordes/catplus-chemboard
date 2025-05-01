import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

// --- S3 Configuration & Client Initialization ---

// Basic check for essential configuration
if (!AWS_REGION || !S3_BUCKET_NAME) {
	console.error('HOOKS: Missing required S3 configuration (AWS_REGION or S3_BUCKET_NAME)');
	throw new Error('Server configuration error: S3 settings missing.');
}

// Instantiate the S3 Client (runs once when the server module loads)
// Ensure credentials are secure (use IAM roles in production ideally)
const s3Client = new S3Client({
	region: AWS_REGION,
	// Avoid hardcoding credentials if possible. SDK will check env vars / IAM roles.
	// Only include credentials here if absolutely necessary and other methods aren't viable.
    credentials: { // Only needed if NOT using env vars or IAM roles
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    }
});

const BUCKET = S3_BUCKET_NAME;

// --- S3 Utility Functions (using the initialized client) ---

/** Get an object's content stream */
async function getObjectFromS3(key: string): Promise<ReadableStream | undefined> {
	const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
	try {
		const response = await s3Client.send(command);
        console.log("get objectFromS3");
		return response.Body as ReadableStream | undefined;
	} catch (error: any) {
		console.error(`S3 Util: Error getting object ${key}:`, error);
		if (error.name === 'NoSuchKey') return undefined;
		throw error;
	}
}

/** List object keys in a bucket/prefix */
async function listObjectsInBucket(prefix: string): Promise<string[]> {
	const command = new ListObjectsV2Command({ Bucket: BUCKET, Prefix: prefix });
	try {
		const response = await s3Client.send(command);
        console.log("get list object in buckets");
		return response.Contents?.map((item) => item.Key || '').filter(Boolean) as string[] || [];
	} catch (error: any) {
		console.error(`S3 Util: Error listing objects with prefix ${prefix}:`, error);
		throw error;
	}
}

/** List common prefixes (folders) */
async function listFilesInBucket(prefix: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
    });
    try {
        const response = await s3Client.send(command);
        console.log("get list files in buckets");
		return response.Contents?.map((item) => item.Key || '').filter(Boolean) as string[] || [];
    } catch (error: any) {
        console.error(`S3 Util: Error listing files with prefix ${prefix}:`, error);
        throw error;
    }
}

/** List common prefixes (folders) */
async function listFoldersInBucket(prefix: string): Promise<string[]> {
    const command = new ListObjectsV2Command({
        Bucket: BUCKET,
        Prefix: prefix,
        Delimiter: '/',
    });
    try {
        const response = await s3Client.send(command);
        console.log("get list folders in buckets");
        return response.CommonPrefixes?.map(commonPrefix => commonPrefix.Prefix).filter(Boolean) as string[] || [];
    } catch (error: any) {
        console.error(`S3 Util: Error listing folders with prefix ${prefix}:`, error);
        throw error;
    }
}


/** Generate a pre-signed URL for client-side GET (download) */
async function getPresignedDownloadUrl(key: string, expiresInSeconds = 300): Promise<string> {
	const command = new GetObjectCommand({ Bucket: BUCKET, Key: key });
	try {
		return await getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
	} catch (error: any) {
		console.error(`S3 Util: Error generating presigned download URL for ${key}:`, error);
		if (error.name === 'NoSuchKey') throw new Error('File not found');
		throw error;
	}
}

// --- Handle Hook ---

export const handle: Handle = async ({ event, resolve }) => {
	// Add the S3 client and utility functions to event.locals
	// This makes them available in subsequent load functions and API routes
	event.locals.s3 = {
		client: s3Client, // The initialized client instance
		bucketName: BUCKET,
		getObject: getObjectFromS3,
		listObjects: listObjectsInBucket,
        listFolders: listFoldersInBucket,
        listFiles: listFilesInBucket,
		getPresignedDownloadUrl: getPresignedDownloadUrl,
	};
	const response = await resolve(event);

	return response;
};
