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
    query: string,
): Promise<string[]> {
    console.log("*** query", query);
    if (!query) {
        console.warn('getSearchOptionsList:  query is missing.');
        return [];
    }

    try {
        const csvResultString = await locals.qlever.queryQlever(query);
        const options = parseTolist(csvResultString);

        return options;
    } catch (error) {
        console.error(`Failed to get search options list for query "${query}":`, error);
        return [];
    }
}
