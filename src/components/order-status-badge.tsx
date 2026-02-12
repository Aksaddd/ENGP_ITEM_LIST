const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: "Pending",
    className: "bg-yellow-100 text-yellow-800",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-blue-100 text-blue-800",
  },
  picking: {
    label: "Picking",
    className: "bg-purple-100 text-purple-800",
  },
  shipped: {
    label: "Shipped",
    className: "bg-indigo-100 text-indigo-800",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-800",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-800",
  },
};

export function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}
