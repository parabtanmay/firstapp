import {
  BlobSASPermissions,
  BlobServiceClient,
  SASProtocol,
  StorageSharedKeyCredential,
  generateBlobSASQueryParameters
} from "@azure/storage-blob";
import { env } from "../config/env.js";

const blobServiceClient = BlobServiceClient.fromConnectionString(env.AZURE_STORAGE_CONNECTION_STRING);

const getAccountCredentials = () => {
  const matches = /AccountName=([^;]+);.*AccountKey=([^;]+)/.exec(env.AZURE_STORAGE_CONNECTION_STRING);
  if (!matches) throw new Error("Invalid Azure Storage connection string");
  return new StorageSharedKeyCredential(matches[1], matches[2]);
};

export const ensureContainers = async () => {
  await blobServiceClient.getContainerClient(env.AZURE_STORAGE_CONTAINER_MEDIA).createIfNotExists();
  await blobServiceClient.getContainerClient(env.AZURE_STORAGE_CONTAINER_THUMBNAILS).createIfNotExists();
};

export const generateUploadSas = (blobName: string, contentType: string) => {
  const container = blobServiceClient.getContainerClient(env.AZURE_STORAGE_CONTAINER_MEDIA);
  const credential = getAccountCredentials();
  const expiresOn = new Date(Date.now() + env.AZURE_SAS_TTL_MINUTES * 60_000);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName: container.containerName,
      blobName,
      permissions: BlobSASPermissions.parse("cw"),
      expiresOn,
      protocol: SASProtocol.Https,
      contentType
    },
    credential
  ).toString();

  return {
    blobUrl: `${container.getBlockBlobClient(blobName).url}?${sasToken}`,
    expiresOn
  };
};

export const buildPublicMediaUrl = (blobName: string) => {
  if (env.AZURE_CDN_BASE_URL) {
    return `${env.AZURE_CDN_BASE_URL}/${env.AZURE_STORAGE_CONTAINER_MEDIA}/${blobName}`;
  }

  return blobServiceClient
    .getContainerClient(env.AZURE_STORAGE_CONTAINER_MEDIA)
    .getBlockBlobClient(blobName)
    .url;
};
