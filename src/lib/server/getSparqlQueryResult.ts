import { parseCsvToObjects } from '$lib/utils/csvParser';

/**
 * Fetch data from Qlever using a SPARQL query, parse the result into an array of objects.
 *
 * @param locals The SvelteKit locals object, containing the qlever service.
 * @param query The SPARQL query
 * @returns A Promise that resolves to an array of unique string values, or an empty array on error/no data.
 */
export async function getSparqlQueryResult(
    locals: App.Locals,
    query: string,
): Promise<Record<string, string>[]> {
    if (!query) {
        console.warn('getSparqlQueryResult: query is missing.');
        return [];
    }
    try {
        // Fetch the CSV result using the SPARQL query
        const result = await locals.qlever.queryQlever(query);
        const resultObjects: Record<string, string>[] = parseCsvToObjects(result);
        return resultObjects;
    } catch (error) {
        console.error(`Failed to get search options list for query targeting key "${query}":`, error);
        return [];
    }
}
