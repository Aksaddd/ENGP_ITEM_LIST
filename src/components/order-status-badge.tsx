const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border border-amber-200/50",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-50 text-blue-700 border border-blue-200/50",
  },
  picking: {
    label: "Picking",
    className: "bg-purple-50 text-purple-700 border border-purple-200/50",
  },
  shipped: {
    label: "Shipped",
    className: "bg-indigo-50 text-indigo-700 border border-indigo-200/50",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200/50",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-600 border border-red-200/50",
  },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-[#F5F5F4] text-[#78716C] border border-[#E7E5E4]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${config.className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
      {config.label}
    </span>
  );
}
