import type { SparqlQueryConfig } from '$lib/types/qleverSearch';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			qlever: QleverService;
		}
	}
	// interface PageData {}
	// interface PageState {}
	// interface Platform {}
}

/**
 * Executes a SPARQL query and returns the result as a CSV string.
 * @param config The SPARQL query configuration.
 * @returns A Promise resolving to the result to the format in the config
 */
interface QleverService {
	queryQlever: (config: SparqlQueryConfig) => Promise<string>;
}

export { };
