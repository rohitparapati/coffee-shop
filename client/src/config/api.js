export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5001/api";

export const USE_MOCK_DATA =
  String(import.meta.env.VITE_USE_MOCK_DATA || "true") === "true";
