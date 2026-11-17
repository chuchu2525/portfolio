export function Icon({
  name,
  className = "",
}: {
  name: "spark" | "layers" | "search" | "camera" | "bolt" | "web" | "arrow";
  className?: string;
}) {
  const paths = {
    spark: "M12 2 9 9 2 12l7 3 3 7 3-7 7-3-7-3-3-7Z",
    layers: "m12 3 10 6-10 6L2 9l10-6Zm-10 12 10 6 10-6M2 12l10 6 10-6",
    search: "m16 16 5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z",
    camera: "M3 6h4l2-3h6l2 3h4v15H3V6Zm13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    bolt: "m13 2-9 12h7l-1 8 10-13h-8l1-7Z",
    web: "M2 4h20v16H2V4Zm0 5h20M8 9v11M5 6.5h.01M8 6.5h.01",
    arrow: "M5 19 19 5M5 5h14v14",
  };
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
