declare global {
	namespace App {
		interface Locals {
			qlever: QleverService;
		}
	}
}

/**
 * Executes a SPARQL query and returns the result as a csv string.
 * @param config The SPARQL query configuration.
 * @returns A Promise resolving to the result to the format in the config
 */
interface QleverService {
	queryQlever: (query: string) => Promise<string>;
}

export { };
