import { useMutation, useQuery } from "@tanstack/react-query";
import type { Lead, ProductCatalogEntry, ShoppingItem } from "../backend.d";
import { useActor } from "./useActor";

export function useProductCatalog() {
  const { actor, isFetching } = useActor();
  return useQuery<ProductCatalogEntry[]>({
    queryKey: ["productCatalog"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getProductCatalog();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitLead() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (lead: Lead) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.submitLead(lead);
    },
  });
}

export function useCreateCheckoutSession() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      items,
      successUrl,
      cancelUrl,
    }: {
      items: ShoppingItem[];
      successUrl: string;
      cancelUrl: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.createCheckoutSession(items, successUrl, cancelUrl);
    },
  });
}

export function useStripeSessionStatus(sessionId: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stripeSession", sessionId],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getStripeSessionStatus(sessionId);
    },
    enabled: !!actor && !isFetching && !!sessionId,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) return 2000;
      if (data.__kind__ === "completed" || data.__kind__ === "failed")
        return false;
      return 2000;
    },
  });
}
