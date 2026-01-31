import { getProducts } from "@/lib/services/products";
import ResultContent from "./ResultContent";

export default async function Result() {
  const products = await getProducts({ limit: 20, offset: 0 });
  return <ResultContent products={products} />;
}
