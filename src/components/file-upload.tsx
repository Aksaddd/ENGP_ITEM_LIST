"use client";

import { useState, useRef, useCallback } from "react";

interface FileUploadProps {
  accept: "image" | "video";
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove?: () => void;
}

export function FileUpload({ accept, currentUrl, onUpload, onRemove }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptTypes =
    accept === "image"
      ? "image/jpeg,image/png,image/webp,image/gif"
      : "video/mp4,video/webm";

  const maxLabel = accept === "image" ? "10MB" : "100MB";

  const uploadFile = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);

      const form = new FormData();
      form.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: form,
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Upload failed");
          setUploading(false);
          return;
        }

        setPreview(data.url);
        onUpload(data.url);
      } catch {
        setError("Network error — please try again");
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleRemove = () => {
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
    onRemove?.();
  };

  return (
    <div>
      {/* Preview */}
      {preview && !uploading && (
        <div className="mb-3">
          {accept === "image" ? (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm transition-colors"
              >
                &times;
              </button>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-black">
              <video
                src={preview}
                className="w-full h-48 object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm transition-colors"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Drop Zone */}
      {!preview && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-green-400 hover:bg-green-50/50"
          } ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <svg
                className="animate-spin w-8 h-8 text-green-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm text-gray-600">Uploading...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {accept === "image" ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
                </svg>
              )}
              <div>
                <span className="text-sm font-medium text-green-600">Click to upload</span>
                <span className="text-sm text-gray-500"> or drag and drop</span>
              </div>
              <span className="text-xs text-gray-400">
                {accept === "image" ? "JPEG, PNG, WebP, GIF" : "MP4, WebM"} up to {maxLabel}
              </span>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={acceptTypes}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <p className="text-red-600 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
