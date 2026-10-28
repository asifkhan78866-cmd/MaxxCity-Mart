import "server-only";
import sharp from "sharp";
import { uploadLimits } from "@/lib/forms/types";

export type PreparedFile = {
  bytes: Buffer;
  contentType: string;
  extension: string;
  originalName: string;
};

export class UploadError extends Error {}

/** Identify the real file type from its first bytes rather than trusting the browser. */
function sniff(buf: Buffer): "image/jpeg" | "image/png" | "image/webp" | "application/pdf" | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png";
  if (buf.length >= 12 && buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP")
    return "image/webp";
  if (buf.length >= 5 && buf.toString("ascii", 0, 5) === "%PDF-") return "application/pdf";
  return null;
}

const safeName = (name: string) => name.replace(/[^\w.\- ]+/g, "").slice(0, 120) || "upload";

/**
 * Images are decoded and re-encoded, which proves they are real images and
 * strips metadata such as GPS location before anything is stored.
 */
async function prepareImage(buf: Buffer, originalName: string): Promise<PreparedFile> {
  try {
    const bytes = await sharp(buf, { failOn: "error", limitInputPixels: 50_000_000 })
      .rotate()
      .resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();
    return { bytes, contentType: "image/jpeg", extension: "jpg", originalName: safeName(originalName) };
  } catch {
    throw new UploadError("We couldn't read that image. Please try a different JPEG, PNG or WebP photo.");
  }
}

export async function prepareUpload(file: File, kind: "image" | "catalogue"): Promise<PreparedFile> {
  const max = kind === "image" ? uploadLimits.imageMaxBytes : uploadLimits.catalogueMaxBytes;
  if (file.size === 0) throw new UploadError("The selected file is empty.");
  if (file.size > max) {
    throw new UploadError(`That file is larger than ${Math.round(max / 1024 / 1024)} MB. Please choose a smaller file.`);
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const type = sniff(buf);
  const allowed: readonly string[] = kind === "image" ? uploadLimits.imageTypes : uploadLimits.catalogueTypes;
  if (!type || !allowed.includes(type)) {
    throw new UploadError(
      kind === "image"
        ? "Please upload a JPEG, PNG or WebP image."
        : "Please upload a PDF, JPEG, PNG or WebP file.",
    );
  }
  if (type === "application/pdf") {
    return { bytes: buf, contentType: type, extension: "pdf", originalName: safeName(file.name) };
  }
  return prepareImage(buf, file.name);
}
