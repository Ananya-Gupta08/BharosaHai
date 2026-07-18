import "server-only";

import {DocumentStatus} from "@prisma/client";
import {createClient} from "@supabase/supabase-js";

const defaultBucket = "provider-documents";
const maxFileSize = 8 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
]);

type ProviderDocumentUploadResult = {
  documentType: string;
  fileName: string;
  originalFileName: string | null;
  storagePath: string;
  fileSize: number | null;
  mimeType: string | null;
  status: DocumentStatus;
};

function storageConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return {
    url,
    serviceRoleKey,
    bucket: process.env.SUPABASE_PROVIDER_DOCUMENTS_BUCKET || defaultBucket
  };
}

function safeSegment(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function extensionFromFileName(fileName: string) {
  return fileName.includes(".") ? fileName.split(".").pop()?.toLowerCase() || "bin" : "bin";
}

function documentFileBase(documentType: string) {
  const slug = safeSegment(documentType);

  if (slug.includes("certificate") || slug.includes("credential") || slug.includes("registration")) {
    return "certificate";
  }

  return slug;
}

function objectPath(providerId: string, providerName: string, documentType: string, fileName: string) {
  const providerFolder = `provider-${providerId}-${safeSegment(providerName) || "provider"}`;
  const documentFolder = safeSegment(documentType) || "document";
  const fileBase = documentFileBase(documentType);
  const extension = extensionFromFileName(fileName);

  return `${providerFolder}/${documentFolder}/${fileBase}.${extension}`;
}

function pendingDocument(providerId: string, documentType: string, file?: File): ProviderDocumentUploadResult {
  return {
    documentType,
    fileName: file && file.size > 0 ? file.name : "Pending upload",
    originalFileName: file && file.size > 0 ? file.name : null,
    storagePath: `pending://${providerId}/${documentType}`,
    fileSize: file && file.size > 0 ? file.size : null,
    mimeType: file && file.size > 0 ? file.type || null : null,
    status: DocumentStatus.PENDING
  };
}

export async function uploadProviderDocument(
  providerId: string,
  providerName: string,
  documentType: string,
  file: FormDataEntryValue | null
): Promise<ProviderDocumentUploadResult> {
  if (!(file instanceof File) || file.size === 0) {
    return pendingDocument(providerId, documentType);
  }

  if (file.size > maxFileSize || !allowedMimeTypes.has(file.type)) {
    throw new Error(`Invalid document upload for ${documentType}.`);
  }

  const config = storageConfig();

  if (!config) {
    return pendingDocument(providerId, documentType, file);
  }

  const supabase = createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const path = objectPath(providerId, providerName, documentType, file.name);
  const {error} = await supabase.storage
    .from(config.bucket)
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      upsert: true
    });

  if (error) {
    throw error;
  }

  return {
    documentType,
    fileName: file.name,
    originalFileName: file.name,
    storagePath: path,
    fileSize: file.size,
    mimeType: file.type || null,
    status: DocumentStatus.PENDING
  };
}

export async function createProviderDocumentSignedUrl(storagePath: string, downloadName?: string) {
  const config = storageConfig();

  if (!config || storagePath.startsWith("pending://")) {
    return null;
  }

  const supabase = createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
  const parsedPath = storagePath.startsWith("supabase://")
    ? storagePath.replace(/^supabase:\/\/[^/]+\//, "")
    : storagePath;
  const {data, error} = await supabase.storage
    .from(config.bucket)
    .createSignedUrl(parsedPath, 60, downloadName ? {download: downloadName} : undefined);

  if (error || !data?.signedUrl) {
    return null;
  }

  return data.signedUrl;
}
