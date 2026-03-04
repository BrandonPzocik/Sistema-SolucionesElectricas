import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ["product", slug],
    queryFn: async () => (await api.get(`/products/${slug}`)).data,
    enabled: !!slug
  });
