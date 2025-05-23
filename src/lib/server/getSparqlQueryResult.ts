import { parseCsvToObjects } from '$lib/utils/csvParser';
import type { SparqlQueryConfig } from '$lib/types/search';

/**
 * Fetch data from Qlever using a SPARQL query, parse the result into an array of objects.
 *
 * @param locals The SvelteKit locals object, containing the qlever service.
 * @param config The SPARQL query configuration
 * @returns A Promise that resolves to an array of unique string values, or an empty array on error/no data.
 */
export async function getSparqlQueryResult(
    locals: App.Locals,
    config: SparqlQueryConfig,
): Promise<Record<string, string>[]> {
    if (!config.sparqlQuery) {
        console.warn('getSparqlQueryResult: query config is missing.');
        return [];
    }
    try {
        // Fetch the CSV result using the SPARQL query
        const result = await locals.qlever.queryQlever(config);
        const resultObjects: Record<string, string>[] = parseCsvToObjects(result);
        return resultObjects;
    } catch (error) {
        console.error(`Failed to get search options list for query targeting key "${config.resultKey}":`, error);
        return [];
    }
}
