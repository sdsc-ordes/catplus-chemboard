import { addPresignedUrlsToFiles } from '$lib/server/s3';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { listFilesInBucket } from '$lib/server/s3';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, request }) => {
    const path = `batch/${params.year}/${params.month}/${params.day}/${params.nr}/`
    const files = await listFilesInBucket(path);
    if (!files) {
		error(404, {
			message: 'Not found'
		});
	}
    console.log("files");
    const fileWithDownloadUrls = await addPresignedUrlsToFiles(files);
    console.log(fileWithDownloadUrls);
    return json({
        request: request,
        params: params,
        files: fileWithDownloadUrls,
    });
};
