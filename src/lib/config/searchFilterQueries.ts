import type { FilterCategory } from '@lib/types';

/**
 * Sparql Queries for Search Categories
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
        sparqlQuery: `PREFIX allores: <http://purl.allotrope.org/ontologies/result#> SELECT DISTINCT ?smiles WHERE { ?s allores:AFR_0002295 ?smiles .}`,
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
