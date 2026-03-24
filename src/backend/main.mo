import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // PRODUCT CATALOG

  public type ProductCatalogEntry = {
    sku : Text;
    nameEn : Text;
    nameFr : Text;
    descriptionEn : Text;
    descriptionFr : Text;
    priceCents : Nat;
    category : ProductCategory;
    stock : Nat;
  };

  public type ProductCategory = {
    #roll;
    #sheet;
    #accessory;
  };

  module ProductCatalogEntry {
    public func compare(p1 : ProductCatalogEntry, p2 : ProductCatalogEntry) : { #less; #equal; #greater } {
      Text.compare(p1.sku, p2.sku);
    };
  };

  let productCatalog = Map.empty<Text, ProductCatalogEntry>();

  public shared ({ caller }) func addOrEditCatalogEntry(product : ProductCatalogEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    productCatalog.add(product.sku, product);
  };

  public shared ({ caller }) func deleteCatalogEntry(sku : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete products");
    };
    productCatalog.remove(sku);
  };

  public query ({ caller }) func getProductCatalog() : async [ProductCatalogEntry] {
    productCatalog.values().toArray().sort();
  };

  public query ({ caller }) func getProduct(sku : Text) : async ProductCatalogEntry {
    switch (productCatalog.get(sku)) {
      case (null) {
        Runtime.trap("Product with SKU " # sku # " not found");
      };
      case (?product) { product };
    };
  };

  // LEAD CAPTURE / CONTACT FORM

  public type Lead = {
    name : Text;
    company : Text;
    email : Text;
    message : Text;
    phone : Text;
    language : Text;
    timestamp : Int;
  };

  module Lead {
    public func compareByTimestamp(l1 : Lead, l2 : Lead) : { #less; #equal; #greater } {
      Nat.compare(l1.timestamp.toNat(), l2.timestamp.toNat());
    };
  };

  var nextLeadId = 0;
  let leads = Map.empty<Nat, Lead>();

  public shared ({ caller }) func submitLead(lead : Lead) : async () {
    leads.add(nextLeadId, lead);
    nextLeadId += 1;
  };

  public query ({ caller }) func getLeads() : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view leads");
    };
    leads.values().toArray().sort(Lead.compareByTimestamp);
  };

  public shared ({ caller }) func flushLeads() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can flush leads");
    };
    leads.clear();
    nextLeadId := 0;
  };

  // ORDER MANAGEMENT

  public type Order = {
    id : Nat;
    customerInfo : CustomerInfo;
    items : [OrderItem];
    totalCents : Nat;
    stripeSessionId : Text;
    timestamp : Int;
    status : OrderStatus;
    customerPrincipal : Principal;
  };

  public type CustomerInfo = {
    name : Text;
    email : Text;
    shippingAddress : Text;
    phone : Text;
  };

  public type OrderItem = {
    sku : Text;
    name : Text;
    priceCents : Nat;
    quantity : Nat;
  };

  public type OrderStatus = {
    #pending;
    #paid;
    #cancelled;
  };

  module Order {
    public func compareByTimestamp(o1 : Order, o2 : Order) : { #less; #equal; #greater } {
      Nat.compare(o1.timestamp.toNat(), o2.timestamp.toNat());
    };
  };

  var nextOrderId = 0;
  let orders = Map.empty<Nat, Order>();

  func getOrderInternal(id : Nat) : Order {
    switch (orders.get(id)) {
      case (null) {
        Runtime.trap("Order not found");
      };
      case (?order) { order };
    };
  };

  public query ({ caller }) func getOrder(id : Nat) : async Order {
    let order = getOrderInternal(id);
    if (caller != order.customerPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };
    order;
  };

  public query ({ caller }) func getOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort(Order.compareByTimestamp);
  };

  public shared ({ caller }) func submitOrder(order : Order) : async () {
    if (orders.containsKey(order.id)) { Runtime.trap("Order already exists") };
    let orderWithPrincipal = {
      order with customerPrincipal = caller;
    };
    orders.add(nextOrderId, orderWithPrincipal);
    nextOrderId += 1;
  };

  public shared ({ caller }) func updateOrderStatus(id : Nat, status : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    let order = getOrderInternal(id);
    if (order.status == status) { Runtime.trap("Order already has that status") };
    orders.add(id, { order with status });
  };

  public shared ({ caller }) func updateOrderStripeSessionId(id : Nat, sessionId : Text) : async () {
    let order = getOrderInternal(id);
    if (caller != order.customerPrincipal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update your own orders");
    };
    if (order.status != #pending) { Runtime.trap("Order already completed") };
    orders.add(id, { order with stripeSessionId = sessionId });
  };

  // STRIPE INTEGRATION

  var configuration : ?Stripe.StripeConfiguration = null;

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) {
        Runtime.trap("Stripe needs to be first configured");
      };
      case (?config) { config };
    };
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
