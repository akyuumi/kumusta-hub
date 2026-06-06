"use client";

import { useId, useRef, useState } from "react";

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
const ACCEPTED_IMAGE_TYPES = "image/jpeg,image/png,image/webp";
const MAX_IMAGE_DIMENSION = 1200;
const WEBP_QUALITY = 0.82;

type ImageFileInputProps = {
  name: string;
  required?: boolean;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMb: number;
  className?: string;
};

export function ImageFileInput({ name, required, multiple, maxFiles = 1, maxSizeMb, className }: ImageFileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const descriptionId = useId();
  const [feedback, setFeedback] = useState<{ message: string; tone: "info" | "error" } | null>(null);
  const maxBytes = maxSizeMb * 1024 * 1024;
  const hint = multiple
    ? `Up to ${maxFiles} photos, ${maxSizeMb}MB each. JPEG, PNG, or WebP only. Images are resized before upload.`
    : `JPEG, PNG, or WebP only. Max ${maxSizeMb}MB. Images are resized before upload.`;

  async function handleChange(files: FileList | null) {
    const selectedFiles = Array.from(files ?? []);
    const input = inputRef.current;

    if (!input) return;

    const countOrTypeError = getCountOrTypeError(selectedFiles, maxFiles);

    if (countOrTypeError) {
      input.setCustomValidity(countOrTypeError);
      setFeedback({ message: countOrTypeError, tone: "error" });
      return;
    }

    if (selectedFiles.length === 0) {
      input.setCustomValidity("");
      setFeedback(null);
      return;
    }

    input.setCustomValidity("Preparing images for upload.");
    setFeedback({ message: "Preparing images for upload...", tone: "info" });

    try {
      const resizedFiles = await Promise.all(selectedFiles.map((file) => resizeImageFile(file)));
      const sizeError = getSizeError(resizedFiles, maxBytes, maxSizeMb);

      if (sizeError) {
        input.setCustomValidity(sizeError);
        setFeedback({ message: sizeError, tone: "error" });
        return;
      }

      const dataTransfer = new DataTransfer();
      resizedFiles.forEach((file) => dataTransfer.items.add(file));
      input.files = dataTransfer.files;
      input.setCustomValidity("");
      setFeedback({ message: getPreparedMessage(selectedFiles, resizedFiles), tone: "info" });
    } catch {
      const error = "Could not prepare image files. Choose another JPEG, PNG, or WebP image.";
      input.setCustomValidity(error);
      setFeedback({ message: error, tone: "error" });
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        name={name}
        type="file"
        accept={ACCEPTED_IMAGE_TYPES}
        required={required}
        multiple={multiple}
        aria-describedby={descriptionId}
        onChange={(event) => {
          void handleChange(event.currentTarget.files);
        }}
        className={className}
      />
      <span id={descriptionId} className="block text-xs text-muted">
        {hint}
      </span>
      {feedback && <span className={feedback.tone === "error" ? "block text-xs font-semibold text-coral" : "block text-xs font-medium text-bay"}>{feedback.message}</span>}
    </>
  );
}

function getCountOrTypeError(files: File[], maxFiles: number) {
  if (files.length > maxFiles) {
    return `Choose up to ${maxFiles} photos.`;
  }

  if (files.some((file) => !ALLOWED_IMAGE_TYPES.has(file.type))) {
    return "Choose a JPEG, PNG, or WebP image.";
  }

  return "";
}

function getSizeError(files: File[], maxBytes: number, maxSizeMb: number) {
  if (files.some((file) => file.size > maxBytes)) {
    return `Each image must be ${maxSizeMb}MB or less after resizing.`;
  }

  return "";
}

async function resizeImageFile(file: File) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await loadImage(objectUrl);
    const { width, height } = getResizedDimensions(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) return file;

    context.drawImage(image, 0, 0, width, height);

    const blob = (await canvasToBlob(canvas, "image/webp", WEBP_QUALITY)) ?? (await canvasToBlob(canvas, "image/jpeg", 0.86));
    if (!blob) return file;

    if (blob.size >= file.size && width === image.naturalWidth && height === image.naturalHeight) {
      return file;
    }

    return new File([blob], replaceImageExtension(file.name, getExtensionForType(blob.type)), {
      type: blob.type,
      lastModified: Date.now()
    });
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image load failed."));
    image.src = src;
  });
}

function getResizedDimensions(width: number, height: number) {
  const longestSide = Math.max(width, height);

  if (longestSide <= MAX_IMAGE_DIMENSION) {
    return { width, height };
  }

  const scale = MAX_IMAGE_DIMENSION / longestSide;

  return {
    width: Math.round(width * scale),
    height: Math.round(height * scale)
  };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

function replaceImageExtension(fileName: string, extension: string) {
  return fileName.replace(/\.[^.]+$/, "") + `.${extension}`;
}

function getExtensionForType(type: string) {
  if (type === "image/jpeg") return "jpg";
  if (type === "image/png") return "png";
  return "webp";
}

function getPreparedMessage(originalFiles: File[], resizedFiles: File[]) {
  const savedBytes = originalFiles.reduce((total, file) => total + file.size, 0) - resizedFiles.reduce((total, file) => total + file.size, 0);
  const count = resizedFiles.length;

  if (savedBytes <= 0) {
    return `${count} ${count === 1 ? "image" : "images"} ready for upload.`;
  }

  return `${count} ${count === 1 ? "image" : "images"} resized for upload.`;
}
