export interface Product {
  id: string;
  Titre: string;
  type: string;
  reference: string;
  enStock: boolean;
  ImageProduit: string;
  ImageProduitSup?: string;
  ImagesSupplementaires?: string[];
  AltText?: string;
  to?: string;
  Prix: number;
  PrixBarre?: number | null;
  Description: string;
  Description2?: string;
  LesPlusProduits?: string;
  LesPlusProduits1?: string;
  LesPlusProduits2?: string;
  LesPlusProduits3?: string;
  LesPlusProduits4?: string;
  Compositions?: string;
  Compositions1?: string;
  Compositions2?: string;
  Compositions3?: string;
  ConseilsUtilisation?: string;
  Certificat?: string[];
  ScoreINCIBeauty?: number;
  ScoreYuka?: number;
  Etoiles?: string;
  categorie?: string;
  stock: number;
  stockAlert?: number;
  active?: boolean;
  TexteBouton?: string;
  besoinChoixCouleur?: boolean;
  besoinChoixTaille?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  trackingNumber: string | null;
  colissimoLabel: string | null;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentIntentId?: string;
  notes: string;
  invoiceId: string | null;
}

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt: string;
  orders: string[];
  newsletter: boolean;
  active: boolean;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  subscribedAt: string;
  active: boolean;
  unsubscribeToken: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  lat?: number;
  lng?: number;
  phone?: string;
  email?: string;
  schedule?: string;
  active: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  customerId: string;
  customerName: string;
  date: string;
  items: Array<{ productId: string; name: string; qty: number; price: number; total: number }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'paid';
  pdfPath: string | null;
}

export interface ContentData {
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  about: {
    title: string;
    text1: string;
    text2: string;
    text3: string;
    text4: string;
  };
  engagements: Array<{ id: number; title: string; text: string }>;
  footer: {
    newsletter: { title: string; subtitle: string };
  };
  seo: {
    homeTitle: string;
    homeDescription: string;
  };
}

export interface StockItem {
  id: string;
  Titre: string;
  reference: string;
  ImageProduit: string;
  stock: number;
  stockAlert: number;
  active?: boolean;
}

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'superadmin';
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  loading: boolean;
}
