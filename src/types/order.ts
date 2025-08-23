export interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  imageUrl?: string;
  active: boolean;
  allowedFruits: string[];
  variations: ProductVariation[];
  complements: Complement[];
}

export interface ProductVariation {
  id: string;
  productId: string;
  name: string;
  basePrice: number;
  includedComplements: number;
  includedFruits: number;
}

export interface Complement {
  id: string;
  name: string;
  type: 'acompanhamento' | 'cobertura' | 'fruta';
  extraPrice: number;
  included: boolean;
  imageUrl?: string;
  active: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  variationId?: string;
  note?: string;
  finalPrice: number;
  complements: OrderItemComplement[];
}

export interface OrderItemComplement {
  id: string;
  complementId: string;
  type: string;
  price: number;
  complement: Complement;
}

export interface Order {
  id: string;
  customerId: string;
  status: string;
  whatsappMessage?: string;
  total: number;
  items: OrderItem[];
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  address?: string;
}