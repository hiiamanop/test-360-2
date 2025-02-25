// types.ts
export interface PriceDetail {
  id: number;
  price_id: number;
  tier: string;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface Price {
  id: number;
  product_id: number;
  unit: string;
  price_details: PriceDetail[];
  created_at?: string;
  updated_at?: string;
}

export interface Product {
  id: number;
  name: string;
  product_category: "Rokok" | "Obat" | "Lainnya";
  description: string;
  prices: Price[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductFormData {
  name: string;
  product_category: "Rokok" | "Obat" | "Lainnya";
  description: string;
}

export interface PriceFormData {
  product_id: number;
  unit: string;
}

export interface PriceDetailFormData {
  price_id: number;
  tier: "Non Member" | "Basic" | "Premium";
  price: number;
}
