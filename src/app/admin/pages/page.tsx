import Link from "next/link";

const EDITABLE_PAGES = [
  {
    slug: "about",
    title: "About Us",
    description: "Company information, values, and story",
    path: "/about",
  },
  {
    slug: "how-it-works",
    title: "How It Works",
    description: "Step-by-step ordering process and FAQ",
    path: "/how-it-works",
  },
  {
    slug: "contact",
    title: "Contact",
    description: "Contact info, business hours, and form",
    path: "/contact",
  },
];

export default function AdminPagesPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pages</h1>
        <p className="text-sm text-gray-600 mt-1">
          Edit the content on your public-facing pages.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {EDITABLE_PAGES.map((page) => (
          <Link
            key={page.slug}
            href={`/admin/pages/${page.slug}`}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:bg-gray-50 hover:border-green-200 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                {page.title}
              </h3>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-green-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">{page.description}</p>
            <div className="mt-3 text-xs text-gray-400">{page.path}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
