import type { Handle, HandleServerError, HandleClientError, HandleFetch } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import type { ServerInit } from '@sveltejs/kit';

export const init: ServerInit = async () => {
	// connect to s3
};


// --- Handle Hook ---

export const handle: Handle = async ({ event, resolve }) => {
	console.log('in hooks.server.ts for route:', event.url.pathname);
	//const response = await resolve(event);
	//return response;
	const route = event.url;
	let start = performance.now();
	const response = await resolve(event);
	let end = performance.now();
	let resposeTime = end - start;
	if (resposeTime > 1000) {
		console.warn(`Slow response time for ${route.pathname}: ${resposeTime.toFixed(2)}ms`);
	};
	if (resposeTime > 1000) {
		console.info(`Fast response time for ${route.pathname}: ${resposeTime.toFixed(2)}ms`);
	};
	return resolve(event);
};

export const handleError: Handle = async ({ error, event }) => {
    console.log('in handleError for route:', event.url.pathname, error);

    return json(
        {
            message: 'An error occurred while processing your request.',
            error: error instanceof Error ? error.message : String(error),
        },
    );
};

export const handleFetch: Handle = async ({ request, fetch }) => {
	console.log('in handleFetch for route:', request);
	const url = request.url;
	request = new Request(url,  request);
	return fetch(request);
};

