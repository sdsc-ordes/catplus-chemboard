import { parseTolist } from '$lib/utils/csvParser';
import type { SparqlQueryConfig } from '$lib/types/search';

/**
 * Fetches the search options via a SPARQL query from Qlever and returns them as list of strings.
 *
 * @param locals The SvelteKit locals object, containing the qlever service.
 * @param config The SPARQL query configuration
 * @returns A Promise that returns a list of strings
 */
export async function getSearchOptionsList(
    locals: App.Locals,
    config: SparqlQueryConfig,
): Promise<string[]> {
    if (!config.sparqlQuery) {
        console.warn('getSearchOptionsList:  query config is missing.');
        return [];
    }

    try {
        const csvResultString = await locals.qlever.queryQlever(config);
        const options = parseTolist(csvResultString);

        return options;
    } catch (error) {
        console.error(`Failed to get search options list for query "${config.sparqlQuery}":`, error);
        return [];
    }
}
