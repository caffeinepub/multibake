import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import OutCall "http-outcalls/outcall";
import EmailClient "email/emailClient";
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

  // Admin password for password-based actions
  let adminPassword = "volvoxc60";

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

    // Send email notification to info@multibake.ca
    let companyLine = if (lead.company == "") { "" } else { "<tr><td style='padding:4px 0;color:#666;font-size:14px;'><strong>Company:</strong> " # lead.company # "</td></tr>" };
    let phoneLine = if (lead.phone == "") { "" } else { "<tr><td style='padding:4px 0;color:#666;font-size:14px;'><strong>Phone:</strong> " # lead.phone # "</td></tr>" };

    let htmlBody = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:0 auto;'>"
      # "<div style='background:#1a1a1a;padding:24px;text-align:center;'>"
      # "<h1 style='color:#fff;font-size:22px;margin:0;'>New Lead - MultiBake</h1>"
      # "</div>"
      # "<div style='padding:24px;background:#f9f9f9;'>"
      # "<p style='color:#333;font-size:15px;'>A new contact form submission has been received:</p>"
      # "<table style='width:100%;border-collapse:collapse;'>"
      # "<tr><td style='padding:4px 0;color:#666;font-size:14px;'><strong>Name:</strong> " # lead.name # "</td></tr>"
      # "<tr><td style='padding:4px 0;color:#666;font-size:14px;'><strong>Email:</strong> " # lead.email # "</td></tr>"
      # companyLine
      # phoneLine
      # "<tr><td style='padding:4px 0;color:#666;font-size:14px;'><strong>Language:</strong> " # lead.language # "</td></tr>"
      # "</table>"
      # "<div style='margin-top:16px;padding:16px;background:#fff;border-left:4px solid #c0392b;'>"
      # "<strong style='color:#333;font-size:14px;'>Message:</strong>"
      # "<p style='color:#555;font-size:14px;margin:8px 0 0;'>" # lead.message # "</p>"
      # "</div>"
      # "</div>"
      # "<div style='background:#1a1a1a;padding:16px;text-align:center;'>"
      # "<p style='color:#999;font-size:12px;margin:0;'>This notification was sent automatically by your MultiBake website.</p>"
      # "</div>"
      # "</div>";

    ignore await EmailClient.sendServiceEmail(
      "noreply",
      ["info@multibake.ca"],
      "New Lead: " # lead.name # " (" # lead.email # ")",
      htmlBody,
    );
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
  // stable var so the Stripe key persists across canister upgrades/redeployments
  stable var configuration : ?Stripe.StripeConfiguration = null;

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

  // Password-based Stripe configuration for admin dashboard
  public shared func setStripeConfigurationWithPassword(password : Text, config : Stripe.StripeConfiguration) : async Bool {
    if (password != adminPassword) {
      return false;
    };
    configuration := ?config;
    return true;
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
