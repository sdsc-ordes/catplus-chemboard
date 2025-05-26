

/**
 * Interface for table columns of campaign file table
 */
export interface FileTableColumns {
	title: string; // Column title
	widthInPercent: number // Column width in percent
}

// Header for Campaign Files Table
export const FileTableHeaders: FileTableColumns[] = [
    {title: "File name", widthInPercent: 45},
    {title: "Size", widthInPercent: 20},
    {title: "Last modified", widthInPercent: 25},
    {title: "Download", widthInPercent: 10},
]

// --- Result Navigation ---

// Pagination of results
export const ResultsPerPage: number = 4;

// Table Header of S3 Results: route: /batch
export const HeadersS3Results: string[] = ["Campaign Path", "Date"]

/**
 * Interface for table columns of campaign file table
 */
export interface FileTableColumns {
	title: string; // Column title
	widthInPercent: number // Column width in percent
}

/**
 * Represents a file with its full S3 key, relative name, size, and last modified date.
 */
export interface CampaignFileAccess {
	Key: string; // The full S3 object key
	name: string; // The filename relative to its folder prefix
	Size: number; // File size in bytes (optional)
	LastModified: Date; // Last modified date (optional)
	presignedUrl: string;
}

/**
 * Campaign results from S3 filtering by prefix
 */
export interface CampaignResult {
	prefix: string;
	date: string;
}

export interface ResultItemBase {
	prefix: string;
}

/**
 * Represents a file with its full S3 key, relative name, size, and last modified date.
 */
export interface S3FileInfo {
	Key: string; // The full S3 object key
	name: string; // The filename relative to its folder prefix
	Size?: number; // File size in bytes (optional)
	LastModified?: Date; // Last modified date (optional)
}

/**
 * Represents a folder prefix and the list of files directly under it.
 */
export interface S3FolderGroup {
	prefix: string; // The calculated folder prefix (e.g., 'batch/2024/05/16/24/') or '' for root
	files: S3FileInfo[]; // Array of files within this folder
}

/**
 * Represents a file with its full S3 key, relative name, size, and last modified date.
 */
export interface S3FileInfo {
	Key: string; // The full S3 object key
	name: string; // The filename relative to its folder prefix
	Size?: number; // File size in bytes (optional)
	LastModified?: Date; // Last modified date (optional)
}

/**
 * Represents a folder prefix and the list of files directly under it.
 */
export interface S3FolderGroup {
	prefix: string; // The calculated folder prefix (e.g., 'batch/2024/05/16/24/') or '' for root
	files: S3FileInfo[]; // Array of files within this folder
}
