"use client";

import { useEffect, useId, useRef, useState, type DragEvent } from "react";
import { FileText, ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { useFormKit, FieldMessage } from "@/components/forms/form-kit";
import { uploadLimits } from "@/lib/forms/types";
import { track } from "@/lib/analytics/track";

const MAX_PICK_BYTES = 20 * 1024 * 1024;

/**
 * Re-encodes a photo in the browser: smaller uploads on slow connections,
 * and camera metadata (including GPS location) is dropped.
 */
async function optimiseImage(file: File): Promise<File> {
  if (typeof createImageBitmap !== "function") return file;
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  for (const quality of [0.85, 0.7, 0.55]) {
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", quality));
    if (blob && blob.size <= uploadLimits.imageMaxBytes) {
      return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
    }
  }
  return file;
}

export function UploadField({
  name,
  label,
  hint,
  kind,
}: {
  name: string;
  label: string;
  hint?: string;
  kind: "image" | "catalogue";
}) {
  const { errors, setFile, setFileError } = useFormKit();
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const [file, setLocalFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const error = errors[name];
  const accept = (kind === "image" ? uploadLimits.imageTypes : uploadLimits.catalogueTypes).join(",");
  const limitMb = Math.round((kind === "image" ? uploadLimits.imageMaxBytes : uploadLimits.catalogueMaxBytes) / 1024 / 1024);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const reset = () => {
    setLocalFile(null);
    setPreview(null);
    setFile(name, null);
    setFileError(name, null);
    if (inputRef.current) inputRef.current.value = "";
  };

  async function accept_(picked: File | undefined) {
    if (!picked) return;
    setFileError(name, null);
    const allowed: readonly string[] = kind === "image" ? uploadLimits.imageTypes : uploadLimits.catalogueTypes;
    if (!allowed.includes(picked.type)) {
      setFileError(name, kind === "image" ? "Please choose a JPEG, PNG or WebP image." : "Please choose a PDF, JPEG, PNG or WebP file.");
      return;
    }
    if (picked.size > MAX_PICK_BYTES) {
      setFileError(name, "That file is too large. Please choose one under 20 MB.");
      return;
    }

    let ready = picked;
    if (picked.type.startsWith("image/")) {
      setBusy(true);
      try {
        ready = await optimiseImage(picked);
      } catch {
        ready = picked;
      } finally {
        setBusy(false);
      }
    }
    const max = kind === "image" ? uploadLimits.imageMaxBytes : uploadLimits.catalogueMaxBytes;
    if (ready.size > max) {
      setFileError(name, `Please choose a file under ${limitMb} MB${kind === "catalogue" ? ", or share a link to your catalogue instead" : ""}.`);
      return;
    }
    setLocalFile(ready);
    setFile(name, ready);
    setPreview(ready.type.startsWith("image/") ? URL.createObjectURL(ready) : null);
    if (kind === "image") track("product_image_added");
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void accept_(e.dataTransfer.files[0]);
  };

  const hintId = `${id}-hint`;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div data-field={name} tabIndex={-1} className="outline-none">
      <p className="text-sm font-semibold text-ink" id={`${id}-label`}>
        {label} <span className="font-normal text-ink-soft">(optional)</span>
      </p>
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        className="sr-only"
        aria-labelledby={`${id}-label`}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ")}
        aria-invalid={error ? true : undefined}
        onChange={(e) => void accept_(e.target.files?.[0])}
      />

      {file ? (
        <div className="mt-2 flex items-center gap-4 rounded-xl border border-line bg-white p-3">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview
            <img src={preview} alt="Preview of the selected photo" className="size-24 rounded-lg object-cover sm:size-28" />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-lg bg-paper">
              <FileText aria-hidden className="size-7 text-brand-blue" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{file.name}</p>
            <p className="text-sm text-ink-soft">{(file.size / 1024 / 1024).toFixed(1)} MB · ready to send</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-semibold hover:border-brand-blue"
              >
                <RefreshCw aria-hidden className="size-4" /> Replace
              </button>
              <button
                type="button"
                onClick={reset}
                className="inline-flex min-h-10 items-center gap-1.5 rounded-full border border-line px-3 text-sm font-semibold hover:border-price-red hover:text-price-red"
              >
                <Trash2 aria-hidden className="size-4" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`mt-2 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
            dragging ? "border-brand-blue bg-brand-blue-soft" : error ? "border-price-red bg-white" : "border-line bg-paper hover:border-brand-blue"
          }`}
        >
          {busy ? (
            <>
              <Loader2 aria-hidden className="size-8 animate-spin text-brand-blue" />
              <span className="mt-3 text-sm font-semibold text-ink">Preparing your file…</span>
            </>
          ) : (
            <>
              {kind === "image" ? (
                <ImagePlus aria-hidden className="size-8 text-brand-blue" />
              ) : (
                <FileText aria-hidden className="size-8 text-brand-blue" />
              )}
              <span className="mt-3 font-semibold text-ink">
                {kind === "image" ? "Take or choose a photo" : "Choose a file"}
                <span className="hidden font-normal text-ink-soft sm:inline"> — or drag it here</span>
              </span>
            </>
          )}
        </label>
      )}
      <FieldMessage id={hintId} kind="hint">
        {hint ?? (kind === "image" ? `JPEG, PNG or WebP. Large photos are resized automatically.` : `PDF, JPEG, PNG or WebP, up to ${limitMb} MB.`)}
      </FieldMessage>
      <FieldMessage id={errorId} kind="error">
        {error}
      </FieldMessage>
      <p className="sr-only" aria-live="polite">
        {busy ? "Preparing your file." : file ? `${file.name} selected.` : ""}
      </p>
    </div>
  );
}
