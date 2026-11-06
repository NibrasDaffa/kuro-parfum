export const CATEGORIES = [
  { value: "edp", label: "Eau de Parfum" },
  { value: "edt", label: "Eau de Toilette" },
  { value: "extrait", label: "Extrait de Parfum" },
] as const;

export const AROMAS = [
  { value: "floral", label: "Floral" },
  { value: "woody", label: "Woody" },
  { value: "oriental", label: "Oriental" },
  { value: "fresh", label: "Fresh" },
  { value: "fougere", label: "Fougère" },
] as const;

export const ORDER_STATUSES = [
  { value: "new", label: "Baru" },
  { value: "processing", label: "Diproses" },
  { value: "done", label: "Selesai" },
] as const;

export type CategoryValue = (typeof CATEGORIES)[number]["value"];
export type AromaValue = (typeof AROMAS)[number]["value"];
export type OrderStatusValue = (typeof ORDER_STATUSES)[number]["value"];

export type ProductDTO = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: CategoryValue;
  aroma_group: AromaValue;
  top_notes: string;
  middle_notes: string;
  base_notes: string;
  volume_ml: number;
  stock: number;
  is_featured: boolean;
  is_new: boolean;
  images: string[];
  created_at: string;
};

export type OrderItemDTO = {
  id: number;
  product_name: string;
  price_at_purchase: number;
  quantity: number;
};

export type OrderDTO = {
  id: number;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string | null;
  total_amount: number;
  status: OrderStatusValue;
  created_at: string;
  items: OrderItemDTO[];
};

export const PER_PAGE = 12;
