/**
 * Configurations and types for the search with qlever
 * on the route '/search'
 */

// ---------------------------- Qlever Search

/**
 * Qlever Service
 */
export interface QleverService {
    queryQlever: (config: SparqlQueryConfig) => Promise<string>;
}

/**
 * Sparql Query to Qlever: with query and result format
 */
export interface SparqlQueryConfig {
    sparqlQuery: string;
    resultFormat: SparqlResultFormat;
}

// ---------------------------- Search Filters

/**
 * Categories for Filters in Qlever
 */
export type FilterCategory =
    | 'CAMPAIGN_NAME'
    | 'REACTION_TYPE'
    | 'REACTION_NAME'
    | 'CHEMICAL_NAME'
    | 'CAS'
    | 'SMILES';

export type ResultTableColumns = FilterCategory | 'CONTENT_URL';

export const FilterCategoriesSorted: FilterCategory[] = [
    'CAMPAIGN_NAME',
    'REACTION_TYPE',
    'REACTION_NAME',
    'CHEMICAL_NAME',
    'CAS',
    'SMILES',
];

export const ResultTableColumnsSorted: ResultTableColumns[] = [
    'CONTENT_URL',
    'CAMPAIGN_NAME',
    'REACTION_TYPE',
    'REACTION_NAME',
    'CHEMICAL_NAME',
    'CAS',
    'SMILES',
];

/**
 * Result formats of Qlever
 */
export type SparqlResultFormat =
    | "text/csv"

/**
 * Qlever Queries
 */
export const SparqlFilterQueries: Record<FilterCategory, SparqlQueryConfig> = {
    CAS: {
        sparqlQuery: `PREFIX cat: <http://example.org/cat#> SELECT DISTINCT ?casNumber WHERE { ?s cat:casNumber ?casNumber .}`,
        resultFormat: `text/csv`,
    },
    CHEMICAL_NAME: {
        sparqlQuery: `PREFIX allores: <http://purl.allotrope.org/ontologies/result#> SELECT DISTINCT ?chemicalName WHERE { ?s allores:AFR_0002292 ?chemicalName .}`,
        resultFormat: `text/csv`,
    },
    SMILES: {
        sparqlQuery: `PREFIX allores: <http://purl.allotrope.org/ontologies/result#> SELECT DISTINCT ?smiles WHERE { ?s allores:AFR_0002296 ?smiles .}`,
        resultFormat: `text/csv`,
    },
    REACTION_NAME: {
        sparqlQuery: `PREFIX cat: <http://example.org/cat#> SELECT DISTINCT ?reactionName WHERE { ?s cat:reactionName ?reactionName .}`,
        resultFormat: `text/csv`,
    },
    REACTION_TYPE: {
        sparqlQuery: `PREFIX cat: <http://example.org/cat#> SELECT DISTINCT ?reactionType WHERE { ?s cat:reactionType ?reactionType .}`,
        resultFormat: `text/csv`,
    },
    CAMPAIGN_NAME: {
        sparqlQuery: `PREFIX cat: <http://example.org/cat#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX schema: <https://schema.org/> SELECT DISTINCT ?o1 WHERE {?Campaign a cat:Campaign . OPTIONAL {?Campaign schema:name ?o1}}`,
        resultFormat: `text/csv`,
    },
};

export interface FilterDisplayConfig {
    label: string,
    nameAttr: string;
}

export interface FilterDisplayConfigWithOptions extends FilterDisplayConfig {
    options: string[],
}

export const FilterDisplays: Record<FilterCategory, FilterDisplayConfig> = {
    CAMPAIGN_NAME: {
        label: 'Campaign Name',
        nameAttr: 'campaign_name'
    },
    REACTION_NAME: {
        label: 'Reaction Name',
        nameAttr: 'reaction_name'
    },
    REACTION_TYPE: {
        label: 'Reaction Type',
        nameAttr: 'reaction_type'
    },
    CHEMICAL_NAME: {
        label: 'Chemical Name',
        nameAttr: 'chemical_name'
    },
    CAS: {
        label: 'Cas',
        nameAttr: 'cas'
    },
    SMILES: {
        label: 'Smiles',
        nameAttr: 'smiles'
    }
}

export interface SparqlSearchResult {
    prefix: string;
    campaignName: string;
    chemicalName: string;
    smiles: string;
    cas: string;
    reactionName: string;
    reactionType: string;
}

export type FlatSparqlRow = { [key: string]: string };

export interface SparqlBinding {
    [key: string]: { // This is the SPARQL variable name, e.g., "s", "p", "o"
        type: 'uri' | 'literal' | 'bnode';
        value: string; // This is the actual value we want to extract
        datatype?: string;
        'xml:lang'?: string;
    };
}

/**
 * Stores the selections in the Search Form
 */
export interface SelectionState {
    selected: Set<string>;
    display: string; // display the selections as a string
    active: boolean; // indicator whether the selection category is active
}

export const SparqlVariables: Record<ResultTableColumns, string> = {
    CONTENT_URL: "cu",
    CAMPAIGN_NAME: "cp",
    REACTION_TYPE: "rt",
    REACTION_NAME: "rn",
    CHEMICAL_NAME: "cn",
    CAS: "ca",
    SMILES: "sm",
}

export const BaseResultSparqlQuery = `PREFIX obo: <http://purl.obolibrary.org/obo/> PREFIX allores: <http://purl.allotrope.org/ontologies/result#> PREFIX cat: <http://example.org/cat#> PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> PREFIX schema: <https://schema.org/> SELECT ?cu ?cp ?rt ?rn ?sm ?ca ?cn WHERE { ?s a cat:Campaign ; cat:hasBatch ?b; cat:hasChemical ?c . OPTIONAL {?s schema:name ?cp } OPTIONAL {?s schema:contentURL ?cu } ?b cat:reactionType ?rt ; cat:reactionName ?rn . ?c allores:AFR_0002295 ?sm ; allores:AFR_0002292 ?cn ; cat:casNumber ?ca . } ORDER BY ?cu`

export const ResultSparqlQuery: SparqlQueryConfig = {
    sparqlQuery: BaseResultSparqlQuery,
    resultFormat: `text/csv`,
};

export interface QleverRawResult {
    cu: string;
    cp: string;
    rn: string;
    rt: string;
    cn: string;
    ca: string;
    sm: string;
}

export interface QleverDisplayResult {
    prefix: string;
    campaignName: string;
    reactionName: string;
    reactionType: string;
    chemicals: string;
}
