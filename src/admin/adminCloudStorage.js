import { supabase } from "../lib/supabaseClient";

export const ADMIN_ASSET_BUCKET = "admin-assets";

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
    records: data.map((row) => ({ id: row.id, ...row.payload }))
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

function sanitizeCloudPayload(collection, record) {
  if (collection !== "assets") {
    return record;
  }

  if (typeof record.icon_name !== "string" || !record.icon_name.startsWith("data:image/")) {
    return record;
  }

  return {
    ...record,
    icon_name: "",
    icon_path: ""
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
