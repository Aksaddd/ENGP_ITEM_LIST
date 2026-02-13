"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface PageField {
  key: string;
  label: string;
  type: "text" | "textarea";
  placeholder: string;
}

const PAGE_CONFIGS: Record<string, { title: string; fields: PageField[] }> = {
  about: {
    title: "About Us",
    fields: [
      { key: "headline", label: "Headline", type: "text", placeholder: "Premium Produce, Trusted Partners" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "A short intro about your company..." },
      { key: "value1Title", label: "Value 1 Title", type: "text", placeholder: "Quality First" },
      { key: "value1Desc", label: "Value 1 Description", type: "textarea", placeholder: "Describe this value..." },
      { key: "value2Title", label: "Value 2 Title", type: "text", placeholder: "Trusted Relationships" },
      { key: "value2Desc", label: "Value 2 Description", type: "textarea", placeholder: "Describe this value..." },
      { key: "value3Title", label: "Value 3 Title", type: "text", placeholder: "Wide Sourcing" },
      { key: "value3Desc", label: "Value 3 Description", type: "textarea", placeholder: "Describe this value..." },
      { key: "storyTitle", label: "Story Section Title", type: "text", placeholder: "Our Story" },
      { key: "storyP1", label: "Story Paragraph 1", type: "textarea", placeholder: "First paragraph..." },
      { key: "storyP2", label: "Story Paragraph 2", type: "textarea", placeholder: "Second paragraph..." },
      { key: "storyP3", label: "Story Paragraph 3", type: "textarea", placeholder: "Third paragraph..." },
    ],
  },
  "how-it-works": {
    title: "How It Works",
    fields: [
      { key: "headline", label: "Headline", type: "text", placeholder: "How It Works" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "A short description..." },
      { key: "step1Title", label: "Step 1 Title", type: "text", placeholder: "Create Your Account" },
      { key: "step1Desc", label: "Step 1 Description", type: "textarea", placeholder: "Describe this step..." },
      { key: "step2Title", label: "Step 2 Title", type: "text", placeholder: "Browse Our Inventory" },
      { key: "step2Desc", label: "Step 2 Description", type: "textarea", placeholder: "Describe this step..." },
      { key: "step3Title", label: "Step 3 Title", type: "text", placeholder: "Add to Cart & Order" },
      { key: "step3Desc", label: "Step 3 Description", type: "textarea", placeholder: "Describe this step..." },
      { key: "step4Title", label: "Step 4 Title", type: "text", placeholder: "We Confirm & Prepare" },
      { key: "step4Desc", label: "Step 4 Description", type: "textarea", placeholder: "Describe this step..." },
      { key: "step5Title", label: "Step 5 Title", type: "text", placeholder: "Fresh Delivery" },
      { key: "step5Desc", label: "Step 5 Description", type: "textarea", placeholder: "Describe this step..." },
    ],
  },
  contact: {
    title: "Contact",
    fields: [
      { key: "headline", label: "Headline", type: "text", placeholder: "Contact Us" },
      { key: "subtitle", label: "Subtitle", type: "textarea", placeholder: "A short description..." },
      { key: "email", label: "Email Address", type: "text", placeholder: "info@engp.com" },
      { key: "phone", label: "Phone Number", type: "text", placeholder: "(555) 123-4567" },
      { key: "hoursLine1", label: "Hours Line 1", type: "text", placeholder: "Mon – Fri: 6am – 5pm" },
      { key: "hoursLine2", label: "Hours Line 2", type: "text", placeholder: "Sat: 7am – 12pm" },
    ],
  },
};

export default function EditPageContent() {
  const { slug } = useParams();
  const router = useRouter();
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const config = PAGE_CONFIGS[slug as string];

  const fetchContent = useCallback(async () => {
    try {
      const res = await fetch(`/api/pages/${slug}`);
      if (res.ok) {
        const data = await res.json();
        try {
          setContent(JSON.parse(data.content));
        } catch {
          setContent({});
        }
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch(`/api/pages/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        setError("Failed to save");
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

  if (!config) {
    return (
      <div className="p-6 lg:p-8">
        <p className="text-gray-500">Page not found.</p>
        <Link href="/admin/pages" className="text-green-600 hover:text-green-700 mt-2 inline-block text-sm">
          &larr; Back to Pages
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8">
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
      <Link
        href="/admin/pages"
        className="text-green-600 hover:text-green-700 text-sm font-medium"
      >
        &larr; Back to Pages
      </Link>

      <div className="mt-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Edit: {config.title}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Leave fields blank to use the default content.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm font-medium">
          Page content saved! Changes are live.
        </div>
      )}

      <div className="space-y-6">
        {config.fields.map((field) => (
          <div key={field.key} className="bg-white rounded-xl border border-gray-200 p-5">
            <label
              htmlFor={field.key}
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                id={field.key}
                rows={3}
                value={content[field.key] || ""}
                onChange={(e) =>
                  setContent({ ...content, [field.key]: e.target.value })
                }
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 text-sm"
              />
            ) : (
              <input
                id={field.key}
                type="text"
                value={content[field.key] || ""}
                onChange={(e) =>
                  setContent({ ...content, [field.key]: e.target.value })
                }
                placeholder={field.placeholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none text-gray-900 text-sm"
              />
            )}
          </div>
        ))}

        <div className="flex items-center gap-4 pt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href={`/${slug}`}
            target="_blank"
            className="text-sm text-gray-500 hover:text-green-600 transition-colors"
          >
            Preview page &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
