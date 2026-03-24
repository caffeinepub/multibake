import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  KeyRound,
  Loader2,
  LogOut,
  Package,
  ShoppingCart,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Order, OrderStatus, ProductCatalogEntry } from "../backend.d";
import { ProductCategory } from "../backend.d";
import { useActor } from "../hooks/useActor";

function formatDate(timestamp: bigint): string {
  return new Date(Number(timestamp) / 1_000_000).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCents(cents: bigint): string {
  return `$${(Number(cents) / 100).toFixed(2)}`;
}

// ─── Admin Login ──────────────────────────────────────────────────────────────
function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "volvoxc60") {
      sessionStorage.setItem("adminAuthenticated", "true");
      window.location.reload();
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img
            src="/assets/uploads/jason_logo-019d1faf-4d59-7299-9569-64c247e0d879-1.png"
            alt="MultiBake"
            className="h-16 mx-auto mb-4"
          />
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <KeyRound className="h-5 w-5 text-red-500" />
            <h1 className="text-white text-xl font-bold">Admin Login</h1>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400 text-sm">Password</Label>
              <Input
                data-ocid="admin.input"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-red-500"
              />
              {error && (
                <p
                  data-ocid="admin.error_state"
                  className="text-red-400 text-sm"
                >
                  {error}
                </p>
              )}
            </div>
            <Button
              data-ocid="admin.login.primary_button"
              onClick={handleLogin}
              disabled={!password.trim()}
              className="bg-red-700 hover:bg-red-600 text-white w-full"
            >
              Login
            </Button>
          </div>
        </div>
        <div className="text-center mt-6">
          <a
            href="/"
            data-ocid="admin.back.link"
            className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
          >
            ← Back to site
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Stripe Setup Tab ────────────────────────────────────────────────────────
function StripeTab() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [secretKey, setSecretKey] = useState("");
  const [countries, setCountries] = useState("CA,US");

  const { data: isConfigured, isLoading: checkingStatus } = useQuery({
    queryKey: ["stripeConfigured"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isStripeConfigured();
    },
    enabled: !!actor,
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      await actor.setStripeConfiguration({
        secretKey,
        allowedCountries: countries
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      });
    },
    onSuccess: () => {
      toast.success("Stripe configuration saved!");
      queryClient.invalidateQueries({ queryKey: ["stripeConfigured"] });
      setSecretKey("");
    },
    onError: () => {
      toast.error("Failed to save Stripe configuration.");
    },
  });

  return (
    <div className="p-8 max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold text-white">Stripe Configuration</h2>
        {checkingStatus ? (
          <Badge className="bg-zinc-700 text-zinc-300">Checking...</Badge>
        ) : isConfigured ? (
          <Badge
            className="bg-green-600 text-white"
            data-ocid="stripe.success_state"
          >
            Active
          </Badge>
        ) : (
          <Badge
            className="bg-red-700 text-white"
            data-ocid="stripe.error_state"
          >
            Not configured
          </Badge>
        )}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label className="text-zinc-300 text-sm">Stripe Secret Key</Label>
          <Input
            data-ocid="stripe.input"
            type="password"
            placeholder="sk_live_... or sk_test_..."
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-red-500"
          />
          <p className="text-zinc-500 text-xs">
            Get your key from{" "}
            <a
              href="https://dashboard.stripe.com/apikeys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:underline"
            >
              dashboard.stripe.com/apikeys
            </a>
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-zinc-300 text-sm">
            Allowed Countries (comma-separated)
          </Label>
          <Input
            data-ocid="stripe_countries.input"
            placeholder="CA,US"
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
            className="bg-zinc-800 border-zinc-600 text-white placeholder:text-zinc-500 focus:border-red-500"
          />
        </div>

        <Button
          data-ocid="stripe.save_button"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending || !secretKey.trim()}
          className="bg-red-700 hover:bg-red-600 text-white w-full"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            "Save Stripe Configuration"
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Leads Tab ───────────────────────────────────────────────────────────────
function LeadsTab() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["adminLeads"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeads();
    },
    enabled: !!actor,
  });

  const flushMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not ready");
      await actor.flushLeads();
    },
    onSuccess: () => {
      toast.success("All leads cleared.");
      queryClient.invalidateQueries({ queryKey: ["adminLeads"] });
      setConfirmOpen(false);
    },
    onError: () => {
      toast.error("Failed to clear leads.");
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Leads</h2>
        <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="leads.delete_button"
              variant="destructive"
              className="bg-red-800 hover:bg-red-700"
              disabled={leads.length === 0}
            >
              Clear All Leads
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="leads.dialog"
            className="bg-zinc-900 border-zinc-700 text-white"
          >
            <DialogHeader>
              <DialogTitle>Clear all leads?</DialogTitle>
              <DialogDescription className="text-zinc-400">
                This will permanently delete all {leads.length} lead(s). This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                data-ocid="leads.cancel_button"
                variant="outline"
                onClick={() => setConfirmOpen(false)}
                className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
              >
                Cancel
              </Button>
              <Button
                data-ocid="leads.confirm_button"
                variant="destructive"
                onClick={() => flushMutation.mutate()}
                disabled={flushMutation.isPending}
                className="bg-red-700 hover:bg-red-600"
              >
                {flushMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Delete All"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div
          data-ocid="leads.loading_state"
          className="flex justify-center py-16"
        >
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      ) : leads.length === 0 ? (
        <div
          data-ocid="leads.empty_state"
          className="text-center py-16 text-zinc-500"
        >
          No leads yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-700">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700 hover:bg-transparent">
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400">Company</TableHead>
                <TableHead className="text-zinc-400">Email</TableHead>
                <TableHead className="text-zinc-400">Phone</TableHead>
                <TableHead className="text-zinc-400">Message</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead, i) => (
                <TableRow
                  key={`${lead.email}-${i}`}
                  data-ocid={`leads.item.${i + 1}`}
                  className="border-zinc-700 hover:bg-zinc-800"
                >
                  <TableCell className="text-white font-medium">
                    {lead.name}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {lead.company || "—"}
                  </TableCell>
                  <TableCell className="text-zinc-300">{lead.email}</TableCell>
                  <TableCell className="text-zinc-300">
                    {lead.phone || "—"}
                  </TableCell>
                  <TableCell className="text-zinc-400 max-w-xs truncate">
                    {lead.message}
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(lead.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Orders Tab ──────────────────────────────────────────────────────────────
function OrdersTab() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: OrderStatus }) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.updateOrderStatus(id, status);
    },
    onSuccess: () => {
      toast.success("Order status updated.");
      queryClient.invalidateQueries({ queryKey: ["adminOrders"] });
    },
    onError: () => toast.error("Failed to update order status."),
  });

  const statusColor: Record<string, string> = {
    pending: "bg-yellow-600 text-yellow-100",
    paid: "bg-green-700 text-green-100",
    cancelled: "bg-red-800 text-red-100",
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-white mb-6">Orders</h2>
      {isLoading ? (
        <div
          data-ocid="orders.loading_state"
          className="flex justify-center py-16"
        >
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      ) : orders.length === 0 ? (
        <div
          data-ocid="orders.empty_state"
          className="text-center py-16 text-zinc-500"
        >
          No orders yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-700">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700 hover:bg-transparent">
                <TableHead className="text-zinc-400">Order ID</TableHead>
                <TableHead className="text-zinc-400">Customer</TableHead>
                <TableHead className="text-zinc-400">Email</TableHead>
                <TableHead className="text-zinc-400">Items</TableHead>
                <TableHead className="text-zinc-400">Total</TableHead>
                <TableHead className="text-zinc-400">Status</TableHead>
                <TableHead className="text-zinc-400">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, i) => (
                <TableRow
                  key={order.id.toString()}
                  data-ocid={`orders.item.${i + 1}`}
                  className="border-zinc-700 hover:bg-zinc-800"
                >
                  <TableCell className="text-zinc-400 font-mono text-xs">
                    #{order.id.toString()}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {order.customerInfo.name}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {order.customerInfo.email}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {order.items.length} item(s)
                  </TableCell>
                  <TableCell className="text-white">
                    {formatCents(order.totalCents)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(val) =>
                        updateStatusMutation.mutate({
                          id: order.id,
                          status: val as OrderStatus,
                        })
                      }
                    >
                      <SelectTrigger
                        data-ocid={`orders.select.${i + 1}`}
                        className={`w-32 border-0 ${statusColor[order.status] ?? ""}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDate(order.timestamp)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Products Tab ─────────────────────────────────────────────────────────────
const emptyProduct: ProductCatalogEntry = {
  sku: "",
  nameEn: "",
  nameFr: "",
  descriptionEn: "",
  descriptionFr: "",
  stock: 0n,
  category: ProductCategory.roll,
  priceCents: 0n,
};

function ProductForm({
  initial,
  onSave,
  isSaving,
}: {
  initial: ProductCatalogEntry;
  onSave: (p: ProductCatalogEntry) => void;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<ProductCatalogEntry>(initial);
  const set = (field: keyof ProductCatalogEntry, value: string | bigint) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-zinc-300 text-xs">SKU</Label>
          <Input
            data-ocid="product.sku.input"
            value={form.sku}
            onChange={(e) => set("sku", e.target.value)}
            className="bg-zinc-800 border-zinc-600 text-white"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-zinc-300 text-xs">Category</Label>
          <Select
            value={form.category}
            onValueChange={(v) => set("category", v as ProductCategory)}
          >
            <SelectTrigger
              data-ocid="product.category.select"
              className="bg-zinc-800 border-zinc-600 text-white"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              <SelectItem value="roll">Roll</SelectItem>
              <SelectItem value="sheet">Sheet</SelectItem>
              <SelectItem value="accessory">Accessory</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-zinc-300 text-xs">Name (EN)</Label>
          <Input
            data-ocid="product.name_en.input"
            value={form.nameEn}
            onChange={(e) => set("nameEn", e.target.value)}
            className="bg-zinc-800 border-zinc-600 text-white"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-zinc-300 text-xs">Name (FR)</Label>
          <Input
            data-ocid="product.name_fr.input"
            value={form.nameFr}
            onChange={(e) => set("nameFr", e.target.value)}
            className="bg-zinc-800 border-zinc-600 text-white"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-zinc-300 text-xs">Description (EN)</Label>
          <Textarea
            data-ocid="product.desc_en.textarea"
            value={form.descriptionEn}
            onChange={(e) => set("descriptionEn", e.target.value)}
            className="bg-zinc-800 border-zinc-600 text-white min-h-[80px]"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-zinc-300 text-xs">Description (FR)</Label>
          <Textarea
            data-ocid="product.desc_fr.textarea"
            value={form.descriptionFr}
            onChange={(e) => set("descriptionFr", e.target.value)}
            className="bg-zinc-800 border-zinc-600 text-white min-h-[80px]"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-zinc-300 text-xs">Price (cents)</Label>
          <Input
            data-ocid="product.price.input"
            type="number"
            value={form.priceCents.toString()}
            onChange={(e) => set("priceCents", BigInt(e.target.value || "0"))}
            className="bg-zinc-800 border-zinc-600 text-white"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-zinc-300 text-xs">Stock</Label>
          <Input
            data-ocid="product.stock.input"
            type="number"
            value={form.stock.toString()}
            onChange={(e) => set("stock", BigInt(e.target.value || "0"))}
            className="bg-zinc-800 border-zinc-600 text-white"
          />
        </div>
      </div>
      <Button
        data-ocid="product.save_button"
        onClick={() => onSave(form)}
        disabled={isSaving || !form.sku.trim() || !form.nameEn.trim()}
        className="bg-red-700 hover:bg-red-600 text-white w-full"
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          "Save Product"
        )}
      </Button>
    </div>
  );
}

function ProductsTab() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductCatalogEntry | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery<ProductCatalogEntry[]>({
    queryKey: ["adminProducts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductCatalog();
    },
    enabled: !!actor,
  });

  const saveMutation = useMutation({
    mutationFn: async (product: ProductCatalogEntry) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.addOrEditCatalogEntry(product);
    },
    onSuccess: () => {
      toast.success("Product saved.");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setAddOpen(false);
      setEditProduct(null);
    },
    onError: () => toast.error("Failed to save product."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (sku: string) => {
      if (!actor) throw new Error("Actor not ready");
      await actor.deleteCatalogEntry(sku);
    },
    onSuccess: () => {
      toast.success("Product deleted.");
      queryClient.invalidateQueries({ queryKey: ["adminProducts"] });
      setDeleteTarget(null);
    },
    onError: () => toast.error("Failed to delete product."),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Products</h2>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button
              data-ocid="products.open_modal_button"
              className="bg-red-700 hover:bg-red-600 text-white"
            >
              + Add Product
            </Button>
          </DialogTrigger>
          <DialogContent
            data-ocid="products.dialog"
            className="bg-zinc-900 border-zinc-700 text-white max-w-2xl"
          >
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <ProductForm
              initial={emptyProduct}
              onSave={(p) => saveMutation.mutate(p)}
              isSaving={saveMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={!!editProduct}
        onOpenChange={(open) => !open && setEditProduct(null)}
      >
        <DialogContent
          data-ocid="products.edit.dialog"
          className="bg-zinc-900 border-zinc-700 text-white max-w-2xl"
        >
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <ProductForm
              initial={editProduct}
              onSave={(p) => saveMutation.mutate(p)}
              isSaving={saveMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent
          data-ocid="products.delete.dialog"
          className="bg-zinc-900 border-zinc-700 text-white"
        >
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription className="text-zinc-400">
              SKU <span className="font-mono text-white">{deleteTarget}</span>{" "}
              will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              data-ocid="products.cancel_button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button
              data-ocid="products.confirm_button"
              variant="destructive"
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget)
              }
              disabled={deleteMutation.isPending}
              className="bg-red-700 hover:bg-red-600"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading ? (
        <div
          data-ocid="products.loading_state"
          className="flex justify-center py-16"
        >
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        </div>
      ) : products.length === 0 ? (
        <div
          data-ocid="products.empty_state"
          className="text-center py-16 text-zinc-500"
        >
          No products yet. Add your first product above.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-zinc-700">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-700 hover:bg-transparent">
                <TableHead className="text-zinc-400">SKU</TableHead>
                <TableHead className="text-zinc-400">Name (EN)</TableHead>
                <TableHead className="text-zinc-400">Category</TableHead>
                <TableHead className="text-zinc-400">Price</TableHead>
                <TableHead className="text-zinc-400">Stock</TableHead>
                <TableHead className="text-zinc-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, i) => (
                <TableRow
                  key={product.sku}
                  data-ocid={`products.item.${i + 1}`}
                  className="border-zinc-700 hover:bg-zinc-800"
                >
                  <TableCell className="font-mono text-xs text-zinc-300">
                    {product.sku}
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {product.nameEn}
                  </TableCell>
                  <TableCell className="text-zinc-300 capitalize">
                    {product.category}
                  </TableCell>
                  <TableCell className="text-white">
                    {formatCents(product.priceCents)}
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {product.stock.toString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        data-ocid={`products.edit_button.${i + 1}`}
                        size="sm"
                        variant="outline"
                        onClick={() => setEditProduct(product)}
                        className="border-zinc-600 text-zinc-300 hover:bg-zinc-700 h-7 px-2 text-xs"
                      >
                        Edit
                      </Button>
                      <Button
                        data-ocid={`products.delete_button.${i + 1}`}
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteTarget(product.sku)}
                        className="bg-red-900 hover:bg-red-700 h-7 px-2 text-xs"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Sidebar Nav ─────────────────────────────────────────────────────────────
type Tab = "stripe" | "leads" | "orders" | "products";

const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "stripe", label: "Stripe Setup", icon: <Zap className="h-4 w-4" /> },
  { id: "leads", label: "Leads", icon: <Users className="h-4 w-4" /> },
  { id: "orders", label: "Orders", icon: <ShoppingCart className="h-4 w-4" /> },
  { id: "products", label: "Products", icon: <Package className="h-4 w-4" /> },
];

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function Admin() {
  const { isFetching } = useActor();
  const [activeTab, setActiveTab] = useState<Tab>("stripe");

  const isAuthenticated =
    sessionStorage.getItem("adminAuthenticated") === "true";

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
        <div className="p-6 border-b border-zinc-800">
          <img
            src="/assets/uploads/jason_logo-019d1faf-4d59-7299-9569-64c247e0d879-1.png"
            alt="MultiBake"
            className="h-10 mb-1"
          />
          <p className="text-zinc-500 text-xs mt-2 uppercase tracking-widest">
            Admin Panel
          </p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.id}
              data-ocid={`admin.${item.id}.tab`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "bg-red-700 text-white"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-zinc-800 space-y-2">
          {isFetching && (
            <p className="text-zinc-600 text-xs flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" /> Connecting...
            </p>
          )}
          <button
            type="button"
            data-ocid="admin.logout.button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-zinc-500 hover:text-red-400 text-xs transition-colors"
          >
            <LogOut className="h-3 w-3" />
            Log out
          </button>
          <button
            type="button"
            data-ocid="admin.back_button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full text-zinc-500 hover:text-white text-xs text-left transition-colors"
          >
            ← Back to site
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === "stripe" && <StripeTab />}
        {activeTab === "leads" && <LeadsTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "products" && <ProductsTab />}
      </main>
    </div>
  );
}
