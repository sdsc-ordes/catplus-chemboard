import type { Picklist } from '$lib/schema/sparql';

/**
 * Parses a simple CSV string into an array of objects.
 * Assumes the first line of the CSV is the header row.
 * Handles values enclosed in double quotes, but does not handle escaped quotes within quoted values
 * or multi-line quoted values for simplicity.
 *
 * @param csvString The CSV string to parse.
 * @returns An array of objects, where each object represents a row
 * and keys are taken from the CSV header.
 * Returns an empty array if the CSV string is empty or has no data rows.
 */
export function parseCsvToObjects(csvString: string | null | undefined): Record<string, string>[] {
    if (!csvString || csvString.trim() === '') {
        return [];
    }

    // Split the CSV string into lines, handling both \r\n and \n line endings
    const lines = csvString.trim().split(/\r?\n/);

    if (lines.length < 2) {
        // Not enough lines for a header and at least one data row
        console.warn("CSV data must have a header and at least one data row.");
        return [];
    }

    // Extract headers from the first line
    // Simple split by comma. For more complex CSVs with commas in fields, a more robust parser is needed.
    const headers = lines[0].split(',').map(header => header.trim().replace(/^"|"$/g, '')); // Trim and remove surrounding quotes

    const result: Record<string, string>[] = [];

    // Process data rows (starting from the second line)
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') {
            continue; // Skip empty lines
        }

        // Simple split by comma. This won't correctly handle commas inside quoted fields.
        const values = line.split(',').map(value => {
            const trimmedValue = value.trim();
            // Remove surrounding quotes if present (handles "value" -> value)
            if (trimmedValue.startsWith('"') && trimmedValue.endsWith('"')) {
                return trimmedValue.substring(1, trimmedValue.length - 1);
            }
            return trimmedValue;
        });

        if (values.length === headers.length) {
            const rowObject: Record<string, string> = {};
            headers.forEach((header, index) => {
                rowObject[header] = values[index];
            });
            result.push(rowObject);
        } else {
            console.warn(`Skipping line ${i + 1}: Mismatch between header count (${headers.length}) and value count (${values.length}). Line: "${line}"`);
        }
    }

    return result;
}

// interface for output of parseToPicklist with csv header and one column csv list
interface Picklist {
    header: string,
    options: string[],
}

/**
 * Parses a simple CSV string into an array of objects.
 * Assumes the first line of the CSV is the header row.
 * Handles values enclosed in double quotes, but does not handle escaped quotes within quoted values
 * or multi-line quoted values for simplicity.
 *
 * @param csvString The CSV string to parse.
 * @returns Picklist: An array of objects, where each object represents a row
 * and keys are taken from the CSV header.
 * Returns an empty array if the CSV string is empty or has no data rows.
 */
export function parseToPicklist(
    csvString: string | null | undefined): Picklist {
    if (!csvString || csvString.trim() === '') {
        throw new Error('No picklist could be retrieved');
    }

    // Split the CSV string into lines, handling both \r\n and \n line endings
    const lines = csvString.trim().split(/\r?\n/).map(line => line.replaceAll('"', ''));
    // Extract header from the first line
    const header = lines[0];

    if (lines.length < 2) {
        // Not enough lines for a header and at least one data row
        console.warn("CSV data must have a header and at least one data row.");
        return  {
            header: header,
            options: [],
        }
    }

    const options: string[] = lines.slice((1));
    return  {
        header: header || '',
        options: options,
    }
}
