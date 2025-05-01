/**
 * Represents a file with its full S3 key and its name relative to its folder.
 */
export interface FileInfo {
	Key: string; // The full S3 object key
	name: string; // The filename relative to its folder prefix
	// You could add other properties like Size, LastModified if your input 'files' array contains objects instead of just keys
}

/**
 * Represents a folder prefix and the list of files directly under it.
 */
export interface FolderWithFiles {
	prefix: string; // The folder prefix (e.g., 'batch/2024/05/16/24/')
	files: FileInfo[]; // Array of files within this folder
}

/**
 * Groups a flat list of S3 file keys into folders based on a list of known folder prefixes.
 *
 * @param allFileKeys - An array of full S3 object keys (strings).
 * @param folderPrefixes - An array of folder prefix strings (must end with '/').
 * @returns An array of FolderWithFiles objects.
 */
export function groupFilesByFolder(allFileKeys: string[], folderPrefixes: string[]): FolderWithFiles[] {
	const foldersWithFilesResult: FolderWithFiles[] = [];

	// Iterate through each identified folder prefix
	for (const folderPrefix of folderPrefixes) {
		const filesInFolder: FileInfo[] = [];

		// Iterate through all the file keys to find matches for the current folder
		for (const fileKey of allFileKeys) {
			// Check if the file key starts with the current folder prefix
			// and is longer than the prefix itself (to avoid matching the prefix itself if it exists as an object)
			if (fileKey.startsWith(folderPrefix) && fileKey.length > folderPrefix.length) {
				// Extract the relative filename
				const relativeName = fileKey.substring(folderPrefix.length);

				// Add the file info to the list for this folder
				filesInFolder.push({
					Key: fileKey,
					name: relativeName,
				});
			}
		}

		// Add the folder object (even if it has no files directly under it)
		foldersWithFilesResult.push({
			prefix: folderPrefix,
			files: filesInFolder,
		});
	}

	return foldersWithFilesResult;
}
