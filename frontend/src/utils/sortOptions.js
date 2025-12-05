export const ADS_SORT_OPTIONS = [
  { label: "Cele mai noi", value: "date_desc" },
  { label: "Cele mai vechi", value: "date_asc" },
  { label: "Preț: Crescător", value: "price_asc" },
  { label: "Preț: Descrescător", value: "price_desc" },
  { label: "Nume (A-Z)", value: "name_asc" },
  { label: "Nume (Z-A)", value: "name_desc" },
];

export const FAVORITES_SORT_OPTIONS = [
  { label: "Adăugate recent la favorite", value: "favorited_date_desc" },
  { label: "Adăugate demult la favorite", value: "favorited_date_asc" },
  ...ADS_SORT_OPTIONS
];