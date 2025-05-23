import type { QleverRawResult, QleverDisplayResult } from '$lib/types/search'

export function s3LinkToPrefix(cu: string): string {
    // Example: 'file:///data/batch/2024/05/16/24/HCI.json' -> 'batch/2024/05/16/28/'
    let s3Path = cu.replace('file:///data/', '');
    const lastSlashIndex = s3Path.lastIndexOf('/');
    const prefix = s3Path.substring(0, lastSlashIndex + 1);
    return prefix;
}

/**
   * Maps an array of Qlever results to their display version
   * @param results - An array of source user objects.
   * @returns An array of transformed display result objects.
   */
export function mapQleverResults(results: QleverRawResult[]): QleverDisplayResult[] {
    if (!Array.isArray(results)) {
        console.error('Input must be an array.');
        return [];
    }

    return results.map((result: QleverRawResult): QleverDisplayResult => {
        // For each user object in the source array, create a new target profile object.
        const displayResult: QleverDisplayResult= {
            // Target property: `userId`
            // Derived from: `user.id` (with a prefix added)
            prefix: s3LinkToPrefix(result.cu),
            campaignName: result.cp,
            reactionName: result.rn,
            reactionType: result.rt,
            chemicals: [result.cn, result.ca, result.sm].join(","),
        };
        return displayResult;
    });
}

/**
 * Takes raw Qlever results, maps them, groups them by prefix,
 * and then consolidates properties within each group.
 * - If a property is the same for all items in a group, it remains a single string.
 * - If a property differs among items in a group, it becomes an array of unique string values.
 *
 * @param rawResults - An array of QleverRawResult objects.
 * @returns A Record where keys are prefixes (string) and values are ConsolidatedQleverResult objects.
 */
export function groupMappedQleverResultsByPrefix(
    rawResults: QleverRawResult[]
): Record<string, QleverDisplayResult> {
    // Transform the raw results into the display format
    const mappedResults: QleverDisplayResult[] = mapQleverResults(rawResults);

    // Group the mapped results by the 'prefix' property
    const groupedByPrefix = mappedResults.reduce<Record<string, QleverDisplayResult[]>>((accumulator, currentItem) => {
        const groupKey = currentItem.prefix;
        if (!accumulator[groupKey]) {
            accumulator[groupKey] = [];
        }
        accumulator[groupKey].push(currentItem);
        return accumulator;
    }, {});

    const consolidatedOutput: Record<string, ConsolidatedQleverResult> = {};

    for (const prefixKey in groupedByPrefix) {
        if (Object.prototype.hasOwnProperty.call(groupedByPrefix, prefixKey)) {
            const itemsInGroup: QleverDisplayResult[] = groupedByPrefix[prefixKey];

            if (itemsInGroup.length === 0) {
                continue;
            }

            // Initialize the consolidated item.
            // The type assertion to 'any' initially and then to 'ConsolidatedQleverResult'
            // simplifies dynamic property assignment.
            const consolidatedItemBase: any = { prefix: prefixKey };

            const firstItem = itemsInGroup[0];
            // These are the keys we want to process for consolidation (excluding 'prefix')
            const propertyKeys = Object.keys(firstItem).filter(
                k => k !== 'prefix'
            ) as Array<keyof Omit<QleverDisplayResult, 'prefix'>>;

            for (const propKey of propertyKeys) {
                // Collect all values for the current property from all items in the group
                const valuesForKey = itemsInGroup.map(item => item[propKey]);

                // Find the unique values for this property
                const uniqueValues = Array.from(new Set(valuesForKey));

                if (uniqueValues.length === 1) {
                    // If all values are the same, store the single value
                    consolidatedItemBase[propKey] = uniqueValues[0];
                } else {
                    // If values differ, join the unique differing values with " | "
                    consolidatedItemBase[propKey] = uniqueValues;
                }
            }
            consolidatedOutput[prefixKey] = consolidatedItemBase as ConsolidatedQleverResult;
        }
    }
    return Object.values(consolidatedOutput);
}
