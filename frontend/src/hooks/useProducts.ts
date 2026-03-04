import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export const useProducts = () =>
  useQuery({
    queryKey: ["products"],
    queryFn: async () => (await api.get("/products")).data
  });
