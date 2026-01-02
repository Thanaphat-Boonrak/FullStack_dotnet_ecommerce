export interface Order {
  id: number;
  orderDate: string;
  buyerEmail: string;
  shippingPrice: number;
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
  paymentSummary: PaymentSummary;
  orderItems: OrderItem[];
  subtotal: number;
  total:number;
  status: string;
  paymentIntentId: string;
}

export interface ShippingAddress {
  name: string;
  line1: string;
  line2?: any;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface PaymentSummary {
  last4: number;
  brand: string;
  expMonth: number;
  expYear: number;
}

export interface OrderItem {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export interface OrderToCreate {
  cartId: string;
  deliveryMethodId: number;
  shippingAddress: ShippingAddress;
  paymentSummary: PaymentSummary;
}
