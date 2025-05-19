import { parseCsvToObjects } from '$lib/utils/csvParser';
import type { SparqlQueryConfig, QleverService } from '$lib/types/qleverSearch';

/**
 * Fetches data using a SPARQL query, parses the result,
 * and extracts a list of string values for a specific key (column).
 *
 * @param locals The SvelteKit locals object, containing the qlever service.
 * @param config The SPARQL query configuration
 * @returns A Promise that resolves to an array of unique string values, or an empty array on error/no data.
 */
export async function getSparqlQueryResult(
    locals: App.Locals,
    config: SparqlQueryConfig,
): Promise<string[]> {
    if (!config.sparqlQuery) {
        console.warn('getSparqlQueryResult: query config is missing.');
        return [];
    }

    try {
        // Ensure the Qlever service and its method are available on locals
        if (!locals.qlever || typeof locals.qlever.queryQlever !== 'function') {
            console.error('getSparqlQueryResult: locals.qlever.queryQlever service is not available.');
            throw new Error('Qlever CSV service not configured correctly on locals.');
        }

        // Fetch the CSV result using the SPARQL query
        const result = await locals.qlever.queryQlever(config);
        console.log(result);

        const resultObjects = parseCsvToObjects(result);

        console.log(resultObjects);

        return resultObjects;
    } catch (error) {
        console.error(`Failed to get search options list for query targeting key "${config.resultKey}":`, error);
        return []; // Return an empty array in case of any error
    }
}
