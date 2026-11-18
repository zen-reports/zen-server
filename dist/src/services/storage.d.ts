export interface StoragePresignedUploadResult {
    uploadUrl: string;
    headers?: Record<string, string>;
}
export interface BlobStorageProvider {
    readonly providerName: string;
    readonly bucketOrContainerName: string;
    ensureContainerExists(): Promise<void>;
    getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds?: number): Promise<StoragePresignedUploadResult>;
    getPresignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
/**
 * AWS S3 storage provider implementation (also supports MinIO, LocalStack, Cloudflare R2, Ceph, etc.).
 */
export declare class S3StorageProvider implements BlobStorageProvider {
    readonly providerName = "s3";
    readonly bucketOrContainerName: string;
    private readonly client;
    constructor();
    /**
     * Verifies that the S3 bucket exists, attempting creation if missing.
     *
     * @returns Resolves when check/creation completes.
     */
    ensureContainerExists(): Promise<void>;
    /**
     * Generates a presigned PUT URL for uploading attachments to S3 directly from client.
     *
     * @param key - Destination object key in bucket.
     * @param contentType - MIME type of the file.
     * @param expiresInSeconds - Expiration time in seconds (default: 3600).
     * @returns Object with uploadUrl.
     */
    getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds?: number): Promise<StoragePresignedUploadResult>;
    /**
     * Generates a presigned GET URL for viewing private attachments in S3.
     *
     * @param key - Object key in bucket.
     * @param expiresInSeconds - Expiration time in seconds (default: 3600).
     * @returns Presigned download URL.
     */
    getPresignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
/**
 * Google Cloud Storage provider implementation.
 */
export declare class GcpStorageProvider implements BlobStorageProvider {
    readonly providerName = "gcp";
    readonly bucketOrContainerName: string;
    private readonly storage;
    constructor();
    /**
     * Verifies that the GCS bucket exists, attempting creation if missing.
     *
     * @returns Resolves when check/creation completes.
     */
    ensureContainerExists(): Promise<void>;
    /**
     * Generates a presigned V4 PUT URL for uploading attachments to GCS.
     *
     * @param key - Destination object key in bucket.
     * @param contentType - MIME type of the file.
     * @param expiresInSeconds - Expiration time in seconds (default: 3600).
     * @returns Object with uploadUrl.
     */
    getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds?: number): Promise<StoragePresignedUploadResult>;
    /**
     * Generates a presigned V4 GET URL for viewing attachments from GCS.
     *
     * @param key - Object key in bucket.
     * @param expiresInSeconds - Expiration time in seconds (default: 3600).
     * @returns Presigned download URL.
     */
    getPresignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
/**
 * Azure Blob Storage provider implementation.
 */
export declare class AzureStorageProvider implements BlobStorageProvider {
    readonly providerName = "azure";
    readonly bucketOrContainerName: string;
    private readonly blobServiceClient;
    private readonly accountName;
    private readonly accountKey;
    constructor();
    /**
     * Verifies that the Azure Blob container exists, attempting creation if missing.
     *
     * @returns Resolves when check/creation completes.
     */
    ensureContainerExists(): Promise<void>;
    /**
     * Generates a Shared Access Signature (SAS) PUT URL for uploading attachments to Azure Blob Storage.
     *
     * @param key - Destination blob key in container.
     * @param contentType - MIME type of the file.
     * @param expiresInSeconds - Expiration time in seconds (default: 3600).
     * @returns Object with uploadUrl and required Azure headers.
     */
    getPresignedUploadUrl(key: string, contentType: string, expiresInSeconds?: number): Promise<StoragePresignedUploadResult>;
    /**
     * Generates a Shared Access Signature (SAS) GET URL for downloading attachments from Azure Blob Storage.
     *
     * @param key - Blob key in container.
     * @param expiresInSeconds - Expiration time in seconds (default: 3600).
     * @returns Presigned SAS download URL.
     */
    getPresignedDownloadUrl(key: string, expiresInSeconds?: number): Promise<string>;
}
/**
 * Storage factory based on STORAGE_PROVIDER environment variable.
 * Defaults to 's3' (AWS, MinIO, S3Mock, LocalStack, R2, etc.).
 *
 * @returns Configured BlobStorageProvider instance.
 */
export declare function createStorageProvider(): BlobStorageProvider;
export declare const storage: BlobStorageProvider;
export declare const BUCKET_NAME: string;
/**
 * Convenience wrapper generating a presigned upload URL using the active cloud storage provider.
 *
 * @param key - Object / blob key.
 * @param contentType - MIME type of the file.
 * @param expiresIn - Expiration time in seconds (default: 3600).
 * @returns Object with uploadUrl and optional provider headers.
 */
export declare function getPresignedUploadUrl(key: string, contentType: string, expiresIn?: number): Promise<StoragePresignedUploadResult>;
/**
 * Convenience wrapper generating a presigned download URL using the active cloud storage provider.
 *
 * @param key - Object / blob key.
 * @param expiresIn - Expiration time in seconds (default: 3600).
 * @returns Presigned download URL string.
 */
export declare function getPresignedDownloadUrl(key: string, expiresIn?: number): Promise<string>;
