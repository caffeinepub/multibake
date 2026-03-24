import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductCatalogEntry {
    sku: string;
    nameEn: string;
    nameFr: string;
    descriptionEn: string;
    descriptionFr: string;
    stock: bigint;
    category: ProductCategory;
    priceCents: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface OrderItem {
    sku: string;
    name: string;
    quantity: bigint;
    priceCents: bigint;
}
export interface Order {
    id: bigint;
    customerInfo: CustomerInfo;
    status: OrderStatus;
    customerPrincipal: Principal;
    totalCents: bigint;
    timestamp: bigint;
    items: Array<OrderItem>;
    stripeSessionId: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Lead {
    name: string;
    email: string;
    language: string;
    company: string;
    message: string;
    timestamp: bigint;
    phone: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface CustomerInfo {
    name: string;
    email: string;
    shippingAddress: string;
    phone: string;
}
export enum OrderStatus {
    cancelled = "cancelled",
    pending = "pending",
    paid = "paid"
}
export enum ProductCategory {
    accessory = "accessory",
    roll = "roll",
    sheet = "sheet"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addOrEditCatalogEntry(product: ProductCatalogEntry): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    deleteCatalogEntry(sku: string): Promise<void>;
    flushLeads(): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getLeads(): Promise<Array<Lead>>;
    getOrder(id: bigint): Promise<Order>;
    getOrders(): Promise<Array<Order>>;
    getProduct(sku: string): Promise<ProductCatalogEntry>;
    getProductCatalog(): Promise<Array<ProductCatalogEntry>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    setStripeConfigurationWithPassword(password: string, config: StripeConfiguration): Promise<boolean>;
    submitLead(lead: Lead): Promise<void>;
    submitOrder(order: Order): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateOrderStatus(id: bigint, status: OrderStatus): Promise<void>;
    updateOrderStripeSessionId(id: bigint, sessionId: string): Promise<void>;
}
