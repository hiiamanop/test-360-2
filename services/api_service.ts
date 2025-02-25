// apiService.ts
import axios from "axios";
import {
  Product,
  ProductFormData,
  Price,
  PriceFormData,
  PriceDetail,
  PriceDetailFormData,
} from "@/type/type";

const API_BASE_URL = "http://localhost:8000/api/v1";

// Product Service
export const productService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: number): Promise<Product> => {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  },

  // Create new product
  createProduct: async (productData: ProductFormData): Promise<Product> => {
    const response = await axios.post(`${API_BASE_URL}/products`, productData);
    return response.data;
  },

  // Update product
  updateProduct: async (
    id: number,
    productData: Partial<ProductFormData>
  ): Promise<Product> => {
    const response = await axios.put(
      `${API_BASE_URL}/products/${id}`,
      productData
    );
    return response.data;
  },

  // Delete product
  deleteProduct: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/products/${id}`);
  },

  // Search products
  searchProducts: async (params: {
    name?: string;
    product_category?: string;
    tier?: string;
  }): Promise<Product[]> => {
    const response = await axios.get(`${API_BASE_URL}/products/search/query`, {
      params,
    });
    return response.data;
  },
};

// Price Service
export const priceService = {
  // Get all prices
  getAllPrices: async (): Promise<Price[]> => {
    const response = await axios.get(`${API_BASE_URL}/prices`);
    return response.data;
  },

  // Get price by ID
  getPriceById: async (id: number): Promise<Price> => {
    const response = await axios.get(`${API_BASE_URL}/prices/${id}`);
    return response.data;
  },

  // Create new price
  createPrice: async (priceData: PriceFormData): Promise<Price> => {
    const response = await axios.post(`${API_BASE_URL}/prices`, priceData);
    return response.data;
  },

  // Update price
  updatePrice: async (
    id: number,
    priceData: Partial<PriceFormData>
  ): Promise<Price> => {
    const response = await axios.put(`${API_BASE_URL}/prices/${id}`, priceData);
    return response.data;
  },

  // Delete price
  deletePrice: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/prices/${id}`);
  },
};

// Price Detail Service
export const priceDetailService = {
  // Get all price details
  getAllPriceDetails: async (): Promise<PriceDetail[]> => {
    const response = await axios.get(`${API_BASE_URL}/price-details`);
    return response.data;
  },

  // Get price detail by ID
  getPriceDetailById: async (id: number): Promise<PriceDetail> => {
    const response = await axios.get(`${API_BASE_URL}/price-details/${id}`);
    return response.data;
  },

  // Create new price detail
  createPriceDetail: async (
    priceDetailData: PriceDetailFormData
  ): Promise<PriceDetail> => {
    const response = await axios.post(
      `${API_BASE_URL}/price-details`,
      priceDetailData
    );
    return response.data;
  },

  // Update price detail
  updatePriceDetail: async (
    id: number,
    priceDetailData: Partial<PriceDetailFormData>
  ): Promise<PriceDetail> => {
    const response = await axios.put(
      `${API_BASE_URL}/price-details/${id}`,
      priceDetailData
    );
    return response.data;
  },

  // Delete price detail
  deletePriceDetail: async (id: number): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/price-details/${id}`);
  },
};
