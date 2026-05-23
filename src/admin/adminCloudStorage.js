import { supabase } from "../lib/supabaseClient";

export const ADMIN_ASSET_BUCKET = "admin-assets";
export const ADMIN_INVOICE_BUCKET = "admin-invoices";

const ADMIN_RECORDS_TABLE = "admin_records";
const CLOUD_UNAVAILABLE_CODES = new Set(["42P01", "42501", "PGRST205"]);

function isCloudUnavailable(error) {
  return !supabase || !error || CLOUD_UNAVAILABLE_CODES.has(error.code);
}

export async function fetchAdminCollection(collection) {
  if (!supabase) {
    return { ok: false, unavailable: true, records: [] };
  }

  const { data, error } = await supabase
    .from(ADMIN_RECORDS_TABLE)
    .select("id, payload")
    .eq("collection", collection)
    .order("updated_at", { ascending: false });

  if (error) {
    if (!isCloudUnavailable(error)) {
      console.error(`Unable to fetch admin ${collection}`, error);
    }
    return { ok: false, unavailable: isCloudUnavailable(error), records: [] };
  }

  return {
    ok: true,
    unavailable: false,
    records: data.map((row) => normalizeCloudPayload(collection, { id: row.id, ...row.payload }))
  };
}

export async function fetchAdminRecord(collection, id) {
  if (!supabase) {
    return { ok: false, unavailable: true, record: null };
  }

  const { data, error } = await supabase
    .from(ADMIN_RECORDS_TABLE)
    .select("id, payload")
    .eq("collection", collection)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    if (!isCloudUnavailable(error)) {
      console.error(`Unable to fetch admin ${collection}/${id}`, error);
    }
    return { ok: false, unavailable: isCloudUnavailable(error), record: null };
  }

  return {
    ok: true,
    unavailable: false,
    record: data ? normalizeCloudPayload(collection, { id: data.id, ...data.payload }) : null
  };
}

export async function saveAdminCollection(collection, records) {
  if (!supabase) {
    return { ok: false, unavailable: true };
  }

  const rows = records.map((record) => ({
    collection,
    id: record.id,
    payload: sanitizeCloudPayload(collection, record)
  }));

  if (rows.length) {
    const { error } = await supabase
      .from(ADMIN_RECORDS_TABLE)
      .upsert(rows, { onConflict: "collection,id" });

    if (error) {
      if (!isCloudUnavailable(error)) {
        console.error(`Unable to save admin ${collection}`, error);
      }
      return { ok: false, unavailable: isCloudUnavailable(error) };
    }
  }

  return { ok: true, unavailable: false };
}

export async function saveAdminRecord(collection, record) {
  if (!supabase) {
    return { ok: false, unavailable: true };
  }

  const { error } = await supabase
    .from(ADMIN_RECORDS_TABLE)
    .upsert({
      collection,
      id: record.id,
      payload: sanitizeCloudPayload(collection, record)
    }, { onConflict: "collection,id" });

  if (error) {
    if (!isCloudUnavailable(error)) {
      console.error(`Unable to save admin ${collection}/${record.id}`, error);
    }
    return { ok: false, unavailable: isCloudUnavailable(error) };
  }

  return { ok: true, unavailable: false };
}

export async function deleteAdminRecord(collection, id) {
  if (!supabase) {
    return { ok: false, unavailable: true };
  }

  const { error } = await supabase
    .from(ADMIN_RECORDS_TABLE)
    .delete()
    .eq("collection", collection)
    .eq("id", id);

  if (error) {
    if (!isCloudUnavailable(error)) {
      console.error(`Unable to delete admin ${collection} record`, error);
    }
    return { ok: false, unavailable: isCloudUnavailable(error) };
  }

  return { ok: true, unavailable: false };
}

function sanitizeCloudPayload(collection, record) {
  if (collection !== "assets") {
    return record;
  }

  if (typeof record.icon_name !== "string" || !record.icon_name.startsWith("data:image/")) {
    return record;
  }

  return {
    ...record,
    icon_name: ""
  };
}

function normalizeCloudPayload(collection, record) {
  if (collection !== "assets" || record.icon_name || !record.icon_path || !supabase) {
    return record;
  }

  const { data } = supabase.storage.from(ADMIN_ASSET_BUCKET).getPublicUrl(record.icon_path);

  return {
    ...record,
    icon_name: data.publicUrl
  };
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Image illisible."));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

export async function compressSpriteFile(file, options = {}) {
  const maxSize = options.maxSize ?? 256;
  const quality = options.quality ?? 0.82;
  const image = await loadImage(file);
  const scale = Math.min(1, maxSize / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { alpha: true });
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, width, height);

  const webp = await canvasToBlob(canvas, "image/webp", quality);
  const png = webp ? null : await canvasToBlob(canvas, "image/png");
  const blob = webp ?? png;

  if (!blob) {
    throw new Error("Compression impossible.");
  }

  return {
    blob,
    extension: webp ? "webp" : "png",
    mimeType: webp ? "image/webp" : "image/png",
    sizeBefore: file.size,
    sizeAfter: blob.size,
    width,
    height
  };
}

export async function uploadAdminSprite(file, assetId) {
  const compressed = await compressSpriteFile(file);

  if (!supabase) {
    throw new Error("Supabase n'est pas configuré pour uploader le sprite.");
  }

  const safeAssetId = assetId || `asset-${Date.now()}`;
  const path = `sprites/${safeAssetId}/${Date.now()}.${compressed.extension}`;
  const { error } = await supabase.storage
    .from(ADMIN_ASSET_BUCKET)
    .upload(path, compressed.blob, {
      cacheControl: "31536000",
      contentType: compressed.mimeType,
      upsert: true
    });

  if (error) {
    console.error("Unable to upload admin sprite", error);
    throw new Error(error.message || "Upload du sprite refusé par Supabase Storage.");
  }

  const { data } = supabase.storage.from(ADMIN_ASSET_BUCKET).getPublicUrl(path);

  return {
    ...compressed,
    path,
    url: data.publicUrl
  };
}

export async function uploadBudgetInvoice(file, entryId) {
  if (!supabase) {
    throw new Error("Supabase n'est pas configure pour uploader la facture.");
  }

  if (!file || file.type !== "application/pdf") {
    throw new Error("La facture doit etre un fichier PDF.");
  }

  const maxSize = 15 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Le PDF depasse la limite de 15 Mo.");
  }

  const safeEntryId = String(entryId || `budget-${Date.now()}`).replace(/[^a-zA-Z0-9_-]/g, "-");
  const safeName = file.name.replace(/[^\w.-]+/g, "-").replace(/-+/g, "-") || "facture.pdf";
  const path = `budget/${safeEntryId}/${Date.now()}-${safeName}`;

  const { error } = await supabase.storage
    .from(ADMIN_INVOICE_BUCKET)
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: "application/pdf",
      upsert: true
    });

  if (error) {
    console.error("Unable to upload budget invoice", error);
    throw new Error(error.message || "Upload de la facture refuse par Supabase Storage.");
  }

  return {
    invoice_path: path,
    invoice_name: file.name,
    invoice_size: file.size,
    invoice_mime_type: file.type
  };
}

export async function createBudgetInvoiceSignedUrl(path) {
  if (!supabase || !path) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from(ADMIN_INVOICE_BUCKET)
    .createSignedUrl(path, 60 * 60);

  if (error) {
    console.error("Unable to create budget invoice signed URL", error);
    throw new Error(error.message || "Ouverture de la facture impossible.");
  }

  return data?.signedUrl || null;
}

export async function deleteBudgetInvoice(path) {
  if (!supabase || !path) {
    return { ok: false, unavailable: !supabase };
  }

  const { error } = await supabase.storage
    .from(ADMIN_INVOICE_BUCKET)
    .remove([path]);

  if (error) {
    console.error("Unable to delete budget invoice", error);
    return { ok: false, unavailable: isCloudUnavailable(error) };
  }

  return { ok: true, unavailable: false };
}
