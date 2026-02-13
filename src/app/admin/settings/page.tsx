"use client";

import { useEffect, useState } from "react";
import { FileUpload } from "@/components/file-upload";

export default function AdminSettingsPage() {
  const [heroVideo, setHeroVideo] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [inputMode, setInputMode] = useState<"upload" | "url">("upload");

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const video = data.heroVideo || "";
        setHeroVideo(video);
        // If existing URL is external, default to URL mode
        if (video && !video.startsWith("/uploads/")) {
          setInputMode("url");
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load settings");
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ heroVideo }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error || "Failed to save");
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      setError("Network error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-4 bg-gray-100 rounded w-96" />
          <div className="h-12 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#1A1A1A] tracking-tight">
          Site Settings
        </h1>
        <p className="text-sm text-[#78716C] mt-1">
          Manage your homepage hero video and other site-wide configuration.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-2xl mb-6 text-sm font-medium">
          Settings saved successfully!
        </div>
      )}

      <div className="card p-6 space-y-6">
        {/* Hero Video Section */}
        <div>
          <h2 className="text-lg font-semibold text-[#1A1A1A] mb-1">
            Hero Video
          </h2>
          <p className="text-sm text-[#78716C] mb-4">
            Upload a video or paste a URL. This video plays behind the hero text
            on the homepage. Leave empty to use the default gradient background.
          </p>

          {/* Upload / URL toggle */}
          <div className="flex gap-2 mb-4">
            <button
              type="button"
              onClick={() => setInputMode("upload")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMode === "upload"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setInputMode("url")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                inputMode === "url"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Paste URL
            </button>
          </div>

          {inputMode === "upload" ? (
            <FileUpload
              accept="video"
              currentUrl={heroVideo && heroVideo.startsWith("/uploads/") ? heroVideo : null}
              onUpload={(url) => setHeroVideo(url)}
              onRemove={() => setHeroVideo("")}
            />
          ) : (
            <div>
              <input
                id="heroVideo"
                type="url"
                value={heroVideo}
                onChange={(e) => setHeroVideo(e.target.value)}
                placeholder="https://example.com/video.mp4"
                className="w-full px-4 py-3 bg-[#FAFAF7] rounded-2xl input-glow text-[#1A1A1A] text-sm placeholder:text-[#A8A29E]"
              />
              <p className="text-xs text-[#A8A29E] mt-2">
                Supported formats: .mp4 (recommended), .webm
              </p>
            </div>
          )}
        </div>

        {/* Preview */}
        {heroVideo && inputMode === "url" && (
          <div>
            <h3 className="text-sm font-medium text-[#44403C] mb-2">
              Preview
            </h3>
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
              <video
                key={heroVideo}
                src={heroVideo}
                muted
                loop
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#064E3B]/80 to-[#047857]/80 flex items-center justify-center">
                <span className="text-white/60 text-sm font-medium">
                  Hero overlay preview
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Save */}
        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary !px-6 !py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin w-4 h-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Settings"
            )}
          </button>

          {heroVideo && (
            <button
              onClick={() => setHeroVideo("")}
              className="btn-ghost text-sm text-[#78716C] hover:text-red-600"
            >
              Remove Video
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
