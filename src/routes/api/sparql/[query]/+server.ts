import { addPresignedUrlsToFiles } from '$lib/utils/addDownloadUrls';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { listFilesInBucket, s3Client, BUCKET } from '$lib/server/s3'

export const GET: RequestHandler = async ({ params, locals }) => {
    const path = `batch/${params.year}/${params.month}/${params.day}/${params.nr}/`
    const files = await listFilesInBucket(path);
    const fileWithDownloadUrls = await addPresignedUrlsToFiles(s3Client, BUCKET, files);
    return json({
        files: fileWithDownloadUrls,
    });
};
