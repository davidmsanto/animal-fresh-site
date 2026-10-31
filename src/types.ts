export interface ProductConfig {
  name: string;
  tagline: string;
  color: string;
  capacity: string;
  material: string;
  badgeText: string;
  price: string;
  isPriceConfigured: boolean;
  installments?: string;
  originalPrice?: string;
  checkoutUrl: string;
  isCheckoutConfigured: boolean;
  shippingInfo: string;
  warrantyInfo: string;
  paymentMethods: string[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface SiteConfig {
  brandName: string;
  slogan: string;
  supportEmail: string;
  supportPhone?: string;
  supportHours: string;
  product: ProductConfig;
  faqs: FaqItem[];
}
