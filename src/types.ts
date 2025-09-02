export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem {
  id: string; 
  productId: string;
  title: string;
  price: number;
  quantity: number;
  personalization?: string;
  image?: string;
}
