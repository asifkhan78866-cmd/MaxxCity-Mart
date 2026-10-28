import sharp from "sharp";
import { describe, expect, it } from "vitest";
import { prepareUpload, UploadError } from "@/lib/server/files";
import { file, jpegWithExif } from "../support/fixtures";

describe("prepareUpload", () => {
  it("re-encodes photos as JPEG and strips camera metadata", async () => {
    const original = await jpegWithExif();
    expect((await sharp(original).metadata()).exif).toBeDefined();

    const prepared = await prepareUpload(file(original, "IMG_1.jpg", "image/jpeg"), "image");
    expect(prepared.contentType).toBe("image/jpeg");
    expect(prepared.extension).toBe("jpg");
    expect((await sharp(prepared.bytes).metadata()).exif).toBeUndefined();
  });

  it("accepts PNG and WebP photos", async () => {
    const png = await sharp({ create: { width: 8, height: 8, channels: 3, background: "#00f" } }).png().toBuffer();
    const webp = await sharp({ create: { width: 8, height: 8, channels: 3, background: "#0f0" } }).webp().toBuffer();
    expect((await prepareUpload(file(png, "a.png", "image/png"), "image")).contentType).toBe("image/jpeg");
    expect((await prepareUpload(file(webp, "a.webp", "image/webp"), "image")).contentType).toBe("image/jpeg");
  });

  it("downsizes very large photos", async () => {
    const big = await jpegWithExif(3000, 1500);
    const prepared = await prepareUpload(file(big, "big.jpg", "image/jpeg"), "image");
    const meta = await sharp(prepared.bytes).metadata();
    expect(Math.max(meta.width ?? 0, meta.height ?? 0)).toBe(2000);
  });

  it("rejects a file that only claims to be an image", async () => {
    const fake = file(new TextEncoder().encode("<script>alert(1)</script>"), "x.jpg", "image/jpeg");
    await expect(prepareUpload(fake, "image")).rejects.toBeInstanceOf(UploadError);
  });

  it("rejects a truncated image with a valid signature", async () => {
    const truncated = (await jpegWithExif()).subarray(0, 40);
    await expect(prepareUpload(file(truncated, "x.jpg", "image/jpeg"), "image")).rejects.toBeInstanceOf(UploadError);
  });

  it("rejects PDFs as product photos but accepts them as catalogues", async () => {
    const pdf = file(new TextEncoder().encode("%PDF-1.4\n%test"), "catalogue.pdf", "application/pdf");
    await expect(prepareUpload(pdf, "image")).rejects.toBeInstanceOf(UploadError);
    const prepared = await prepareUpload(pdf, "catalogue");
    expect(prepared.contentType).toBe("application/pdf");
  });

  it("rejects empty and oversized files", async () => {
    await expect(prepareUpload(file(new Uint8Array(), "e.jpg", "image/jpeg"), "image")).rejects.toThrow(/empty/);
    const huge = file(new Uint8Array(4 * 1024 * 1024 + 1), "h.jpg", "image/jpeg");
    await expect(prepareUpload(huge, "image")).rejects.toThrow(/larger than 4 MB/);
  });

  it("cleans unsafe characters from original file names", async () => {
    const prepared = await prepareUpload(file(await jpegWithExif(), "../../etc/<pass>wd.jpg", "image/jpeg"), "image");
    expect(prepared.originalName).not.toMatch(/[/<>]/);
  });
});
